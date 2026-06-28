'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type Interview = {
  id: string
  candidate_email: string | null
  candidate_name: string | null
  interview_date: string | null
  interview_time: string | null
  timezone: string | null
  meeting_link: string | null
  status: string | null
}

export default function InterviewJoinPage() {
  const params = useParams()
  const interviewId = params?.interviewId as string

  const [interview, setInterview] = useState<Interview | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadInterview() {
      try {
        const token =
  typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('token')
    : ''

const { data: sessionData } = await supabase.auth.getSession()

const res = await fetch(`/api/interviews/${interviewId}?token=${token || ''}`, {
  cache: 'no-store',
  headers: sessionData.session?.access_token
    ? {
        Authorization: `Bearer ${sessionData.session.access_token}`,
      }
    : {},
})

        const data = await res.json()

        if (!res.ok) {
          setErrorMessage(data?.error || 'Interview not found.')
          return
        }

        setInterview(data.interview)
      } catch {
        setErrorMessage('Unable to load this interview.')
      } finally {
        setLoading(false)
      }
    }

    if (interviewId) loadInterview()
  }, [interviewId])

  if (loading) {
    return <main className="interviewPage">Loading interview...</main>
  }

  if (errorMessage || !interview) {
    return (
      <main className="interviewPage">
        <div className="card errorCard">
          <h1>Interview unavailable</h1>
          <p>{errorMessage}</p>
          <Link href="/">Back to Fountain Prep</Link>
        </div>

        <style jsx>{styles}</style>
      </main>
    )
  }

  return (
    <main className="interviewPage">
      <section className="card">
        <div className="left">
          <p className="badge">Fountain Prep Interview</p>
          <h1>Join your tutor interview</h1>
          <p>
            This secure interview page confirms your appointment and opens your
            Fountain Prep interview room.
          </p>

          <div className="miniGrid">
            <div>
              <span>Interview type</span>
              <strong>Tutor onboarding</strong>
            </div>

            <div>
              <span>Format</span>
              <strong>Online meeting</strong>
            </div>
          </div>
        </div>

        <div className="right">
          <p className="eyebrow">Interview confirmed</p>

          <h2>
            {interview.candidate_name
              ? `Hello ${interview.candidate_name}`
              : 'Your interview is ready'}
          </h2>

          <div className="infoBox">
            <Info label="Date and time" value={`${formatDate(interview.interview_date)} at ${formatTime(interview.interview_time)}`} />
            <Info label="Timezone" value={interview.timezone || 'Europe/London'} />
            <Info label="Status" value={formatStatus(interview.status)} />
            {interview.candidate_email && (
              <Info label="Candidate email" value={interview.candidate_email} />
            )}
          </div>

          <div className="prepBox">
            <strong>Before you join</strong>
            <ul>
              <li>Use a quiet space with good internet.</li>
              <li>Keep your CV or teaching details nearby.</li>
              <li>Join a few minutes before the scheduled time.</li>
            </ul>
          </div>

          <a
            href={interview.meeting_link || `https://meet.jit.si/fountainprep-interview-${interview.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="joinButton"
          >
            Join Interview
          </a>

          <Link href="/" className="backLink">
            Back to Fountain Prep
          </Link>
        </div>
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function formatDate(value?: string | null) {
  if (!value) return 'Date to be confirmed'

  try {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function formatTime(value?: string | null) {
  if (!value) return 'Time to be confirmed'
  return value.slice(0, 5)
}

function formatStatus(value?: string | null) {
  if (!value) return 'Scheduled'

  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const styles = `
  .interviewPage {
    min-height: 100vh;
    padding: 40px 18px;
    background:
      radial-gradient(circle at top left, rgba(124,58,237,.16), transparent 32%),
      linear-gradient(135deg,#fffaff,#f5edff 55%,#fff);
    color: #1f1235;
  }

  .card {
    width: min(1120px, 100%);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 0.9fr;
    overflow: hidden;
    border-radius: 34px;
    background: white;
    border: 1px solid rgba(124,58,237,.14);
    box-shadow: 0 30px 90px rgba(31,18,53,.16);
  }

  .left {
    padding: 56px;
    color: white;
    background: linear-gradient(145deg,#25123d,#6d28d9);
  }

  .badge {
    display: inline-flex;
    margin: 0 0 34px;
    padding: 10px 15px;
    border-radius: 999px;
    background: rgba(255,255,255,.12);
    font-weight: 900;
  }

  h1 {
    margin: 0;
    font-size: clamp(42px, 5vw, 68px);
    line-height: .95;
    letter-spacing: -.06em;
  }

  .left > p:not(.badge) {
    max-width: 580px;
    margin-top: 24px;
    color: rgba(255,255,255,.78);
    font-size: 18px;
    line-height: 1.8;
  }

  .miniGrid {
    margin-top: 44px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  .miniGrid div {
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.16);
  }

  .miniGrid span,
  .info span {
    display: block;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .14em;
  }

  .miniGrid span {
    color: rgba(255,255,255,.65);
  }

  .miniGrid strong {
    display: block;
    margin-top: 7px;
    font-size: 17px;
  }

  .right {
    padding: 52px;
  }

  .eyebrow {
    margin: 0 0 14px;
    color: #6d28d9;
    font-size: 12px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .18em;
  }

  h2 {
    margin: 0;
    font-size: clamp(30px, 4vw, 44px);
    line-height: 1.05;
    letter-spacing: -.045em;
  }

  .infoBox {
    margin-top: 30px;
    display: grid;
    gap: 12px;
  }

  .info {
    padding: 17px;
    border-radius: 20px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,.12);
  }

  .info span {
    color: #7c3aed;
  }

  .info strong {
    display: block;
    margin-top: 6px;
    overflow-wrap: anywhere;
  }

  .prepBox {
    margin-top: 24px;
    padding: 22px;
    border-radius: 24px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,.14);
  }

  .prepBox ul {
    margin-bottom: 0;
    color: #6f637e;
    line-height: 1.75;
  }

  .joinButton {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 58px;
    border-radius: 999px;
    color: white;
    text-decoration: none;
    font-weight: 950;
    background: linear-gradient(135deg,#7c3aed,#8b5cf6);
    box-shadow: 0 20px 42px rgba(124,58,237,.25);
  }

  .backLink {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    color: #351e55;
    font-weight: 850;
    text-decoration: none;
  }

  .errorCard {
    display: block;
    padding: 38px;
  }

  @media (max-width: 900px) {
    .interviewPage {
      padding: 18px 12px 40px;
    }

    .card {
      grid-template-columns: 1fr;
      border-radius: 28px;
    }

    .left,
    .right {
      padding: 30px 22px;
    }

    .miniGrid {
      grid-template-columns: 1fr;
    }
  }
`