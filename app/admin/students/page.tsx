'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type StudentProfile = {
  id: string
  parent_id: string
  full_name: string
  child_age: number | null
  country_system: string | null
  country_class_label: string | null
  learning_level_id: string | null
  created_at: string | null
  parent_profiles: {
    full_name: string
    country_of_residence: string | null
  } | null
  learning_levels: {
    name: string
  } | null
}

type Booking = {
  id: string
  student_id: string
  subject_id: string
  payment_status: string
  status: string
  amount_gbp: number | null
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

export default function AdminStudentsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadStudents() {
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

      const { data: studentRows } = await supabase
        .from('student_profiles')
        .select(`
          id,
          parent_id,
          full_name,
          child_age,
          country_system,
          country_class_label,
          learning_level_id,
          created_at,
          parent_profiles (
            full_name,
            country_of_residence
          ),
          learning_levels (
            name
          )
        `)
        .order('created_at', { ascending: false })

      const { data: bookingRows } = await supabase
        .from('lesson_bookings')
        .select('id, student_id, subject_id, payment_status, status, amount_gbp')

      const cleanStudents = ((studentRows ?? []) as any[]).map((row) => ({
        ...row,
        parent_profiles: Array.isArray(row.parent_profiles)
          ? row.parent_profiles[0] ?? null
          : row.parent_profiles ?? null,
        learning_levels: Array.isArray(row.learning_levels)
          ? row.learning_levels[0] ?? null
          : row.learning_levels ?? null,
      })) as StudentProfile[]

      setStudents(cleanStudents)
      setBookings((bookingRows ?? []) as Booking[])
      setLoading(false)
    }

    loadStudents()
  }, [router])

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return students

    return students.filter((student) =>
      [
        student.full_name,
        student.parent_profiles?.full_name,
        student.parent_profiles?.country_of_residence,
        student.country_system,
        student.country_class_label,
        student.learning_levels?.name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    )
  }, [students, search])

  const paidBookings = bookings.filter(
    (booking) =>
      booking.payment_status === 'PAID' ||
      booking.payment_status === 'paid' ||
      booking.status === 'CONFIRMED'
  )

  const totalRevenue = paidBookings.reduce(
    (sum, booking) => sum + Number(booking.amount_gbp || 0),
    0
  )

  const earlyYearsCount = students.filter((s) =>
    String(s.learning_levels?.name || '').toLowerCase().includes('early')
  ).length

  const primaryCount = students.filter((s) =>
    String(s.learning_levels?.name || '').toLowerCase().includes('primary')
  ).length

  if (loading) {
    return <main style={styles.page}>Loading students...</main>
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Admin Students</p>

        <h1 style={styles.title}>Student control centre</h1>

        <p style={styles.subtitle}>
          Track children, parent links, learning levels, school systems, subjects booked, and payment activity.
        </p>

        <div style={styles.kpiGrid}>
          <Kpi label="Students" value={String(students.length)} />
          <Kpi label="Early Years" value={String(earlyYearsCount)} />
          <Kpi label="Primary / Other" value={String(primaryCount)} />
          <Kpi label="Bookings" value={String(bookings.length)} />
          <Kpi label="Paid Bookings" value={String(paidBookings.length)} />
          <Kpi label="Revenue" value={`£${totalRevenue.toFixed(2)}`} />
        </div>

        <div style={styles.actions}>
          <Link href="/admin" style={styles.secondaryLink}>
            Back to Admin
          </Link>

          <Link href="/admin/parents" style={styles.primaryLink}>
            Parents
          </Link>

          <Link href="/admin/bookings" style={styles.secondaryLink}>
            Bookings
          </Link>
        </div>
      </section>

      <section style={styles.cardWide}>
        <div style={styles.toolbar}>
          <div>
            <p style={styles.sectionEyebrow}>Student Directory</p>
            <h2 style={styles.sectionTitle}>All children on the platform</h2>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search child, parent, level, school system..."
            style={styles.searchInput}
          />
        </div>

        {filteredStudents.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>No students found</h3>
            <p style={styles.emptyText}>Children added by parents will appear here.</p>
          </div>
        ) : (
          <div style={styles.studentGrid}>
            {filteredStudents.map((student) => {
              const studentBookings = bookings.filter(
                (booking) => booking.student_id === student.id
              )

              const studentPaidBookings = studentBookings.filter(
                (booking) =>
                  booking.payment_status === 'PAID' ||
                  booking.payment_status === 'paid' ||
                  booking.status === 'CONFIRMED'
              )

              const studentRevenue = studentPaidBookings.reduce(
                (sum, booking) => sum + Number(booking.amount_gbp || 0),
                0
              )

              const subjectSet = Array.from(
                new Set(
                  studentBookings.map(
                    (booking) => subjectLabels[booking.subject_id] || booking.subject_id
                  )
                )
              )

              return (
                <div key={student.id} style={styles.studentCard}>
                  <div style={styles.studentTop}>
                    <div>
                      <p style={styles.studentName}>{student.full_name}</p>
                      <p style={styles.studentMeta}>
                        Parent: {student.parent_profiles?.full_name || 'Unknown parent'}
                      </p>
                      <p style={styles.studentMeta}>
                        {student.parent_profiles?.country_of_residence || 'Country not set'}
                      </p>
                    </div>

                    <span style={styles.badge}>
                      {student.learning_levels?.name || 'No level'}
                    </span>
                  </div>

                  <div style={styles.detailGrid}>
                    <Detail label="Age" value={student.child_age ? String(student.child_age) : '-'} />
                    <Detail label="System" value={student.country_system || '-'} />
                    <Detail label="Class" value={student.country_class_label || '-'} />
                    <Detail label="Bookings" value={String(studentBookings.length)} />
                    <Detail label="Paid" value={String(studentPaidBookings.length)} />
                    <Detail label="Revenue" value={`£${studentRevenue.toFixed(2)}`} />
                  </div>

                  <div style={styles.subjectBox}>
                    <p style={styles.subjectTitle}>Subjects booked</p>

                    {subjectSet.length === 0 ? (
                      <p style={styles.muted}>No subjects booked yet.</p>
                    ) : (
                      <div style={styles.subjectList}>
                        {subjectSet.slice(0, 5).map((subject) => (
                          <span key={subject} style={styles.subjectPill}>
                            {subject}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.detailBox}>
      <p style={styles.detailLabel}>{label}</p>
      <p style={styles.detailValue}>{value}</p>
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
    maxWidth: 1180,
    margin: '0 auto',
    padding: '44px 36px',
    borderRadius: 34,
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(248,242,255,0.96))',
    border: '1px solid rgba(126,87,194,0.16)',
    boxShadow: '0 30px 90px rgba(88,52,150,0.12)',
  },

  eyebrow: {
    margin: 0,
    color: '#7441d8',
    fontWeight: 900,
    fontSize: 15,
  },

  title: {
    margin: '14px 0 0',
    fontSize: 'clamp(34px, 5vw, 54px)',
    lineHeight: 1.05,
    fontWeight: 950,
    letterSpacing: -1.2,
  },

  subtitle: {
    maxWidth: 760,
    margin: '18px 0 0',
    color: '#6f637e',
    fontSize: 17,
    lineHeight: 1.7,
  },

  kpiGrid: {
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

  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 18,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 22,
  },

  sectionEyebrow: {
    margin: 0,
    color: '#7441d8',
    fontWeight: 950,
    fontSize: 14,
  },

  sectionTitle: {
    margin: '8px 0 0',
    fontSize: 28,
    fontWeight: 950,
  },

  searchInput: {
    width: 360,
    maxWidth: '100%',
    border: '1px solid rgba(124,58,237,0.18)',
    borderRadius: 18,
    padding: '15px 16px',
    outline: 'none',
    fontSize: 15,
    fontWeight: 800,
  },

  studentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: 18,
  },

  studentCard: {
    padding: 22,
    borderRadius: 26,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  studentTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    alignItems: 'flex-start',
  },

  studentName: {
    margin: 0,
    fontSize: 21,
    fontWeight: 950,
  },

  studentMeta: {
    margin: '7px 0 0',
    color: '#6f637e',
    fontSize: 14,
    lineHeight: 1.5,
  },

  badge: {
    padding: '8px 11px',
    borderRadius: 999,
    background: '#f0e7ff',
    color: '#6d35d4',
    fontWeight: 950,
    fontSize: 12,
    whiteSpace: 'nowrap',
  },

  detailGrid: {
    marginTop: 18,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
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

  subjectBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    background: 'white',
    border: '1px solid rgba(124,58,237,0.1)',
  },

  subjectTitle: {
    margin: 0,
    color: '#7a7088',
    fontWeight: 850,
    fontSize: 13,
  },

  subjectList: {
    marginTop: 10,
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },

  subjectPill: {
    padding: '8px 10px',
    borderRadius: 999,
    background: '#f0e7ff',
    color: '#6d35d4',
    fontWeight: 900,
    fontSize: 12,
  },

  muted: {
    margin: '8px 0 0',
    color: '#6f637e',
    fontSize: 14,
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