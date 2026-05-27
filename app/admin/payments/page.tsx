'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type Payment = {
  id: string
  booking_id: string
  payment_status: string
  amount: number | null
  currency: string | null
  created_at: string | null
}

export default function AdminPaymentsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'FAILED' | 'PENDING'>('ALL')

  useEffect(() => {
    async function loadPayments() {
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

      const { data } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })

      setPayments((data ?? []) as Payment[])
      setLoading(false)
    }

    loadPayments()
  }, [router])

  const filtered = useMemo(() => {
    if (filter === 'ALL') return payments
    return payments.filter((p) => p.payment_status === filter.toLowerCase())
  }, [payments, filter])

  const totalRevenue = payments
    .filter((p) => p.payment_status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)

  const paidCount = payments.filter((p) => p.payment_status === 'paid').length
  const pendingCount = payments.filter((p) => p.payment_status === 'pending').length
  const failedCount = payments.filter((p) => p.payment_status === 'failed').length

  if (loading) return <div style={{ padding: 40 }}>Loading payments...</div>

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.title}>Payments Control</h1>
        <p style={styles.subtitle}>Track revenue, failed payments and platform cash flow.</p>

        <div style={styles.kpiGrid}>
          <Kpi label="Revenue" value={`£${totalRevenue.toFixed(2)}`} />
          <Kpi label="Paid" value={String(paidCount)} />
          <Kpi label="Pending" value={String(pendingCount)} />
          <Kpi label="Failed" value={String(failedCount)} />
        </div>

        <div style={styles.actions}>
          <Link href="/admin" style={styles.secondary}>Back</Link>
          <Link href="/admin/bookings" style={styles.primary}>Bookings</Link>
        </div>
      </section>

      <section style={styles.card}>
        <div style={styles.filters}>
          {['ALL', 'PAID', 'PENDING', 'FAILED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              style={{
                ...styles.filterBtn,
                ...(filter === f ? styles.activeFilter : {}),
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={styles.list}>
          {filtered.map((p) => (
            <div key={p.id} style={styles.row}>
              <div>
                <p style={styles.amount}>
                  {p.currency || 'GBP'} {Number(p.amount || 0).toFixed(2)}
                </p>
                <p style={styles.meta}>Booking: {p.booking_id.slice(0, 8)}</p>
              </div>

              <span style={{
                ...styles.badge,
                ...(p.payment_status === 'paid'
                  ? styles.paid
                  : p.payment_status === 'failed'
                  ? styles.failed
                  : styles.pending)
              }}>
                {p.payment_status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.kpi}>
      <p style={styles.kpiLabel}>{label}</p>
      <h2>{value}</h2>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    padding: 40,
    background: '#f7f4ff',
    minHeight: '100vh',
  },

  hero: {
    marginBottom: 30,
  },

  title: {
    fontSize: 40,
    fontWeight: 900,
  },

  subtitle: {
    color: '#666',
  },

  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
    gap: 16,
    marginTop: 20,
  },

  kpi: {
    background: 'white',
    padding: 20,
    borderRadius: 16,
  },

  kpiLabel: {
    color: '#777',
    fontSize: 12,
  },

  actions: {
    marginTop: 20,
    display: 'flex',
    gap: 10,
  },

  primary: {
    background: '#7c3aed',
    color: 'white',
    padding: 12,
    borderRadius: 10,
    textDecoration: 'none',
  },

  secondary: {
    border: '1px solid #ddd',
    padding: 12,
    borderRadius: 10,
    textDecoration: 'none',
  },

  card: {
    background: 'white',
    padding: 20,
    borderRadius: 20,
  },

  filters: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
  },

  filterBtn: {
    padding: 10,
    borderRadius: 10,
    border: '1px solid #ddd',
    background: 'white',
    cursor: 'pointer',
  },

  activeFilter: {
    background: '#7c3aed',
    color: 'white',
  },

  list: {
    display: 'grid',
    gap: 12,
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    background: '#faf9ff',
  },

  amount: {
    fontWeight: 900,
  },

  meta: {
    fontSize: 12,
    color: '#777',
  },

  badge: {
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  paid: {
    background: '#dcfce7',
    color: '#065f46',
  },

  failed: {
    background: '#fee2e2',
    color: '#991b1b',
  },

  pending: {
    background: '#fef3c7',
    color: '#92400e',
  },
}