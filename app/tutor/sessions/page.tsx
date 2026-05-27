'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type TutorProfile = {
  id: string
  full_name: string
}

type SessionRow = {
  id: string
  booking_id: string
  student_id: string
  subject_id: string
  starts_at: string
  ends_at: string
  duration_minutes: number
  meeting_link: string | null
  status: string
  tutor_notes: string | null
  progress_summary: string | null
  student_name: string
  subject_name: string
}

export default function TutorSessionsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [message, setMessage] = useState('Loading...')
  const [tutor, setTutor] = useState<TutorProfile | null>(null)
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

      const { data: tutorProfile, error: tutorError } = await supabase
        .from('tutor_profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .maybeSingle()

      if (tutorError || !tutorProfile) {
        router.push('/tutor/onboarding')
        return
      }

      setTutor(tutorProfile as TutorProfile)
      await loadSessions(tutorProfile.id)

      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [router])

  async function loadSessions(tutorId: string) {
    const { data, error } = await supabase
      .from('lesson_sessions')
      .select(`
        id,
        booking_id,
        student_id,
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
        subjects (
          name
        )
      `)
      .eq('tutor_id', tutorId)
      .order('starts_at', { ascending: true })

    if (error) {
      setMessage(error.message)
      return
    }

    const cleanRows = ((data ?? []) as any[]).map((row) => ({
      id: row.id,
      booking_id: row.booking_id,
      student_id: row.student_id,
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
      subject_name: Array.isArray(row.subjects)
        ? row.subjects[0]?.name ?? '-'
        : row.subjects?.name ?? '-',
    })) as SessionRow[]

    setSessions(cleanRows)
  }

  function formatDateTime(value: string) {
    const date = new Date(value)

    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  async function updateSessionStatus(sessionId: string, status: string) {
    if (!tutor) return

    setSavingId(sessionId)
    setMessage('')

    const { error } = await supabase
      .from('lesson_sessions')
      .update({ status })
      .eq('id', sessionId)
      .eq('tutor_id', tutor.id)

    if (error) {
      setMessage(error.message)
      setSavingId('')
      return
    }

    await loadSessions(tutor.id)
    setSavingId('')
  }

  async function updateSessionNotes(
    sessionId: string,
    tutorNotes: string,
    progressSummary: string
  ) {
    if (!tutor) return

    setSavingId(sessionId)
    setMessage('')

    const { error } = await supabase
      .from('lesson_sessions')
      .update({
        tutor_notes: tutorNotes.trim() || null,
        progress_summary: progressSummary.trim() || null,
      })
      .eq('id', sessionId)
      .eq('tutor_id', tutor.id)

    if (error) {
      setMessage(error.message)
      setSavingId('')
      return
    }

    await loadSessions(tutor.id)
    setSavingId('')
  }

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="container">
          <div className="card" style={{ padding: 32 }}>
            <h1 className="page-title">Tutor Sessions</h1>
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
            Tutor Portal
          </p>

          <h1 className="page-title" style={{ marginTop: 10 }}>
            My Sessions
          </h1>

          <p className="page-subtitle">
            View scheduled lessons, join sessions, mark attendance, and record progress.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
            <Link href="/tutor/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>

            <Link href="/tutor/availability" className="btn-primary">
              Manage Availability
            </Link>
          </div>
        </section>

        <section style={{ marginTop: 24 }}>
          {message ? <p>{message}</p> : null}

          {sessions.length === 0 ? (
            <div className="card" style={{ padding: 30, textAlign: 'center' }}>
              <h2 style={{ marginTop: 0 }}>No sessions yet</h2>
              <p className="page-subtitle" style={{ maxWidth: 620, margin: '0 auto' }}>
                Once parents book and pay for lessons assigned to you, sessions will appear here.
              </p>

              <div style={{ marginTop: 20 }}>
                <Link href="/tutor/availability" className="btn-primary">
                  Add Availability
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 18 }}>
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  saving={savingId === session.id}
                  onStatusChange={updateSessionStatus}
                  onSaveNotes={updateSessionNotes}
                  formatDateTime={formatDateTime}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function SessionCard({
  session,
  saving,
  onStatusChange,
  onSaveNotes,
  formatDateTime,
}: {
  session: SessionRow
  saving: boolean
  onStatusChange: (sessionId: string, status: string) => Promise<void>
  onSaveNotes: (
    sessionId: string,
    tutorNotes: string,
    progressSummary: string
  ) => Promise<void>
  formatDateTime: (value: string) => string
}) {
  const [tutorNotes, setTutorNotes] = useState(session.tutor_notes ?? '')
  const [progressSummary, setProgressSummary] = useState(session.progress_summary ?? '')

  return (
    <div className="card" style={{ padding: 26 }}>
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
              <h2 style={{ margin: '0 0 8px', fontSize: 26 }}>
                {session.subject_name}
              </h2>

              <p className="page-subtitle">
                Student: <strong>{session.student_name}</strong>
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
                ? 'Use this link to join and teach the scheduled lesson.'
                : 'The meeting link will appear here once the session is prepared.'}
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

            <button
              type="button"
              className="btn-secondary"
              disabled={saving}
              onClick={() => onStatusChange(session.id, 'completed')}
            >
              Mark Completed
            </button>

            <button
              type="button"
              className="btn-secondary"
              disabled={saving}
              onClick={() => onStatusChange(session.id, 'no_show_parent')}
            >
              Parent No-show
            </button>
          </div>
        </div>

        <div className="panel" style={{ padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>Progress Notes</h3>

          <div className="form-stack">
            <textarea
              placeholder="What was taught today?"
              value={tutorNotes}
              onChange={(e) => setTutorNotes(e.target.value)}
              rows={4}
            />

            <textarea
              placeholder="Progress summary / next focus"
              value={progressSummary}
              onChange={(e) => setProgressSummary(e.target.value)}
              rows={4}
            />

            <button
              type="button"
              className="btn-primary"
              disabled={saving}
              onClick={() => onSaveNotes(session.id, tutorNotes, progressSummary)}
            >
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>
    </div>
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