import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '../../../lib/stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const appUrl = process.env.NEXT_PUBLIC_APP_URL

if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
if (!appUrl) throw new Error('Missing NEXT_PUBLIC_APP_URL')

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

type RequestBody = {
  bookingId?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('lesson_bookings')
      .select(`
        id,
        parent_id,
        student_id,
        subject_id,
        program_id,
        plan_id,
        lesson_date,
        lesson_time,
        timezone,
        status,
        payment_status,
        amount_gbp,
        notes
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.status === 'CONFIRMED' || booking.payment_status === 'PAID') {
      return NextResponse.json(
        { error: 'This booking has already been confirmed or paid for.' },
        { status: 400 }
      )
    }

    const amount = Number(booking.amount_gbp || 0)
    const currency = 'GBP'

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid booking amount. Please recreate this booking.' },
        { status: 400 }
      )
    }

    const { data: existingPayment, error: existingPaymentError } = await supabaseAdmin
      .from('payments')
      .select('id, payment_status')
      .eq('booking_id', booking.id)
      .maybeSingle()

    if (existingPaymentError) {
      return NextResponse.json(
        { error: 'Unable to check existing payment.' },
        { status: 500 }
      )
    }

    if (existingPayment?.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'This booking has already been paid for.' },
        { status: 400 }
      )
    }

    const subjectLabel = String(booking.subject_id || 'Lesson')
    const planLabel = String(booking.plan_id || 'Plan')
    const lessonDate = booking.lesson_date || 'Date to be confirmed'
    const lessonTime = booking.lesson_time || 'Time to be confirmed'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',

      success_url: `${appUrl}/payment/success?bookingId=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment?bookingId=${booking.id}`,

      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `${subjectLabel} - ${planLabel}`,
              description: `${lessonDate} at ${lessonTime}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        booking_id: booking.id,
        parent_id: booking.parent_id,
        student_id: booking.student_id,
        subject_id: booking.subject_id,
        program_id: booking.program_id ?? '',
        plan_id: booking.plan_id,
        booking_table: 'lesson_bookings',
      },
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL.' },
        { status: 500 }
      )
    }

    if (!existingPayment) {
      const { error: insertPaymentError } = await supabaseAdmin.from('payments').insert({
        booking_id: booking.id,
        parent_id: booking.parent_id,
        payment_provider: 'stripe',
        provider_reference: session.id,
        currency,
        amount,
        payment_status: 'pending',
      })

      if (insertPaymentError) {
        return NextResponse.json({ error: insertPaymentError.message }, { status: 500 })
      }
    } else {
      const { error: updatePaymentError } = await supabaseAdmin
        .from('payments')
        .update({
          provider_reference: session.id,
          payment_status: 'pending',
          currency,
          amount,
        })
        .eq('id', existingPayment.id)

      if (updatePaymentError) {
        return NextResponse.json({ error: updatePaymentError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('checkout-session error', error)
    return NextResponse.json(
      { error: 'Unable to create checkout session.' },
      { status: 500 }
    )
  }
}