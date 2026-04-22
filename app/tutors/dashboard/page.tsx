'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type TutorProfile = {
  full_name: string
  phone: string | null
  country: string
  timezone: string
  bio: string | null
  years_of_experience: number
  qualification_summary: string | null
  approval_status: string
  verification_status: string
  average_rating: number
  rating_count: number
  is_listed: boolean
}

export default function TutorDashboardPage() {
  const router = useRouter()
  const [message, setMessage] = useState('Loading...')
  const [profile, setProfile] = useState<TutorProfile | null>(null)

  useEffect(() => {
    async function loadTutorProfile() {
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

      if (!userProfile || userProfile.role !== 'TUTOR') {
        router.push('/account')
        return
      }

      const { data, error } = await supabase
        .from('tutor_profiles')
        .select(
          'full_name, phone, country, timezone, bio, years_of_experience, qualification_summary, approval_status, verification_status, average_rating, rating_count, is_listed'
        )
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        setMessage(error.message)
        return
      }

      if (!data) {
        router.push('/tutor/onboarding')
        return
      }

      setProfile(data)
      setMessage('')
    }

    loadTutorProfile()
  }, [router])

  return (
    <main className="page-wrap">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
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
              Tutor Portal
            </p>

            <h1 className="page-title" style={{ marginTop: 10 }}>
              Tutor Dashboard
            </h1>

            <p className="page-subtitle">
              Manage your profile, track approval status, and prepare to receive bookings.
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
                <p className="kpi-label" style={{ margin: 0 }}>Rating</p>
                <h2 style={{ margin: '8px 0 0', fontSize: 28 }}>
                  {profile ? profile.average_rating.toFixed(1) : '0.0'}
                </h2>
              </div>

              <div className="panel" style={{ padding: 20 }}>
                <p className="kpi-label" style={{ margin: 0 }}>Ratings Count</p>
                <h2 style={{ margin: '8px 0 0', fontSize: 28 }}>
                  {profile?.rating_count ?? 0}
                </h2>
              </div>

              <div className="panel" style={{ padding: 20 }}>
                <p className="kpi-label" style={{ margin: 0 }}>Listed</p>
                <h2 style={{ margin: '8px 0 0', fontSize: 28 }}>
                  {profile?.is_listed ? 'Yes' : 'No'}
                </h2>
              </div>
            </div>

            {profile?.bio ? (
              <div className="panel" style={{ marginTop: 24, padding: 20 }}>
                <p style={{ margin: 0, fontWeight: 700 }}>Bio</p>
                <p style={{ margin: '10px 0 0', color: 'var(--muted)' }}>{profile.bio}</p>
              </div>
            ) : null}
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
                  <span className="kpi-value">{profile.country}</span>
                </div>
                <div className="kpi-row">
                  <span className="kpi-label">Timezone</span>
                  <span className="kpi-value">{profile.timezone}</span>
                </div>
                <div className="kpi-row">
                  <span className="kpi-label">Experience</span>
                  <span className="kpi-value">{profile.years_of_experience} yrs</span>
                </div>
                <div className="kpi-row">
                  <span className="kpi-label">Qualification</span>
                  <span className="kpi-value">{profile.qualification_summary ?? '-'}</span>
                </div>
                <div className="kpi-row">
                  <span className="kpi-label">Approval</span>
                  <span className="kpi-value">{profile.approval_status}</span>
                </div>
                <div className="kpi-row">
                  <span className="kpi-label">Verification</span>
                  <span className="kpi-value">{profile.verification_status}</span>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  )
}