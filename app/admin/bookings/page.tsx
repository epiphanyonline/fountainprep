'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type Booking = {
  id: string
  parent_id: string
  student_id: string
  tutor_id: string | null
  subject_id: string
  plan_id: string
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  meeting_link: string | null
  booking_frequency: string | null
  repeat_weeks: number | null
  created_at: string | null
  student_profiles: {
    full_name: string
    child_age: number | null
    country_system: string | null
    country_class_label: string | null
  } | null
  tutor_profiles: {
    full_name: string
  } | null
}

const subjectLabels: Record<string, string> = {
  maths: 'Maths',
  english: 'English',
  science: 'Science',
  coding: 'Coding',
  music: 'Music',
  yoruba: 'Yoruba',
  igbo: 'Igbo',
  hausa: 'Hausa',
}

const planLabels: Record<string, string> = {
  payg: 'Pay As You Go',
  monthly: 'Monthly Plan',
  three_month: '3-Month Plan',
  six_month: '6-Month Plan',
}

export default function AdminBookingsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading bookings...')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'UNASSIGNED'>('ALL')

  useEffect(() => {
    async function loadBookings() {
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
        .maybeSingle()

      if (!userProfile || userProfile.role !== 'ADMIN') {
        router.push('/account')
        return
      }

      const { data, error } = await supabase
        .from('lesson_bookings')
        .select(`
          id,
          parent_id,
          student_id,
          tutor_id,
          subject_id,
          plan_id,
          lesson_date,
          lesson_time,
          timezone,
          status,
          payment_status,
          amount_gbp,
          meeting_link,
          booking_frequency,
          repeat_weeks,
          created_at,
          student_profiles (
            full_name,
            child_age,
            country_system,
            country_class_label
          ),
          tutor_profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      const cleanRows = ((data ?? []) as any[]).map((row) => ({
        ...row,
        student_profiles: Array.isArray(row.student_profiles)
          ? row.student_profiles[0] ?? null
          : row.student_profiles ?? null,
        tutor_profiles: Array.isArray(row.tutor_profiles)
          ? row.tutor_profiles[0] ?? null
          : row.tutor_profiles ?? null,
      })) as Booking[]

      setBookings(cleanRows)
      setMessage('')
      setLoading(false)
    }

    loadBookings()
  }, [router])

  const filteredBookings = useMemo(() => {
    if (filter === 'PAID') {
      return bookings.filter((b) => b.payment_status === 'PAID' || b.status === 'CONFIRMED')
    }

    if (filter === 'PENDING') {
      return bookings.filter((b) => b.payment_status !== 'PAID')
    }

    if (filter === 'UNASSIGNED') {
      return bookings.filter((b) => !b.tutor_id)
    }

    return bookings
  }, [bookings, filter])

  const paidCount = bookings.filter((b) => b.payment_status === 'PAID' || b.status === 'CONFIRMED').length
  const pendingCount = bookings.filter((b) => b.payment_status !== 'PAID').length
  const unassignedCount = bookings.filter((b) => !b.tutor_id).length
  const revenue = bookings
    .filter((b) => b.payment_status === 'PAID' || b.status === 'CONFIRMED')
    .reduce((total, b) => total + Number(b.amount_gbp || 0), 0)

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.hero}>
          <p style={styles.eyebrow}>Admin Bookings</p>
          <h1 style={styles.title}>Loading bookings...</h1>
          <p style={styles.subtitle}>{message}</p>
        </section>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroGlow} />

        <p style={styles.eyebrow}>Admin Bookings</p>

        <h1 style={styles.title}>Bookings control centre</h1>

        <p style={styles.subtitle}>
          Track every parent booking, tutor assignment, payment state, class time, and meeting link.
        </p>

        <div style={styles.kpiGrid}>
          <Kpi label="Total Bookings" value={String(bookings.length)} />
          <Kpi label="Paid / Confirmed" value={String(paidCount)} />
          <Kpi label="Pending Payment" value={String(pendingCount)} />
          <Kpi label="Unassigned" value={String(unassignedCount)} />
          <Kpi label="Revenue" value={`£${revenue.toFixed(2)}`} />
        </div>

        <div style={styles.actions}>
          <Link href="/admin" style={styles.secondaryLink}>
            Back to Admin
          </Link>

          <Link href="/admin/tutors" style={styles.primaryLink}>
            Tutor Approval
          </Link>

          <Link href="/admin/payments" style={styles.secondaryLink}>
            Payments
          </Link>
        </div>
      </section>

      <section style={styles.cardWide}>
        <div style={styles.filterBar}>
          {(['ALL', 'PAID', 'PENDING', 'UNASSIGNED'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              style={{
                ...styles.filterButton,
                ...(filter === item ? styles.filterButtonActive : {}),
              }}
            >
              {item === 'ALL'
                ? 'All'
                : item === 'PAID'
                  ? 'Paid'
                  : item === 'PENDING'
                    ? 'Pending'
                    : 'Unassigned'}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>No bookings found</h3>
            <p style={styles.emptyText}>Bookings matching this filter will appear here.</p>
          </div>
        ) : (
          <div style={styles.bookingList}>
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const paid = booking.payment_status === 'PAID' || booking.status === 'CONFIRMED'

  return (
    <div style={styles.bookingCard}>
      <div style={styles.bookingTop}>
        <div>
          <p style={styles.bookingTitle}>
            {subjectLabels[booking.subject_id] || booking.subject_id}
          </p>

          <p style={styles.bookingMeta}>
            Student: {booking.student_profiles?.full_name || 'Unknown student'}
          </p>

          <p style={styles.bookingMeta}>
            Tutor: {booking.tutor_profiles?.full_name || 'Not assigned'}
          </p>
        </div>

        <span
          style={{
            ...styles.statusBadge,
            ...(paid ? styles.statusPaid : styles.statusPending),
          }}
        >
          {paid ? 'Paid / Confirmed' : booking.payment_status || 'Pending'}
        </span>
      </div>

      <div style={styles.detailGrid}>
        <Detail label="Plan" value={planLabels[booking.plan_id] || booking.plan_id} />
        <Detail label="Date" value={booking.lesson_date || '-'} />
        <Detail label="Time" value={booking.lesson_time || '-'} />
        <Detail label="Timezone" value={booking.timezone || '-'} />
        <Detail label="Frequency" value={booking.booking_frequency || 'ONE_OFF'} />
        <Detail label="Repeat" value={`${booking.repeat_weeks || 1} week(s)`} />
        <Detail label="Amount" value={`£${Number(booking.amount_gbp || 0).toFixed(2)}`} />
        <Detail label="Booking ID" value={booking.id.slice(0, 8)} />
      </div>

      <div style={styles.meetingBox}>
        <p style={styles.meetingLabel}>Meeting Link</p>

        {booking.meeting_link ? (
          <a href={booking.meeting_link} target="_blank" rel="noreferrer" style={styles.meetingLink}>
            {booking.meeting_link}
          </a>
        ) : (
          <p style={styles.missingText}>Missing meeting link</p>
        )}
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.detailBox}>
      <p style={styles.detailLabel}>{label}</p>
      <p style={styles.detailValue}>{value}</p>
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.kpiCard}>
      <p style={styles.kpiLabel}>{label}</p>
      <h2 style={styles.kpiValue}>{value}</h2>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '42px 20px 90px',
    background:
      'radial-gradient(circle at top right, #efe4ff 0, #faf7ff 34%, #f8f5ff 100%)',
    color: '#21152d',
  },

  hero: {
    position: 'relative',
    maxWidth: 1180,
    margin: '0 auto',
    padding: '44px 36px',
    borderRadius: 34,
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(248,242,255,0.96))',
    border: '1px solid rgba(126,87,194,0.16)',
    boxShadow: '0 30px 90px rgba(88,52,150,0.12)',
  },

  heroGlow: {
    position: 'absolute',
    right: -120,
    top: -120,
    width: 360,
    height: 360,
    borderRadius: '50%',
    background: 'rgba(124,58,237,0.18)',
    filter: 'blur(20px)',
  },

  eyebrow: {
    position: 'relative',
    margin: 0,
    color: '#7441d8',
    fontWeight: 900,
    fontSize: 15,
  },

  title: {
    position: 'relative',
    margin: '14px 0 0',
    fontSize: 'clamp(34px, 5vw, 54px)',
    lineHeight: 1.05,
    fontWeight: 950,
    letterSpacing: -1.2,
  },

  subtitle: {
    position: 'relative',
    maxWidth: 760,
    margin: '18px 0 0',
    color: '#6f637e',
    fontSize: 17,
    lineHeight: 1.7,
  },

  kpiGrid: {
    position: 'relative',
    marginTop: 30,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 16,
  },

  kpiCard: {
    padding: 20,
    borderRadius: 24,
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(124,58,237,0.14)',
    boxShadow: '0 18px 45px rgba(71,43,117,0.07)',
  },

  kpiLabel: {
    margin: 0,
    color: '#7a7088',
    fontWeight: 850,
    fontSize: 14,
  },

  kpiValue: {
    margin: '8px 0 0',
    fontSize: 30,
    fontWeight: 950,
  },

  actions: {
    position: 'relative',
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 28,
  },

  primaryLink: {
    display: 'inline-flex',
    borderRadius: 18,
    padding: '15px 22px',
    background: 'linear-gradient(135deg, #6f35d5, #8b5cf6)',
    color: 'white',
    fontWeight: 950,
    textDecoration: 'none',
    boxShadow: '0 16px 38px rgba(124,58,237,0.28)',
  },

  secondaryLink: {
    display: 'inline-flex',
    borderRadius: 18,
    padding: '15px 22px',
    background: 'white',
    color: '#351e55',
    fontWeight: 950,
    textDecoration: 'none',
    border: '1px solid rgba(124,58,237,0.18)',
  },

  cardWide: {
    maxWidth: 1180,
    margin: '30px auto 0',
    padding: 30,
    borderRadius: 30,
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid rgba(126,87,194,0.14)',
    boxShadow: '0 25px 70px rgba(71,43,117,0.10)',
  },

  filterBar: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 22,
  },

  filterButton: {
    border: '1px solid rgba(124,58,237,0.16)',
    borderRadius: 16,
    padding: '12px 16px',
    background: 'white',
    color: '#351e55',
    fontWeight: 950,
    cursor: 'pointer',
  },

  filterButtonActive: {
    background: 'linear-gradient(135deg, #6f35d5, #8b5cf6)',
    color: 'white',
    border: '1px solid #6f35d5',
  },

  bookingList: {
    display: 'grid',
    gap: 18,
  },

  bookingCard: {
    padding: 22,
    borderRadius: 26,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  bookingTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 18,
    alignItems: 'flex-start',
  },

  bookingTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 950,
  },

  bookingMeta: {
    margin: '7px 0 0',
    color: '#6f637e',
    fontSize: 14,
  },

  statusBadge: {
    padding: '8px 11px',
    borderRadius: 999,
    fontWeight: 950,
    fontSize: 12,
    whiteSpace: 'nowrap',
  },

  statusPaid: {
    background: '#ecfdf3',
    color: '#027a48',
  },

  statusPending: {
    background: '#fff7ed',
    color: '#9a3412',
  },

  detailGrid: {
    marginTop: 18,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
  },

  detailBox: {
    padding: 14,
    borderRadius: 18,
    background: 'white',
    border: '1px solid rgba(124,58,237,0.1)',
  },

  detailLabel: {
    margin: 0,
    color: '#7a7088',
    fontWeight: 850,
    fontSize: 13,
  },

  detailValue: {
    margin: '7px 0 0',
    fontWeight: 950,
    wordBreak: 'break-word',
  },

  meetingBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    background: 'white',
    border: '1px solid rgba(124,58,237,0.1)',
  },

  meetingLabel: {
    margin: 0,
    color: '#7a7088',
    fontWeight: 850,
    fontSize: 13,
  },

  meetingLink: {
    display: 'block',
    marginTop: 8,
    color: '#6f35d5',
    fontWeight: 950,
    wordBreak: 'break-word',
  },

  missingText: {
    margin: '8px 0 0',
    color: '#9a3412',
    fontWeight: 850,
  },

  emptyState: {
    padding: 24,
    borderRadius: 24,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  emptyTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 950,
  },

  emptyText: {
    margin: '10px 0 0',
    color: '#6f637e',
    lineHeight: 1.6,
  },
}