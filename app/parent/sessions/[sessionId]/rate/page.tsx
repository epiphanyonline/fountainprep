'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

type SessionRow = {
  id: string
  booking_id: string
  student_id: string
  tutor_id: string
  subject_id: string
  status: string
  starts_at: string
  student_name: string
  tutor_name: string
  subject_name: string
}

export default function RateSessionPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('Loading...')
  const [parentId, setParentId] = useState('')
  const [session, setSession] = useState<SessionRow | null>(null)

  const [ratingScore, setRatingScore] = useState(5)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: parentProfile } = await supabase
        .from('parent_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!parentProfile) {
        router.push('/parent/onboarding')
        return
      }

      setParentId(parentProfile.id)

      const { data: sessionRow, error } = await supabase
        .from('lesson_sessions')
        .select(`
          id,
          booking_id,
          student_id,
          tutor_id,
          subject_id,
          status,
          starts_at,
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
        .eq('id', sessionId)
        .maybeSingle()

      if (error || !sessionRow) {
        setMessage('Session not found.')
        setLoading(false)
        return
      }

      const { data: bookingRow } = await supabase
        .from('bookings')
        .select('parent_id')
        .eq('id', sessionRow.booking_id)
        .maybeSingle()

      if (!bookingRow || bookingRow.parent_id !== parentProfile.id) {
        setMessage('You do not have access to rate this session.')
        setLoading(false)
        return
      }

      if (sessionRow.status !== 'completed') {
        setMessage('Only completed sessions can be rated.')
        setLoading(false)
        return
      }

      const { data: existingRating } = await supabase
        .from('lesson_session_ratings')
        .select('id')
        .eq('lesson_session_id', sessionId)
        .maybeSingle()

      if (existingRating) {
        setMessage('This session has already been rated.')
        setLoading(false)
        return
      }

      const cleanSession = {
        id: sessionRow.id,
        booking_id: sessionRow.booking_id,
        student_id: sessionRow.student_id,
        tutor_id: sessionRow.tutor_id,
        subject_id: sessionRow.subject_id,
        status: sessionRow.status,
        starts_at: sessionRow.starts_at,
        student_name: Array.isArray((sessionRow as any).student_profiles)
          ? (sessionRow as any).student_profiles[0]?.full_name ?? '-'
          : (sessionRow as any).student_profiles?.full_name ?? '-',
        tutor_name: Array.isArray((sessionRow as any).tutor_profiles)
          ? (sessionRow as any).tutor_profiles[0]?.full_name ?? '-'
          : (sessionRow as any).tutor_profiles?.full_name ?? '-',
        subject_name: Array.isArray((sessionRow as any).subjects)
          ? (sessionRow as any).subjects[0]?.name ?? '-'
          : (sessionRow as any).subjects?.name ?? '-',
      } as SessionRow

      setSession(cleanSession)
      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [router, sessionId])

  async function handleSubmitRating(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!session || !parentId) return

    setSaving(true)
    setMessage('')

    const { error } = await supabase.from('lesson_session_ratings').insert({
      lesson_session_id: session.id,
      booking_id: session.booking_id,
      parent_id: parentId,
      student_id: session.student_id,
      tutor_id: session.tutor_id,
      rating_score: ratingScore,
      private_feedback: feedback.trim() || null,
    })

    if (error) {
      setMessage(error.message)
      setSaving(false)
      return
    }

    router.push('/parent/sessions')
  }

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="card" style={{ padding: 32 }}>
            <h1 className="page-title">Rate Session</h1>
            <p>{message}</p>
          </div>
        </div>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="page-wrap">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="card" style={{ padding: 32 }}>
            <h1 className="page-title">Rate Session</h1>
            <p>{message}</p>

            <div style={{ marginTop: 20 }}>
              <Link href="/parent/sessions" className="btn-secondary">
                Back to Lessons
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 760 }}>
        <form className="card" style={{ padding: 34 }} onSubmit={handleSubmitRating}>
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 800 }}>
            Session Feedback
          </p>

          <h1 className="page-title" style={{ marginTop: 10 }}>
            Rate this lesson
          </h1>

          <p className="page-subtitle">
            Help us maintain tutor quality after every completed session.
          </p>

          <div className="panel" style={{ padding: 18, marginTop: 22 }}>
            <p style={{ margin: 0, fontWeight: 900 }}>
              {session.subject_name}
            </p>
            <p className="page-subtitle" style={{ marginTop: 8 }}>
              Student: {session.student_name} • Tutor: {session.tutor_name}
            </p>
          </div>

          <div style={{ marginTop: 24 }}>
            <label style={{ fontWeight: 800 }}>Rating</label>

            <select
              value={ratingScore}
              onChange={(e) => setRatingScore(Number(e.target.value))}
              style={{ marginTop: 8 }}
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Very good</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Fair</option>
              <option value={1}>1 - Poor</option>
            </select>
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={{ fontWeight: 800 }}>Private feedback</label>
            <textarea
              placeholder="Share your feedback about this session"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              style={{ marginTop: 8 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
            <button className="btn-primary" disabled={saving}>
              {saving ? 'Submitting...' : 'Submit Rating'}
            </button>

            <Link href="/parent/sessions" className="btn-secondary">
              Cancel
            </Link>
          </div>

          {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
        </form>
      </div>
    </main>
  )
}