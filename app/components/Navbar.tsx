'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type UserProfile = {
  id: string
  role: string
  full_name: string | null
}

export default function Navbar() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('user_profiles')
        .select('id, role, full_name')
        .eq('id', user.id)
        .maybeSingle()

      setProfile(data ?? null)
      setLoading(false)
    }

    loadProfile()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
        background: 'rgba(248, 246, 252, 0.82)',
        borderBottom: '1px solid rgba(111, 66, 193, 0.08)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 74,
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          Tutor<span style={{ color: '#6f42c1' }}>Me</span>
        </Link>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" className="btn-secondary">
            Home
          </Link>

          {!loading && !profile ? (
            <>
              <Link href="/signup/parent" className="btn-secondary">
                Parent Sign Up
              </Link>
              <Link href="/signup/tutor" className="btn-secondary">
                Tutor Sign Up
              </Link>
              <Link href="/login" className="btn-primary">
                Login
              </Link>
            </>
          ) : null}

          {!loading && profile ? (
            <>
              <Link
                href={profile.role === 'PARENT' ? '/parent/dashboard' : '/tutor/dashboard'}
                className="btn-secondary"
              >
                Dashboard
              </Link>

              <Link href="/account" className="btn-secondary">
                Account
              </Link>

              <button className="btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  )
}