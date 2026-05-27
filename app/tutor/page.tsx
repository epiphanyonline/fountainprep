'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

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

export default function TutorsPage() {
  const [tutors, setTutors] = useState<PublicTutor[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('All')

  useEffect(() => {
    async function loadTutors() {
      const { data, error } = await supabase
        .from('vw_public_tutors')
        .select('*')
        .order('average_rating', { ascending: false })

      if (!error && data) {
        setTutors(data)
      }

      setLoading(false)
    }

    loadTutors()
  }, [])

  const teachingLevels = useMemo(() => {
    const allLevels = tutors.flatMap((t) => t.teaching_levels || [])
    return ['All', ...Array.from(new Set(allLevels))]
  }, [tutors])

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const matchesSearch =
        tutor.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (tutor.bio || '').toLowerCase().includes(search.toLowerCase()) ||
        (tutor.qualification_summary || '').toLowerCase().includes(search.toLowerCase())

      const matchesLevel =
        levelFilter === 'All' ||
        (tutor.teaching_levels || []).includes(levelFilter)

      return matchesSearch && matchesLevel
    })
  }, [tutors, search, levelFilter])

  return (
    <main className="page-wrap">
      <div className="container">
        <section
          className="card"
          style={{
            padding: 36,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(244,237,255,0.95) 100%)',
          }}
        >
          <p style={{ color: '#6f42c1', fontWeight: 700, margin: 0 }}>
            Tutor Marketplace
          </p>
          <h1 className="page-title" style={{ marginTop: 12 }}>
            Browse trusted tutors
          </h1>
          <p className="page-subtitle" style={{ maxWidth: 720 }}>
            Explore tutors based on experience, teaching level, and learning fit.
            Designed to help families choose with confidence.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: 16,
              marginTop: 24,
            }}
            className="two-col-grid"
          >
            <input
              placeholder="Search tutor name, bio, or qualification"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {teachingLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          {loading ? (
            <div
              className="three-col-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 20,
              }}
            >
              <TutorSkeletonCard />
              <TutorSkeletonCard />
              <TutorSkeletonCard />
            </div>
          ) : filteredTutors.length > 0 ? (
            <>
              <div
                style={{
                  marginBottom: 18,
                  color: 'var(--muted)',
                  fontWeight: 600,
                }}
              >
                {filteredTutors.length} tutor{filteredTutors.length === 1 ? '' : 's'} found
              </div>

              <div
                className="three-col-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 20,
                }}
              >
                {filteredTutors.map((tutor) => (
                  <div key={tutor.id} className="card" style={{ padding: 24 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        marginBottom: 18,
                      }}
                    >
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          background: '#efe7ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          color: '#6f42c1',
                          overflow: 'hidden',
                          flexShrink: 0,
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

                      <div>
                        <h3 style={{ margin: '0 0 6px' }}>{tutor.full_name}</h3>
                        <p className="page-subtitle" style={{ margin: 0 }}>
                          {tutor.qualification_summary || `${tutor.years_of_experience} years experience`}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontWeight: 700 }}>
                        ⭐ {Number(tutor.average_rating || 0).toFixed(1)}
                      </span>
                      <span style={{ color: 'var(--muted)', marginLeft: 8 }}>
                        {tutor.rating_count} ratings
                      </span>
                    </div>

                    <p className="page-subtitle" style={{ marginBottom: 16 }}>
                      {truncateText(
                        tutor.bio || 'Professional tutor available for personalised support.',
                        120
                      )}
                    </p>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                      {(tutor.teaching_levels || []).slice(0, 3).map((level) => (
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

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 12,
                        alignItems: 'center',
                        marginBottom: 16,
                        color: 'var(--muted)',
                        fontSize: 14,
                      }}
                    >
                      <span>{tutor.country}</span>
                      <span>{tutor.timezone}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
  <Link href={`/tutors/${tutor.id}`} className="btn-secondary">
    View Profile
  </Link>

  <Link href={`/parent/book/${tutor.id}`} className="btn-primary">
    Book Lesson
  </Link>
</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <h2 style={{ marginTop: 0 }}>No tutors found</h2>
              <p className="page-subtitle" style={{ maxWidth: 560, margin: '0 auto' }}>
                We could not find a tutor matching your current search. Try another
                keyword or remove the teaching level filter.
              </p>
            </div>
          )}
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
      <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#efe7ff',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: 18,
              width: '70%',
              background: '#f1ecfa',
              borderRadius: 8,
              marginBottom: 10,
            }}
          />
          <div
            style={{
              height: 14,
              width: '85%',
              background: '#f6f2fb',
              borderRadius: 8,
            }}
          />
        </div>
      </div>

      <div style={{ height: 14, width: '45%', background: '#f6f2fb', borderRadius: 8, marginBottom: 12 }} />
      <div style={{ height: 14, width: '100%', background: '#f6f2fb', borderRadius: 8, marginBottom: 10 }} />
      <div style={{ height: 14, width: '82%', background: '#f6f2fb', borderRadius: 8, marginBottom: 16 }} />
      <div style={{ height: 42, width: '100%', background: '#f8f5fc', borderRadius: 14 }} />
    </div>
  )
}