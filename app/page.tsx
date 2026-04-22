'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

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

export default function HomePage() {
  const [tutors, setTutors] = useState<PublicTutor[]>([])
  const [loadingTutors, setLoadingTutors] = useState(true)

  useEffect(() => {
    async function loadTutors() {
      const { data, error } = await supabase
        .from('vw_public_tutors')
        .select('*')
        .limit(3)

      if (!error && data) {
        setTutors(data)
      }

      setLoadingTutors(false)
    }

    loadTutors()
  }, [])

  return (
    <main className="page-wrap">
      <div className="container">
        <section
          className="card hero-grid"
          style={{
            padding: 48,
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 32,
            alignItems: 'center',
          }}
        >
          <div>
            <p style={{ color: '#6f42c1', fontWeight: 700, margin: 0 }}>
              Global Tutor Platform
            </p>

            <h1 className="page-title" style={{ marginTop: 16 }}>
              High-quality tutoring,
              <br />
              powered by global talent
            </h1>

            <p className="page-subtitle" style={{ maxWidth: 540, marginTop: 16 }}>
              Connect your child with verified tutors across Maths, English, and
              Science — affordable, reliable, and designed for real results.
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Link href="/signup/parent" className="btn-primary">
                Get Started
              </Link>

              <Link href="/login" className="btn-secondary">
                Login
              </Link>
            </div>
          </div>

          <div className="panel" style={{ padding: 28 }}>
            <h3 style={{ marginTop: 0 }}>Why choose us?</h3>
            <div style={{ display: 'grid', gap: 16, marginTop: 20 }}>
              <p>✔ Verified tutors</p>
              <p>✔ Affordable pricing</p>
              <p>✔ Flexible scheduling</p>
              <p>✔ Global curriculum support</p>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 80 }}>
          <h2 className="section-heading">Featured Tutors</h2>

          <div
            className="three-col-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 20,
              marginTop: 20,
            }}
          >
            {loadingTutors ? (
              <>
                <TutorSkeletonCard />
                <TutorSkeletonCard />
                <TutorSkeletonCard />
              </>
            ) : tutors.length > 0 ? (
              tutors.map((tutor) => (
                <div key={tutor.id} className="card" style={{ padding: 24 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: '#efe7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: '#6f42c1',
                      marginBottom: 16,
                      overflow: 'hidden',
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

                  <h3 style={{ margin: '0 0 8px' }}>{tutor.full_name}</h3>

                  <p className="page-subtitle" style={{ marginBottom: 10 }}>
                    {tutor.qualification_summary || `${tutor.years_of_experience} years experience`}
                  </p>

                  <p style={{ margin: '0 0 10px', fontWeight: 700 }}>
                    ⭐ {Number(tutor.average_rating || 0).toFixed(1)}
                    <span style={{ color: 'var(--muted)', fontWeight: 500 }}>
                      {' '}
                      ({tutor.rating_count} ratings)
                    </span>
                  </p>

                  <p className="page-subtitle" style={{ marginBottom: 16 }}>
                    {truncateText(
                      tutor.bio || 'Professional tutor available for personalised learning support.',
                      88
                    )}
                  </p>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    {(tutor.teaching_levels || []).slice(0, 2).map((level) => (
                      <span
                        key={level}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 999,
                          background: '#f3effb',
                          color: '#6f42c1',
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {level}
                      </span>
                    ))}
                  </div>

                  <Link href="/tutors" className="btn-secondary">
                    View Tutors
                  </Link>
                </div>
              ))
            ) : (
              <>
                <StaticTutorCard initials="JD" name="Jane Doe" subtitle="Maths & English" rating="4.8" />
                <StaticTutorCard initials="AO" name="Amina Okoye" subtitle="Science & Exams" rating="4.9" />
                <StaticTutorCard initials="TS" name="Tunde Smith" subtitle="English & Science" rating="4.7" />
              </>
            )}
          </div>
        </section>

        <section style={{ marginTop: 80 }}>
          <h2 className="section-heading">How it works</h2>

          <div
            className="three-col-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 20,
              marginTop: 20,
            }}
          >
            <div className="panel" style={{ padding: 24 }}>
              <h3>1. Sign up</h3>
              <p className="page-subtitle">
                Create your parent account in minutes.
              </p>
            </div>

            <div className="panel" style={{ padding: 24 }}>
              <h3>2. Choose tutor</h3>
              <p className="page-subtitle">
                Browse tutors based on subject and level.
              </p>
            </div>

            <div className="panel" style={{ padding: 24 }}>
              <h3>3. Start learning</h3>
              <p className="page-subtitle">
                Book lessons and begin immediately.
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 80, marginBottom: 80 }}>
          <h2 className="section-heading">Popular Subjects</h2>

          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              marginTop: 20,
            }}
          >
            {['Maths', 'English', 'Science', 'Biology', 'Chemistry', 'Physics'].map(
              (subject) => (
                <div
                  key={subject}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 999,
                    background: '#fff',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow)',
                    fontWeight: 600,
                  }}
                >
                  {subject}
                </div>
              )
            )}
          </div>
        </section>
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

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

function TutorSkeletonCard() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#efe7ff',
          marginBottom: 16,
        }}
      />
      <div style={{ height: 18, width: '65%', background: '#f1ecfa', borderRadius: 8, marginBottom: 10 }} />
      <div style={{ height: 14, width: '80%', background: '#f6f2fb', borderRadius: 8, marginBottom: 10 }} />
      <div style={{ height: 14, width: '50%', background: '#f6f2fb', borderRadius: 8, marginBottom: 16 }} />
      <div style={{ height: 42, width: '100%', background: '#f8f5fc', borderRadius: 14 }} />
    </div>
  )
}

function StaticTutorCard({
  initials,
  name,
  subtitle,
  rating,
}: {
  initials: string
  name: string
  subtitle: string
  rating: string
}) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#efe7ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          color: '#6f42c1',
          marginBottom: 16,
        }}
      >
        {initials}
      </div>
      <h3>{name}</h3>
      <p className="page-subtitle">{subtitle}</p>
      <p style={{ fontWeight: 700 }}>⭐ {rating}</p>
    </div>
  )
}