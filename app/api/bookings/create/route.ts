import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '../../../lib/stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

type BookingFrequency = 'WEEKLY_SAME_TIME' | 'TWO_DAYS_WEEKLY'

type RequestBody = {
  studentId?: string
  subjectId?: string
  programId?: string | null
  planId?: string
  frequency?: BookingFrequency
  selectedSlotIds?: string[]
}

type SlotRow = {
  id: string
  tutor_id: string
  subject_id: string | null
  learning_level_id: string | null
  weekly_availability_id: string | null
  slot_date: string
  start_time: string
  end_time: string
  starts_at: string
  ends_at: string
  timezone: string
  is_available: boolean
  is_booked: boolean
}

type ExistingBooking = {
  id: string
  parent_id: string | null
  tutor_id: string | null
  lesson_date: string | null
  lesson_time: string | null
  availability_slot_id: string | null
  status: string
  payment_status: string
}

const plans = {
  monthly: { weeks: 4, pricePerLesson: 10 },
  three_month: { weeks: 12, pricePerLesson: 9 },
} as const

class RequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
  }
}

export async function POST(req: Request) {
  try {
    const user = await authenticateRequest(req)
    if (!user) throw new RequestError('You must be logged in to create a booking.', 401)

    const body = (await req.json()) as RequestBody
    const studentId = body.studentId?.trim()
    const subjectId = body.subjectId?.trim()
    const planId = body.planId === 'three_month' ? 'three_month' : 'monthly'
    const frequency: BookingFrequency =
      body.frequency === 'TWO_DAYS_WEEKLY'
        ? 'TWO_DAYS_WEEKLY'
        : 'WEEKLY_SAME_TIME'
    const selectedSlotIds = Array.from(
      new Set((body.selectedSlotIds ?? []).map((value) => value.trim()).filter(Boolean))
    )

    if (!studentId || !subjectId) {
      throw new RequestError('The child or subject is missing. Please start again.', 400)
    }

    const requiredSlotCount = frequency === 'TWO_DAYS_WEEKLY' ? 2 : 1
    if (selectedSlotIds.length !== requiredSlotCount) {
      throw new RequestError(
        requiredSlotCount === 2
          ? 'Please choose two different weekly lesson times.'
          : 'Please choose one weekly lesson time.',
        400
      )
    }

    const { data: parentProfile, error: parentError } = await supabaseAdmin
      .from('parent_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (parentError) throw parentError
    if (!parentProfile) throw new RequestError('Parent profile not found.', 403)

    const { data: student, error: studentError } = await supabaseAdmin
      .from('student_profiles')
      .select('id, learning_level_id')
      .eq('id', studentId)
      .eq('parent_id', parentProfile.id)
      .maybeSingle()

    if (studentError) throw studentError
    if (!student) throw new RequestError('This child does not belong to your account.', 403)

    const { data: subject, error: subjectError } = await supabaseAdmin
      .from('subjects')
      .select('id, name, category')
      .eq('id', subjectId)
      .eq('is_active', true)
      .maybeSingle()

    if (subjectError) throw subjectError
    if (!subject) throw new RequestError('The selected subject is not available.', 400)

    const { data: slotRows, error: slotError } = await supabaseAdmin
      .from('tutor_availability_slots')
      .select(
        'id, tutor_id, subject_id, learning_level_id, weekly_availability_id, slot_date, start_time, end_time, starts_at, ends_at, timezone, is_available, is_booked'
      )
      .in('id', selectedSlotIds)

    if (slotError) throw slotError

    const seedSlots = (slotRows ?? []) as SlotRow[]
    if (seedSlots.length !== requiredSlotCount) {
      throw new RequestError('One of the selected tutor times no longer exists.', 409)
    }

    if (seedSlots.some((slot) => !slot.is_available || slot.is_booked)) {
      throw new RequestError(
        'One of these times has just been booked. Please choose another available time.',
        409
      )
    }

    const tutorIds = new Set(seedSlots.map((slot) => slot.tutor_id))
    if (tutorIds.size !== 1) {
      throw new RequestError('Both weekly lessons must use the same tutor.', 400)
    }

    if (requiredSlotCount === 2) {
      const weekdays = new Set(seedSlots.map((slot) => weekday(slot.slot_date)))
      if (weekdays.size !== 2) {
        throw new RequestError('Choose two different days for the two weekly lessons.', 400)
      }
    }

    const minimumStart = Date.now() + 72 * 60 * 60 * 1000
    if (seedSlots.some((slot) => new Date(slot.starts_at).getTime() < minimumStart)) {
      throw new RequestError('First lessons require at least 72 hours notice.', 409)
    }

    await validateSlotSubjects(seedSlots, subject.name)
    await validateLearningLevels(seedSlots, student.learning_level_id, subject.category)

    const plan = plans[planId]
    const totalLessons = plan.weeks * requiredSlotCount
    const totalAmount = totalLessons * plan.pricePerLesson
    const tutorId = seedSlots[0].tutor_id

    const occurrences = seedSlots.flatMap((seed, seedIndex) =>
      Array.from({ length: plan.weeks }, (_, weekIndex) => ({
        seed,
        seedIndex,
        weekIndex,
        lessonDate: addWeeks(seed.slot_date, weekIndex),
        lessonTime: normaliseTime(seed.start_time),
      }))
    )

    const previousPending = await getPreviousPendingBookings(
      user.id,
      studentId,
      subjectId,
      planId
    )
    const previousIds = new Set(previousPending.map((booking) => booking.id))

    await assertNoBookingConflicts(tutorId, occurrences, previousIds)
    await cancelPreviousReservations(previousPending)

    const occurrenceDates = Array.from(
      new Set(occurrences.map((occurrence) => occurrence.lessonDate))
    )
    const { data: matchingSlotRows, error: matchingSlotError } = await supabaseAdmin
      .from('tutor_availability_slots')
      .select(
        'id, tutor_id, subject_id, learning_level_id, weekly_availability_id, slot_date, start_time, end_time, starts_at, ends_at, timezone, is_available, is_booked'
      )
      .eq('tutor_id', tutorId)
      .in('slot_date', occurrenceDates)

    if (matchingSlotError) throw matchingSlotError

    const matchingSlots = (matchingSlotRows ?? []) as SlotRow[]
    const globallyBookedOccurrence = occurrences.find((occurrence) =>
      matchingSlots.some(
        (slot) =>
          slot.slot_date === occurrence.lessonDate &&
          normaliseTime(slot.start_time) === occurrence.lessonTime &&
          (slot.is_booked || !slot.is_available)
      )
    )

    if (globallyBookedOccurrence) {
      throw new RequestError(
        'A recurring lesson time has just become unavailable. Please choose another timetable.',
        409
      )
    }

    const bookingGroupId = crypto.randomUUID()
    const bookingRows = occurrences.map((occurrence) => {
      const matchingSlot = matchingSlots.find(
        (slot) =>
          slot.slot_date === occurrence.lessonDate &&
          normaliseTime(slot.start_time) === occurrence.lessonTime &&
          slot.subject_id === occurrence.seed.subject_id &&
          slot.learning_level_id === occurrence.seed.learning_level_id
      )

      return {
        parent_id: user.id,
        student_id: studentId,
        subject_id: subjectId,
        program_id: body.programId || null,
        plan_id: planId,
        tutor_id: tutorId,
        availability_slot_id: matchingSlot?.id || (occurrence.weekIndex === 0 ? occurrence.seed.id : null),
        lesson_date: occurrence.lessonDate,
        lesson_time: occurrence.lessonTime,
        timezone: occurrence.seed.timezone || 'Africa/Lagos',
        status: 'PENDING_PAYMENT',
        payment_status: 'UNPAID',
        amount_gbp:
          occurrence.seedIndex === 0 && occurrence.weekIndex === 0 ? totalAmount : 0,
        meeting_link: `https://meet.jit.si/fountainprep-${bookingGroupId}-${occurrence.seedIndex + 1}-${occurrence.weekIndex + 1}`,
        booking_frequency: frequency,
        repeat_weeks: plan.weeks,
        parent_booking_group_id: bookingGroupId,
      }
    })

    const { data: insertedBookings, error: insertError } = await supabaseAdmin
      .from('lesson_bookings')
      .insert(bookingRows)
      .select('id, amount_gbp')

    if (insertError) {
      if (insertError.code === '23505') {
        throw new RequestError(
          'This tutor time was booked by another parent. Please choose another time.',
          409
        )
      }
      throw insertError
    }

    const affectedSlotIds = Array.from(
      new Set(
        matchingSlots
          .filter((slot) =>
            occurrences.some(
              (occurrence) =>
                occurrence.lessonDate === slot.slot_date &&
                occurrence.lessonTime === normaliseTime(slot.start_time)
            )
          )
          .map((slot) => slot.id)
      )
    )

    if (affectedSlotIds.length > 0) {
      const { error: reserveError } = await supabaseAdmin
        .from('tutor_availability_slots')
        .update({
          is_available: false,
          is_booked: true,
          updated_at: new Date().toISOString(),
        })
        .in('id', affectedSlotIds)

      if (reserveError) {
        const insertedIds = (insertedBookings ?? []).map((booking) => booking.id)
        if (insertedIds.length > 0) {
          await supabaseAdmin.from('lesson_bookings').delete().in('id', insertedIds)
        }
        throw reserveError
      }
    }

    const paymentBooking = (insertedBookings ?? []).find(
      (booking) => Number(booking.amount_gbp || 0) > 0
    )

    if (!paymentBooking) {
      throw new Error('Booking group was created without a payment anchor.')
    }

    return NextResponse.json({
      bookingId: paymentBooking.id,
      bookingGroupId,
      totalLessons,
      totalAmount,
    })
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('booking-create error', error)
    return NextResponse.json(
      { error: 'Unable to reserve this timetable. Please try again.' },
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

async function validateSlotSubjects(seedSlots: SlotRow[], requestedName: string) {
  const subjectIds = Array.from(
    new Set(seedSlots.map((slot) => slot.subject_id).filter(Boolean) as string[])
  )

  if (subjectIds.length === 0) {
    throw new RequestError('The selected tutor time has no subject assigned.', 400)
  }

  const { data, error } = await supabaseAdmin
    .from('subjects')
    .select('id, name')
    .in('id', subjectIds)

  if (error) throw error

  const expected = canonicalSubject(requestedName)
  const names = new Map((data ?? []).map((subject) => [subject.id, subject.name]))

  if (
    seedSlots.some(
      (slot) => !slot.subject_id || canonicalSubject(names.get(slot.subject_id) || '') !== expected
    )
  ) {
    throw new RequestError('The selected tutor time does not match this subject.', 400)
  }
}

async function validateLearningLevels(
  seedSlots: SlotRow[],
  studentLevelId: string | null,
  subjectCategory: string | null
) {
  if (String(subjectCategory || '').toLowerCase() === 'language') return

  const levelIds = Array.from(
    new Set(seedSlots.map((slot) => slot.learning_level_id).filter(Boolean) as string[])
  )
  if (levelIds.length === 0 || !studentLevelId) return

  const { data, error } = await supabaseAdmin
    .from('learning_levels')
    .select('id, code, name')
    .in('id', levelIds)

  if (error) throw error
  const allAgesIds = new Set(
    (data ?? [])
      .filter(
        (level) =>
          String(level.code || '').toUpperCase() === 'ALL_AGES' ||
          String(level.name || '').toLowerCase() === 'all ages'
      )
      .map((level) => level.id)
  )

  if (
    seedSlots.some(
      (slot) =>
        slot.learning_level_id &&
        slot.learning_level_id !== studentLevelId &&
        !allAgesIds.has(slot.learning_level_id)
    )
  ) {
    throw new RequestError('This tutor time does not match the child’s learning level.', 400)
  }
}

async function getPreviousPendingBookings(
  parentId: string,
  studentId: string,
  subjectId: string,
  planId: string
) {
  const { data, error } = await supabaseAdmin
    .from('lesson_bookings')
    .select(
      'id, parent_id, tutor_id, lesson_date, lesson_time, availability_slot_id, status, payment_status'
    )
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .eq('subject_id', subjectId)
    .eq('plan_id', planId)
    .eq('status', 'PENDING_PAYMENT')
    .eq('payment_status', 'UNPAID')

  if (error) throw error
  return (data ?? []) as ExistingBooking[]
}

async function assertNoBookingConflicts(
  tutorId: string,
  occurrences: Array<{ lessonDate: string; lessonTime: string }>,
  ignoredBookingIds: Set<string>
) {
  const dates = Array.from(new Set(occurrences.map((item) => item.lessonDate)))
  const { data, error } = await supabaseAdmin
    .from('lesson_bookings')
    .select(
      'id, parent_id, tutor_id, lesson_date, lesson_time, availability_slot_id, status, payment_status'
    )
    .eq('tutor_id', tutorId)
    .in('lesson_date', dates)
    .in('status', ['PENDING_PAYMENT', 'CONFIRMED'])

  if (error) throw error

  const conflict = ((data ?? []) as ExistingBooking[]).find(
    (booking) =>
      !ignoredBookingIds.has(booking.id) &&
      booking.lesson_date &&
      booking.lesson_time &&
      occurrences.some(
        (occurrence) =>
          occurrence.lessonDate === booking.lesson_date &&
          occurrence.lessonTime === normaliseTime(booking.lesson_time || '')
      )
  )

  if (conflict) {
    throw new RequestError(
      'This tutor already has a lesson in part of that weekly timetable. Please choose another time.',
      409
    )
  }
}

async function cancelPreviousReservations(previous: ExistingBooking[]) {
  if (previous.length === 0) return

  const bookingIds = previous.map((booking) => booking.id)
  const { data: payments, error: paymentError } = await supabaseAdmin
    .from('payments')
    .select('id, booking_id, provider_reference, payment_status')
    .in('booking_id', bookingIds)

  if (paymentError) throw paymentError

  for (const payment of payments ?? []) {
    if (payment.payment_status === 'paid') {
      throw new RequestError(
        'A previous payment has already completed. Please check your dashboard.',
        409
      )
    }

    if (payment.provider_reference) {
      const session = await stripe.checkout.sessions.retrieve(payment.provider_reference)

      if (session.payment_status === 'paid' || session.status === 'complete') {
        throw new RequestError(
          'A previous payment is still being confirmed. Please check your dashboard shortly.',
          409
        )
      }

      if (session.status === 'open') {
        await stripe.checkout.sessions.expire(session.id)
      }
    }
  }

  if ((payments ?? []).length > 0) {
    const { error } = await supabaseAdmin
      .from('payments')
      .update({ payment_status: 'failed', updated_at: new Date().toISOString() })
      .in(
        'id',
        (payments ?? []).map((payment) => payment.id)
      )
      .neq('payment_status', 'paid')

    if (error) throw error
  }

  const { error: cancelError } = await supabaseAdmin
    .from('lesson_bookings')
    .update({
      status: 'CANCELLED',
      payment_status: 'FAILED',
      updated_at: new Date().toISOString(),
    })
    .in('id', bookingIds)

  if (cancelError) throw cancelError

  const slotIds = Array.from(
    new Set(
      previous
        .map((booking) => booking.availability_slot_id)
        .filter(Boolean) as string[]
    )
  )

  if (slotIds.length > 0) {
    const { error } = await supabaseAdmin
      .from('tutor_availability_slots')
      .update({
        is_available: true,
        is_booked: false,
        updated_at: new Date().toISOString(),
      })
      .in('id', slotIds)

    if (error) throw error
  }
}

function canonicalSubject(value: string) {
  const normalised = value.trim().toLowerCase().replace(/\s+/g, ' ')
  return normalised === 'mathematics' ? 'maths' : normalised
}

function normaliseTime(value: string) {
  return value.slice(0, 5)
}

function addWeeks(dateValue: string, weeks: number) {
  const date = new Date(`${dateValue}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + weeks * 7)
  return date.toISOString().split('T')[0]
}

function weekday(dateValue: string) {
  return new Date(`${dateValue}T12:00:00Z`).getUTCDay()
}
