'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type ParentProfile = {
  id: string
  full_name: string
}

type SessionRow = {
  id: string
  booking_id: string
  student_id: string
  tutor_id: string
  subject_id: string
  starts_at: string
  ends_at: string
  duration_minutes: number
  meeting_link: string | null
  status: string
  tutor_notes: string | null
  progress_summary: string | null
  student_name: string
  tutor_name: string
  subject_name: string
  has_rating: boolean
}

export default function ParentSessionsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading...')
  const [parent, setParent] = useState<ParentProfile | null>(null)
  const [sessions, setSessions] = useState<SessionRow[]>([])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setMessage('Loading...')

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: parentProfile, error: parentError } = await supabase
        .from('parent_profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .maybeSingle()

      if (parentError || !parentProfile) {
        router.push('/parent/onboarding')
        return
      }

      setParent(parentProfile as ParentProfile)

      const { data: bookingRows, error: bookingError } = await supabase
        .from('bookings')
        .select('id')
        .eq('parent_id', parentProfile.id)

      if (bookingError) {
        setMessage(bookingError.message)
        setLoading(false)
        return
      }

      const bookingIds = (bookingRows ?? []).map((booking) => booking.id)

      if (bookingIds.length === 0) {
        setSessions([])
        setMessage('')
        setLoading(false)
        return
      }

      const { data: sessionRows, error: sessionError } = await supabase
        .from('lesson_sessions')
        .select(`
          id,
          booking_id,
          student_id,
          tutor_id,
          subject_id,
          starts_at,
          ends_at,
          duration_minutes,
          meeting_link,
          status,
          tutor_notes,
          progress_summary,
          student_profiles (
            full_name
          ),
          tutor_profiles (
            full_name
          ),
          subjects (
            name
          )
        `)
        .in('booking_id', bookingIds)
        .order('starts_at', { ascending: true })

      if (sessionError) {
        setMessage(sessionError.message)
        setLoading(false)
        return
      }

      const sessionIds = (sessionRows ?? []).map((session) => session.id)

      let ratedSessionIds = new Set<string>()

      if (sessionIds.length > 0) {
        const { data: ratingRows } = await supabase
          .from('lesson_session_ratings')
          .select('lesson_session_id')
          .in('lesson_session_id', sessionIds)

        ratedSessionIds = new Set((ratingRows ?? []).map((rating) => rating.lesson_session_id))
      }

      const cleanSessions = ((sessionRows ?? []) as any[]).map((row) => ({
        id: row.id,
        booking_id: row.booking_id,
        student_id: row.student_id,
        tutor_id: row.tutor_id,
        subject_id: row.subject_id,
        starts_at: row.starts_at,
        ends_at: row.ends_at,
        duration_minutes: row.duration_minutes,
        meeting_link: row.meeting_link,
        status: row.status,
        tutor_notes: row.tutor_notes,
        progress_summary: row.progress_summary,
        student_name: Array.isArray(row.student_profiles)
          ? row.student_profiles[0]?.full_name ?? '-'
          : row.student_profiles?.full_name ?? '-',
        tutor_name: Array.isArray(row.tutor_profiles)
          ? row.tutor_profiles[0]?.full_name ?? '-'
          : row.tutor_profiles?.full_name ?? '-',
        subject_name: Array.isArray(row.subjects)
          ? row.subjects[0]?.name ?? '-'
          : row.subjects?.name ?? '-',
        has_rating: ratedSessionIds.has(row.id),
      })) as SessionRow[]

      setSessions(cleanSessions)
      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [router])

  function formatDateTime(value: string) {
    const date = new Date(value)

    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  function isUpcoming(value: string) {
    return new Date(value).getTime() > Date.now()
  }

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="container">
          <div className="card" style={{ padding: 32 }}>
            <h1 className="page-title">My Lessons</h1>
            <p>{message}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <section
          className="card"
          style={{
            padding: 34,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(244,237,255,0.95) 100%)',
          }}
        >
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 800 }}>
            Parent Portal
          </p>

          <h1 className="page-title" style={{ marginTop: 10 }}>
            My Lessons
          </h1>

          <p className="page-subtitle">
            {parent
              ? `Track lessons, meeting links, tutor notes, and progress for ${parent.full_name}.`
              : 'Track lessons, meeting links, tutor notes, and progress.'}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
            <Link href="/parent/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>

            <Link href="/parent/students" className="btn-primary">
              Choose Subject
            </Link>
          </div>
        </section>

        <section style={{ marginTop: 24 }}>
          {message ? <p>{message}</p> : null}

          {sessions.length === 0 ? (
            <div className="card" style={{ padding: 30, textAlign: 'center' }}>
              <h2 style={{ marginTop: 0 }}>No lessons yet</h2>
              <p className="page-subtitle" style={{ maxWidth: 620, margin: '0 auto' }}>
                Once you book and pay for a class, your lesson sessions will appear here.
              </p>

              <div style={{ marginTop: 20 }}>
                <Link href="/parent/students" className="btn-primary">
                  Add or Choose Child
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 18 }}>
              {sessions.map((session) => {
                const upcoming = isUpcoming(session.starts_at)

                return (
                  <div key={session.id} className="card" style={{ padding: 26 }}>
                    <div
                      className="dashboard-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 0.75fr',
                        gap: 22,
                        alignItems: 'start',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 16,
                            flexWrap: 'wrap',
                          }}
                        >
                          <div>
                            <p
                              style={{
                                margin: '0 0 8px',
                                color: '#6f42c1',
                                fontWeight: 800,
                                fontSize: 13,
                              }}
                            >
                              {upcoming ? 'Upcoming Lesson' : 'Lesson Record'}
                            </p>

                            <h2 style={{ margin: '0 0 8px', fontSize: 26 }}>
                              {session.subject_name}
                            </h2>

                            <p className="page-subtitle">
                              Student: <strong>{session.student_name}</strong> • Tutor:{' '}
                              <strong>{session.tutor_name}</strong>
                            </p>
                          </div>

                          <StatusBadge status={session.status} />
                        </div>

                        <div className="kpi-list" style={{ marginTop: 18 }}>
                          <div className="kpi-row">
                            <span className="kpi-label">Starts</span>
                            <span className="kpi-value">{formatDateTime(session.starts_at)}</span>
                          </div>

                          <div className="kpi-row">
                            <span className="kpi-label">Ends</span>
                            <span className="kpi-value">{formatDateTime(session.ends_at)}</span>
                          </div>

                          <div className="kpi-row">
                            <span className="kpi-label">Duration</span>
                            <span className="kpi-value">{session.duration_minutes} mins</span>
                          </div>
                        </div>

                        <div
                          className="panel"
                          style={{
                            marginTop: 20,
                            padding: 18,
                            background: session.meeting_link
                              ? 'rgba(46, 204, 113, 0.08)'
                              : 'rgba(245, 158, 11, 0.10)',
                          }}
                        >
                          <p style={{ margin: 0, fontWeight: 800 }}>
                            {session.meeting_link ? 'Meeting link ready' : 'Meeting link pending'}
                          </p>

                          <p className="page-subtitle" style={{ marginTop: 8 }}>
                            {session.meeting_link
                              ? 'Use the button below to join your lesson at the scheduled time.'
                              : 'Your meeting link will appear here once the session is prepared.'}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
                          {session.meeting_link ? (
                            <a
                              href={session.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary"
                            >
                              Join Lesson
                            </a>
                          ) : (
                            <button className="btn-secondary" disabled>
                              Meeting Link Pending
                            </button>
                          )}

                          {session.status === 'completed' && !session.has_rating ? (
                            <Link
                              href={`/parent/sessions/${session.id}/rate`}
                              className="btn-primary"
                            >
                              Rate Session
                            </Link>
                          ) : null}

                          {session.has_rating ? (
                            <button className="btn-secondary" disabled>
                              Rated
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <aside className="panel" style={{ padding: 20 }}>
                        <h3 style={{ marginTop: 0 }}>Tutor Progress Notes</h3>

                        <div className="kpi-list">
                          <div className="kpi-row">
                            <span className="kpi-label">What was taught</span>
                          </div>
                          <p className="page-subtitle" style={{ marginTop: 0, lineHeight: 1.6 }}>
                            {session.tutor_notes || 'No notes added yet.'}
                          </p>

                          <div className="kpi-row">
                            <span className="kpi-label">Progress summary</span>
                          </div>
                          <p className="page-subtitle" style={{ marginTop: 0, lineHeight: 1.6 }}>
                            {session.progress_summary || 'No progress summary yet.'}
                          </p>
                        </div>
                      </aside>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function StatusBadge({ status }: { status: string }) {
  let bg = '#f3effb'
  let color = '#6f42c1'

  if (status === 'completed') {
    bg = 'rgba(46, 204, 113, 0.14)'
    color = '#16834a'
  }

  if (status === 'scheduled') {
    bg = 'rgba(59, 130, 246, 0.12)'
    color = '#2563eb'
  }

  if (status.includes('no_show')) {
    bg = 'rgba(245, 158, 11, 0.14)'
    color = '#b45309'
  }

  if (status === 'cancelled') {
    bg = 'rgba(239, 68, 68, 0.14)'
    color = '#dc2626'
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: 999,
        background: bg,
        color,
        fontWeight: 800,
        fontSize: 13,
        height: 'fit-content',
      }}
    >
      {status}
    </span>
  )
}