'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import {
  bookingInstant,
  formatBookingDate,
  formatBookingTime,
  resolveViewerTimezone,
} from '../../lib/timezone'

type ParentProfile = {
  id: string
  full_name: string
  timezone: string | null
}

type BookingRow = {
  id: string
  student_id: string
  subject_id: string
  tutor_id: string | null
  plan_id: string
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  booking_frequency: string | null
  parent_booking_group_id: string | null
  created_at: string | null
}

type NameRow = {
  id: string
  full_name?: string
  name?: string
}

type BookingGroup = {
  id: string
  lessons: BookingRow[]
  paymentBooking: BookingRow
  firstLesson: BookingRow
  status: string
  totalAmount: number
}

const planLabels: Record<string, string> = {
  monthly: 'Monthly Plan',
  three_month: '3-Month Plan',
}

export default function ParentBookingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading your bookings...')
  const [parent, setParent] = useState<ParentProfile | null>(null)
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [students, setStudents] = useState<Record<string, string>>({})
  const [subjects, setSubjects] = useState<Record<string, string>>({})
  const [tutors, setTutors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadBookings() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!userProfile || userProfile.role !== 'PARENT') {
        router.push('/account')
        return
      }

      const { data: parentProfile, error: parentError } = await supabase
        .from('parent_profiles')
        .select('id, full_name, timezone')
        .eq('user_id', user.id)
        .maybeSingle()

      if (parentError || !parentProfile) {
        router.push('/parent/onboarding')
        return
      }

      setParent(parentProfile as ParentProfile)

      const { data: bookingRows, error: bookingsError } = await supabase
        .from('lesson_bookings')
        .select(`
          id,
          student_id,
          subject_id,
          tutor_id,
          plan_id,
          lesson_date,
          lesson_time,
          timezone,
          status,
          payment_status,
          amount_gbp,
          booking_frequency,
          parent_booking_group_id,
          created_at
        `)
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false })

      if (bookingsError) {
        setMessage(bookingsError.message)
        setLoading(false)
        return
      }

      const cleanBookings = (bookingRows ?? []) as BookingRow[]
      setBookings(cleanBookings)

      const studentIds = unique(cleanBookings.map((item) => item.student_id))
      const subjectIds = unique(cleanBookings.map((item) => item.subject_id))
      const tutorIds = unique(
        cleanBookings.map((item) => item.tutor_id).filter(Boolean) as string[]
      )

      const [studentResult, subjectResult, tutorResult] = await Promise.all([
        studentIds.length
          ? supabase.from('student_profiles').select('id, full_name').in('id', studentIds)
          : Promise.resolve({ data: [] }),
        subjectIds.length
          ? supabase.from('subjects').select('id, name').in('id', subjectIds)
          : Promise.resolve({ data: [] }),
        tutorIds.length
          ? supabase.from('tutor_profiles').select('id, full_name').in('id', tutorIds)
          : Promise.resolve({ data: [] }),
      ])

      setStudents(toNameMap((studentResult.data ?? []) as NameRow[], 'Selected child'))
      setSubjects(toNameMap((subjectResult.data ?? []) as NameRow[], 'Selected subject'))
      setTutors(toNameMap((tutorResult.data ?? []) as NameRow[], 'Approved tutor'))
      setMessage('')
      setLoading(false)
    }

    loadBookings()
  }, [router])

  const groups = useMemo(() => groupBookings(bookings), [bookings])
  const viewerTimezone = resolveViewerTimezone(parent?.timezone)

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Parent Portal</p>
        <h1>My Bookings</h1>
        <p className="subtitle">
          {parent
            ? `See every plan for ${parent.full_name}, continue an unfinished payment, or open the complete lesson timetable.`
            : 'See your plans, payments, and complete lesson timetable.'}
        </p>

        <div className="heroActions">
          <Link href="/parent/students" className="primaryBtn">
            Book Another Lesson
          </Link>
          <Link href="/parent/sessions" className="secondaryBtn">
            View Full Timetable
          </Link>
          <Link href="/parent/dashboard" className="secondaryBtn">
            Back to Dashboard
          </Link>
        </div>
      </section>

      {loading ? <div className="notice">Loading your bookings...</div> : null}
      {!loading && message ? <div className="notice error">{message}</div> : null}

      {!loading && !message && groups.length === 0 ? (
        <section className="emptyCard">
          <p className="eyebrow">Ready when you are</p>
          <h2>No bookings yet</h2>
          <p>Choose a child to start. The booking journey will guide you through subject, plan, timetable, and payment.</p>
          <Link href="/parent/students" className="primaryBtn">
            Start Booking
          </Link>
        </section>
      ) : null}

      {!loading && groups.length > 0 ? (
        <section className="bookingList" aria-label="Booking plans">
          {groups.map((group) => {
            const first = group.firstLesson
            const needsPayment =
              group.status === 'PENDING_PAYMENT' ||
              group.lessons.some((item) => item.payment_status !== 'PAID')

            return (
              <article key={group.id} className="bookingCard">
                <div className="bookingTop">
                  <div>
                    <p className="eyebrow">
                      {planLabels[first.plan_id] || first.plan_id || 'Lesson Plan'}
                    </p>
                    <h2>{subjects[first.subject_id] || 'Selected subject'}</h2>
                    <p className="meta">
                      For <strong>{students[first.student_id] || 'Selected child'}</strong>
                      {' · '}Tutor <strong>{first.tutor_id ? tutors[first.tutor_id] || 'Approved tutor' : 'To be assigned'}</strong>
                    </p>
                  </div>
                  <StatusChip value={group.status} />
                </div>

                <div className="infoGrid">
                  <Info label="First lesson" value={formatBookingDate(first.lesson_date, first.lesson_time, first.timezone, viewerTimezone)} />
                  <Info label="Your time" value={formatBookingTime(first.lesson_date, first.lesson_time, first.timezone, viewerTimezone)} />
                  <Info label="Lessons" value={String(group.lessons.length)} />
                  <Info label="Plan total" value={`£${group.totalAmount.toFixed(2)}`} />
                </div>

                <p className="timezoneNote">Times are shown in {viewerTimezone}. The tutor’s original timezone is converted automatically.</p>

                <div className="cardActions">
                  <Link href="/parent/sessions" className="secondaryBtn">
                    View Schedule
                  </Link>
                  {needsPayment ? (
                    <Link href={`/payment?bookingId=${group.paymentBooking.id}`} className="primaryBtn">
                      Continue Payment
                    </Link>
                  ) : null}
                </div>
              </article>
            )
          })}
        </section>
      ) : null}

      <style jsx>{styles}</style>
    </main>
  )
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

function toNameMap(rows: NameRow[], fallback: string) {
  const map: Record<string, string> = {}
  rows.forEach((row) => {
    map[row.id] = row.full_name || row.name || fallback
  })
  return map
}

function lessonTimeValue(lesson: BookingRow) {
  if (!lesson.lesson_date || !lesson.lesson_time) return Number.MAX_SAFE_INTEGER
  return bookingInstant(lesson.lesson_date, lesson.lesson_time, lesson.timezone).getTime()
}

function groupBookings(bookings: BookingRow[]): BookingGroup[] {
  const grouped = new Map<string, BookingRow[]>()

  bookings.forEach((booking) => {
    const id = booking.parent_booking_group_id || booking.id
    grouped.set(id, [...(grouped.get(id) ?? []), booking])
  })

  return Array.from(grouped.entries())
    .map(([id, rows]) => {
      const lessons = [...rows].sort((a, b) => lessonTimeValue(a) - lessonTimeValue(b))
      const paymentBooking = lessons.find((item) => Number(item.amount_gbp || 0) > 0) || lessons[0]
      const allCompleted = lessons.every((item) => item.status === 'COMPLETED')
      const allPaid = lessons.every((item) => item.payment_status === 'PAID')
      const anyPending = lessons.some(
        (item) => item.status === 'PENDING_PAYMENT' || item.payment_status !== 'PAID'
      )

      return {
        id,
        lessons,
        paymentBooking,
        firstLesson: lessons[0],
        status: allCompleted
          ? 'COMPLETED'
          : allPaid
            ? 'CONFIRMED'
            : anyPending
              ? 'PENDING_PAYMENT'
              : lessons[0].status,
        totalAmount: lessons.reduce((sum, item) => sum + Number(item.amount_gbp || 0), 0),
      }
    })
    .sort((a, b) => {
      const aCreated = a.paymentBooking.created_at ? Date.parse(a.paymentBooking.created_at) : 0
      const bCreated = b.paymentBooking.created_at ? Date.parse(b.paymentBooking.created_at) : 0
      return bCreated - aCreated
    })
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function StatusChip({ value }: { value: string }) {
  const normalized = value.toUpperCase()
  const label = normalized.replaceAll('_', ' ')
  const className =
    normalized === 'COMPLETED'
      ? 'status completed'
      : normalized === 'CONFIRMED'
        ? 'status confirmed'
        : normalized === 'CANCELLED' || normalized === 'PAYMENT_FAILED'
          ? 'status failed'
          : 'status pending'

  return <span className={className}>{label}</span>
}

const styles = `
  .page { min-height: 100vh; padding: 42px 18px 90px; background: linear-gradient(180deg,#fff,#fbf8ff 45%,#f4edff); color: #21152d; }
  .hero, .bookingList, .notice, .emptyCard { max-width: 1120px; margin-left: auto; margin-right: auto; }
  .hero { padding: 44px; border-radius: 38px; background: radial-gradient(circle at top right,rgba(124,58,237,.17),transparent 34%),rgba(255,255,255,.97); border: 1px solid rgba(124,58,237,.13); box-shadow: 0 28px 80px rgba(71,43,117,.11); }
  .eyebrow { margin: 0; color: #6d28d9; font-weight: 950; font-size: 14px; }
  h1 { margin: 12px 0 0; font-size: clamp(42px,7vw,70px); line-height: .98; letter-spacing: -.055em; }
  .subtitle, .meta, .timezoneNote, .emptyCard p { color: #6f637e; line-height: 1.7; }
  .subtitle { max-width: 760px; margin: 18px 0 0; font-size: 18px; }
  .heroActions, .cardActions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 26px; }
  .primaryBtn, .secondaryBtn { min-height: 52px; padding: 0 22px; display: inline-flex; align-items: center; justify-content: center; border-radius: 17px; text-decoration: none; font-weight: 950; }
  .primaryBtn { color: white; background: linear-gradient(135deg,#7c3aed,#6d28d9); box-shadow: 0 14px 34px rgba(124,58,237,.25); }
  .secondaryBtn { color: #351e55; background: white; border: 1px solid rgba(124,58,237,.17); }
  .notice { margin-top: 20px; padding: 16px 18px; border-radius: 18px; background: white; border: 1px solid rgba(124,58,237,.15); font-weight: 850; }
  .notice.error { color: #b42318; background: #fff5f5; border-color: #fecaca; }
  .bookingList { display: grid; gap: 20px; margin-top: 28px; }
  .bookingCard, .emptyCard { padding: 28px; border-radius: 30px; background: rgba(255,255,255,.97); border: 1px solid rgba(124,58,237,.13); box-shadow: 0 22px 60px rgba(71,43,117,.08); }
  .emptyCard { margin-top: 28px; text-align: center; }
  .emptyCard h2 { margin: 10px 0; font-size: 32px; }
  .emptyCard .primaryBtn { margin-top: 10px; }
  .bookingTop { display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; }
  .bookingTop h2 { margin: 9px 0 0; font-size: 32px; letter-spacing: -.04em; }
  .meta { margin: 10px 0 0; }
  .status { padding: 9px 13px; border-radius: 999px; font-size: 12px; font-weight: 950; white-space: nowrap; }
  .status.confirmed { color: #027a48; background: #ecfdf3; }
  .status.completed { color: #175cd3; background: #eff8ff; }
  .status.pending { color: #b54708; background: #fffaeb; }
  .status.failed { color: #b42318; background: #fef3f2; }
  .infoGrid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; margin-top: 22px; }
  .info { padding: 15px; border-radius: 18px; background: #fbf8ff; border: 1px solid rgba(124,58,237,.1); }
  .info span { display: block; color: #7a7088; font-size: 12px; font-weight: 850; }
  .info strong { display: block; margin-top: 7px; font-size: 15px; }
  .timezoneNote { margin: 14px 0 0; font-size: 13px; }
  @media (max-width: 820px) {
    .page { padding: 24px 12px 70px; }
    .hero { padding: 32px 20px; border-radius: 28px; }
    .bookingCard { padding: 22px 18px; }
    .bookingTop { flex-direction: column; }
    .infoGrid { grid-template-columns: 1fr 1fr; }
    .primaryBtn, .secondaryBtn { width: 100%; }
  }
  @media (max-width: 520px) { .infoGrid { grid-template-columns: 1fr; } }
`
