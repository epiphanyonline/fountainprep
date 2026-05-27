'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

type Tutor = {
  id: string
  full_name: string
  bio: string | null
  years_of_experience: number | null
  qualification_summary: string | null
}

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTutors() {
      const { data, error } = await supabase
        .from('tutor_profiles')
        .select(
          `
          id,
          full_name,
          bio,
          years_of_experience,
          qualification_summary
        `
        )
        .eq('approval_status', 'approved')
        .eq('verification_status', 'verified')
        .eq('is_listed', true)

      if (!error && data) {
        setTutors(data)
      }

      setLoading(false)
    }

    loadTutors()
  }, [])

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="container">
          <p>Loading tutors...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 1180 }}>
        <section
          className="card"
          style={{
            padding: 32,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(244,237,255,0.95) 100%)',
          }}
        >
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 700, fontSize: 14 }}>
            Tutor Marketplace
          </p>

          <h1 className="page-title" style={{ marginTop: 10 }}>
            Meet Our Tutors
          </h1>

          <p className="page-subtitle">
            Our tutors are matched automatically based on your child’s age, subject, schedule, and learning level.
          </p>
        </section>

        <section style={{ marginTop: 28 }}>
          {tutors.length === 0 ? (
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ marginTop: 0 }}>No tutors available yet</h2>
              <p className="page-subtitle">
                Approved tutors will appear here once admin has reviewed and listed them.
              </p>
            </div>
          ) : (
            <div
              className="three-col-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 20,
              }}
            >
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="card"
                  style={{
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 280,
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6f42c1 0%, #8a5cf6 100%)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 18,
                        marginBottom: 16,
                      }}
                    >
                      {tutor.full_name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <h2 style={{ margin: '0 0 10px', fontSize: 28 }}>{tutor.full_name}</h2>

                    <p className="page-subtitle" style={{ minHeight: 60 }}>
                      {tutor.bio || 'No bio provided yet.'}
                    </p>

                    <div className="kpi-list" style={{ marginTop: 16 }}>
                      <div className="kpi-row" style={{ padding: '10px 0' }}>
                        <span className="kpi-label">Experience</span>
                        <span className="kpi-value">
                          {tutor.years_of_experience ?? 0} yrs
                        </span>
                      </div>

                      <div className="kpi-row" style={{ padding: '10px 0' }}>
                        <span className="kpi-label">Qualification</span>
                        <span className="kpi-value">
                          {tutor.qualification_summary ?? 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <Link
                      href="/parent/students"
                      className="btn-primary"
                      style={{ display: 'inline-block' }}
                    >
                      Start with Child Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}