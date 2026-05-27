'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type PublicTutor = {
  id: string
  full_name: string
  photo_url: string | null
  bio: string | null
  years_of_experience: number
  qualification_summary: string | null
  languages_spoken: string[] | null
  teaching_levels: string[] | null
  average_rating: number
  rating_count: number
  country: string
  timezone: string
}

export default function TutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [tutor, setTutor] = useState<PublicTutor | null>(null)
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    async function loadTutor() {
      const resolvedParams = await params

      const { data, error } = await supabase
        .from('vw_public_tutors')
        .select('*')
        .eq('id', resolvedParams.id)
        .maybeSingle()

      if (error) {
        setMessage(error.message)
        return
      }

      if (!data) {
        setMessage('Tutor not found.')
        return
      }

      setTutor(data)
      setMessage('')
    }

    loadTutor()
  }, [params])

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 960 }}>
        <div className="card" style={{ padding: 32 }}>
          {message ? <p>{message}</p> : null}

          {tutor ? (
            <div
              className="dashboard-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '0.9fr 1.1fr',
                gap: 28,
                alignItems: 'start',
              }}
            >
              <div className="panel" style={{ padding: 24, textAlign: 'center' }}>
                <div
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: '50%',
                    background: '#efe7ff',
                    margin: '0 auto 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: '#6f42c1',
                    overflow: 'hidden',
                    fontSize: 30,
                  }}
                >
                  {tutor.photo_url ? (
                    <img
                      src={tutor.photo_url}
                      alt={tutor.full_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    getInitials(tutor.full_name)
                  )}
                </div>

                <h1 style={{ margin: '0 0 8px' }}>{tutor.full_name}</h1>
                <p className="page-subtitle">
                  {tutor.qualification_summary || `${tutor.years_of_experience} years experience`}
                </p>

                <p style={{ marginTop: 16, fontWeight: 700 }}>
                  ⭐ {Number(tutor.average_rating || 0).toFixed(1)} ({tutor.rating_count} ratings)
                </p>
              </div>

              <div>
                <h2 style={{ marginTop: 0 }}>Tutor Profile</h2>
                <p className="page-subtitle" style={{ lineHeight: 1.7 }}>
                  {tutor.bio || 'No tutor bio added yet.'}
                </p>

                <div className="kpi-list" style={{ marginTop: 24 }}>
                  <div className="kpi-row">
                    <span className="kpi-label">Country</span>
                    <span className="kpi-value">{tutor.country}</span>
                  </div>
                  <div className="kpi-row">
                    <span className="kpi-label">Timezone</span>
                    <span className="kpi-value">{tutor.timezone}</span>
                  </div>
                  <div className="kpi-row">
                    <span className="kpi-label">Experience</span>
                    <span className="kpi-value">{tutor.years_of_experience} years</span>
                  </div>
                  <div className="kpi-row">
                    <span className="kpi-label">Languages</span>
                    <span className="kpi-value">
                      {(tutor.languages_spoken || []).join(', ') || '-'}
                    </span>
                  </div>
                  <div className="kpi-row">
                    <span className="kpi-label">Teaching Levels</span>
                    <span className="kpi-value">
                      {(tutor.teaching_levels || []).join(', ') || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}