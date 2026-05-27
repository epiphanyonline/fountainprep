'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'

type PaymentRow = {
  id: string
  booking_id: string
  currency: string
  amount: number
  payment_status: string
}

export default function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const [payment, setPayment] = useState<PaymentRow | null>(null)
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    async function loadPayment() {
      const resolvedParams = await params

      const { data, error } = await supabase
        .from('payments')
        .select('id, booking_id, currency, amount, payment_status')
        .eq('booking_id', resolvedParams.bookingId)
        .maybeSingle()

      if (error) {
        setMessage(error.message)
        return
      }

      if (!data) {
        setMessage('Payment record not found.')
        return
      }

      setPayment(data)
      setMessage('')
    }

    loadPayment()
  }, [params])

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="card" style={{ padding: 36, textAlign: 'center' }}>
          <p style={{ color: '#6f42c1', fontWeight: 700, margin: 0 }}>
            Payment Step Ready
          </p>

          <h1 className="page-title" style={{ fontSize: 42, marginTop: 10 }}>
            Payment record created
          </h1>

          {message ? <p>{message}</p> : null}

          {payment ? (
            <>
              <p className="page-subtitle" style={{ maxWidth: 620, margin: '0 auto' }}>
                This is the placeholder success page before real Stripe checkout is connected.
              </p>

              <div
                className="panel"
                style={{
                  marginTop: 28,
                  padding: 24,
                  maxWidth: 520,
                  marginInline: 'auto',
                  textAlign: 'left',
                }}
              >
                <div className="kpi-list">
                  <div className="kpi-row">
                    <span className="kpi-label">Booking ID</span>
                    <span className="kpi-value">{payment.booking_id}</span>
                  </div>
                  <div className="kpi-row">
                    <span className="kpi-label">Amount</span>
                    <span className="kpi-value">
                      {payment.currency} {Number(payment.amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="kpi-row">
                    <span className="kpi-label">Status</span>
                    <span className="kpi-value">{payment.payment_status}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                <Link href="/parent/dashboard" className="btn-primary">
                  Back to Dashboard
                </Link>

                <Link href={`/parent/bookings/${payment.booking_id}`} className="btn-secondary">
                  View Booking
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </main>
  )
}