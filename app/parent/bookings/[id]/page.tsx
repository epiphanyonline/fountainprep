'use client'

import { useEffect, useState } from 'react'
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
}

export default function ParentBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [booking, setBooking] = useState<BookingRow | null>(null)
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    async function loadBooking() {
      const resolvedParams = await params

      const { data, error } = await supabase
        .from('bookings')
        .select(
          'id, booking_ref, booking_date, start_time, end_time, duration_minutes, lesson_status, lesson_title, parent_notes'
        )
        .eq('id', resolvedParams.id)
        .maybeSingle()

      if (error) {
        setMessage(error.message)
        return
      }

      if (!data) {
        setMessage('Booking not found.')
        return
      }

      setBooking(data)
      setMessage('')
    }

    loadBooking()
  }, [params])

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="card" style={{ padding: 32 }}>
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 700, fontSize: 14 }}>
            Booking Created
          </p>

          <h1 className="page-title" style={{ fontSize: 40, marginTop: 10 }}>
            Booking draft summary
          </h1>

          {message ? <p>{message}</p> : null}

          {booking ? (
            <>
              <div className="kpi-list" style={{ marginTop: 24 }}>
                <div className="kpi-row">
                  <span className="kpi-label">Booking Ref</span>
                  <span className="kpi-value">{booking.booking_ref || '-'}</span>
                </div>
                <div className="kpi-row">
                  <span className="kpi-label">Lesson Title</span>
                  <span className="kpi-value">{booking.lesson_title || '-'}</span>
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
                  <span className="kpi-label">Status</span>
                  <span className="kpi-value">{booking.lesson_status}</span>
                </div>
                <div className="kpi-row">
                  <span className="kpi-label">Notes</span>
                  <span className="kpi-value">{booking.parent_notes || '-'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
  <Link href={`/parent/payments/${booking.id}`} className="btn-primary">
    Go to Payment
  </Link>

  <Link href="/parent/dashboard" className="btn-secondary">
    Back to Dashboard
  </Link>
</div>
            </>
          ) : null}
        </div>
      </div>
    </main>
  )
}