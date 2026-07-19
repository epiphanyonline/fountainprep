'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type Booking = {
  id: string
  parent_id: string
  student_id: string
  subject_id: string
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  parent_booking_group_id: string | null
}

type ConfirmationState = 'checking' | 'confirmed' | 'failed' | 'delayed' | 'error'

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<ConfirmationLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  const [confirmationState, setConfirmationState] =
    useState<ConfirmationState>('checking')
  const [message, setMessage] = useState('Securely verifying your Stripe payment...')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [studentName, setStudentName] = useState('Selected child')
  const [subjectName, setSubjectName] = useState('Selected subject')
  const [parentTimezone, setParentTimezone] = useState('Europe/London')

  useEffect(() => {
    let stopped = false
    let timer: ReturnType<typeof setTimeout> | null = null

    async function checkConfirmation(attempt: number) {
      if (!bookingId) {
        if (!stopped) {
          setConfirmationState('error')
          setMessage('The booking reference is missing. Please check your dashboard.')
        }
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      const { data: anchor, error: anchorError } = await supabase
        .from('lesson_bookings')
        .select(
          'id, parent_id, student_id, subject_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, parent_booking_group_id'
        )
        .eq('id', bookingId)
        .eq('parent_id', user.id)
        .maybeSingle()

      if (anchorError || !anchor) {
        if (!stopped) {
          setConfirmationState('error')
          setMessage('We could not find this booking. Please check your dashboard or contact support.')
        }
        return
      }

      let groupQuery = supabase
        .from('lesson_bookings')
        .select(
          'id, parent_id, student_id, subject_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, parent_booking_group_id'
        )
        .eq('parent_id', user.id)

      if (anchor.parent_booking_group_id) {
        groupQuery = groupQuery.eq(
          'parent_booking_group_id',
          anchor.parent_booking_group_id
        )
      } else {
        groupQuery = groupQuery.eq('id', anchor.id)
      }

      const { data: groupRows, error: groupError } = await groupQuery
        .order('lesson_date', { ascending: true })
        .order('lesson_time', { ascending: true })

      if (groupError || !groupRows?.length) {
        if (!stopped) {
          setConfirmationState('error')
          setMessage('We could not load the confirmed timetable. Please contact support.')
        }
        return
      }

      const rows = groupRows as Booking[]

      const [{ data: student }, { data: subject }, { data: parentProfile }] =
        await Promise.all([
          supabase
            .from('student_profiles')
            .select('full_name')
            .eq('id', anchor.student_id)
            .maybeSingle(),
          supabase
            .from('subjects')
            .select('name')
            .eq('id', anchor.subject_id)
            .maybeSingle(),
          supabase
            .from('parent_profiles')
            .select('timezone')
            .eq('user_id', user.id)
            .maybeSingle(),
        ])

      if (stopped) return

      setBookings(rows)
      setStudentName(student?.full_name || 'Selected child')
      setSubjectName(subject?.name || 'Selected subject')
      setParentTimezone(
        parentProfile?.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone ||
          'Europe/London'
      )

      const allConfirmed = rows.every(
        (booking) =>
          booking.status === 'CONFIRMED' && booking.payment_status === 'PAID'
      )
      const anyFailed = rows.some(
        (booking) =>
          booking.status === 'PAYMENT_FAILED' || booking.payment_status === 'FAILED'
      )

      if (allConfirmed) {
        setConfirmationState('confirmed')
        setMessage('Payment verified. Your child’s learning plan is confirmed.')
        return
      }

      if (anyFailed) {
        setConfirmationState('failed')
        setMessage('Stripe did not complete this payment. Your card has not been confirmed.')
        return
      }

      if (attempt >= 15) {
        setConfirmationState('delayed')
        setMessage(
          'Stripe is still confirming the payment. This can take a little longer—your dashboard will update automatically when verification completes.'
        )
        return
      }

      setConfirmationState('checking')
      setMessage('Payment received by Stripe. Finalising your timetable...')
      timer = setTimeout(() => checkConfirmation(attempt + 1), 2000)
    }

    checkConfirmation(0)

    return () => {
      stopped = true
      if (timer) clearTimeout(timer)
    }
  }, [bookingId, router])

  const amountPaid = useMemo(
    () => bookings.reduce((sum, booking) => sum + Number(booking.amount_gbp || 0), 0),
    [bookings]
  )

  const firstLesson = bookings[0]
  const isConfirmed = confirmationState === 'confirmed'

  return (
    <main className="successPage">
      <section className="successCard" aria-live="polite">
        <div className={isConfirmed ? 'statusIcon confirmed' : 'statusIcon'}>
          {isConfirmed ? '✓' : confirmationState === 'failed' ? '!' : '⋯'}
        </div>

        <p className="eyebrow">
          {isConfirmed ? 'Payment verified' : 'Payment verification'}
        </p>
        <h1>{isConfirmed ? 'Booking confirmed' : 'Confirming your booking'}</h1>
        <p className="message">{message}</p>

        {isConfirmed ? (
          <>
            <div className="summaryGrid">
              <SummaryCard label="Learner" value={studentName} />
              <SummaryCard label="Subject" value={subjectName} />
              <SummaryCard
                label="Lessons"
                value={`${bookings.length} private lesson${bookings.length === 1 ? '' : 's'}`}
              />
              <SummaryCard label="Amount paid" value={`£${amountPaid}`} />
            </div>

            {firstLesson ? (
              <div className="firstLesson">
                <span>First lesson in your timezone</span>
                <strong>{formatLessonForViewer(firstLesson, parentTimezone)}</strong>
                <small>Times shown in {parentTimezone}</small>
              </div>
            ) : null}

            <div className="actions">
              <Link href="/parent/dashboard" className="primaryBtn">
                View My Learning Dashboard
              </Link>
            </div>
          </>
        ) : (
          <div className="actions">
            {confirmationState === 'delayed' || confirmationState === 'error' ? (
              <button
                type="button"
                className="primaryBtn"
                onClick={() => window.location.reload()}
              >
                Check Again
              </button>
            ) : null}

            <Link href="/parent/dashboard" className="secondaryBtn">
              Check Dashboard
            </Link>
          </div>
        )}
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="summaryCard">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ConfirmationLoading() {
  return (
    <main className="successPage">
      <section className="successCard">
        <p className="eyebrow">Payment verification</p>
        <h1>Confirming your booking...</h1>
      </section>
      <style jsx>{styles}</style>
    </main>
  )
}

function formatLessonForViewer(booking: Booking, viewerTimezone: string) {
  if (!booking.lesson_date || !booking.lesson_time) return 'Timetable confirmed'

  const lessonInstant = zonedDateTimeToUtc(
    booking.lesson_date,
    booking.lesson_time,
    booking.timezone || 'Europe/London'
  )

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: viewerTimezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).format(lessonInstant)
}

function zonedDateTimeToUtc(dateValue: string, timeValue: string, timeZone: string) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const [hour, minute, second = 0] = timeValue.split(':').map(Number)
  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute, second)
  let candidate = new Date(targetAsUtc)

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = zonedParts(candidate, timeZone)
    const representedAsUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    )
    const difference = targetAsUtc - representedAsUtc

    if (difference === 0) return candidate
    candidate = new Date(candidate.getTime() + difference)
  }

  return candidate
}

function zonedParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const values = new Map(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return {
    year: Number(values.get('year')),
    month: Number(values.get('month')),
    day: Number(values.get('day')),
    hour: Number(values.get('hour')),
    minute: Number(values.get('minute')),
    second: Number(values.get('second')),
  }
}

const styles = `
  .successPage {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 32px 16px;
    background: radial-gradient(circle at top right, rgba(124,58,237,.17), transparent 32%), linear-gradient(180deg,#fff,#f5efff);
    color: #21152d;
  }
  .successCard {
    width: min(920px, 100%);
    padding: clamp(26px, 5vw, 52px);
    border: 1px solid rgba(124,58,237,.12);
    border-radius: 36px;
    background: rgba(255,255,255,.96);
    box-shadow: 0 30px 90px rgba(47,25,80,.12);
    text-align: center;
  }
  .statusIcon {
    width: 72px;
    height: 72px;
    margin: 0 auto 18px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: #f3e8ff;
    color: #6d28d9;
    font-size: 34px;
    font-weight: 950;
  }
  .statusIcon.confirmed { background: #dcfce7; color: #15803d; }
  .eyebrow { margin: 0; color: #6d28d9; font-size: 13px; font-weight: 950; letter-spacing: .12em; text-transform: uppercase; }
  h1 { margin: 12px 0 0; font-size: clamp(36px, 7vw, 68px); line-height: .98; letter-spacing: -.06em; }
  .message { max-width: 680px; margin: 18px auto 0; color: #6d647c; font-size: 17px; line-height: 1.7; }
  .summaryGrid { margin-top: 30px; display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }
  .summaryCard { padding: 18px; border-radius: 20px; background: #fbf8ff; border: 1px solid rgba(124,58,237,.1); text-align: left; }
  .summaryCard span { display: block; color: #7a7088; font-size: 13px; font-weight: 800; }
  .summaryCard strong { display: block; margin-top: 7px; color: #241535; }
  .firstLesson { margin-top: 22px; padding: 22px; border-radius: 24px; background: linear-gradient(135deg,#6d28d9,#4c1d95); color: #fff; }
  .firstLesson span,.firstLesson small,.firstLesson strong { display: block; }
  .firstLesson strong { margin-top: 8px; font-size: 20px; }
  .firstLesson small { margin-top: 7px; opacity: .82; }
  .actions { margin-top: 26px; display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; }
  .primaryBtn,.secondaryBtn { min-height: 54px; padding: 0 24px; border-radius: 17px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-weight: 950; cursor: pointer; }
  .primaryBtn { border: 0; background: linear-gradient(135deg,#7c3aed,#6d28d9); color: #fff; box-shadow: 0 16px 36px rgba(109,40,217,.24); }
  .secondaryBtn { background: #fff; color: #241535; border: 1px solid rgba(124,58,237,.16); }
  @media (max-width: 760px) {
    .summaryGrid { grid-template-columns: 1fr 1fr; }
    .actions,.primaryBtn,.secondaryBtn { width: 100%; }
  }
  @media (max-width: 460px) {
    .successCard { border-radius: 28px; }
    .summaryGrid { grid-template-columns: 1fr; }
  }
`
