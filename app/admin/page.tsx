'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

type Booking = {
  id: string
  parent_id: string | null
  student_id: string
  tutor_id: string | null
  subject_id: string
  plan_id: string
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  meeting_link: string | null
  notes: string | null
  created_at: string | null
}

type Student = {
  id: string
  full_name: string
}

type Subject = {
  id: string
  name: string
}

type Tutor = {
  id: string
  full_name: string
  approval_status: string
  verification_status: string
  is_listed: boolean
}

type Payment = {
  id: string
  booking_id: string
  payment_status: string
  amount: number | null
  currency: string | null
  created_at: string | null
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

const adminActions = [
  {
  title: 'Business Intelligence',
  text: 'Monitor platform growth, revenue, bookings, analytics and performance.',
  href: '/admin/bi',
  tag: 'Analytics',
},

  {
    title: 'Messages & Support',
    text: 'Handle enquiries, complaints, parent notes, tutor issues and safeguarding reports.',
    href: '/admin/messages',
    tag: 'Support',
  },
  {
    title: 'Tutor Approval',
    text: 'Review tutor applications, verification, interview readiness and listing status.',
    href: '/admin/tutors',
    tag: 'Tutors',
  },
  {
    title: 'Tutor Capacity',
    text: 'Review listed tutor bios, approved subjects, weekly availability and how quickly booking starts are filling.',
    href: '/admin/tutor-capacity',
    tag: 'Availability',
  },
  {
  title: 'Communications Centre',
  text: 'Manage tutor webinars, orientations, parent newsletters, announcements and event invitations.',
  href: '/admin/communications',
  tag: 'Communications',
},
  {
    title: 'Curriculum Manager',
    text: 'Manage subjects, stages, strands, modules and lessons.',
    href: '/admin/curriculum',
    tag: 'Learning',
  },
  {
    title: 'Bookings Control',
    text: 'Track parent bookings, assigned tutors, meeting links and lesson notes.',
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

export default function AdminDashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading admin dashboard...')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [tutorEarnings, setTutorEarnings] = useState<TutorEarning[]>([])
  const [studentMap, setStudentMap] = useState<Record<string, Student>>({})
  const [subjectMap, setSubjectMap] = useState<Record<string, Subject>>({})
  const [tutorMap, setTutorMap] = useState<Record<string, Tutor>>({})
  const [parentCount, setParentCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)
  const [openMessages, setOpenMessages] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [highPriorityMessages, setHighPriorityMessages] = useState(0)
  const [safeguardingMessages, setSafeguardingMessages] = useState(0)

  const controlLinks = [
    { label: unreadMessages > 0 ? `Messages (${unreadMessages})` : 'Messages', href: '/admin/messages' },
    { label: 'Parents', href: '/admin/parents' },
    { label: 'Students', href: '/admin/students' },
    { label: 'Curriculum', href: '/admin/curriculum' },
    { label: 'Tutor Payouts', href: '/admin/tutor-payouts' },
    { label: 'Bookings', href: '/admin/bookings' },
    { label: 'Payments', href: '/admin/payments' },
    { label: 'Reports', href: '/admin/reports' },
    { label: 'Tutors', href: '/admin/tutors' },
    { label: 'Tutor Capacity', href: '/admin/tutor-capacity' },
    {
  label: 'Communications',
  href: '/admin/communications',
},
    { label: 'Business Intelligence', href: '/admin/bi' },
  ]

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
          timezone,
          status,
          payment_status,
          amount_gbp,
          meeting_link,
          notes,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(40)

      const cleanBookings = (bookingRows ?? []) as Booking[]

      const studentIds = Array.from(new Set(cleanBookings.map((b) => b.student_id).filter(Boolean)))
      const subjectIds = Array.from(new Set(cleanBookings.map((b) => b.subject_id).filter(Boolean)))
      const tutorIds = Array.from(new Set(cleanBookings.map((b) => b.tutor_id).filter(Boolean))) as string[]

      if (studentIds.length) {
        const { data } = await supabase
          .from('student_profiles')
          .select('id, full_name')
          .in('id', studentIds)

        setStudentMap(
          Object.fromEntries(((data ?? []) as Student[]).map((item) => [item.id, item]))
        )
      }

      if (subjectIds.length) {
        const { data } = await supabase
          .from('subjects')
          .select('id, name')
          .in('id', subjectIds)

        setSubjectMap(
          Object.fromEntries(((data ?? []) as Subject[]).map((item) => [item.id, item]))
        )
      }

      const { data: tutorRows } = await supabase
        .from('tutor_profiles')
        .select('id, full_name, approval_status, verification_status, is_listed')
        .order('created_at', { ascending: false })

      const cleanTutors = (tutorRows ?? []) as Tutor[]

      setTutorMap(
        Object.fromEntries(cleanTutors.map((item) => [item.id, item]))
      )

      const { data: paymentRows } = await supabase
        .from('payments')
        .select('id, booking_id, payment_status, amount, currency, created_at')
        .order('created_at', { ascending: false })
        .limit(20)

      const { data: tutorEarningRows } = await supabase
        .from('tutor_earnings')
        .select('id, tutor_id, booking_id, tutor_amount, status, created_at, paid_at, lesson_date')
        .order('created_at', { ascending: false })
        .limit(50)

      const { count: parentsTotal } = await supabase
        .from('parent_profiles')
        .select('*', { count: 'exact', head: true })

      const { count: studentsTotal } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true })

      const { count: openMessagesTotal } = await supabase
        .from('support_threads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open')

      const { count: unreadMessagesTotal } = await supabase
        .from('support_threads')
        .select('*', { count: 'exact', head: true })
        .eq('admin_read', false)

      const { count: highPriorityMessagesTotal } = await supabase
        .from('support_threads')
        .select('*', { count: 'exact', head: true })
        .in('priority', ['high', 'urgent'])
        .in('status', ['open', 'pending'])

      const { count: safeguardingMessagesTotal } = await supabase
        .from('support_threads')
        .select('*', { count: 'exact', head: true })
        .eq('category', 'safeguarding')
        .in('status', ['open', 'pending'])

      setBookings(cleanBookings)
      setPayments((paymentRows ?? []) as Payment[])
      setTutorEarnings((tutorEarningRows ?? []) as TutorEarning[])
      setTutors(cleanTutors)
      setParentCount(parentsTotal ?? 0)
      setStudentCount(studentsTotal ?? 0)
      setOpenMessages(openMessagesTotal ?? 0)
      setUnreadMessages(unreadMessagesTotal ?? 0)
      setHighPriorityMessages(highPriorityMessagesTotal ?? 0)
      setSafeguardingMessages(safeguardingMessagesTotal ?? 0)
      setMessage('')
      setLoading(false)
    }

    loadAdminDashboard()
  }, [router])

  const confirmedBookings = useMemo(
    () => bookings.filter((b) => b.payment_status === 'PAID' || b.status === 'CONFIRMED'),
    [bookings]
  )

  const pendingParentPayments = useMemo(
    () => bookings.filter((b) => b.payment_status !== 'PAID'),
    [bookings]
  )

  const missingMeetingLinks = useMemo(
    () => confirmedBookings.filter((b) => !b.meeting_link),
    [confirmedBookings]
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

  const pendingTutorPayoutAmount = useMemo(
    () =>
      pendingTutorPayouts.reduce(
        (total, earning) => total + Number(earning.tutor_amount || 0),
        0
      ),
    [pendingTutorPayouts]
  )

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
          <Link href="/admin/messages" className="miniLink">Messages</Link>
        </div>

        <h1>Platform command centre</h1>

        <p className="subtitle">
          Monitor bookings, payments, tutor payouts, support messages, parent notes,
          meeting links, students and tutor activity from one premium admin workspace.
        </p>

        <div className="heroActions">
          <Link href="/admin/messages" className="primaryLink">Open Messages</Link>
          <Link href="/admin/tutors" className="secondaryLink">Review Tutors</Link>
          <Link href="/admin/tutor-capacity" className="secondaryLink">Tutor Capacity</Link>
          <Link
    href="/admin/communications"
    className="secondaryLink"
>
    Communications
</Link>
          <Link href="/admin/bookings" className="secondaryLink">View Bookings</Link>
          <Link
    href="/admin/bi"
    className="secondaryLink"
>
    Business Intelligence
</Link>
        </div>

        <div className="kpiGrid">
          <Kpi label="Unread Messages" value={String(unreadMessages)} />
          <Kpi label="Open Messages" value={String(openMessages)} />
          <Kpi label="Safeguarding" value={String(safeguardingMessages)} />
          <Kpi label="Bookings" value={String(bookings.length)} />
          <Kpi label="Confirmed" value={String(confirmedBookings.length)} />
          <Kpi label="Revenue" value={`£${revenue.toFixed(2)}`} />
          <Kpi label="Tutor Payouts" value={`$${pendingTutorPayoutAmount.toFixed(2)}`} />
          <Kpi label="Students" value={String(studentCount)} />
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

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">Recent Bookings</p>
            <h2>Latest parent lesson activity</h2>
          </div>
          <Link href="/admin/bookings" className="smallLink">View all</Link>
        </div>

        {bookings.length === 0 ? (
          <Empty title="No bookings yet" text="Parent bookings will appear here once lessons are scheduled." />
        ) : (
          <div className="bookingList">
            {bookings.slice(0, 10).map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                student={studentMap[booking.student_id]}
                subject={subjectMap[booking.subject_id]}
                tutor={booking.tutor_id ? tutorMap[booking.tutor_id] : undefined}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mainGrid">
        <div className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Support Inbox</p>
              <h2>Messages requiring attention</h2>
            </div>
            <Link href="/admin/messages" className="smallLink">Open inbox</Link>
          </div>

          <div className="healthList">
            <HealthRow label="Open enquiries" value={openMessages} tone="warning" />
            <HealthRow label="High priority messages" value={highPriorityMessages} tone="warning" />
            <HealthRow label="Safeguarding alerts" value={safeguardingMessages} tone="danger" />
          </div>
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
        </aside>
      </section>

      <section className="splitGrid">
        <div className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Tutor Status</p>
              <h2>Tutor pipeline</h2>
            </div>
            <Link href="/admin/tutors" className="smallLink">Manage</Link>
          </div>

          <div className="profileList">
            <ProfileRow label="Total Tutors" value={String(tutors.length)} />
            <ProfileRow label="Approved + Listed" value={String(approvedTutors.length)} />
            <ProfileRow label="Needs Review" value={String(pendingTutors.length)} />
            <ProfileRow label="Parents" value={String(parentCount)} />
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
          </div>
        </div>
      </section>

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">Payment Activity</p>
            <h2>Recent parent payment records</h2>
          </div>
          <Link href="/admin/payments" className="smallLink">View payments</Link>
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
                <p className="rowMeta">Booking: {payment.booking_id?.slice(0, 8)}...</p>
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

function BookingRow({
  booking,
  student,
  subject,
  tutor,
}: {
  booking: Booking
  student?: Student
  subject?: Subject
  tutor?: Tutor
}) {
  return (
    <div className="bookingCard">
      <div className="bookingTop">
        <div>
          <p className="bookingSubject">{subject?.name || booking.subject_id}</p>
          <p className="rowMeta">
            Student: {student?.full_name || booking.student_id.slice(0, 8)}
          </p>
          <p className="rowMeta">
            Tutor: {tutor?.full_name || (booking.tutor_id ? 'Assigned tutor' : 'Not assigned')}
          </p>
        </div>

        <StatusBadge status={booking.payment_status || booking.status} />
      </div>

      <div className="bookingMetaGrid">
        <div>
          <span>Date</span>
          <strong>{formatDate(booking.lesson_date)}</strong>
        </div>
        <div>
          <span>Time</span>
          <strong>{booking.lesson_time || 'Time pending'}</strong>
        </div>
        <div>
          <span>Timezone</span>
          <strong>{booking.timezone || 'Not set'}</strong>
        </div>
        <div>
          <span>Amount</span>
          <strong>£{Number(booking.amount_gbp || 0).toFixed(2)}</strong>
        </div>
      </div>

      {booking.notes ? (
        <div className="noteBox">
          <span>Parent note</span>
          <p>{booking.notes}</p>
        </div>
      ) : null}

      {booking.meeting_link ? (
        <a href={booking.meeting_link} target="_blank" rel="noreferrer" className="meetingLink">
          Open meeting link
        </a>
      ) : (
        <p className="missingLink">Meeting link missing</p>
      )}
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
  const paid = clean === 'paid' || clean === 'confirmed'
  const pending = clean === 'pending' || clean === 'pending_payment' || clean === 'unpaid'

  return (
    <span className={paid ? 'statusBadge statusPaid' : pending ? 'statusBadge statusPending' : 'statusBadge'}>
      {paid ? 'Confirmed' : pending ? 'Pending' : status || 'Pending'}
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
  .sectionHeader,
  .bookingTop {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
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

  .heroActions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 28px;
  }

  .primaryLink,
  .secondaryLink,
  .smallLink,
  .miniLink,
  .meetingLink,
  .controlLink {
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

  .primaryLink,
  .meetingLink {
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 16px 38px rgba(124,58,237,0.22);
  }

  .secondaryLink,
  .smallLink,
  .miniLink,
  .controlLink {
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
  .cardWide,
  .bookingCard,
  .paymentCard {
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
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
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
    grid-template-columns: 1fr 1fr;
    gap: 24px;
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

  .bookingList,
  .healthList,
  .profileList {
    display: grid;
    gap: 14px;
  }

  .bookingCard {
    padding: 22px;
    border-radius: 26px;
  }

  .bookingSubject {
    margin: 0;
    font-size: 25px;
    font-weight: 950;
    letter-spacing: -0.04em;
  }

  .rowMeta {
    margin: 7px 0 0;
    color: #6f637e;
    font-weight: 750;
    line-height: 1.5;
  }

  .bookingMetaGrid,
  .financeGrid,
  .paymentGrid {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .bookingMetaGrid div,
  .financeGrid div {
    padding: 15px;
    border-radius: 18px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.1);
  }

  .bookingMetaGrid span,
  .financeGrid span,
  .noteBox span {
    display: block;
    color: #7a7088;
    font-size: 12px;
    font-weight: 950;
  }

  .bookingMetaGrid strong,
  .financeGrid strong {
    display: block;
    margin-top: 6px;
    font-weight: 950;
  }

  .noteBox {
    margin-top: 16px;
    padding: 16px;
    border-radius: 18px;
    background: #fff7ed;
    border: 1px solid rgba(249,115,22,0.14);
  }

  .noteBox p {
    margin: 7px 0 0;
    color: #7c2d12;
    line-height: 1.6;
    font-weight: 750;
  }

  .meetingLink {
    width: fit-content;
    min-height: 44px;
    margin-top: 16px;
    padding: 0 16px;
    border-radius: 999px;
  }

  .missingLink {
    margin: 16px 0 0;
    color: #be123c;
    font-weight: 950;
  }

  .statusBadge {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    background: #f6f1ff;
    color: #4c1d95;
    font-size: 12px;
    font-weight: 950;
  }

  .statusPaid {
    background: #dcfce7;
    color: #166534;
  }

  .statusPending {
    background: #fff7ed;
    color: #9a3412;
  }

  .healthRow,
  .profileRow {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 15px 0;
    border-bottom: 1px solid rgba(124,58,237,0.1);
  }

  .healthRow span,
  .profileRow span {
    color: #7a7088;
    font-weight: 850;
  }

  .healthRow strong,
  .profileRow strong {
    font-weight: 950;
  }

  .good strong { color: #166534; }
  .warning strong { color: #9a3412; }
  .danger strong { color: #be123c; }

  .emptyState {
    padding: 26px;
    border-radius: 24px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.1);
  }

  .emptyState h3 {
    margin: 0;
    font-size: 24px;
  }

  .emptyState p {
    margin: 10px 0 0;
    color: #6f637e;
    line-height: 1.7;
  }

  .paymentGrid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .paymentCard {
    padding: 18px;
    border-radius: 22px;
  }

  .paymentAmount {
    margin: 0;
    font-size: 19px;
    font-weight: 950;
  }

  .controlGrid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .controlLink {
    min-height: 44px;
    padding: 0 15px;
    border-radius: 999px;
  }

  @media (max-width: 900px) {
    .page {
      padding: 24px 12px 70px;
    }

    .hero,
    .card,
    .cardWide {
      padding: 24px;
      border-radius: 28px;
    }

    .heroTop,
    .sectionHeader,
    .bookingTop {
      flex-direction: column;
      align-items: flex-start;
    }

    .kpiGrid,
    .mainGrid,
    .splitGrid,
    .bookingMetaGrid {
      grid-template-columns: 1fr;
    }

    .hero h1 {
      font-size: clamp(40px, 13vw, 58px);
    }
  }
`