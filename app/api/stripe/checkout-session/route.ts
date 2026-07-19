import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '../../../lib/stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const appUrl = process.env.NEXT_PUBLIC_APP_URL

if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
if (!appUrl) throw new Error('Missing NEXT_PUBLIC_APP_URL')

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

type RequestBody = {
  bookingId?: string
}

type BookingRow = {
  id: string
  parent_id: string | null
  student_id: string
  subject_id: string
  program_id: string | null
  plan_id: string
  tutor_id: string | null
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  parent_booking_group_id: string | null
  booking_frequency: string | null
}

type PaymentRow = {
  id: string
  provider_reference: string | null
  payment_status: string
}

const planLabels: Record<string, string> = {
  monthly: 'Monthly Plan',
  three_month: '3-Month Plan',
}

const planRules: Record<string, { weeks: number; pricePerLesson: number }> = {
  monthly: { weeks: 4, pricePerLesson: 10 },
  three_month: { weeks: 12, pricePerLesson: 9 },
}

export async function POST(req: Request) {
  try {
    const user = await authenticateRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to pay.' }, { status: 401 })
    }

    const body = (await req.json()) as RequestBody
    const bookingId = body.bookingId?.trim()

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
    }

    const anchorBooking = await getOwnedBooking(bookingId, user.id)

    if (!anchorBooking) {
      return NextResponse.json(
        { error: 'Booking not found or you do not have access to it.' },
        { status: 404 }
      )
    }

    const groupBookings = await getOwnedBookingGroup(anchorBooking, user.id)

    if (groupBookings.length === 0) {
      return NextResponse.json({ error: 'Booking timetable not found.' }, { status: 404 })
    }

    if (
      groupBookings.some(
        (booking) => booking.status === 'CONFIRMED' || booking.payment_status === 'PAID'
      )
    ) {
      return NextResponse.json(
        { error: 'This booking has already been confirmed or paid for.' },
        { status: 409 }
      )
    }

    const validation = validateCheckoutGroup(groupBookings)

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const amount = validation.amount

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid booking amount. Please recreate this booking.' },
        { status: 400 }
      )
    }

    const currency = 'GBP'
    const existingPayment = await getPayment(bookingId)

    if (existingPayment?.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'This booking has already been paid for.' },
        { status: 409 }
      )
    }

    const reusableUrl = await getReusableCheckoutUrl(existingPayment)
    if (reusableUrl) {
      return NextResponse.json({ url: reusableUrl })
    }

    const [{ data: student }, { data: subject }] = await Promise.all([
      supabaseAdmin
        .from('student_profiles')
        .select('full_name')
        .eq('id', anchorBooking.student_id)
        .maybeSingle(),
      supabaseAdmin
        .from('subjects')
        .select('name')
        .eq('id', anchorBooking.subject_id)
        .maybeSingle(),
    ])

    const learnerName = student?.full_name || 'Learner'
    const subjectName = subject?.name || 'Private lesson'
    const planName = planLabels[anchorBooking.plan_id] || 'Learning Plan'
    const lessonCount = groupBookings.length
    const bookingGroupReference =
      anchorBooking.parent_booking_group_id || anchorBooking.id

    // The previous Stripe session id makes a fresh idempotency key possible
    // after expiry while concurrent clicks still resolve to one session.
    const attemptReference = existingPayment?.provider_reference || 'initial'
    const idempotencyKey = `checkout-${bookingGroupReference}-${attemptReference}`

    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        customer_email: user.email || undefined,
        client_reference_id: bookingGroupReference,
        success_url: `${normalisedAppUrl()}/payment/success?bookingId=${anchorBooking.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${normalisedAppUrl()}/payment?bookingId=${anchorBooking.id}&cancelled=1`,
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: `${subjectName} — ${planName}`,
                description: `${lessonCount} private 1-to-1 lesson${lessonCount === 1 ? '' : 's'} for ${learnerName}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          booking_id: anchorBooking.id,
          booking_group_id: anchorBooking.parent_booking_group_id || '',
          parent_id: user.id,
          student_id: anchorBooking.student_id,
          subject_id: anchorBooking.subject_id,
          program_id: anchorBooking.program_id || '',
          plan_id: anchorBooking.plan_id,
          booking_table: 'lesson_bookings',
        },
      },
      { idempotencyKey }
    )

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL.' },
        { status: 500 }
      )
    }

    if (!existingPayment) {
      const { error } = await supabaseAdmin.from('payments').insert({
        booking_id: anchorBooking.id,
        parent_id: user.id,
        payment_provider: 'stripe',
        provider_reference: session.id,
        currency,
        amount,
        amount_gbp: amount,
        exchange_rate_to_gbp: 1,
        payment_status: 'pending',
      })

      if (error) throw error
    } else {
      const { error } = await supabaseAdmin
        .from('payments')
        .update({
          provider_reference: session.id,
          payment_status: 'pending',
          currency,
          amount,
          amount_gbp: amount,
          exchange_rate_to_gbp: 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingPayment.id)

      if (error) throw error
    }

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error('checkout-session error', error)
    return NextResponse.json(
      { error: 'Unable to create checkout session.' },
      { status: 500 }
    )
  }
}

async function authenticateRequest(req: Request) {
  const authorization = req.headers.get('authorization')
  const accessToken = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : ''

  if (!accessToken) return null

  const { data, error } = await supabaseAdmin.auth.getUser(accessToken)
  if (error || !data.user) return null

  return data.user
}

async function getOwnedBooking(bookingId: string, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('lesson_bookings')
    .select(
      'id, parent_id, student_id, subject_id, program_id, plan_id, tutor_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, parent_booking_group_id, booking_frequency'
    )
    .eq('id', bookingId)
    .eq('parent_id', userId)
    .maybeSingle()

  if (error) throw error
  return (data ?? null) as BookingRow | null
}

async function getOwnedBookingGroup(anchor: BookingRow, userId: string) {
  let query = supabaseAdmin
    .from('lesson_bookings')
    .select(
      'id, parent_id, student_id, subject_id, program_id, plan_id, tutor_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, parent_booking_group_id, booking_frequency'
    )
    .eq('parent_id', userId)

  if (anchor.parent_booking_group_id) {
    query = query.eq('parent_booking_group_id', anchor.parent_booking_group_id)
  } else {
    query = query.eq('id', anchor.id)
  }

  const { data, error } = await query
    .order('lesson_date', { ascending: true })
    .order('lesson_time', { ascending: true })

  if (error) throw error
  return (data ?? []) as BookingRow[]
}

async function getPayment(bookingId: string): Promise<PaymentRow | null> {
  const { data, error } = await supabaseAdmin
    .from('payments')
    .select('id, provider_reference, payment_status')
    .eq('booking_id', bookingId)
    .maybeSingle()

  if (error) throw error
  return (data ?? null) as PaymentRow | null
}

async function getReusableCheckoutUrl(payment: PaymentRow | null) {
  if (!payment?.provider_reference || payment.payment_status !== 'pending') {
    return null
  }

  try {
    const existingSession = await stripe.checkout.sessions.retrieve(
      payment.provider_reference
    )

    if (existingSession.status === 'open' && existingSession.url) {
      return existingSession.url
    }
  } catch (error) {
    console.warn('Unable to reuse previous Stripe Checkout session:', error)
  }

  return null
}

function normalisedAppUrl() {
  return appUrl!.replace(/\/$/, '')
}

function validateCheckoutGroup(
  bookings: BookingRow[]
): { ok: true; amount: number } | { ok: false; error: string } {
  const first = bookings[0]
  const rule = planRules[first?.plan_id]

  if (!first || !rule) {
    return { ok: false, error: 'This booking has an unsupported learning plan.' }
  }

  const frequency = first.booking_frequency
  const lessonsPerWeek = frequency === 'TWO_DAYS_WEEKLY' ? 2 : 1

  if (
    frequency !== 'WEEKLY_SAME_TIME' &&
    frequency !== 'TWO_DAYS_WEEKLY'
  ) {
    return { ok: false, error: 'This booking has an invalid weekly frequency.' }
  }

  const expectedLessonCount = rule.weeks * lessonsPerWeek
  const expectedAmount = expectedLessonCount * rule.pricePerLesson

  if (bookings.length !== expectedLessonCount) {
    return {
      ok: false,
      error: `This plan should contain ${expectedLessonCount} lessons. Please recreate the timetable.`,
    }
  }

  const lessonKeys = new Set<string>()
  let positiveAmountRows = 0

  for (const booking of bookings) {
    if (
      booking.parent_id !== first.parent_id ||
      booking.student_id !== first.student_id ||
      booking.subject_id !== first.subject_id ||
      booking.plan_id !== first.plan_id ||
      booking.tutor_id !== first.tutor_id ||
      booking.booking_frequency !== frequency
    ) {
      return { ok: false, error: 'The recurring booking group is inconsistent.' }
    }

    if (!booking.tutor_id || !booking.lesson_date || !booking.lesson_time) {
      return { ok: false, error: 'A lesson is missing its tutor, date, or time.' }
    }

    const lessonKey = `${booking.tutor_id}|${booking.lesson_date}|${booking.lesson_time.slice(0, 5)}`
    if (lessonKeys.has(lessonKey)) {
      return { ok: false, error: 'The timetable contains a duplicate lesson time.' }
    }
    lessonKeys.add(lessonKey)

    const rowAmount = Number(booking.amount_gbp || 0)
    if (!Number.isFinite(rowAmount) || rowAmount < 0) {
      return { ok: false, error: 'The booking contains an invalid amount.' }
    }
    if (rowAmount > 0) positiveAmountRows += 1
  }

  const storedAmount = bookings.reduce(
    (sum, booking) => sum + Number(booking.amount_gbp || 0),
    0
  )

  if (positiveAmountRows !== 1 || Math.abs(storedAmount - expectedAmount) > 0.005) {
    return {
      ok: false,
      error: 'The booking total does not match the selected plan. Please recreate it.',
    }
  }

  return { ok: true, amount: expectedAmount }
}
