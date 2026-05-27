'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type ParentProfile = {
  id: string
  user_id: string
  full_name: string
  phone: string | null
  country_of_residence: string | null
  timezone: string | null
  preferred_currency: string | null
  created_at: string | null
}

type StudentProfile = {
  id: string
  parent_id: string
  full_name: string
}

type Booking = {
  id: string
  parent_id: string
  payment_status: string
  status: string
  amount_gbp: number | null
}

export default function AdminParentsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [parents, setParents] = useState<ParentProfile[]>([])
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadParents() {
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

      const { data: parentRows } = await supabase
        .from('parent_profiles')
        .select('id, user_id, full_name, phone, country_of_residence, timezone, preferred_currency, created_at')
        .order('created_at', { ascending: false })

      const { data: studentRows } = await supabase
        .from('student_profiles')
        .select('id, parent_id, full_name')

      const { data: bookingRows } = await supabase
        .from('lesson_bookings')
        .select('id, parent_id, payment_status, status, amount_gbp')

      setParents((parentRows ?? []) as ParentProfile[])
      setStudents((studentRows ?? []) as StudentProfile[])
      setBookings((bookingRows ?? []) as Booking[])
      setLoading(false)
    }

    loadParents()
  }, [router])

  const filteredParents = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return parents

    return parents.filter((parent) =>
      [
        parent.full_name,
        parent.phone,
        parent.country_of_residence,
        parent.preferred_currency,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    )
  }, [parents, search])

  const totalRevenue = bookings
    .filter((b) => b.payment_status === 'PAID' || b.payment_status === 'paid' || b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + Number(b.amount_gbp || 0), 0)

  if (loading) {
    return <main style={styles.page}>Loading parents...</main>
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Admin Parents</p>

        <h1 style={styles.title}>Parent control centre</h1>

        <p style={styles.subtitle}>
          Track parent accounts, children, booking activity, currencies, and country spread.
        </p>

        <div style={styles.kpiGrid}>
          <Kpi label="Parents" value={String(parents.length)} />
          <Kpi label="Students" value={String(students.length)} />
          <Kpi label="Bookings" value={String(bookings.length)} />
          <Kpi label="Revenue" value={`£${totalRevenue.toFixed(2)}`} />
        </div>

        <div style={styles.actions}>
          <Link href="/admin" style={styles.secondaryLink}>
            Back to Admin
          </Link>

          <Link href="/admin/students" style={styles.primaryLink}>
            Students
          </Link>

          <Link href="/admin/bookings" style={styles.secondaryLink}>
            Bookings
          </Link>
        </div>
      </section>

      <section style={styles.cardWide}>
        <div style={styles.toolbar}>
          <div>
            <p style={styles.sectionEyebrow}>Parent Directory</p>
            <h2 style={styles.sectionTitle}>All parent accounts</h2>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parent, phone, country..."
            style={styles.searchInput}
          />
        </div>

        {filteredParents.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>No parents found</h3>
            <p style={styles.emptyText}>Parent profiles will appear here after onboarding.</p>
          </div>
        ) : (
          <div style={styles.parentGrid}>
            {filteredParents.map((parent) => {
              const childCount = students.filter((student) => student.parent_id === parent.id).length

              const parentBookings = bookings.filter(
                (booking) => booking.parent_id === parent.user_id
              )

              const paidBookings = parentBookings.filter(
                (booking) =>
                  booking.payment_status === 'PAID' ||
                  booking.payment_status === 'paid' ||
                  booking.status === 'CONFIRMED'
              )

              const parentRevenue = paidBookings.reduce(
                (sum, booking) => sum + Number(booking.amount_gbp || 0),
                0
              )

              return (
                <div key={parent.id} style={styles.parentCard}>
                  <div style={styles.parentTop}>
                    <div>
                      <p style={styles.parentName}>{parent.full_name}</p>
                      <p style={styles.parentMeta}>
                        {parent.country_of_residence || 'Country not set'} •{' '}
                        {parent.timezone || 'Timezone not set'}
                      </p>
                    </div>

                    <span style={styles.badge}>{parent.preferred_currency || 'GBP'}</span>
                  </div>

                  <div style={styles.detailGrid}>
                    <Detail label="Phone" value={parent.phone || '-'} />
                    <Detail label="Children" value={String(childCount)} />
                    <Detail label="Bookings" value={String(parentBookings.length)} />
                    <Detail label="Paid" value={String(paidBookings.length)} />
                    <Detail label="Revenue" value={`£${parentRevenue.toFixed(2)}`} />
                    <Detail
                      label="Joined"
                      value={parent.created_at ? formatDate(parent.created_at) : '-'}
                    />
                  </div>

                  <div style={styles.childrenBox}>
                    <p style={styles.childrenTitle}>Children</p>

                    {childCount === 0 ? (
                      <p style={styles.muted}>No children added yet.</p>
                    ) : (
                      <div style={styles.childList}>
                        {students
                          .filter((student) => student.parent_id === parent.id)
                          .slice(0, 4)
                          .map((student) => (
                            <span key={student.id} style={styles.childPill}>
                              {student.full_name}
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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
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
    width: 320,
    maxWidth: '100%',
    border: '1px solid rgba(124,58,237,0.18)',
    borderRadius: 18,
    padding: '15px 16px',
    outline: 'none',
    fontSize: 15,
    fontWeight: 800,
  },

  parentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: 18,
  },

  parentCard: {
    padding: 22,
    borderRadius: 26,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  parentTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    alignItems: 'flex-start',
  },

  parentName: {
    margin: 0,
    fontSize: 21,
    fontWeight: 950,
  },

  parentMeta: {
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

  childrenBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    background: 'white',
    border: '1px solid rgba(124,58,237,0.1)',
  },

  childrenTitle: {
    margin: 0,
    color: '#7a7088',
    fontWeight: 850,
    fontSize: 13,
  },

  childList: {
    marginTop: 10,
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },

  childPill: {
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