'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
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

type Subject = {
  id: string
  name: string
}

type ProgressNote = {
  lesson_booking_id: string
}

type Earning = {
  booking_id: string
  status: string
}

type Filter = 'ALL' | 'UPCOMING' | 'COMPLETED' | 'PENDING_PAYMENT' | 'NEEDS_REPORT' | 'NEEDS_PAYOUT'

const planLabels: Record<string, string> = {
  monthly: 'Monthly Plan',
  three_month: '3-Month Plan',
}

export default function AdminBookingsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading bookings...')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [subjects, setSubjects] = useState<Record<string, string>>({})
  const [progressNotes, setProgressNotes] = useState<Record<string, boolean>>({})
  const [earnings, setEarnings] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<Filter>('ALL')

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
        .order('lesson_date', { ascending: false })
        .order('lesson_time', { ascending: false })

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

      const subjectIds = Array.from(new Set(cleanRows.map((row) => row.subject_id)))
      const bookingIds = cleanRows.map((row) => row.id)

      if (subjectIds.length > 0) {
        const { data: subjectRows } = await supabase
          .from('subjects')
          .select('id, name')
          .in('id', subjectIds)

        const subjectMap: Record<string, string> = {}

        ;((subjectRows ?? []) as Subject[]).forEach((subject) => {
          subjectMap[subject.id] = subject.name
        })

        setSubjects(subjectMap)
      }

      if (bookingIds.length > 0) {
        const { data: noteRows } = await supabase
          .from('lesson_progress_notes')
          .select('lesson_booking_id')
          .in('lesson_booking_id', bookingIds)

        const noteMap: Record<string, boolean> = {}

        ;((noteRows ?? []) as ProgressNote[]).forEach((note) => {
          noteMap[note.lesson_booking_id] = true
        })

        setProgressNotes(noteMap)

        const { data: earningRows } = await supabase
          .from('tutor_earnings')
          .select('booking_id, status')
          .in('booking_id', bookingIds)

        const earningMap: Record<string, string> = {}

        ;((earningRows ?? []) as Earning[]).forEach((earning) => {
          earningMap[earning.booking_id] = earning.status
        })

        setEarnings(earningMap)
      }

      setMessage('')
      setLoading(false)
    }

    loadBookings()
  }, [router])

  const today = new Date().toISOString().split('T')[0]

  const paidBookings = bookings.filter(
    (b) => b.payment_status === 'PAID' || b.status === 'CONFIRMED' || b.status === 'COMPLETED'
  )

  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED')

  const upcomingBookings = bookings.filter(
    (b) =>
      b.lesson_date &&
      b.lesson_date >= today &&
      (b.payment_status === 'PAID' || b.status === 'CONFIRMED')
  )

  const pendingPaymentBookings = bookings.filter((b) => b.payment_status !== 'PAID')

  const needsReportBookings = bookings.filter(
    (b) => b.status === 'COMPLETED' && !progressNotes[b.id]
  )

  const needsPayoutBookings = bookings.filter(
    (b) => b.status === 'COMPLETED' && earnings[b.id] !== 'paid'
  )

  const revenue = paidBookings.reduce(
    (total, b) => total + Number(b.amount_gbp || 0),
    0
  )

  const filteredBookings = useMemo(() => {
    if (filter === 'UPCOMING') return upcomingBookings
    if (filter === 'COMPLETED') return completedBookings
    if (filter === 'PENDING_PAYMENT') return pendingPaymentBookings
    if (filter === 'NEEDS_REPORT') return needsReportBookings
    if (filter === 'NEEDS_PAYOUT') return needsPayoutBookings
    return bookings
  }, [
    filter,
    bookings,
    upcomingBookings,
    completedBookings,
    pendingPaymentBookings,
    needsReportBookings,
    needsPayoutBookings,
  ])

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
          Track every parent booking, tutor assignment, payment status, lesson report,
          and tutor payout from one operational view.
        </p>

        <div style={styles.kpiGrid}>
          <Kpi label="Total Bookings" value={String(bookings.length)} />
          <Kpi label="Upcoming" value={String(upcomingBookings.length)} />
          <Kpi label="Completed" value={String(completedBookings.length)} />
          <Kpi label="Needs Report" value={String(needsReportBookings.length)} />
          <Kpi label="Needs Payout" value={String(needsPayoutBookings.length)} />
          <Kpi label="Revenue" value={`£${revenue.toFixed(2)}`} />
        </div>

        <div style={styles.actions}>
          <Link href="/admin" style={styles.secondaryLink}>
            Back to Admin
          </Link>

          <Link href="/admin/tutor-payouts" style={styles.primaryLink}>
            Tutor Payouts
          </Link>

          <Link href="/admin/reports" style={styles.secondaryLink}>
            Reports
          </Link>
        </div>
      </section>

      <section style={styles.cardWide}>
        <div style={styles.filterBar}>
          {[
            ['ALL', 'All'],
            ['UPCOMING', 'Upcoming'],
            ['COMPLETED', 'Completed'],
            ['PENDING_PAYMENT', 'Pending Payment'],
            ['NEEDS_REPORT', 'Needs Report'],
            ['NEEDS_PAYOUT', 'Needs Payout'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key as Filter)}
              style={{
                ...styles.filterButton,
                ...(filter === key ? styles.filterButtonActive : {}),
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>No bookings found</h3>
            <p style={styles.emptyText}>
              Bookings matching this filter will appear here.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Tutor</th>
                  <th style={styles.th}>Plan</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Lesson</th>
                  <th style={styles.th}>Report</th>
                  <th style={styles.th}>Payout</th>
                  <th style={styles.th}>Amount</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td style={styles.td}>
                      <strong>{formatDate(booking.lesson_date)}</strong>
                      <br />
                      <span style={styles.muted}>{booking.lesson_time || '-'}</span>
                    </td>

                    <td style={styles.td}>
                      <strong>
                        {booking.student_profiles?.full_name || 'Selected child'}
                      </strong>
                      <br />
                      <span style={styles.muted}>
                        {booking.student_profiles?.country_class_label || ''}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {subjects[booking.subject_id] || 'Selected subject'}
                    </td>

                    <td style={styles.td}>
                      {booking.tutor_profiles?.full_name || 'Tutor pending'}
                    </td>

                    <td style={styles.td}>
                      {planLabels[booking.plan_id] || 'Learning Plan'}
                    </td>

                    <td style={styles.td}>
                      <Badge
                        text={booking.payment_status === 'PAID' ? 'Paid' : 'Pending'}
                        tone={booking.payment_status === 'PAID' ? 'green' : 'orange'}
                      />
                    </td>

                    <td style={styles.td}>
                      <Badge
                        text={booking.status}
                        tone={booking.status === 'COMPLETED' ? 'green' : 'blue'}
                      />
                    </td>

                    <td style={styles.td}>
                      <Badge
                        text={progressNotes[booking.id] ? 'Submitted' : 'Missing'}
                        tone={progressNotes[booking.id] ? 'green' : 'orange'}
                      />
                    </td>

                    <td style={styles.td}>
                      <Badge
                        text={
                          earnings[booking.id] === 'paid'
                            ? 'Paid'
                            : earnings[booking.id] === 'pending'
                              ? 'Pending'
                              : 'Not Created'
                        }
                        tone={earnings[booking.id] === 'paid' ? 'green' : 'orange'}
                      />
                    </td>

                    <td style={styles.td}>£{Number(booking.amount_gbp || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
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

function Badge({
  text,
  tone,
}: {
  text: string
  tone: 'green' | 'orange' | 'blue'
}) {
  const bg =
    tone === 'green' ? '#ecfdf3' : tone === 'blue' ? '#eff6ff' : '#fff7ed'
  const color =
    tone === 'green' ? '#027a48' : tone === 'blue' ? '#1d4ed8' : '#9a3412'

  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '8px 11px',
        borderRadius: 999,
        background: bg,
        color,
        fontWeight: 900,
        fontSize: 12,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  )
}

function formatDate(date: string | null) {
  if (!date) return 'Date pending'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

const styles: Record<string, any> = {
  page: {
    minHeight: '100vh',
    padding: '42px 18px 90px',
    background:
      'radial-gradient(circle at top right, rgba(124,58,237,0.16), transparent 30%), linear-gradient(180deg, #ffffff, #fbf8ff 45%, #f4edff)',
    color: '#21152d',
  },

  hero: {
    position: 'relative',
    maxWidth: 1180,
    margin: '0 auto',
    padding: 48,
    borderRadius: 40,
    overflow: 'hidden',
    background:
      'radial-gradient(circle at top right, rgba(124,58,237,0.18), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,239,255,0.96))',
    border: '1px solid rgba(126,87,194,0.14)',
    boxShadow: '0 30px 90px rgba(71,43,117,0.12)',
  },

  heroGlow: {
    position: 'absolute',
    right: -130,
    top: -130,
    width: 380,
    height: 380,
    borderRadius: 999,
    background: 'rgba(124,58,237,0.18)',
    filter: 'blur(24px)',
  },

  eyebrow: {
    position: 'relative',
    margin: 0,
    color: '#6d28d9',
    fontWeight: 950,
    fontSize: 14,
  },

  title: {
    position: 'relative',
    margin: '14px 0 0',
    maxWidth: 900,
    fontSize: 'clamp(42px, 6vw, 72px)',
    lineHeight: 0.96,
    letterSpacing: '-0.06em',
    fontWeight: 950,
  },

  subtitle: {
    position: 'relative',
    maxWidth: 820,
    margin: '20px 0 0',
    color: '#6f637e',
    fontSize: 18,
    lineHeight: 1.75,
  },

  kpiGrid: {
    position: 'relative',
    marginTop: 32,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16,
  },

  kpiCard: {
    padding: 20,
    borderRadius: 24,
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(124,58,237,0.12)',
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
    lineHeight: 1,
    letterSpacing: '-0.05em',
    fontWeight: 950,
  },

  actions: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 30,
  },

  primaryLink: {
    minHeight: 54,
    padding: '0 24px',
    borderRadius: 18,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    fontWeight: 950,
    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    color: 'white',
    boxShadow: '0 16px 38px rgba(124,58,237,0.28)',
  },

  secondaryLink: {
    minHeight: 54,
    padding: '0 24px',
    borderRadius: 18,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    fontWeight: 950,
    background: 'white',
    color: '#351e55',
    border: '1px solid rgba(124,58,237,0.16)',
  },

  cardWide: {
    maxWidth: 1180,
    margin: '28px auto 0',
    padding: 32,
    borderRadius: 34,
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid rgba(126,87,194,0.12)',
    boxShadow: '0 24px 70px rgba(71,43,117,0.09)',
  },

  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },

  filterButton: {
    border: '1px solid rgba(124,58,237,0.16)',
    background: 'white',
    color: '#351e55',
    minHeight: 44,
    padding: '0 16px',
    borderRadius: 999,
    fontWeight: 900,
    cursor: 'pointer',
  },

  filterButtonActive: {
    background: '#6d28d9',
    color: 'white',
  },

  tableWrap: {
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    minWidth: 1100,
    borderCollapse: 'collapse',
  },

  th: {
    textAlign: 'left',
    padding: 14,
    color: '#7a7088',
    fontSize: 13,
    fontWeight: 950,
    borderBottom: '1px solid rgba(124,58,237,0.12)',
  },

  td: {
    padding: 14,
    borderBottom: '1px solid rgba(124,58,237,0.08)',
    color: '#241535',
    verticalAlign: 'top',
  },

  muted: {
    color: '#7a7088',
    fontSize: 13,
  },

  emptyState: {
    padding: 26,
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
    lineHeight: 1.7,
  },
}