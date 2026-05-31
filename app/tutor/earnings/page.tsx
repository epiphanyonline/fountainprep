'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type TutorProfile = {
  id: string
  full_name: string
}

type Earning = {
  id: string
  tutor_id: string
  booking_id: string
  lesson_amount: number | null
  platform_fee: number | null
  tutor_amount: number | null
  status: string
  created_at: string
  paid_at: string | null
  lesson_date?: string | null
}

const TUTOR_RATE_USD = 4

export default function TutorEarningsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading earnings...')
  const [tutor, setTutor] = useState<TutorProfile | null>(null)
  const [earnings, setEarnings] = useState<Earning[]>([])

  useEffect(() => {
    async function loadEarnings() {
      setLoading(true)

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

      const { data, error } = await supabase
        .from('tutor_earnings')
        .select('*')
        .eq('tutor_id', tutorProfile.id)
        .order('created_at', { ascending: false })

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      setEarnings((data ?? []) as Earning[])
      setMessage('')
      setLoading(false)
    }

    loadEarnings()
  }, [router])

  const pendingTotal = useMemo(
    () =>
      earnings
        .filter((e) => e.status === 'pending')
        .reduce((sum, e) => sum + Number(e.tutor_amount || 0), 0),
    [earnings]
  )

  const paidTotal = useMemo(
    () =>
      earnings
        .filter((e) => e.status === 'paid')
        .reduce((sum, e) => sum + Number(e.tutor_amount || 0), 0),
    [earnings]
  )

  const lifetimeTotal = useMemo(
    () => earnings.reduce((sum, e) => sum + Number(e.tutor_amount || 0), 0),
    [earnings]
  )

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Tutor Earnings</p>
          <h1>Loading your earnings...</h1>
          <p className="subtitle">{message}</p>
        </section>

        <style jsx>{styles}</style>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Tutor Earnings</p>

        <h1>
          {tutor?.full_name ? `${tutor.full_name.split(' ')[0]}, ` : ''}
          track your lesson earnings.
        </h1>

        <p className="subtitle">
          Tutors are paid <strong>${TUTOR_RATE_USD} per completed 1-hour class</strong>.
          Earnings become pending after a lesson is completed and reviewed for payout.
        </p>

        <div className="kpiGrid">
          <Kpi label="Pending Earnings" value={`$${pendingTotal.toFixed(2)}`} />
          <Kpi label="Paid Earnings" value={`$${paidTotal.toFixed(2)}`} />
          <Kpi label="Lifetime Earnings" value={`$${lifetimeTotal.toFixed(2)}`} />
          <Kpi label="Rate Per Class" value={`$${TUTOR_RATE_USD}`} />
        </div>

        <div className="actions">
          <Link href="/tutor/dashboard" className="secondaryBtn">
            Back to Dashboard
          </Link>

          <Link href="/tutor/sessions" className="primaryBtn">
            View Lessons
          </Link>
        </div>
      </section>

      <section className="card">
        <div className="sectionHead">
          <p className="eyebrow">Earnings History</p>
          <h2>Completed lesson payouts</h2>
        </div>

        {earnings.length === 0 ? (
          <div className="empty">
            <h3>No earnings yet</h3>
            <p>
              Earnings will appear here after you complete a confirmed lesson and
              submit the lesson report.
            </p>
            <Link href="/tutor/sessions" className="primaryBtn">
              Go to Lessons
            </Link>
          </div>
        ) : (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Lesson Pay</th>
                  <th>Status</th>
                  <th>Paid At</th>
                </tr>
              </thead>

              <tbody>
                {earnings.map((earning) => (
                  <tr key={earning.id}>
                    <td>{formatDate(earning.lesson_date || earning.created_at)}</td>
                    <td>
                      <strong>${Number(earning.tutor_amount || 0).toFixed(2)}</strong>
                    </td>
                    <td>
                      <span
                        className={
                          earning.status === 'paid'
                            ? 'status paid'
                            : 'status pending'
                        }
                      >
                        {earning.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td>{earning.paid_at ? formatDate(earning.paid_at) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card noteCard">
        <p className="eyebrow">How payouts work</p>
        <h2>Simple weekly or monthly payout review.</h2>
        <p>
          Completed lessons are added as pending earnings. Fountain Prep admin can
          review pending balances, pay tutors manually, and mark earnings as paid
          after transfer.
        </p>
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="kpi">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function formatDate(dateString: string | null) {
  if (!dateString) return '-'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

const styles = `
  .page {
    min-height: 100vh;
    padding: 42px 18px 90px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 30%),
      linear-gradient(180deg, #ffffff, #fbf8ff 45%, #f4edff);
    color: #21152d;
  }

  .hero,
  .card {
    max-width: 1180px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero {
    padding: 48px;
    border-radius: 40px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,239,255,0.96));
    border: 1px solid rgba(126,87,194,0.14);
    box-shadow: 0 30px 90px rgba(71,43,117,0.12);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-weight: 950;
    font-size: 14px;
  }

  h1 {
    margin: 14px 0 0;
    max-width: 860px;
    font-size: clamp(42px, 6vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .subtitle {
    max-width: 780px;
    margin: 20px 0 0;
    color: #6f637e;
    font-size: 18px;
    line-height: 1.75;
  }

  .subtitle strong {
    color: #241535;
  }

  .kpiGrid {
    margin-top: 32px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  .kpi {
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(124,58,237,0.12);
    box-shadow: 0 18px 45px rgba(71,43,117,0.07);
  }

  .kpi span {
    display: block;
    color: #7a7088;
    font-weight: 850;
    font-size: 14px;
  }

  .kpi strong {
    display: block;
    margin-top: 8px;
    font-size: 34px;
    line-height: 1;
    letter-spacing: -0.05em;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 30px;
  }

  .primaryBtn,
  .secondaryBtn {
    min-height: 54px;
    padding: 0 24px;
    border-radius: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-weight: 950;
  }

  .primaryBtn {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
    box-shadow: 0 16px 38px rgba(124,58,237,0.28);
  }

  .secondaryBtn {
    background: white;
    color: #351e55;
    border: 1px solid rgba(124,58,237,0.16);
  }

  .card {
    margin-top: 28px;
    padding: 32px;
    border-radius: 34px;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(126,87,194,0.12);
    box-shadow: 0 24px 70px rgba(71,43,117,0.09);
  }

  .sectionHead {
    margin-bottom: 24px;
  }

  .sectionHead h2,
  .noteCard h2 {
    margin: 10px 0 0;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .empty {
    padding: 26px;
    border-radius: 24px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .empty h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 950;
  }

  .empty p,
  .noteCard p {
    margin: 10px 0 20px;
    color: #6f637e;
    line-height: 1.7;
  }

  .tableWrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 620px;
  }

  th {
    text-align: left;
    padding: 14px;
    color: #7a7088;
    font-size: 13px;
    font-weight: 950;
    border-bottom: 1px solid rgba(124,58,237,0.12);
  }

  td {
    padding: 16px 14px;
    border-bottom: 1px solid rgba(124,58,237,0.08);
    color: #241535;
  }

  .status {
    display: inline-flex;
    padding: 8px 12px;
    border-radius: 999px;
    font-weight: 950;
    font-size: 12px;
  }

  .paid {
    background: #ecfdf3;
    color: #027a48;
  }

  .pending {
    background: #fff7ed;
    color: #9a3412;
  }

  @media (max-width: 900px) {
    .page {
      padding: 26px 12px 70px;
    }

    .hero {
      padding: 32px 20px;
      border-radius: 30px;
    }

    h1 {
      font-size: clamp(38px, 12vw, 56px);
    }

    .subtitle {
      font-size: 16px;
    }

    .kpiGrid {
      grid-template-columns: 1fr;
    }

    .actions {
      flex-direction: column;
    }

    .primaryBtn,
    .secondaryBtn {
      width: 100%;
    }

    .card {
      padding: 24px 20px;
      border-radius: 28px;
    }
  }
`