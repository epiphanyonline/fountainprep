'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

type UserProfile = {
  id: string
  role: string
  full_name: string | null
  email: string | null
}

export default function AccountPage() {
  const [authEmail, setAuthEmail] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage('No logged-in user.')
        return
      }

      setAuthEmail(user.email ?? '')

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, role, full_name, email')
        .eq('id', user.id)
        .single()

      if (error) {
        setMessage(error.message)
        return
      }

      setProfile(data)
      setMessage('')
    }

    loadUser()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const dashboardHref =
    profile?.role === 'PARENT'
      ? '/parent/dashboard'
      : profile?.role === 'TUTOR'
      ? '/tutor/dashboard'
      : '/'

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="card" style={{ padding: 32 }}>
          <h1 className="page-title" style={{ fontSize: 36 }}>
            My Account
          </h1>

          {message ? <p>{message}</p> : null}

          <div className="kpi-list" style={{ marginTop: 16 }}>
            <div className="kpi-row">
              <span className="kpi-label">Auth Email</span>
              <span className="kpi-value">{authEmail}</span>
            </div>
            <div className="kpi-row">
              <span className="kpi-label">Profile Name</span>
              <span className="kpi-value">{profile?.full_name ?? '-'}</span>
            </div>
            <div className="kpi-row">
              <span className="kpi-label">Role</span>
              <span className="kpi-value">{profile?.role ?? '-'}</span>
            </div>
            <div className="kpi-row">
              <span className="kpi-label">User ID</span>
              <span className="kpi-value">{profile?.id ?? '-'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Link href={dashboardHref} className="btn-primary">
              Go to Dashboard
            </Link>

            <button className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}