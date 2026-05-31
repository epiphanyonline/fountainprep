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
  lesson_date: string
  lesson_time: string
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
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
  const [message, setMessage] = useState('Loading secure payment details...')
  const [booking, setBooking] = useState<BookingRow | null>(null)
  const [groupBookings, setGroupBookings] = useState<BookingRow[]>([])
  const [student, setStudent] = useState<StudentRow | null>(null)
  const [subject, setSubject] = useState<SubjectRow | null>(null)

  useEffect(() => {
    async function loadPayment() {
      setLoading(true)

      if (!bookingId) {
        setMessage('Missing booking reference. Please start again.')
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

      const { data: bookingRow, error } = await supabase
        .from('lesson_bookings')
        .select(
          'id, parent_id, student_id, subject_id, tutor_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, booking_frequency, repeat_weeks, parent_booking_group_id'
        )
        .eq('id', bookingId)
        .eq('parent_id', user.id)
        .maybeSingle()

      if (error || !bookingRow) {
        setMessage('Booking not found or you do not have access to this booking.')
        setLoading(false)
        return
      }

      const mainBooking = bookingRow as BookingRow
      setBooking(mainBooking)

      if (mainBooking.parent_booking_group_id) {
        const { data: rows } = await supabase
          .from('lesson_bookings')
          .select(
            'id, parent_id, student_id, subject_id, tutor_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, booking_frequency, repeat_weeks, parent_booking_group_id'
          )
          .eq('parent_booking_group_id', mainBooking.parent_booking_group_id)
          .eq('parent_id', user.id)
          .order('lesson_date', { ascending: true })
          .order('lesson_time', { ascending: true })

        setGroupBookings((rows ?? []) as BookingRow[])
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

  const amount = useMemo(() => {
    const directAmount = Number(booking?.amount_gbp || 0)
    if (directAmount > 0) return directAmount

    return groupBookings.reduce(
      (sum, item) => sum + Number(item.amount_gbp || 0),
      0
    )
  }, [booking, groupBookings])

  const totalLessons = groupBookings.length || 1

  const planLabel =
    booking?.booking_frequency === 'TWO_DAYS_WEEKLY'
      ? '2 lessons weekly'
      : '1 lesson weekly'

  const pricePerClass =
    totalLessons > 0 && amount > 0 ? Math.round((amount / totalLessons) * 100) / 100 : 0

  async function handleCheckout() {
    if (!booking) return

    if (amount <= 0) {
      setMessage('Payment amount is missing. Please contact support before continuing.')
      return
    }

    setSaving(true)
    setMessage('Preparing secure Stripe checkout...')

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

      setMessage('Checkout session created but no payment link was returned.')
      setSaving(false)
    } catch (error: any) {
      setMessage(error.message || 'Unexpected payment error.')
      setSaving(false)
    }
  }

  if (loading) return <PaymentLoading message={message} />

  if (!booking) {
    return (
      <main className="paymentPage">
        <section className="emptyCard">
          <p className="eyebrow">Payment</p>
          <h1>Booking not found</h1>
          <p>{message}</p>
          <Link href="/parent/dashboard" className="secondaryBtn">
            Back to Dashboard
          </Link>
        </section>

        <style jsx>{styles}</style>
      </main>
    )
  }

  return (
    <main className="paymentPage">
      <section className="hero">
        <p className="eyebrow">Secure Stripe Payment</p>
        <h1>Confirm your private 1-to-1 tutoring plan.</h1>
        <p className="subtitle">
          Review your Fountain Prep booking before continuing to secure payment.
        </p>

        <div className="trustRow">
          <span>✓ Private 1-to-1 lessons</span>
          <span>✓ Secure checkout</span>
          <span>✓ Structured learning plan</span>
        </div>
      </section>

      <section className="paymentGrid">
        <div className="detailsCard">
          <div className="cardHead">
            <p className="eyebrow">Booking Summary</p>
            <h2>{student?.full_name || 'Selected child'}</h2>
          </div>

          <div className="summaryList">
            <SummaryRow label="Subject" value={subject?.name || 'Selected subject'} />
            <SummaryRow label="Learning format" value="Private 1-to-1 online tutoring" />
            <SummaryRow label="Plan" value={planLabel} />
            <SummaryRow label="Lessons" value={`${totalLessons} private lesson${totalLessons > 1 ? 's' : ''}`} />
            <SummaryRow label="Price per class" value={pricePerClass ? `£${pricePerClass}` : 'Included'} />
            <SummaryRow label="Booking status" value={booking.status} />
            <SummaryRow label="Payment status" value={booking.payment_status} />
          </div>

          <div className="lessonList">
            <h3>Lesson schedule</h3>

            {groupBookings.map((item, index) => (
              <div key={item.id} className="lessonItem">
                <div>
                  <strong>Lesson {index + 1}</strong>
                  <span>{formatDate(item.lesson_date)} · {item.lesson_time}</span>
                </div>
                <small>{item.timezone || 'Europe/London'}</small>
              </div>
            ))}
          </div>
        </div>

        <aside className="checkoutCard">
          <p className="eyebrow">Amount Due</p>

          <div className="amountBox">
            <span>Total package</span>
            <strong>£{amount}</strong>
            <p>{totalLessons} private 1-to-1 lesson{totalLessons > 1 ? 's' : ''}</p>
          </div>

          <div className="secureBox">
            <strong>Secure payment</strong>
            <p>
              You will be redirected to Stripe to complete payment safely by card.
            </p>
          </div>

          {message ? <div className="messageBox">{message}</div> : null}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={saving || amount <= 0}
            className="primaryBtn"
          >
            {saving ? 'Preparing Payment...' : 'Continue to Secure Payment'}
          </button>

          <Link href="/parent/dashboard" className="secondaryBtn full">
            Back to Dashboard
          </Link>
        </aside>
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function PaymentLoading({ message = 'Loading payment details...' }: { message?: string }) {
  return (
    <main className="paymentPage">
      <section className="hero">
        <p className="eyebrow">Fountain Prep Payment</p>
        <h1>Loading secure payment details...</h1>
        <p className="subtitle">{message}</p>
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summaryRow">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${dateString}T00:00:00`))
}

const styles = `
  .paymentPage {
    min-height: 100vh;
    padding: 44px 18px 90px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.14), transparent 30%),
      linear-gradient(180deg, #ffffff, #fbf8ff 46%, #f4edff);
    color: #201230;
  }

  .hero,
  .paymentGrid,
  .emptyCard {
    max-width: 1180px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero {
    padding: 48px;
    border-radius: 38px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 34%),
      linear-gradient(135deg, #ffffff, #f4edff);
    border: 1px solid rgba(124, 58, 237, 0.12);
    box-shadow: 0 30px 90px rgba(47, 25, 80, 0.1);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-weight: 950;
    font-size: 14px;
  }

  h1 {
    margin: 14px 0 0;
    max-width: 900px;
    font-size: clamp(40px, 6vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .subtitle {
    margin: 20px 0 0;
    max-width: 760px;
    color: #6d647c;
    font-size: 18px;
    line-height: 1.75;
  }

  .trustRow {
    margin-top: 28px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .trustRow span {
    padding: 11px 15px;
    border-radius: 999px;
    background: white;
    color: #352145;
    font-weight: 850;
    border: 1px solid rgba(124, 58, 237, 0.1);
    box-shadow: 0 12px 30px rgba(55, 35, 95, 0.05);
  }

  .paymentGrid {
    margin-top: 28px;
    display: grid;
    grid-template-columns: 1fr 390px;
    gap: 24px;
    align-items: start;
  }

  .detailsCard,
  .checkoutCard,
  .emptyCard {
    padding: 32px;
    border-radius: 34px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(124, 58, 237, 0.1);
    box-shadow: 0 24px 70px rgba(47, 25, 80, 0.09);
  }

  .checkoutCard {
    position: sticky;
    top: 24px;
  }

  .cardHead h2 {
    margin: 10px 0 0;
    font-size: 34px;
    line-height: 1.05;
    letter-spacing: -0.04em;
    font-weight: 950;
  }

  .summaryList {
    margin-top: 24px;
    display: grid;
    gap: 12px;
  }

  .summaryRow {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 16px;
    border-radius: 18px;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.08);
  }

  .summaryRow span {
    color: #7a7088;
    font-weight: 800;
  }

  .summaryRow strong {
    text-align: right;
    color: #241535;
    font-weight: 950;
  }

  .lessonList {
    margin-top: 28px;
  }

  .lessonList h3 {
    margin: 0 0 16px;
    font-size: 24px;
    letter-spacing: -0.03em;
  }

  .lessonItem {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: center;
    padding: 16px;
    border-radius: 20px;
    background: white;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .lessonItem + .lessonItem {
    margin-top: 10px;
  }

  .lessonItem strong,
  .lessonItem span {
    display: block;
  }

  .lessonItem span,
  .lessonItem small {
    margin-top: 6px;
    color: #6d647c;
    font-weight: 750;
  }

  .amountBox {
    margin-top: 20px;
    padding: 24px;
    border-radius: 26px;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 20px 50px rgba(109, 40, 217, 0.25);
  }

  .amountBox span {
    font-weight: 850;
    opacity: 0.92;
  }

  .amountBox strong {
    display: block;
    margin-top: 10px;
    font-size: 58px;
    line-height: 1;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .amountBox p {
    margin: 8px 0 0;
    opacity: 0.92;
    line-height: 1.5;
  }

  .secureBox {
    margin-top: 18px;
    padding: 18px;
    border-radius: 22px;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .secureBox strong {
    display: block;
    color: #241535;
    font-weight: 950;
  }

  .secureBox p {
    margin: 8px 0 0;
    color: #6d647c;
    line-height: 1.6;
  }

  .messageBox {
    margin-top: 16px;
    padding: 15px;
    border-radius: 18px;
    background: #fff7ed;
    color: #9a3412;
    font-weight: 800;
    border: 1px solid #fed7aa;
  }

  .primaryBtn,
  .secondaryBtn {
    min-height: 56px;
    border-radius: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-weight: 950;
  }

  .primaryBtn {
    width: 100%;
    margin-top: 18px;
    border: 0;
    cursor: pointer;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 18px 42px rgba(109, 40, 217, 0.24);
  }

  .primaryBtn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .secondaryBtn {
    padding: 0 22px;
    background: white;
    color: #241535;
    border: 1px solid rgba(124, 58, 237, 0.14);
  }

  .secondaryBtn.full {
    width: 100%;
    margin-top: 14px;
  }

  .emptyCard {
    margin-top: 60px;
  }

  .emptyCard h1 {
    font-size: clamp(34px, 5vw, 58px);
  }

  .emptyCard p {
    color: #6d647c;
    line-height: 1.7;
  }

  @media (max-width: 980px) {
    .paymentPage {
      padding: 26px 12px 70px;
    }

    .hero {
      padding: 30px 20px;
      border-radius: 30px;
    }

    .paymentGrid {
      grid-template-columns: 1fr;
    }

    .checkoutCard {
      position: static;
    }

    .detailsCard,
    .checkoutCard {
      padding: 22px;
      border-radius: 28px;
    }

    .summaryRow,
    .lessonItem {
      flex-direction: column;
      align-items: flex-start;
    }

    .summaryRow strong {
      text-align: left;
    }

    h1 {
      font-size: clamp(38px, 12vw, 56px);
    }

    .subtitle {
      font-size: 16px;
    }

    .amountBox strong {
      font-size: 50px;
    }
  }
`