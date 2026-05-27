'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

type BookingRow = {
  id: string
  booking_ref: string | null
  booking_date: string
  start_time: string
  end_time: string
  duration_minutes: number
  lesson_status: string
  lesson_title: string | null
  parent_notes: string | null
  parent_id: string
  tutor_id: string
  subject_id: string
  price_amount: number | null
  currency: string | null
  total_sessions: number | null
}

type SubjectRow = {
  id: string
  name: string
}

export default function ParentPaymentPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('Loading...')
  const [booking, setBooking] = useState<BookingRow | null>(null)
  const [subject, setSubject] = useState<SubjectRow | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setMessage('Loading...')

      const resolvedParams = await params

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: parentProfile } = await supabase
        .from('parent_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!parentProfile) {
        router.push('/parent/onboarding')
        return
      }

      const { data: bookingRow, error: bookingError } = await supabase
        .from('bookings')
        .select(
          'id, booking_ref, booking_date, start_time, end_time, duration_minutes, lesson_status, lesson_title, parent_notes, parent_id, tutor_id, subject_id, price_amount, currency, total_sessions'
        )
        .eq('id', resolvedParams.bookingId)
        .eq('parent_id', parentProfile.id)
        .maybeSingle()

      if (bookingError || !bookingRow) {
        setMessage('Booking not found.')
        setLoading(false)
        return
      }

      const { data: subjectRow } = await supabase
        .from('subjects')
        .select('id, name')
        .eq('id', bookingRow.subject_id)
        .maybeSingle()

      setBooking(bookingRow as BookingRow)
      setSubject(subjectRow ?? null)
      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [params, router])

  const amount = useMemo(() => {
    if (!booking) return 0
    return Number(booking.price_amount || 0)
  }, [booking])

  const currency = booking?.currency || 'GBP'

  async function handleCheckout() {
    if (!booking) return

    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id }),
      })

      const json = await res.json()

      if (!res.ok) {
        setMessage(json.error || 'Unable to create checkout session')
        return
      }

      if (json.url) {
        window.location.href = json.url
        return
      }

      setMessage('Stripe session created but no redirect URL returned.')
    } catch (error: any) {
      setMessage(error.message || 'Unexpected error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="card" style={{ padding: 32 }}>
            <h1 className="page-title" style={{ fontSize: 38 }}>Payment</h1>
            <p>{message}</p>
          </div>
        </div>
      </main>
    )
  }

  if (!booking) {
    return (
      <main className="page-wrap">
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="card" style={{ padding: 32 }}>
            <h1 className="page-title" style={{ fontSize: 38 }}>Payment</h1>
            <p>{message || 'Booking not found.'}</p>
            <div style={{ marginTop: 20 }}>
              <Link href="/parent/dashboard" className="btn-secondary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const amountIsValid = Number.isFinite(amount) && amount > 0

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 1100 }}>
        <div
          className="dashboard-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '0.95fr 1.05fr',
            gap: 24,
            alignItems: 'start',
          }}
        >
          <aside className="card" style={{ padding: 28 }}>
            <p style={{ margin: 0, color: '#6f42c1', fontWeight: 800, fontSize: 14 }}>
              Booking Summary
            </p>

            <h2 style={{ margin: '10px 0 12px', fontSize: 30 }}>
              {booking.lesson_title || 'Lesson'}
            </h2>

            <div className="kpi-list">
              <div className="kpi-row">
                <span className="kpi-label">Booking Ref</span>
                <span className="kpi-value">{booking.booking_ref || '-'}</span>
              </div>

              <div className="kpi-row">
                <span className="kpi-label">Subject</span>
                <span className="kpi-value">{subject?.name || '-'}</span>
              </div>

              <div className="kpi-row">
                <span className="kpi-label">Date</span>
                <span className="kpi-value">{booking.booking_date}</span>
              </div>

              <div className="kpi-row">
                <span className="kpi-label">Time</span>
                <span className="kpi-value">
                  {booking.start_time} - {booking.end_time}
                </span>
              </div>

              <div className="kpi-row">
                <span className="kpi-label">Duration</span>
                <span className="kpi-value">{booking.duration_minutes} mins</span>
              </div>

              <div className="kpi-row">
                <span className="kpi-label">Sessions</span>
                <span className="kpi-value">{booking.total_sessions ?? 1}</span>
              </div>

              <div className="kpi-row">
                <span className="kpi-label">Status</span>
                <span className="kpi-value">{booking.lesson_status}</span>
              </div>
            </div>
          </aside>

          <section className="card" style={{ padding: 32 }}>
            <p style={{ margin: 0, color: '#6f42c1', fontWeight: 800, fontSize: 14 }}>
              Secure Payment
            </p>

            <h1 className="page-title" style={{ fontSize: 40, marginTop: 10 }}>
              Complete payment
            </h1>

            <p className="page-subtitle">
              Pay securely with Stripe. After payment, your lesson will be confirmed and a meeting link will be created.
            </p>

            <div
              className="panel"
              style={{
                marginTop: 24,
                padding: 22,
                background:
                  'linear-gradient(135deg, rgba(111,66,193,0.06) 0%, rgba(138,92,246,0.10) 100%)',
              }}
            >
              <p style={{ margin: 0, color: 'var(--muted)', fontWeight: 800 }}>
                Amount due
              </p>
              <h2 style={{ margin: '8px 0 0', fontSize: 40 }}>
                {amountIsValid ? `${currency} ${amount.toFixed(2)}` : 'Price not set'}
              </h2>
            </div>

            <div className="kpi-list" style={{ marginTop: 24 }}>
              <div className="kpi-row">
                <span className="kpi-label">Provider</span>
                <span className="kpi-value">Stripe</span>
              </div>
              <div className="kpi-row">
                <span className="kpi-label">Payment mode</span>
                <span className="kpi-value">Card / hosted checkout</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={handleCheckout}
                disabled={saving || !amountIsValid || booking.lesson_status === 'confirmed'}
              >
                {saving ? 'Redirecting...' : booking.lesson_status === 'confirmed' ? 'Already Paid' : 'Pay with Stripe'}
              </button>

              <Link href={`/parent/bookings/${booking.id}`} className="btn-secondary">
                Back to Booking
              </Link>
            </div>

            {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}

            {!amountIsValid ? (
              <div className="panel" style={{ marginTop: 20, padding: 18 }}>
                <p style={{ margin: 0, fontWeight: 800 }}>No valid price found</p>
                <p className="page-subtitle" style={{ marginTop: 8 }}>
                  This booking does not have a saved amount. Please recreate the booking from the subject and schedule flow.
                </p>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  )
}