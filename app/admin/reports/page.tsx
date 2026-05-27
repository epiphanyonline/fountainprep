'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type Booking = {
  id: string
  subject_id: string
  plan_id: string
  tutor_id: string | null
  payment_status: string
  status: string
  amount_gbp: number | null
  lesson_date: string | null
  created_at: string | null
}

type Tutor = {
  id: string
  approval_status: string
  verification_status: string
  is_listed: boolean
}

type Payment = {
  id: string
  payment_status: string
  amount: number | null
  created_at: string | null
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

export default function AdminReportsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [parentCount, setParentCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)

  useEffect(() => {
    async function loadReports() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile || profile.role !== 'ADMIN') {
        router.push('/account')
        return
      }

      const { data: bookingRows } = await supabase
        .from('lesson_bookings')
        .select('id, subject_id, plan_id, tutor_id, payment_status, status, amount_gbp, lesson_date, created_at')
        .order('created_at', { ascending: false })

      const { data: paymentRows } = await supabase
        .from('payments')
        .select('id, payment_status, amount, created_at')
        .order('created_at', { ascending: false })

      const { data: tutorRows } = await supabase
        .from('tutor_profiles')
        .select('id, approval_status, verification_status, is_listed')

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
      setLoading(false)
    }

    loadReports()
  }, [router])

  const paidBookings = useMemo(
    () => bookings.filter((b) => b.payment_status === 'PAID' || b.status === 'CONFIRMED'),
    [bookings]
  )

  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.payment_status !== 'PAID'),
    [bookings]
  )

  const revenue = useMemo(() => {
    return payments
      .filter((p) => p.payment_status === 'paid')
      .reduce((total, p) => total + Number(p.amount || 0), 0)
  }, [payments])

  const listedTutors = tutors.filter(
    (t) => t.approval_status === 'approved' && t.verification_status === 'verified' && t.is_listed
  )

  const tutorSupplyRisk = listedTutors.length === 0 ? 'High' : listedTutors.length < 3 ? 'Medium' : 'Healthy'

  const subjectDemand = useMemo(() => {
    const counts: Record<string, number> = {}

    bookings.forEach((booking) => {
      const label = subjectLabels[booking.subject_id] || booking.subject_id
      counts[label] = (counts[label] || 0) + 1
    })

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  }, [bookings])

  if (loading) {
    return <main style={styles.page}>Loading reports...</main>
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Admin Reports</p>
        <h1 style={styles.title}>Platform intelligence</h1>
        <p style={styles.subtitle}>
          Track growth, revenue, tutor supply, demand, pending payments, and operational risk.
        </p>

        <div style={styles.kpiGrid}>
          <Kpi label="Revenue" value={`£${revenue.toFixed(2)}`} />
          <Kpi label="Total Bookings" value={String(bookings.length)} />
          <Kpi label="Paid Bookings" value={String(paidBookings.length)} />
          <Kpi label="Pending Payments" value={String(pendingBookings.length)} />
          <Kpi label="Parents" value={String(parentCount)} />
          <Kpi label="Students" value={String(studentCount)} />
          <Kpi label="Listed Tutors" value={String(listedTutors.length)} />
          <Kpi label="Tutor Supply Risk" value={tutorSupplyRisk} />
        </div>

        <div style={styles.actions}>
          <Link href="/admin" style={styles.secondary}>Back to Admin</Link>
          <Link href="/admin/bookings" style={styles.primary}>Bookings</Link>
          <Link href="/admin/payments" style={styles.secondary}>Payments</Link>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.sectionTitle}>Subject Demand</p>

          {subjectDemand.length === 0 ? (
            <p style={styles.muted}>No booking demand yet.</p>
          ) : (
            <div style={styles.list}>
              {subjectDemand.map(([subject, count]) => (
                <div key={subject} style={styles.row}>
                  <span>{subject}</span>
                  <strong>{count} booking(s)</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.card}>
          <p style={styles.sectionTitle}>Operational Health</p>

          <div style={styles.list}>
            <HealthRow label="Tutor assignment" value={bookings.some((b) => !b.tutor_id) ? 'Needs attention' : 'Healthy'} />
            <HealthRow label="Payment collection" value={pendingBookings.length > 0 ? 'Pending payments exist' : 'Healthy'} />
            <HealthRow label="Tutor supply" value={tutorSupplyRisk} />
            <HealthRow label="Meeting links" value={bookings.some((b) => !b.tutor_id) ? 'Check unassigned bookings' : 'Ready'} />
          </div>
        </div>
      </section>
    </main>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.kpi}>
      <p style={styles.kpiLabel}>{label}</p>
      <h2 style={styles.kpiValue}>{value}</h2>
    </div>
  )
}

function HealthRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.row}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '42px 20px 90px',
    background: 'radial-gradient(circle at top right, #efe4ff 0, #faf7ff 34%, #f8f5ff 100%)',
    color: '#21152d',
  },
  hero: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: 36,
    borderRadius: 34,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(248,242,255,0.96))',
    boxShadow: '0 30px 90px rgba(88,52,150,0.12)',
  },
  eyebrow: {
    margin: 0,
    color: '#7441d8',
    fontWeight: 900,
  },
  title: {
    margin: '14px 0 0',
    fontSize: 'clamp(34px, 5vw, 54px)',
    fontWeight: 950,
    letterSpacing: -1,
  },
  subtitle: {
    maxWidth: 760,
    color: '#6f637e',
    lineHeight: 1.7,
  },
  kpiGrid: {
    marginTop: 28,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 16,
  },
  kpi: {
    background: 'white',
    padding: 20,
    borderRadius: 22,
    border: '1px solid rgba(124,58,237,0.14)',
  },
  kpiLabel: {
    margin: 0,
    color: '#7a7088',
    fontWeight: 850,
    fontSize: 13,
  },
  kpiValue: {
    margin: '8px 0 0',
    fontSize: 26,
    fontWeight: 950,
  },
  actions: {
    marginTop: 26,
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  primary: {
    padding: '14px 20px',
    borderRadius: 16,
    background: '#7c3aed',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 900,
  },
  secondary: {
    padding: '14px 20px',
    borderRadius: 16,
    background: 'white',
    color: '#351e55',
    textDecoration: 'none',
    fontWeight: 900,
    border: '1px solid rgba(124,58,237,0.18)',
  },
  grid: {
    maxWidth: 1180,
    margin: '30px auto 0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  },
  card: {
    background: 'white',
    padding: 28,
    borderRadius: 28,
    boxShadow: '0 25px 70px rgba(71,43,117,0.10)',
  },
  sectionTitle: {
    margin: 0,
    color: '#7441d8',
    fontWeight: 950,
  },
  list: {
    marginTop: 18,
    display: 'grid',
    gap: 12,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },
  muted: {
    color: '#6f637e',
  },
}