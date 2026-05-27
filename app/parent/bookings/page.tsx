'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type ParentProfile = {
  id: string
  full_name: string
}

type BookingRow = {
  id: string
  booking_ref: string | null
  booking_date: string
  start_time: string
  end_time: string
  duration_minutes: number
  lesson_status: string
  lesson_title: string | null
  created_at: string
  subject_id: string
  tutor_id: string
}

type SubjectRow = {
  id: string
  name: string
}

type TutorRow = {
  id: string
  full_name: string
}

type BookingDisplayRow = BookingRow & {
  subject_name: string
  tutor_name: string
}

export default function ParentBookingsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading...')
  const [parent, setParent] = useState<ParentProfile | null>(null)
  const [bookings, setBookings] = useState<BookingDisplayRow[]>([])

  useEffect(() => {
    async function loadBookings() {
      setLoading(true)
      setMessage('Loading...')

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
        .select('id, full_name')
        .eq('user_id', user.id)
        .maybeSingle()

      if (parentError || !parentProfile) {
        router.push('/parent/onboarding')
        return
      }

      setParent(parentProfile)

      const { data: bookingRows, error: bookingsError } = await supabase
        .from('bookings')
        .select(
          'id, booking_ref, booking_date, start_time, end_time, duration_minutes, lesson_status, lesson_title, created_at, subject_id, tutor_id'
        )
        .eq('parent_id', parentProfile.id)
        .order('created_at', { ascending: false })

      if (bookingsError) {
        setMessage(bookingsError.message)
        setLoading(false)
        return
      }

      const bookingsData = bookingRows ?? []

      if (bookingsData.length === 0) {
        setBookings([])
        setMessage('')
        setLoading(false)
        return
      }

      const subjectIds = Array.from(new Set(bookingsData.map((b) => b.subject_id)))
      const tutorIds = Array.from(new Set(bookingsData.map((b) => b.tutor_id)))

      const { data: subjectRows } = await supabase
        .from('subjects')
        .select('id, name')
        .in('id', subjectIds)

      const { data: tutorRows } = await supabase
        .from('tutor_profiles')
        .select('id, full_name')
        .in('id', tutorIds)

      const subjectMap = new Map<string, string>(
        (subjectRows ?? []).map((s: SubjectRow) => [s.id, s.name])
      )

      const tutorMap = new Map<string, string>(
        (tutorRows ?? []).map((t: TutorRow) => [t.id, t.full_name])
      )

      const displayRows: BookingDisplayRow[] = bookingsData.map((booking) => ({
        ...booking,
        subject_name: subjectMap.get(booking.subject_id) ?? '-',
        tutor_name: tutorMap.get(booking.tutor_id) ?? '-',
      }))

      setBookings(displayRows)
      setMessage('')
      setLoading(false)
    }

    loadBookings()
  }, [router])

  return (
    <main className="page-wrap">
      <div className="container">
        <section
          className="card"
          style={{
            padding: 32,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(244,237,255,0.95) 100%)',
          }}
        >
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 700, fontSize: 14 }}>
            Parent Portal
          </p>

          <h1 className="page-title" style={{ marginTop: 10 }}>
            My Bookings
          </h1>

          <p className="page-subtitle">
            {parent
              ? `Track and manage bookings for ${parent.full_name}.`
              : 'Track and manage your lessons from one place.'}
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
            <Link href="/parent/students" className="btn-primary">
              Choose Child
            </Link>

            <Link href="/subjects" className="btn-secondary">
              Choose Subject
            </Link>

            <Link href="/parent/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          {loading ? <p>Loading bookings...</p> : null}
          {message ? <p>{message}</p> : null}

          {!loading && bookings.length === 0 ? (
            <div className="card" style={{ padding: 28, textAlign: 'center' }}>
              <h2 style={{ marginTop: 0 }}>No bookings yet</h2>
              <p className="page-subtitle" style={{ maxWidth: 560, margin: '0 auto' }}>
                You have not created any lesson bookings yet. Add or choose a child, then select a subject and time.
              </p>

              <div style={{ marginTop: 20 }}>
                <Link href="/parent/students" className="btn-primary">
                  Start Booking
                </Link>
              </div>
            </div>
          ) : null}

          {!loading && bookings.length > 0 ? (
            <div style={{ display: 'grid', gap: 18 }}>
              {bookings.map((booking) => (
                <div key={booking.id} className="card" style={{ padding: 24 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 16,
                      alignItems: 'start',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <h2 style={{ margin: '0 0 8px', fontSize: 24 }}>
                        {booking.lesson_title || 'Lesson'}
                      </h2>

                      <p className="page-subtitle" style={{ marginBottom: 12 }}>
                        Tutor: <strong>{booking.tutor_name}</strong> • Subject:{' '}
                        <strong>{booking.subject_name}</strong>
                      </p>

                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <StatusChip value={booking.lesson_status} />
                        <SmallInfoChip label={`Ref: ${booking.booking_ref || '-'}`} />
                        <SmallInfoChip label={`${booking.duration_minutes} mins`} />
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: 180 }}>
                      <p style={{ margin: 0, fontWeight: 700 }}>{booking.booking_date}</p>
                      <p className="page-subtitle" style={{ marginTop: 6 }}>
                        {booking.start_time} - {booking.end_time}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                    <Link href={`/parent/bookings/${booking.id}`} className="btn-secondary">
                      View Booking
                    </Link>

                    {booking.lesson_status === 'pending_payment' ? (
                      <Link href={`/parent/payments/${booking.id}`} className="btn-primary">
                        Continue Payment
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  )
}

function StatusChip({ value }: { value: string }) {
  let bg = '#f3effb'
  let color = '#6f42c1'

  if (value === 'confirmed') {
    bg = 'rgba(46, 204, 113, 0.14)'
    color = '#1e9f5a'
  } else if (value === 'completed') {
    bg = 'rgba(52, 152, 219, 0.14)'
    color = '#2f77c7'
  } else if (value === 'cancelled') {
    bg = 'rgba(231, 76, 60, 0.14)'
    color = '#d64533'
  } else if (value === 'pending_payment') {
    bg = 'rgba(243, 156, 18, 0.14)'
    color = '#c88308'
  }

  return (
    <span
      style={{
        padding: '8px 12px',
        borderRadius: 999,
        background: bg,
        color,
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {value}
    </span>
  )
}

function SmallInfoChip({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: '8px 12px',
        borderRadius: 999,
        background: '#fff',
        border: '1px solid var(--border)',
        color: 'var(--muted)',
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      {label}
    </span>
  )
}