'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

type UserProfile = {
  id: string
  public_id: string | null
  email: string | null
  role: string
  full_name: string | null
}

export default function AccountPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [message, setMessage] = useState('Loading...')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadAccount() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, public_id, email, role, full_name')
        .eq('id', user.id)
        .single()

      if (error || !data) {
        setMessage('Profile not found.')
        setLoading(false)
        return
      }

      setProfile(data)
      setMessage('')
      setLoading(false)
    }

    loadAccount()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleCopyId() {
    if (!profile?.public_id) return

    await navigator.clipboard.writeText(profile.public_id)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  function dashboardLink() {
    if (!profile) return '/'
    if (profile.role === 'ADMIN') return '/admin'
    if (profile.role === 'TUTOR') return '/tutor/dashboard'
    if (profile.role === 'PARENT') return '/parent/dashboard'
    return '/'
  }

  function publicIdLabel() {
    if (!profile) return 'Account ID'
    if (profile.role === 'TUTOR') return 'Tutor ID'
    if (profile.role === 'PARENT') return 'Parent ID'
    if (profile.role === 'ADMIN') return 'Admin ID'
    return 'Account ID'
  }

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="card" style={{ padding: 32 }}>
            <p>{message}</p>
          </div>
        </div>
      </main>
    )
  }

  if (!profile) return null

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 1100 }}>
        <section className="card" style={{ padding: 36 }}>
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 700 }}>
            Account
          </p>

          <h1 className="page-title" style={{ marginTop: 10 }}>
            My Account
          </h1>

          <div className="kpi-list" style={{ marginTop: 24 }}>
            <div className="kpi-row">
              <span className="kpi-label">Auth Email</span>
              <span className="kpi-value">{profile.email || '-'}</span>
            </div>

            <div className="kpi-row">
              <span className="kpi-label">Profile Name</span>
              <span className="kpi-value">{profile.full_name || '-'}</span>
            </div>

            <div className="kpi-row">
              <span className="kpi-label">Role</span>
              <span className="kpi-value">{profile.role}</span>
            </div>

            <div className="kpi-row">
              <span className="kpi-label">{publicIdLabel()}</span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="kpi-value"
                  style={{
                    letterSpacing: 0.5,
                    fontWeight: 900,
                    color: '#111827',
                  }}
                >
                  {profile.public_id || 'Generating...'}
                </span>

                {profile.public_id ? (
                  <button
                    type="button"
                    onClick={handleCopyId}
                    style={{
                      border: '1px solid #e5e7eb',
                      background: copied ? '#f3edff' : '#ffffff',
                      color: copied ? '#6f42c1' : '#374151',
                      borderRadius: 999,
                      padding: '6px 13px',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(17, 24, 39, 0.06)',
                    }}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              marginTop: 28,
            }}
          >
            <Link href={dashboardLink()} className="btn-primary">
              Go to Dashboard
            </Link>

            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </section>

        {profile.role === 'ADMIN' ? (
          <section style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 30, marginBottom: 16 }}>
              Admin Control Centre
            </h2>

            <div
              className="three-col-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 20,
              }}
            >
              <AdminCard
                title="Tutor Approval"
                text="Review, approve, reject, verify and list tutors."
                href="/admin/tutors"
              />

              <AdminCard
                title="Bookings"
                text="Monitor parent bookings and lesson status."
                href="/admin/bookings"
              />

              <AdminCard
                title="Payments"
                text="Track payment status, paid bookings and failed payments."
                href="/admin/payments"
              />

              <AdminCard
                title="Parents"
                text="View parent accounts and student activity."
                href="/admin/parents"
              />

              <AdminCard
                title="Students"
                text="Monitor student profiles and learning needs."
                href="/admin/students"
              />

              <AdminCard
                title="Reports"
                text="View platform activity and operational summaries."
                href="/admin/reports"
              />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}

function AdminCard({
  title,
  text,
  href,
}: {
  title: string
  text: string
  href: string
}) {
  return (
    <Link href={href} className="card" style={{ padding: 24, display: 'block' }}>
      <h3 style={{ margin: 0, fontSize: 22 }}>{title}</h3>

      <p className="page-subtitle" style={{ marginTop: 10 }}>
        {text}
      </p>

      <p style={{ marginTop: 18, color: '#6f42c1', fontWeight: 800 }}>
        Open →
      </p>
    </Link>
  )
}