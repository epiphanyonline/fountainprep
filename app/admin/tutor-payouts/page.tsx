'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type Earning = {
  id: string
  tutor_id: string
  booking_id: string
  tutor_amount: number | null
  lesson_amount: number | null
  platform_fee: number | null
  status: string
  created_at: string
  paid_at: string | null
}

type Tutor = {
  id: string
  full_name: string
}

type TutorGroup = {
  tutor: Tutor
  earnings: Earning[]
  total: number
}

export default function AdminTutorPayoutsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [savingTutorId, setSavingTutorId] = useState('')
  const [message, setMessage] = useState('Loading tutor payouts...')
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [tutors, setTutors] = useState<Record<string, Tutor>>({})

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'ADMIN') {
      router.push('/account')
      return
    }

    const { data: earningRows, error } = await supabase
      .from('tutor_earnings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    const cleanEarnings = (earningRows ?? []) as Earning[]
    setEarnings(cleanEarnings)

    const tutorIds = Array.from(new Set(cleanEarnings.map((e) => e.tutor_id)))

    if (tutorIds.length > 0) {
      const { data: tutorRows } = await supabase
        .from('tutor_profiles')
        .select('id, full_name')
        .in('id', tutorIds)

      const tutorMap: Record<string, Tutor> = {}

      ;((tutorRows ?? []) as Tutor[]).forEach((tutor) => {
        tutorMap[tutor.id] = tutor
      })

      setTutors(tutorMap)
    }

    setMessage('')
    setLoading(false)
  }

  const pendingGroups = useMemo(() => {
    const grouped: Record<string, TutorGroup> = {}

    earnings
      .filter((earning) => earning.status === 'pending')
      .forEach((earning) => {
        const tutor = tutors[earning.tutor_id] || {
          id: earning.tutor_id,
          full_name: 'Tutor',
        }

        if (!grouped[earning.tutor_id]) {
          grouped[earning.tutor_id] = {
            tutor,
            earnings: [],
            total: 0,
          }
        }

        grouped[earning.tutor_id].earnings.push(earning)
        grouped[earning.tutor_id].total += Number(earning.tutor_amount || 0)
      })

    return Object.values(grouped)
  }, [earnings, tutors])

  const paidTotal = useMemo(() => {
    return earnings
      .filter((e) => e.status === 'paid')
      .reduce((sum, e) => sum + Number(e.tutor_amount || 0), 0)
  }, [earnings])

  const pendingTotal = useMemo(() => {
    return earnings
      .filter((e) => e.status === 'pending')
      .reduce((sum, e) => sum + Number(e.tutor_amount || 0), 0)
  }, [earnings])

  async function markTutorPaid(group: TutorGroup) {
    const confirmPay = window.confirm(
      `Mark ${group.tutor.full_name}'s $${group.total.toFixed(
        2
      )} pending earnings as paid?`
    )

    if (!confirmPay) return

    setSavingTutorId(group.tutor.id)
    setMessage('Marking payout as paid...')

    const ids = group.earnings.map((earning) => earning.id)

    const { error } = await supabase
      .from('tutor_earnings')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .in('id', ids)

    if (error) {
      setMessage(error.message)
      setSavingTutorId('')
      return
    }

    await loadData()
    setMessage(`${group.tutor.full_name}'s payout marked as paid.`)
    setSavingTutorId('')
  }

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Admin Payouts</p>
          <h1>Loading tutor payouts...</h1>
          <p className="subtitle">{message}</p>
        </section>

        <style jsx>{styles}</style>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Admin Payouts</p>

        <h1>Review and mark tutor payouts.</h1>

        <p className="subtitle">
          Tutors earn <strong>$4 per completed 1-hour class</strong>. Review
          pending earnings, pay tutors manually, then mark payouts as paid.
        </p>

        <div className="kpiGrid">
          <Kpi label="Pending Payouts" value={`$${pendingTotal.toFixed(2)}`} />
          <Kpi label="Paid Payouts" value={`$${paidTotal.toFixed(2)}`} />
          <Kpi label="Tutors Due" value={String(pendingGroups.length)} />
          <Kpi label="Rate" value="$4/class" />
        </div>

        <div className="actions">
          <Link href="/admin/dashboard" className="secondaryBtn">
            Back to Admin
          </Link>
        </div>
      </section>

      {message ? <div className="notice">{message}</div> : null}

      <section className="card">
        <div className="sectionHead">
          <p className="eyebrow">Pending Tutor Payouts</p>
          <h2>Amounts due</h2>
        </div>

        {pendingGroups.length === 0 ? (
          <div className="empty">
            <h3>No pending payouts</h3>
            <p>Completed tutor earnings awaiting payment will appear here.</p>
          </div>
        ) : (
          <div className="payoutGrid">
            {pendingGroups.map((group) => (
              <article key={group.tutor.id} className="payoutCard">
                <div>
                  <h3>{group.tutor.full_name}</h3>
                  <p>
                    {group.earnings.length} completed lesson
                    {group.earnings.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="amountBox">
                  <span>Amount due</span>
                  <strong>${group.total.toFixed(2)}</strong>
                </div>

                <button
                  type="button"
                  className="primaryBtn full"
                  disabled={savingTutorId === group.tutor.id}
                  onClick={() => markTutorPaid(group)}
                >
                  {savingTutorId === group.tutor.id
                    ? 'Marking Paid...'
                    : 'Mark as Paid'}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="sectionHead">
          <p className="eyebrow">All Earnings</p>
          <h2>Payout history</h2>
        </div>

        {earnings.length === 0 ? (
          <div className="empty">
            <h3>No earnings yet</h3>
            <p>Tutor earnings will appear after completed lesson reports.</p>
          </div>
        ) : (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Tutor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Paid At</th>
                </tr>
              </thead>

              <tbody>
                {earnings.map((earning) => (
                  <tr key={earning.id}>
                    <td>{tutors[earning.tutor_id]?.full_name || 'Tutor'}</td>
                    <td>
                      <strong>
                        ${Number(earning.tutor_amount || 0).toFixed(2)}
                      </strong>
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
                    <td>{formatDate(earning.created_at)}</td>
                    <td>{earning.paid_at ? formatDate(earning.paid_at) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  .card,
  .notice {
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
    border: 0;
    font-family: inherit;
    cursor: pointer;
  }

  .primaryBtn {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
    box-shadow: 0 16px 38px rgba(124,58,237,0.28);
  }

  .primaryBtn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .secondaryBtn {
    background: white;
    color: #351e55;
    border: 1px solid rgba(124,58,237,0.16);
  }

  .full {
    width: 100%;
  }

  .notice {
    margin-top: 18px;
    padding: 15px 17px;
    border-radius: 18px;
    background: #fff7ed;
    color: #9a3412;
    border: 1px solid #fed7aa;
    font-weight: 850;
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

  .sectionHead h2 {
    margin: 10px 0 0;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .payoutGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 18px;
  }

  .payoutCard {
    padding: 24px;
    border-radius: 28px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .payoutCard h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 950;
    letter-spacing: -0.03em;
  }

  .payoutCard p {
    margin: 8px 0 0;
    color: #6f637e;
  }

  .amountBox {
    margin: 20px 0;
    padding: 20px;
    border-radius: 24px;
    background: white;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .amountBox span {
    display: block;
    color: #7a7088;
    font-weight: 850;
  }

  .amountBox strong {
    display: block;
    margin-top: 8px;
    font-size: 42px;
    line-height: 1;
    letter-spacing: -0.05em;
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

  .empty p {
    margin: 10px 0 0;
    color: #6f637e;
    line-height: 1.7;
  }

  .tableWrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;
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