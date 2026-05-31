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
  lesson_date: string
  lesson_time: string
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  booking_frequency: string | null
  parent_booking_group_id: string | null
}

type Student = {
  id: string
  full_name: string
}

type Subject = {
  id: string
  name: string
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const bookingId = searchParams.get('bookingId')
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Confirming your payment...')
  const [booking, setBooking] = useState<Booking | null>(null)
  const [groupBookings, setGroupBookings] = useState<Booking[]>([])
  const [student, setStudent] = useState<Student | null>(null)
  const [subject, setSubject] = useState<Subject | null>(null)

  useEffect(() => {
    async function confirmPayment() {
      if (!bookingId) {
        setMessage('Payment successful, but booking reference was not found.')
        setLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: bookingRow, error: bookingError } = await supabase
        .from('lesson_bookings')
        .select(
          'id, parent_id, student_id, subject_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, booking_frequency, parent_booking_group_id'
        )
        .eq('id', bookingId)
        .eq('parent_id', user.id)
        .maybeSingle()

      if (bookingError || !bookingRow) {
        setMessage('Payment received, but we could not find this booking.')
        setLoading(false)
        return
      }

      const mainBooking = bookingRow as Booking
      setBooking(mainBooking)

      const groupId = mainBooking.parent_booking_group_id

      let updateQuery = supabase
        .from('lesson_bookings')
        .update({
          status: 'CONFIRMED',
          payment_status: 'PAID',
          stripe_session_id: sessionId || null,
        })
        .eq('parent_id', user.id)

      if (groupId) {
        updateQuery = updateQuery.eq('parent_booking_group_id', groupId)
      } else {
        updateQuery = updateQuery.eq('id', bookingId)
      }

      const { error: updateError } = await updateQuery

      if (updateError) {
        setMessage(updateError.message)
        setLoading(false)
        return
      }

      // Create lesson reminders for all confirmed lessons in this booking group

const { data: reminderBookings, error: reminderBookingError } = await supabase
  .from('lesson_bookings')
  .select('id, lesson_date, lesson_time')
  .eq(groupId ? 'parent_booking_group_id' : 'id', groupId || bookingId)
  .eq('payment_status', 'PAID')

if (reminderBookingError) {
  console.log('Reminder booking lookup error:', reminderBookingError.message)
}

if (reminderBookings?.length) {
  const reminders = reminderBookings
    .filter((lesson) => lesson.lesson_date && lesson.lesson_time)
    .flatMap((lesson) => {
      const lessonDateTime = new Date(
        `${lesson.lesson_date}T${lesson.lesson_time}:00`
      )

      return [
        {
          booking_id: lesson.id,
          reminder_type: '24_HOURS',
          scheduled_for: new Date(
            lessonDateTime.getTime() - 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          booking_id: lesson.id,
          reminder_type: '1_HOUR',
          scheduled_for: new Date(
            lessonDateTime.getTime() - 60 * 60 * 1000
          ).toISOString(),
        },
      ]
    })

  const { error: reminderError } = await supabase
    .from('lesson_reminders')
    .upsert(reminders, {
      onConflict: 'booking_id,reminder_type',
    })

  if (reminderError) {
    console.log('Reminder creation error:', reminderError.message)
  }
}

      const { data: allBookings } = await supabase
        .from('lesson_bookings')
        .select(
          'id, parent_id, student_id, subject_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, booking_frequency, parent_booking_group_id'
        )
        .eq('parent_id', user.id)
        .eq(groupId ? 'parent_booking_group_id' : 'id', groupId || bookingId)
        .order('lesson_date', { ascending: true })
        .order('lesson_time', { ascending: true })

      setGroupBookings((allBookings ?? []) as Booking[])

      const { data: studentRow } = await supabase
        .from('student_profiles')
        .select('id, full_name')
        .eq('id', mainBooking.student_id)
        .maybeSingle()

      const { data: subjectRow } = await supabase
        .from('subjects')
        .select('id, name')
        .eq('id', mainBooking.subject_id)
        .maybeSingle()

      setStudent(studentRow ?? null)
      setSubject(subjectRow ?? null)
      setMessage('Your child’s learning plan has been confirmed.')
      setLoading(false)
    }

    confirmPayment()
  }, [bookingId, sessionId, router])

  const amountPaid = useMemo(() => {
    return groupBookings.reduce(
      (sum, item) => sum + Number(item.amount_gbp || 0),
      0
    )
  }, [groupBookings])

  const firstLesson = groupBookings[0]

  return (
    <main className="successPage">
      <section className="successHero">
        <div className="successIcon">✓</div>

        <p className="eyebrow">Payment Successful</p>

        <h1>{loading ? 'Finalising your booking...' : 'Booking confirmed'}</h1>

        <p className="muted">{message}</p>

        {!loading && booking ? (
          <div className="summaryGrid">
            <SummaryCard label="Student" value={student?.full_name || 'Selected child'} />
            <SummaryCard label="Subject" value={subject?.name || 'Selected subject'} />
            <SummaryCard
              label="Lessons"
              value={`${groupBookings.length || 1} private 1-to-1 lesson${
                groupBookings.length > 1 ? 's' : ''
              }`}
            />
            <SummaryCard label="Amount paid" value={`£${amountPaid || Number(booking.amount_gbp || 0)}`} />
          </div>
        ) : null}

        <div className="actions">
          <Link href="/parent/dashboard" className="primaryBtn">
            Go to Dashboard
          </Link>

          <Link href="/" className="secondaryBtn">
            Back to Home
          </Link>
        </div>
      </section>

      {!loading && booking ? (
        <section className="detailsGrid">
          <div className="premiumCard">
            <p className="eyebrow">What happens next</p>
            <h2>Your child’s learning journey is ready.</h2>

            <div className="checkList">
              <span>✓ Payment received securely</span>
              <span>✓ Lesson schedule confirmed</span>
              <span>✓ Private 1-to-1 tutoring plan created</span>
              <span>✓ Parent dashboard updated</span>
            </div>
          </div>

          <div className="premiumCard">
            <p className="eyebrow">First lesson</p>

            {firstLesson ? (
              <>
                <h2>{formatDate(firstLesson.lesson_date)}</h2>
                <p className="lessonTime">
                  {firstLesson.lesson_time} • {firstLesson.timezone || 'Europe/London'}
                </p>
              </>
            ) : (
              <>
                <h2>Schedule confirmed</h2>
                <p className="lessonTime">View your lessons in the parent dashboard.</p>
              </>
            )}

            <p className="smallNote">
              Your dashboard will show upcoming lessons, plan details, and learning
              updates.
            </p>
          </div>
        </section>
      ) : null}

      <style jsx>{successStyles}</style>
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

function SuccessLoading() {
  return (
    <main className="successPage">
      <section className="successHero">
        <p className="eyebrow">Payment</p>
        <h1>Loading...</h1>
        <p className="muted">Confirming payment details...</p>
      </section>

      <style jsx>{successStyles}</style>
    </main>
  )
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${dateString}T00:00:00`))
}

const successStyles = `
  .successPage {
    min-height: 100vh;
    padding: 48px 18px 90px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 30%),
      linear-gradient(180deg, #ffffff, #fbf8ff 45%, #f4edff);
    color: #21152d;
  }

  .successHero,
  .detailsGrid {
    max-width: 1080px;
    margin-left: auto;
    margin-right: auto;
  }

  .successHero {
    text-align: center;
    padding: 50px 42px;
    border-radius: 40px;
    background:
      radial-gradient(circle at top, rgba(124, 58, 237, 0.16), transparent 32%),
      linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,239,255,0.95));
    border: 1px solid rgba(111,66,193,0.14);
    box-shadow: 0 30px 90px rgba(71,43,117,0.12);
  }

  .successIcon {
    width: 76px;
    height: 76px;
    margin: 0 auto 20px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
    font-size: 38px;
    font-weight: 950;
    box-shadow: 0 20px 50px rgba(124,58,237,0.28);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-weight: 950;
    font-size: 14px;
  }

  h1 {
    margin: 14px 0 0;
    font-size: clamp(40px, 6vw, 70px);
    line-height: 0.96;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .muted {
    max-width: 680px;
    margin: 18px auto 0;
    color: #6f637e;
    line-height: 1.75;
    font-size: 17px;
  }

  .summaryGrid {
    margin-top: 32px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .summaryCard {
    padding: 18px;
    border-radius: 22px;
    background: white;
    border: 1px solid rgba(124,58,237,0.1);
    box-shadow: 0 14px 34px rgba(55,35,95,0.06);
    text-align: left;
  }

  .summaryCard span {
    display: block;
    color: #7a7088;
    font-size: 13px;
    font-weight: 850;
  }

  .summaryCard strong {
    display: block;
    margin-top: 8px;
    color: #241535;
    font-size: 18px;
    font-weight: 950;
    line-height: 1.25;
  }

  .actions {
    margin-top: 34px;
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .primaryBtn,
  .secondaryBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 56px;
    padding: 0 26px;
    border-radius: 18px;
    font-weight: 950;
    text-decoration: none;
  }

  .primaryBtn {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
    box-shadow: 0 18px 42px rgba(124,58,237,0.28);
  }

  .secondaryBtn {
    background: white;
    color: #351e55;
    border: 1px solid rgba(111,66,193,0.18);
  }

  .detailsGrid {
    margin-top: 26px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
  }

  .premiumCard {
    padding: 32px;
    border-radius: 32px;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(124,58,237,0.1);
    box-shadow: 0 24px 70px rgba(71,43,117,0.09);
  }

  .premiumCard h2 {
    margin: 12px 0 0;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .checkList {
    margin-top: 24px;
    display: grid;
    gap: 12px;
  }

  .checkList span {
    padding: 15px 17px;
    border-radius: 18px;
    background: #fbf8ff;
    color: #351e55;
    font-weight: 850;
    border: 1px solid rgba(124,58,237,0.1);
  }

  .lessonTime {
    margin: 14px 0 0;
    color: #6f637e;
    font-size: 18px;
    font-weight: 800;
  }

  .smallNote {
    margin: 22px 0 0;
    color: #6f637e;
    line-height: 1.7;
  }

  @media (max-width: 840px) {
    .successPage {
      padding: 28px 12px 70px;
    }

    .successHero {
      padding: 34px 20px;
      border-radius: 30px;
    }

    .summaryGrid,
    .detailsGrid {
      grid-template-columns: 1fr;
    }

    .premiumCard {
      padding: 24px 20px;
      border-radius: 28px;
    }

    .primaryBtn,
    .secondaryBtn {
      width: 100%;
    }

    h1 {
      font-size: clamp(38px, 12vw, 56px);
    }
  }
`