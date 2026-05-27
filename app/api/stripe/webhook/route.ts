import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '../../../lib/stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return new NextResponse('Missing webhook secret', { status: 500 })
  }

  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new NextResponse('Missing Stripe signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.booking_id

      if (!bookingId) {
        return NextResponse.json({ received: true })
      }

      const { data: existingPayment } = await supabaseAdmin
        .from('payments')
        .select('id, payment_status')
        .eq('booking_id', bookingId)
        .maybeSingle()

      if (existingPayment?.payment_status === 'paid') {
        return NextResponse.json({ received: true })
      }

      const { data: booking, error: bookingError } = await supabaseAdmin
        .from('lesson_bookings')
        .select(
          `
          id,
          parent_id,
          student_id,
          tutor_id,
          subject_id,
          learning_level_id,
          availability_slot_id,
          booking_date,
          start_time,
          end_time,
          duration_minutes
        `
        )
        .eq('id', bookingId)
        .maybeSingle()

      if (bookingError || !booking) {
        throw new Error('Booking not found')
      }

      const { error: paymentUpdateError } = await supabaseAdmin
        .from('payments')
        .update({
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          provider_payment_intent:
            typeof session.payment_intent === 'string' ? session.payment_intent : null,
        })
        .eq('booking_id', bookingId)

      if (paymentUpdateError) throw paymentUpdateError

      const { error: bookingUpdateError } = await supabaseAdmin
        .from('bookings')
        .update({
          status: 'CONFIRMED',
          payment_status: 'PAID',
        })
        .eq('id', bookingId)

      if (bookingUpdateError) throw bookingUpdateError

      if (booking.availability_slot_id) {
        const { error: slotUpdateError } = await supabaseAdmin
          .from('tutor_availability_slots')
          .update({
            is_booked: true,
            is_available: false,
          })
          .eq('id', booking.availability_slot_id)

        if (slotUpdateError) throw slotUpdateError
      }

      const startsAt = buildDateTime(booking.booking_date, booking.start_time)
      const endsAt = buildDateTime(booking.booking_date, booking.end_time)

      const { data: existingSession } = await supabaseAdmin
        .from('lesson_sessions')
        .select('id')
        .eq('booking_id', bookingId)
        .maybeSingle()

      if (!existingSession) {
        const { error: sessionInsertError } = await supabaseAdmin
          .from('lesson_sessions')
          .insert({
            booking_id: booking.id,
            student_id: booking.student_id,
            tutor_id: booking.tutor_id,
            subject_id: booking.subject_id,
            learning_level_id: booking.learning_level_id,
            session_date: booking.booking_date,
            starts_at: startsAt,
            ends_at: endsAt,
            duration_minutes: booking.duration_minutes || 60,
            meeting_link: `https://meet.jit.si/tutorme-${booking.id}`,
            status: 'scheduled',
          })

        if (sessionInsertError) throw sessionInsertError
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.booking_id

      if (bookingId) {
        await supabaseAdmin
          .from('payments')
          .update({ payment_status: 'failed' })
          .eq('booking_id', bookingId)

        await supabaseAdmin
          .from('lesson_bookings')
            .update({
              status: 'PAYMENT_FAILED',
              payment_status: 'FAILED',
            })
          .eq('id', bookingId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook processing error:', err)
    return new NextResponse('Webhook handler failed', { status: 500 })
  }
}

function buildDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`).toISOString()
}