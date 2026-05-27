'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'

type BookingRow = {
  id: string
  parent_id: string
  student_id: string
  subject_id: string
  tutor_id: string
  availability_slot_id: string | null
  lesson_date: string
  lesson_time: string
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  meeting_link: string | null
  notes: string | null
  booking_frequency: string | null
  repeat_weeks: number | null
  parent_booking_group_id: string | null
}

type StudentRow = {
  id: string
  full_name: string
}

type SubjectRow = {
  id: string
  name: string
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentContent />
    </Suspense>
  )
}

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('Loading payment details...')
  const [booking, setBooking] = useState<BookingRow | null>(null)
  const [groupBookings, setGroupBookings] = useState<BookingRow[]>([])
  const [student, setStudent] = useState<StudentRow | null>(null)
  const [subject, setSubject] = useState<SubjectRow | null>(null)

  useEffect(() => {
    async function loadPayment() {
      setLoading(true)
      setMessage('Loading payment details...')

      if (!bookingId) {
        setMessage('Missing booking reference.')
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
          'id, parent_id, student_id, subject_id, tutor_id, availability_slot_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, meeting_link, notes, booking_frequency, repeat_weeks, parent_booking_group_id'
        )
        .eq('id', bookingId)
        .eq('parent_id', user.id)
        .maybeSingle()

      if (bookingError || !bookingRow) {
        setMessage('Booking not found.')
        setLoading(false)
        return
      }

      const mainBooking = bookingRow as BookingRow
      setBooking(mainBooking)

      if (mainBooking.parent_booking_group_id) {
        const { data: groupRows } = await supabase
          .from('lesson_bookings')
          .select(
            'id, parent_id, student_id, subject_id, tutor_id, availability_slot_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, meeting_link, notes, booking_frequency, repeat_weeks, parent_booking_group_id'
          )
          .eq('parent_booking_group_id', mainBooking.parent_booking_group_id)
          .eq('parent_id', user.id)
          .order('lesson_date', { ascending: true })
          .order('lesson_time', { ascending: true })

        setGroupBookings((groupRows ?? []) as BookingRow[])
      } else {
        setGroupBookings([mainBooking])
      }

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
      setMessage('')
      setLoading(false)
    }

    loadPayment()
  }, [bookingId, router])

  const amount = useMemo(() => Number(booking?.amount_gbp || 0), [booking])

  const totalLessons = groupBookings.length || 1

  const planLabel =
    booking?.booking_frequency === 'TWO_DAYS_WEEKLY'
      ? '2 lessons weekly'
      : '1 lesson weekly'

  async function handleCheckout() {
    if (!booking) return

    setSaving(true)
    setMessage('Preparing secure payment...')

    try {
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id }),
      })

      const json = await res.json()

      if (!res.ok) {
        setMessage(json.error || 'Unable to create checkout session.')
        setSaving(false)
        return
      }

      if (json.url) {
        window.location.href = json.url
        return
      }

      setMessage('Payment session created but no checkout URL was returned.')
      setSaving(false)
    } catch (error: any) {
      setMessage(error.message || 'Unexpected payment error.')
      setSaving(false)
    }
  }

  if (loading) return <PaymentLoading message={message} />

  if (!booking) {
    return (
      <main className="payment-page">
        <section className="payment-card">
          <p className="eyebrow">Payment</p>
          <h1>Booking not found</h1>
          <p className="muted">{message}</p>

          <Link href="/parent/dashboard" className="secondary-btn">
            Back to Dashboard
          </Link>
        </section>

        <style jsx>{paymentStyles}</style>
      </main>
    )
  }

  return (
    <main className="payment-page">
      <section className="payment-hero">
        <p className="eyebrow">Secure Payment</p>
        <h1>Confirm your Fountain Prep booking</h1>
        <p className="muted">
          Review the learning plan below, then continue to secure payment.
        </p>
      </section>

      <section className="payment-grid">
        <div className="payment-card">
          <p className="eyebrow">Booking Summary</p>

          <h2>{student?.full_name || 'Selected child'}</h2>

          <div className="summary-list">
            <SummaryRow label="Subject" value={subject?.name || 'Selected subject'} />
            <SummaryRow label="Plan" value={planLabel} />
            <SummaryRow
              label="Lessons"
              value={`${totalLessons} lesson booking${totalLessons > 1 ? 's' : ''}`}
            />
            <SummaryRow label="Status" value={booking.status} />
            <SummaryRow label="Payment" value={booking.payment_status} />
          </div>

          <div className="lesson-list">
            {groupBookings.map((item, index) => (
              <div key={item.id} className="lesson-row">
                <strong>Lesson {index + 1}</strong>
                <span>
                  {formatDate(item.lesson_date)} · {item.lesson_time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="payment-card checkout-card">
          <p className="eyebrow">Amount Due</p>

          <div className="amount">£{amount}</div>

          <p className="muted">
            This covers the selected Fountain Prep learning package.
          </p>

          {message ? <p className="message">{message}</p> : null}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={saving || amount <= 0}
            className="primary-btn"
          >
            {saving ? 'Preparing Payment...' : 'Continue to Payment'}
          </button>

          <Link href="/parent/dashboard" className="secondary-btn full">
            Back to Dashboard
          </Link>
        </aside>
      </section>

      <style jsx>{paymentStyles}</style>
    </main>
  )
}

function PaymentLoading({ message = 'Loading payment...' }: { message?: string }) {
  return (
    <main className="payment-page">
      <section className="payment-card">
        <p className="eyebrow">Payment</p>
        <h1>Loading payment</h1>
        <p className="muted">{message}</p>
      </section>

      <style jsx>{paymentStyles}</style>
    </main>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const paymentStyles = `
  .payment-page {
    min-height: 100vh;
    padding: 48px 20px 90px;
    background: radial-gradient(circle at top right, #eadcff 0, #faf7ff 36%, #f8f5ff 100%);
    color: #21152d;
  }

  .payment-hero,
  .payment-grid {
    max-width: 1120px;
    margin: 0 auto;
  }

  .payment-hero {
    margin-bottom: 28px;
  }

  .eyebrow {
    margin: 0;
    color: #6f42c1;
    font-weight: 900;
    font-size: 14px;
  }

  h1 {
    margin: 12px 0 0;
    font-size: clamp(38px, 6vw, 62px);
    line-height: 1;
    letter-spacing: -0.055em;
    font-weight: 950;
  }

  h2 {
    margin: 12px 0 20px;
    font-size: 30px;
    letter-spacing: -0.03em;
  }

  .muted {
    color: #6f637e;
    line-height: 1.7;
    font-size: 16px;
  }

  .payment-grid {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 24px;
    align-items: start;
  }

  .payment-card {
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(111,66,193,0.12);
    border-radius: 30px;
    padding: 32px;
    box-shadow: 0 24px 70px rgba(71,43,117,0.1);
  }

  .checkout-card {
    position: sticky;
    top: 110px;
  }

  .summary-list {
    display: grid;
    gap: 12px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 15px 16px;
    border-radius: 16px;
    background: #faf7ff;
    border: 1px solid rgba(111,66,193,0.1);
  }

  .summary-row span {
    color: #6f637e;
    font-weight: 700;
  }

  .summary-row strong {
    text-align: right;
  }

  .lesson-list {
    margin-top: 22px;
    display: grid;
    gap: 10px;
  }

  .lesson-row {
    display: grid;
    gap: 4px;
    padding: 14px 16px;
    border-radius: 16px;
    background: white;
    border: 1px solid rgba(111,66,193,0.12);
  }

  .lesson-row span {
    color: #6f637e;
  }

  .amount {
    margin-top: 16px;
    font-size: 56px;
    font-weight: 950;
    letter-spacing: -0.06em;
  }

  .primary-btn,
  .secondary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 54px;
    padding: 0 22px;
    border-radius: 18px;
    font-weight: 900;
    text-decoration: none;
    border: 0;
    cursor: pointer;
    font-size: 15px;
  }

  .primary-btn {
    width: 100%;
    margin-top: 22px;
    background: linear-gradient(135deg, #6f35d5, #8b5cf6);
    color: white;
    box-shadow: 0 16px 38px rgba(124,58,237,0.28);
  }

  .primary-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .secondary-btn {
    margin-top: 16px;
    background: white;
    color: #351e55;
    border: 1px solid rgba(111,66,193,0.18);
  }

  .secondary-btn.full {
    width: 100%;
  }

  .message {
    margin-top: 18px;
    padding: 14px 16px;
    border-radius: 16px;
    background: #fff7ed;
    color: #9a3412;
    border: 1px solid #fed7aa;
    font-weight: 800;
  }

  @media (max-width: 900px) {
    .payment-grid {
      grid-template-columns: 1fr;
    }

    .checkout-card {
      position: static;
    }

    .payment-card {
      padding: 26px 20px;
    }
  }
`