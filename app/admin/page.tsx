'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

type Booking = {
  id: string
  parent_id: string
  student_id: string
  tutor_id: string | null
  subject_id: string
  plan_id: string
  lesson_date: string | null
  lesson_time: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  meeting_link: string | null
  created_at: string | null
}

type Payment = {
  id: string
  booking_id: string
  payment_status: string
  amount: number | null
  currency: string | null
  created_at: string | null
}

type Tutor = {
  id: string
  full_name: string
  approval_status: string
  verification_status: string
  is_listed: boolean
}

type ParentProfile = {
  id: string
}

type StudentProfile = {
  id: string
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

export default function AdminDashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading admin dashboard...')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [parentCount, setParentCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)

  useEffect(() => {
    async function loadAdminDashboard() {
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

      const { data: bookingRows } = await supabase
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
          status,
          payment_status,
          amount_gbp,
          meeting_link,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      const { data: paymentRows } = await supabase
        .from('payments')
        .select('id, booking_id, payment_status, amount, currency, created_at')
        .order('created_at', { ascending: false })
        .limit(20)

      const { data: tutorRows } = await supabase
        .from('tutor_profiles')
        .select('id, full_name, approval_status, verification_status, is_listed')
        .order('created_at', { ascending: false })

      const { count: parentsTotal } = await supabase
        .from('parent_profiles')
        .select('*', { count: 'exact', head: true })

      const { count: studentsTotal } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true })

      setBookings((bookingRows ?? []) as Booking[])
      setPayments((paymentRows ?? []) as Payment[])
      setTutors((tutorRows ?? []) as Tutor[])
      setParentCount(parentsTotal ?? 0)
      setStudentCount(studentsTotal ?? 0)
      setMessage('')
      setLoading(false)
    }

    loadAdminDashboard()
  }, [router])

  const paidBookings = useMemo(
    () => bookings.filter((b) => b.payment_status === 'PAID' || b.status === 'CONFIRMED'),
    [bookings]
  )

  const pendingPayments = useMemo(
    () => bookings.filter((b) => b.payment_status !== 'PAID'),
    [bookings]
  )

  const approvedTutors = useMemo(
    () => tutors.filter((t) => t.approval_status === 'approved' && t.verification_status === 'verified' && t.is_listed),
    [tutors]
  )

  const pendingTutors = useMemo(
    () => tutors.filter((t) => t.approval_status !== 'approved' || !t.is_listed),
    [tutors]
  )

  const revenue = useMemo(() => {
    return payments
      .filter((payment) => payment.payment_status === 'paid')
      .reduce((total, payment) => total + Number(payment.amount || 0), 0)
  }, [payments])

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.hero}>
          <p style={styles.eyebrow}>Admin Control Centre</p>
          <h1 style={styles.title}>Loading platform activity...</h1>
          <p style={styles.subtitle}>{message}</p>
        </section>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroGlow} />

        <p style={styles.eyebrow}>Admin Control Centre</p>

        <h1 style={styles.title}>Platform overview</h1>

        <p style={styles.subtitle}>
          Monitor bookings, payments, tutors, parents, students, and operational activity from one place.
        </p>

        <div style={styles.kpiGrid}>
          <Kpi label="Bookings" value={String(bookings.length)} />
          <Kpi label="Confirmed" value={String(paidBookings.length)} />
          <Kpi label="Pending Payments" value={String(pendingPayments.length)} />
          <Kpi label="Revenue" value={`£${revenue.toFixed(2)}`} />
          <Kpi label="Tutors Listed" value={String(approvedTutors.length)} />
          <Kpi label="Parents" value={String(parentCount)} />
          <Kpi label="Students" value={String(studentCount)} />
          <Kpi label="Tutor Reviews" value={String(pendingTutors.length)} />
        </div>

        <div style={styles.actions}>
          <Link href="/admin/tutors" style={styles.primaryLink}>
            Tutor Approval
          </Link>

          <Link href="/admin/bookings" style={styles.secondaryLink}>
            Bookings
          </Link>

          <Link href="/admin/payments" style={styles.secondaryLink}>
            Payments
          </Link>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.sectionEyebrow}>Recent Bookings</p>

          {bookings.length === 0 ? (
            <Empty title="No bookings yet" text="Parent bookings will appear here once lessons are scheduled." />
          ) : (
            <div style={styles.list}>
              {bookings.slice(0, 8).map((booking) => (
                <div key={booking.id} style={styles.rowCard}>
                  <div>
                    <p style={styles.rowTitle}>
                      {subjectLabels[booking.subject_id] || booking.subject_id}
                    </p>
                    <p style={styles.rowMeta}>
                      {booking.lesson_date || 'Date pending'} • {booking.lesson_time || 'Time pending'}
                    </p>
                    <p style={styles.rowMeta}>
                      Tutor: {booking.tutor_id ? 'Assigned' : 'Not assigned'} • Meeting:{' '}
                      {booking.meeting_link ? 'Ready' : 'Missing'}
                    </p>
                  </div>

                  <StatusBadge status={booking.payment_status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <aside style={styles.card}>
          <p style={styles.sectionEyebrow}>Tutor Status</p>

          <div style={styles.profileList}>
            <ProfileRow label="Total Tutors" value={String(tutors.length)} />
            <ProfileRow label="Approved + Listed" value={String(approvedTutors.length)} />
            <ProfileRow label="Needs Review" value={String(pendingTutors.length)} />
          </div>

          <div style={{ marginTop: 22 }}>
            <Link href="/admin/tutors" style={styles.primaryLinkFull}>
              Review Tutors
            </Link>
          </div>
        </aside>
      </section>

      <section style={styles.cardWide}>
        <p style={styles.sectionEyebrow}>Payment Activity</p>

        {payments.length === 0 ? (
          <Empty title="No payment activity yet" text="Stripe payment records will appear here." />
        ) : (
          <div style={styles.paymentGrid}>
            {payments.slice(0, 8).map((payment) => (
              <div key={payment.id} style={styles.paymentCard}>
                <p style={styles.paymentAmount}>
                  {payment.currency || 'GBP'} {Number(payment.amount || 0).toFixed(2)}
                </p>
                <p style={styles.rowMeta}>Booking: {payment.booking_id.slice(0, 8)}...</p>
                <StatusBadge status={payment.payment_status} />
              </div>
            ))}
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

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.profileRow}>
      <span style={styles.profileLabel}>{label}</span>
      <span style={styles.profileValue}>{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const paid = status?.toLowerCase() === 'paid' || status === 'PAID'

  return (
    <span style={{ ...styles.statusBadge, ...(paid ? styles.statusPaid : styles.statusPending) }}>
      {paid ? 'Paid' : status || 'Pending'}
    </span>
  )
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div style={styles.emptyState}>
      <h3 style={styles.emptyTitle}>{title}</h3>
      <p style={styles.emptyText}>{text}</p>
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

  primaryLinkFull: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
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

  grid: {
    maxWidth: 1180,
    margin: '30px auto 0',
    display: 'grid',
    gridTemplateColumns: '1.3fr 0.7fr',
    gap: 24,
  },

  card: {
    padding: 30,
    borderRadius: 30,
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid rgba(126,87,194,0.14)',
    boxShadow: '0 25px 70px rgba(71,43,117,0.10)',
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

  sectionEyebrow: {
    margin: 0,
    color: '#7441d8',
    fontWeight: 950,
    fontSize: 14,
  },

  list: {
    marginTop: 20,
    display: 'grid',
    gap: 14,
  },

  rowCard: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    padding: 18,
    borderRadius: 22,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  rowTitle: {
    margin: 0,
    fontWeight: 950,
    fontSize: 18,
  },

  rowMeta: {
    margin: '7px 0 0',
    color: '#6f637e',
    fontSize: 14,
  },

  statusBadge: {
    alignSelf: 'flex-start',
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

  profileList: {
    marginTop: 20,
  },

  profileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 18,
    padding: '16px 0',
    borderBottom: '1px solid rgba(124,58,237,0.12)',
  },

  profileLabel: {
    color: '#7a7088',
    fontWeight: 850,
  },

  profileValue: {
    fontWeight: 950,
    textAlign: 'right',
  },

  paymentGrid: {
    marginTop: 20,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },

  paymentCard: {
    padding: 20,
    borderRadius: 24,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  paymentAmount: {
    margin: 0,
    fontSize: 22,
    fontWeight: 950,
  },

  emptyState: {
    marginTop: 20,
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