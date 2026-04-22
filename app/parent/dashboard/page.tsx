'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type ParentProfile = {
  full_name: string
  phone: string | null
  country_of_residence: string | null
  timezone: string
  preferred_currency: string
}

export default function ParentDashboardPage() {
  const router = useRouter()
  const [message, setMessage] = useState('Loading...')
  const [profile, setProfile] = useState<ParentProfile | null>(null)

  useEffect(() => {
    async function loadParentProfile() {
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
        .single()

      if (!userProfile || userProfile.role !== 'PARENT') {
        router.push('/account')
        return
      }

      const { data, error } = await supabase
        .from('parent_profiles')
        .select('full_name, phone, country_of_residence, timezone, preferred_currency')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        setMessage(error.message)
        return
      }

      if (!data) {
        router.push('/parent/onboarding')
        return
      }

      setProfile(data)
      setMessage('')
    }

    loadParentProfile()
  }, [router])

  return (
    <main className="page-wrap">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 0.7fr',
            gap: 24,
            alignItems: 'start',
          }}
        >
          <section className="card" style={{ padding: 32 }}>
            <p
              style={{
                margin: 0,
                color: '#6f42c1',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Parent Portal
            </p>
            <h1 className="page-title" style={{ marginTop: 10 }}>
              Welcome back
            </h1>
            <p className="page-subtitle">
              Manage your profile, students, bookings, and tutoring activity from one place.
            </p>

            <div
              style={{
                marginTop: 28,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 16,
              }}
            >
              <div className="panel" style={{ padding: 20 }}>
                <p className="kpi-label" style={{ margin: 0 }}>Students</p>
                <h2 style={{ margin: '8px 0 0', fontSize: 28 }}>0</h2>
              </div>

              <div className="panel" style={{ padding: 20 }}>
                <p className="kpi-label" style={{ margin: 0 }}>Upcoming Lessons</p>
                <h2 style={{ margin: '8px 0 0', fontSize: 28 }}>0</h2>
              </div>

              <div className="panel" style={{ padding: 20 }}>
                <p className="kpi-label" style={{ margin: 0 }}>Preferred Currency</p>
                <h2 style={{ margin: '8px 0 0', fontSize: 28 }}>
                  {profile?.preferred_currency ?? '-'}
                </h2>
              </div>
            </div>
          </section>

          <aside className="card" style={{ padding: 28 }}>
            <h2 style={{ marginTop: 0, fontSize: 24 }}>Profile Summary</h2>

            {message ? <p>{message}</p> : null}

            {profile ? (
              <div className="kpi-list">
                <div className="kpi-row">
                  <span className="kpi-label">Name</span>
                  <span className="kpi-value">{profile.full_name}</span>
                </div>
                <div className="kpi-row">
                  <span className="kpi-label">Phone</span>
                  <span className="kpi-value">{profile.phone ?? '-'}</span>
                </div>
                <div className="kpi-row">
                  <span className="kpi-label">Country</span>
                  <span className="kpi-value">{profile.country_of_residence ?? '-'}</span>
                </div>
                <div className="kpi-row">
                  <span className="kpi-label">Timezone</span>
                  <span className="kpi-value">{profile.timezone}</span>
                </div>
                <div className="kpi-row">
                  <span className="kpi-label">Currency</span>
                  <span className="kpi-value">{profile.preferred_currency}</span>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  )
}