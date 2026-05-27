'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const sessionId = searchParams.get('session_id')

  const [message, setMessage] = useState('Confirming your payment...')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function confirmPayment() {
      if (!bookingId) {
        setMessage('Payment successful, but booking reference was not found.')
        setLoading(false)
        return
      }

      const { error } = await supabase
        .from('lesson_bookings')
        .update({
          status: 'CONFIRMED',
          payment_status: 'PAID',
          stripe_session_id: sessionId || null,
        })
        .eq('id', bookingId)

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      setMessage('Your lesson booking has been confirmed.')
      setLoading(false)
    }

    confirmPayment()
  }, [bookingId, sessionId])

  return (
    <main className="success-page">
      <section className="success-card">
        <p className="eyebrow">Payment Successful</p>

        <h1>{loading ? 'Finalising your booking...' : 'Booking confirmed'}</h1>

        <p className="muted">{message}</p>

        <div className="actions">
          <Link href="/parent/dashboard" className="primary-btn">
            Go to Dashboard
          </Link>

          <Link href="/" className="secondary-btn">
            Back to Home
          </Link>
        </div>
      </section>

      <style jsx>{successStyles}</style>
    </main>
  )
}

function SuccessLoading() {
  return (
    <main className="success-page">
      <section className="success-card">
        <p className="eyebrow">Payment</p>
        <h1>Loading...</h1>
        <p className="muted">Confirming payment details...</p>
      </section>

      <style jsx>{successStyles}</style>
    </main>
  )
}

const successStyles = `
  .success-page {
    min-height: 100vh;
    padding: 56px 20px 90px;
    background: radial-gradient(circle at top right, #eadcff 0, #faf7ff 36%, #f8f5ff 100%);
    color: #21152d;
  }

  .success-card {
    max-width: 760px;
    margin: 0 auto;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(111,66,193,0.12);
    border-radius: 32px;
    padding: 44px;
    box-shadow: 0 24px 70px rgba(71,43,117,0.1);
    text-align: center;
  }

  .eyebrow {
    margin: 0;
    color: #6f42c1;
    font-weight: 900;
    font-size: 14px;
  }

  h1 {
    margin: 14px 0 0;
    font-size: clamp(38px, 6vw, 62px);
    line-height: 1;
    letter-spacing: -0.055em;
    font-weight: 950;
  }

  .muted {
    margin-top: 18px;
    color: #6f637e;
    line-height: 1.7;
    font-size: 16px;
  }

  .actions {
    margin-top: 30px;
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
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
  }

  .primary-btn {
    background: linear-gradient(135deg, #6f35d5, #8b5cf6);
    color: white;
    box-shadow: 0 16px 38px rgba(124,58,237,0.28);
  }

  .secondary-btn {
    background: white;
    color: #351e55;
    border: 1px solid rgba(111,66,193,0.18);
  }

  @media (max-width: 640px) {
    .success-card {
      padding: 30px 20px;
      border-radius: 26px;
    }

    .primary-btn,
    .secondary-btn {
      width: 100%;
    }
  }
`