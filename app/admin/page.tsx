'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

type Booking = {
  id: string
  parent_id: string
  student_id: string
  tutor_id: string | null
  subject_id: string
  plan_id: string
  lesson_date: string | null
  lesson_time: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  meeting_link: string | null
  created_at: string | null
}

type Payment = {
  id: string
  booking_id: string
  payment_status: string
  amount: number | null
  currency: string | null
  created_at: string | null
}

type Tutor = {
  id: string
  full_name: string
  approval_status: string
  verification_status: string
  is_listed: boolean
}

type TutorEarning = {
  id: string
  tutor_id: string
  booking_id: string
  tutor_amount: number | string | null
  status: string
  created_at: string | null
  paid_at: string | null
  lesson_date: string | null
}

const subjectLabels: Record<string, string> = {
  maths: 'Maths',
  english: 'English',
  science: 'Science',
  coding: 'Coding',
  music: 'Music',
  yoruba: 'Yoruba',
  igbo: 'Igbo',
  hausa: 'Hausa',
}

const adminActions = [
  {
    title: 'Tutor Approval',
    text: 'Review tutor applications, verification and listing status.',
    href: '/admin/tutors',
    tag: 'Tutors',
  },
  {
    title: 'Bookings Control',
    text: 'Track parent bookings, lesson status and meeting links.',
    href: '/admin/bookings',
    tag: 'Lessons',
  },
  {
    title: 'Tutor Payouts',
    text: 'Approve pending tutor earnings after completed lessons.',
    href: '/admin/tutor-payouts',
    tag: 'Payouts',
  },
  {
    title: 'Reports',
    text: 'Review lesson reports and learning progress activity.',
    href: '/admin/reports',
    tag: 'Quality',
  },
]

const controlLinks = [
  { label: 'Parents', href: '/admin/parents' },
  { label: 'Students', href: '/admin/students' },
  { label: 'Tutor Payouts', href: '/admin/tutor-payouts' },
  { label: 'Bookings', href: '/admin/bookings' },
  { label: 'Payments', href: '/admin/payments' },
  { label: 'Reports', href: '/admin/reports' },
]

export default function AdminDashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading admin dashboard...')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [tutorEarnings, setTutorEarnings] = useState<TutorEarning[]>([])
  const [parentCount, setParentCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)

  useEffect(() => {
    async function loadAdminDashboard() {
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
        .maybeSingle()

      if (!userProfile || userProfile.role !== 'ADMIN') {
        router.push('/account')
        return
      }

      const { data: bookingRows } = await supabase
        .from('lesson_bookings')
        .select(`
          id,
          parent_id,
          student_id,
          tutor_id,
          subject_id,
          plan_id,
          lesson_date,
          lesson_time,
          status,
          payment_status,
          amount_gbp,
          meeting_link,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      const { data: paymentRows } = await supabase
        .from('payments')
        .select('id, booking_id, payment_status, amount, currency, created_at')
        .order('created_at', { ascending: false })
        .limit(20)

      const { data: tutorEarningRows, error: tutorEarningError } = await supabase
  .from('tutor_earnings')
  .select('id, tutor_id, booking_id, tutor_amount, status, created_at, paid_at, lesson_date')
  .order('created_at', { ascending: false })
  .limit(50)

if (tutorEarningError) {
  console.error('Tutor earnings error:', tutorEarningError.message)
}
      const { data: tutorRows } = await supabase
        .from('tutor_profiles')
        .select('id, full_name, approval_status, verification_status, is_listed')
        .order('created_at', { ascending: false })

      const { count: parentsTotal } = await supabase
        .from('parent_profiles')
        .select('*', { count: 'exact', head: true })

      const { count: studentsTotal } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true })

      setBookings((bookingRows ?? []) as Booking[])
      setPayments((paymentRows ?? []) as Payment[])
      setTutorEarnings((tutorEarningRows ?? []) as TutorEarning[])
      setTutors((tutorRows ?? []) as Tutor[])
      setParentCount(parentsTotal ?? 0)
      setStudentCount(studentsTotal ?? 0)
      setMessage('')
      setLoading(false)
    }

    loadAdminDashboard()
  }, [router])

  const paidBookings = useMemo(
    () => bookings.filter((b) => b.payment_status === 'PAID' || b.status === 'CONFIRMED'),
    [bookings]
  )

  const pendingParentPayments = useMemo(
    () => bookings.filter((b) => b.payment_status !== 'PAID'),
    [bookings]
  )

  const missingMeetingLinks = useMemo(
    () => paidBookings.filter((b) => !b.meeting_link),
    [paidBookings]
  )

  const approvedTutors = useMemo(
    () =>
      tutors.filter(
        (t) =>
          t.approval_status === 'approved' &&
          t.verification_status === 'verified' &&
          t.is_listed
      ),
    [tutors]
  )

  const pendingTutors = useMemo(
    () => tutors.filter((t) => t.approval_status !== 'approved' || !t.is_listed),
    [tutors]
  )

  const pendingTutorPayouts = useMemo(
  () =>
    tutorEarnings.filter(
      (earning) => String(earning.status || '').trim().toLowerCase() === 'pending'
    ),
  [tutorEarnings]
)

  const paidTutorPayouts = useMemo(
  () =>
    tutorEarnings.filter(
      (earning) => String(earning.status || '').trim().toLowerCase() === 'paid'
    ),
  [tutorEarnings]
)

  const pendingTutorPayoutAmount = useMemo(() => {
    return pendingTutorPayouts.reduce(
      (total, earning) => total + Number(earning.tutor_amount || 0),
      0
    )
  }, [pendingTutorPayouts])

  const paidTutorPayoutAmount = useMemo(() => {
    return paidTutorPayouts.reduce(
      (total, earning) => total + Number(earning.tutor_amount || 0),
      0
    )
  }, [paidTutorPayouts])

  const revenue = useMemo(() => {
    return payments
      .filter((payment) => payment.payment_status?.toLowerCase() === 'paid')
      .reduce((total, payment) => total + Number(payment.amount || 0), 0)
  }, [payments])

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Admin Control Centre</p>
          <h1>Loading platform activity...</h1>
          <p className="subtitle">{message}</p>
        </section>

        <style jsx global>{styles}</style>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="heroTop">
          <p className="eyebrow">Admin Control Centre</p>
          <Link href="/admin/tutor-payouts" className="miniLink">
            Tutor Payouts
          </Link>
        </div>

        <h1>Platform command centre</h1>

        <p className="subtitle">
          Monitor bookings, payments, tutor payouts, reports, parents, students
          and operational activity from one premium admin workspace.
        </p>

        <div className="heroActions">
          <Link href="/admin/tutor-payouts" className="primaryLink">
            Review Tutor Payouts
          </Link>
          <Link href="/admin/tutors" className="secondaryLink">
            Review Tutors
          </Link>
          <Link href="/admin/bookings" className="secondaryLink">
            Manage Bookings
          </Link>
        </div>

        <div className="kpiGrid">
          <Kpi label="Bookings" value={String(bookings.length)} />
          <Kpi label="Confirmed" value={String(paidBookings.length)} />
          <Kpi label="Parent Pending" value={String(pendingParentPayments.length)} />
          <Kpi label="Revenue" value={`£${revenue.toFixed(2)}`} />
          <Kpi label="Tutor Payouts" value={`$${pendingTutorPayoutAmount.toFixed(2)}`} />
          <Kpi label="Payout Items" value={String(pendingTutorPayouts.length)} />
          <Kpi label="Parents" value={String(parentCount)} />
          <Kpi label="Students" value={String(studentCount)} />
          <Kpi label="Earning Rows" value={String(tutorEarnings.length)} />
        </div>
      </section>

      <section className="quickGrid">
        {adminActions.map((item) => (
          <Link href={item.href} className="quickCard" key={item.title}>
            <span>{item.tag}</span>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </Link>
        ))}
      </section>

      <section className="mainGrid">
        <div className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Tutor Payout Queue</p>
              <h2>Completed lessons awaiting payout</h2>
            </div>

            <Link href="/admin/tutor-payouts" className="smallLink">
              Open payouts
            </Link>
          </div>

          {pendingTutorPayouts.length === 0 ? (
            <Empty
              title="No tutor payouts pending"
              text="When tutors submit lesson reports and earnings are created, pending payouts will appear here."
            />
          ) : (
            <div className="list">
              {pendingTutorPayouts.slice(0, 8).map((earning) => (
                <PayoutRow key={earning.id} earning={earning} />
              ))}
            </div>
          )}
        </div>

        <aside className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Platform Health</p>
              <h2>Action checks</h2>
            </div>
          </div>

          <div className="healthList">
            <HealthRow label="Pending tutor payouts" value={pendingTutorPayouts.length} tone="warning" />
            <HealthRow label="Tutor reviews" value={pendingTutors.length} tone="warning" />
            <HealthRow label="Parent pending payments" value={pendingParentPayments.length} tone="warning" />
            <HealthRow label="Missing meeting links" value={missingMeetingLinks.length} tone="danger" />
            <HealthRow label="Listed tutors" value={approvedTutors.length} tone="good" />
          </div>

          <Link href="/admin/tutor-payouts" className="primaryLink fullLink">
            Open Payout Review
          </Link>
        </aside>
      </section>

      <section className="splitGrid">
        <div className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Recent Bookings</p>
              <h2>Latest parent lesson activity</h2>
            </div>

            <Link href="/admin/bookings" className="smallLink">
              View all
            </Link>
          </div>

          {bookings.length === 0 ? (
            <Empty
              title="No bookings yet"
              text="Parent bookings will appear here once lessons are scheduled."
            />
          ) : (
            <div className="list">
              {bookings.slice(0, 6).map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Tutor Status</p>
              <h2>Tutor pipeline</h2>
            </div>

            <Link href="/admin/tutors" className="smallLink">
              Manage
            </Link>
          </div>

          <div className="profileList">
            <ProfileRow label="Total Tutors" value={String(tutors.length)} />
            <ProfileRow label="Approved + Listed" value={String(approvedTutors.length)} />
            <ProfileRow label="Needs Review" value={String(pendingTutors.length)} />
            <ProfileRow label="Paid Payouts" value={`$${paidTutorPayoutAmount.toFixed(2)}`} />
          </div>
        </div>
      </section>

      <section className="splitGrid">
        <div className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Families</p>
              <h2>Parent and student growth</h2>
            </div>
          </div>

          <div className="familyGrid">
            <div>
              <span>Parents</span>
              <strong>{parentCount}</strong>
            </div>
            <div>
              <span>Students</span>
              <strong>{studentCount}</strong>
            </div>
          </div>

          <div className="dualActions">
            <Link href="/admin/parents" className="secondaryLink">
              Parents
            </Link>
            <Link href="/admin/students" className="secondaryLink">
              Students
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Finance Summary</p>
              <h2>Parent money vs tutor payout</h2>
            </div>
          </div>

          <div className="financeGrid">
            <div>
              <span>Parent revenue</span>
              <strong>£{revenue.toFixed(2)}</strong>
            </div>
            <div>
              <span>Pending tutor payout</span>
              <strong>${pendingTutorPayoutAmount.toFixed(2)}</strong>
            </div>
            <div>
              <span>Paid tutor payout</span>
              <strong>${paidTutorPayoutAmount.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">Payment Activity</p>
            <h2>Recent parent payment records</h2>
          </div>

          <Link href="/admin/payments" className="smallLink">
            View payments
          </Link>
        </div>

        {payments.length === 0 ? (
          <Empty title="No payment activity yet" text="Stripe payment records will appear here." />
        ) : (
          <div className="paymentGrid">
            {payments.slice(0, 8).map((payment) => (
              <div key={payment.id} className="paymentCard">
                <p className="paymentAmount">
                  {(payment.currency || 'GBP').toUpperCase()} {Number(payment.amount || 0).toFixed(2)}
                </p>
                <p className="rowMeta">Booking: {payment.booking_id.slice(0, 8)}...</p>
                <StatusBadge status={payment.payment_status} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">Control Navigation</p>
            <h2>Admin pages</h2>
          </div>
        </div>

        <div className="controlGrid">
          {controlLinks.map((item) => (
            <Link href={item.href} key={item.href} className="controlLink">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <style jsx global>{styles}</style>
    </main>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="kpiCard">
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  )
}

function BookingRow({ booking }: { booking: Booking }) {
  return (
    <div className="rowCard">
      <div>
        <p className="rowTitle">
          {subjectLabels[booking.subject_id] || booking.subject_id}
        </p>
        <p className="rowMeta">
          {formatDate(booking.lesson_date)} • {booking.lesson_time || 'Time pending'}
        </p>
        <p className="rowMeta">
          Tutor: {booking.tutor_id ? 'Assigned' : 'Not assigned'} • Meeting:{' '}
          {booking.meeting_link ? 'Ready' : 'Missing'}
        </p>
      </div>

      <StatusBadge status={booking.payment_status} />
    </div>
  )
}

function PayoutRow({ earning }: { earning: TutorEarning }) {
  return (
    <div className="rowCard payoutRow">
      <div>
        <p className="rowTitle">${Number(earning.tutor_amount || 0).toFixed(2)} tutor payout</p>
        <p className="rowMeta">
          Lesson: {formatDate(earning.lesson_date)} • Booking: {earning.booking_id.slice(0, 8)}...
        </p>
        <p className="rowMeta">
          Created: {formatDateTime(earning.created_at)} • Status: {earning.status}
        </p>
      </div>

      <StatusBadge status={earning.status} />
    </div>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="profileRow">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function HealthRow({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'good' | 'warning' | 'danger'
}) {
  return (
    <div className={`healthRow ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const clean = status?.toLowerCase()
  const paid = clean === 'paid' || status === 'PAID'
  const pending = clean === 'pending'

  return (
    <span
      className={
        paid
          ? 'statusBadge statusPaid'
          : pending
            ? 'statusBadge statusTutorPending'
            : 'statusBadge statusPending'
      }
    >
      {paid ? 'Paid' : pending ? 'Pending' : status || 'Pending'}
    </span>
  )
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="emptyState">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

function formatDate(date: string | null) {
  if (!date) return 'Date pending'

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${date}T00:00:00`))
}

function formatDateTime(date: string | null) {
  if (!date) return 'Date pending'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

const styles = `
  .page {
    min-height: 100vh;
    padding: 34px 16px 90px;
    color: #21152d;
    background:
      radial-gradient(circle at 8% 0%, rgba(124, 58, 237, 0.14), transparent 30%),
      radial-gradient(circle at 92% 5%, rgba(236, 72, 153, 0.08), transparent 28%),
      linear-gradient(180deg, #fffaff 0%, #fbf8ff 44%, #f4edff 100%);
  }

  .hero,
  .quickGrid,
  .mainGrid,
  .splitGrid,
  .cardWide {
    width: min(1180px, 100%);
    margin-left: auto;
    margin-right: auto;
  }

  .hero {
    padding: 42px;
    border-radius: 38px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,239,255,0.96));
    border: 1px solid rgba(126,87,194,0.14);
    box-shadow: 0 30px 90px rgba(71,43,117,0.12);
  }

  .heroTop,
  .sectionHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
  }

  .eyebrow,
  .sectionEyebrow {
    margin: 0;
    color: #6d28d9;
    font-size: 14px;
    font-weight: 950;
  }

  .hero h1 {
    margin: 16px 0 0;
    max-width: 900px;
    font-size: clamp(42px, 6.4vw, 76px);
    line-height: 0.95;
    letter-spacing: -0.065em;
    font-weight: 950;
  }

  .subtitle {
    max-width: 790px;
    margin: 20px 0 0;
    color: #6f637e;
    font-size: 17.5px;
    line-height: 1.75;
  }

  .heroActions,
  .dualActions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 28px;
  }

  .primaryLink,
  .secondaryLink,
  .smallLink,
  .miniLink {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-weight: 950;
  }

  .primaryLink,
  .secondaryLink {
    min-height: 54px;
    padding: 0 22px;
    border-radius: 18px;
  }

  .primaryLink {
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 16px 38px rgba(124,58,237,0.28);
  }

  .secondaryLink,
  .smallLink,
  .miniLink {
    color: #351e55;
    background: white;
    border: 1px solid rgba(124,58,237,0.16);
  }

  .smallLink,
  .miniLink {
    min-height: 42px;
    padding: 0 15px;
    border-radius: 999px;
    font-size: 13px;
  }

  .kpiGrid {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .kpiCard,
  .quickCard,
  .card,
  .cardWide {
    background: rgba(255,255,255,0.94);
    border: 1px solid rgba(126,87,194,0.12);
    box-shadow: 0 22px 62px rgba(71,43,117,0.08);
  }

  .kpiCard {
    padding: 19px;
    border-radius: 23px;
  }

  .kpiCard p {
    margin: 0;
    color: #7a7088;
    font-size: 13px;
    font-weight: 850;
  }

  .kpiCard h2 {
    margin: 8px 0 0;
    font-size: 31px;
    line-height: 1;
    letter-spacing: -0.05em;
    font-weight: 950;
  }

  .quickGrid {
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .quickCard {
    min-height: 185px;
    padding: 23px;
    border-radius: 28px;
    color: inherit;
    text-decoration: none;
  }

  .quickCard span {
    display: inline-flex;
    padding: 8px 11px;
    border-radius: 999px;
    background: rgba(124,58,237,0.09);
    color: #6d28d9;
    font-size: 12px;
    font-weight: 950;
  }

  .quickCard h2 {
    margin: 18px 0 0;
    font-size: 22px;
    line-height: 1.12;
    letter-spacing: -0.035em;
    font-weight: 950;
  }

  .quickCard p {
    margin: 10px 0 0;
    color: #6f637e;
    font-size: 14.5px;
    line-height: 1.6;
  }

  .mainGrid,
  .splitGrid {
    margin-top: 24px;
    display: grid;
    grid-template-columns: 1.25fr 0.75fr;
    gap: 24px;
  }

  .splitGrid {
    grid-template-columns: 1fr 1fr;
  }

  .card,
  .cardWide {
    padding: 30px;
    border-radius: 32px;
  }

  .cardWide {
    margin-top: 24px;
  }

  .sectionHeader {
    margin-bottom: 22px;
  }

  .sectionHeader h2 {
    margin: 8px 0 0;
    font-size: clamp(26px, 3.3vw, 42px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .list,
  .healthList,
  .profileList {
    display: grid;
    gap: 14px;
  }

  .rowCard,
  .paymentCard,
  .emptyState,
  .familyGrid div,
  .financeGrid div,
  .healthRow {
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .rowCard {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 18px;
    border-radius: 22px;
  }

  .payoutRow {
    background: linear-gradient(135deg, #fbf8ff, #fff7ed);
  }

  .rowTitle {
    margin: 0;
    font-size: 18px;
    font-weight: 950;
  }

  .rowMeta {
    margin: 7px 0 0;
    color: #6f637e;
    font-size: 14px;
    line-height: 1.45;
  }

  .statusBadge {
    align-self: flex-start;
    padding: 8px 11px;
    border-radius: 999px;
    font-weight: 950;
    font-size: 12px;
    white-space: nowrap;
  }

  .statusPaid {
    background: #ecfdf3;
    color: #027a48;
  }

  .statusPending,
  .statusTutorPending {
    background: #fff7ed;
    color: #9a3412;
  }

  .healthRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 20px;
  }

  .healthRow span {
    color: #6f637e;
    font-weight: 850;
  }

  .healthRow strong {
    font-size: 24px;
    font-weight: 950;
  }

  .healthRow.good strong {
    color: #027a48;
  }

  .healthRow.warning strong {
    color: #9a3412;
  }

  .healthRow.danger strong {
    color: #b42318;
  }

  .fullLink {
    width: 100%;
    margin-top: 20px;
  }

  .profileRow {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(124,58,237,0.12);
  }

  .profileRow span {
    color: #7a7088;
    font-weight: 850;
  }

  .profileRow strong {
    text-align: right;
    font-weight: 950;
  }

  .familyGrid,
  .financeGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .financeGrid {
    grid-template-columns: 1fr;
  }

  .familyGrid div,
  .financeGrid div {
    padding: 22px;
    border-radius: 24px;
  }

  .familyGrid span,
  .familyGrid strong,
  .financeGrid span,
  .financeGrid strong {
    display: block;
  }

  .familyGrid span,
  .financeGrid span {
    color: #6f637e;
    font-weight: 850;
  }

  .familyGrid strong,
  .financeGrid strong {
    margin-top: 8px;
    font-size: 34px;
    line-height: 1;
    font-weight: 950;
  }

  .paymentGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .paymentCard {
    padding: 20px;
    border-radius: 24px;
  }

  .paymentAmount {
    margin: 0;
    font-size: 22px;
    font-weight: 950;
  }

  .controlGrid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 12px;
  }

  .controlLink {
    min-height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
    color: #351e55;
    text-decoration: none;
    font-weight: 950;
  }

  .emptyState {
    padding: 24px;
    border-radius: 24px;
  }

  .emptyState h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 950;
  }

  .emptyState p {
    margin: 10px 0 0;
    color: #6f637e;
    line-height: 1.6;
  }

  @media (max-width: 980px) {
    .page {
      padding: 20px 10px 70px;
    }

    .hero {
      padding: 28px 20px;
      border-radius: 30px;
    }

    .heroTop,
    .sectionHeader,
    .rowCard {
      align-items: flex-start;
      flex-direction: column;
    }

    .hero h1 {
      font-size: clamp(38px, 12vw, 56px);
      line-height: 0.98;
    }

    .subtitle {
      font-size: 16px;
    }

    .heroActions,
    .dualActions {
      flex-direction: column;
    }

    .primaryLink,
    .secondaryLink {
      width: 100%;
    }

    .kpiGrid,
    .quickGrid,
    .mainGrid,
    .splitGrid,
    .familyGrid,
    .controlGrid {
      grid-template-columns: 1fr;
    }

    .quickCard {
      min-height: auto;
    }

    .card,
    .cardWide {
      padding: 23px 18px;
      border-radius: 28px;
    }

    .profileRow {
      align-items: flex-start;
      flex-direction: column;
      gap: 5px;
    }

    .profileRow strong {
      text-align: left;
    }
  }
`