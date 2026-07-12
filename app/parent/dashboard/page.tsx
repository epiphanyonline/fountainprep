'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type ParentProfile = {
  id: string
  full_name: string
  phone: string | null
  country_of_residence: string | null
  timezone: string
  preferred_currency: string
  account_type: 'PARENT' | 'ADULT_LEARNER'
}

type LessonBooking = {
  id: string
  student_id: string
  subject_id: string
  plan_id: string
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  meeting_link: string | null
}

type Student = {
  id: string
  full_name: string
}

type Subject = {
  id: string
  name: string
}

const planLabels: Record<string, string> = {
  monthly: 'Monthly Plan',
  three_month: '3-Month Plan',
}

const quickActions = [
  {
    title: 'Manage Students',
    text: 'Add or update your children’s learning profiles.',
    href: '/parent/students',
    tag: 'Child profiles',
  },
  {
    title: 'Book Private Lesson',
    text: 'Choose a child, subject, tutor and lesson time.',
    href: '/parent/students',
    tag: '1-to-1 tutoring',
  },
  {
    title: 'Progress Reports',
    text: 'View tutor feedback and learning updates.',
    href: '/parent/progress',
    tag: 'Parent updates',
  },
  {
    title: 'My Sessions',
    text: 'Manage upcoming and completed lessons.',
    href: '/parent/sessions',
    tag: 'Lesson centre',
  },
]

const helpfulLinks = [
  { label: 'Bookings', href: '/parent/bookings' },
  { label: 'Payments', href: '/parent/payments' },
  { label: 'Subjects', href: '/subjects' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Schedule', href: '/schedule' },
]

const recommendedSubjects = ['Yoruba', 'Maths', 'English', 'Science', 'Coding', 'Music']

export default function ParentDashboardPage() {
  const router = useRouter()

  const [message, setMessage] = useState('Loading your dashboard...')
  const [profile, setProfile] = useState<ParentProfile | null>(null)
  const [studentCount, setStudentCount] = useState(0)
  const [bookings, setBookings] = useState<LessonBooking[]>([])
  const [students, setStudents] = useState<Record<string, string>>({})
  const [subjects, setSubjects] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
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

      if (!userProfile || userProfile.role !== 'PARENT') {
        router.push('/account')
        return
      }

      const { data: parentProfile, error } = await supabase
  .from('parent_profiles')
  .select(
    'id, full_name, phone, country_of_residence, timezone, preferred_currency, account_type'
  )
  .eq('user_id', user.id)
  .maybeSingle()

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      if (!parentProfile) {
        router.push('/parent/onboarding')
        return
      }

      if (parentProfile.account_type === 'ADULT_LEARNER') {
  router.replace('/learner/dashboard')
  return
}

      setProfile(parentProfile as ParentProfile)

      const { count: studentsTotal } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('parent_id', parentProfile.id)

      setStudentCount(studentsTotal ?? 0)

      const { data: studentRows } = await supabase
        .from('student_profiles')
        .select('id, full_name')
        .eq('parent_id', parentProfile.id)

      const studentMap: Record<string, string> = {}

      ;((studentRows ?? []) as Student[]).forEach((student) => {
        studentMap[student.id] = student.full_name
      })

      setStudents(studentMap)

      const today = new Date().toISOString().split('T')[0]

      const { data: bookingRows } = await supabase
        .from('lesson_bookings')
        .select(
          `
          id,
          student_id,
          subject_id,
          plan_id,
          lesson_date,
          lesson_time,
          timezone,
          status,
          payment_status,
          amount_gbp,
          meeting_link
        `
        )
        .eq('parent_id', user.id)
        .gte('lesson_date', today)
        .order('lesson_date', { ascending: true })
        .order('lesson_time', { ascending: true })
        .limit(8)

      const cleanBookings = (bookingRows ?? []) as LessonBooking[]
      setBookings(cleanBookings)

      const subjectIds = Array.from(
        new Set(cleanBookings.map((booking) => booking.subject_id).filter(Boolean))
      )

      if (subjectIds.length > 0) {
        const { data: subjectRows } = await supabase
          .from('subjects')
          .select('id, name')
          .in('id', subjectIds)

        const subjectMap: Record<string, string> = {}

        ;((subjectRows ?? []) as Subject[]).forEach((subject) => {
          subjectMap[subject.id] = subject.name
        })

        setSubjects(subjectMap)
      }

      setMessage('')
      setLoading(false)
    }

    loadDashboard()
  }, [router])

  const confirmedLessons = useMemo(() => {
    return bookings.filter(
      (booking) => booking.status === 'CONFIRMED' || booking.payment_status === 'PAID'
    )
  }, [bookings])

  const pendingPayments = useMemo(() => {
    return bookings.filter(
      (booking) =>
        booking.payment_status !== 'PAID' && booking.status !== 'CONFIRMED'
    )
  }, [bookings])

  const nextLesson = confirmedLessons[0]
  const firstName = profile?.full_name?.split(' ')[0] || 'Parent'
  const studentList = Object.entries(students)

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Parent Portal</p>
          <h1>Loading your learning centre...</h1>
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
          <p className="eyebrow">Parent Learning Centre</p>

          <Link href="/parent/students" className="heroMiniLink">
            Manage Children
          </Link>
        </div>

        <h1>
          {firstName}, <br />
          your child’s learning centre
        </h1>

        <p className="subtitle">
          Manage your children, book private 1-to-1 lessons, track progress
          reports, handle payments, and stay informed about every step of their
          learning journey.
        </p>

        <div className="heroActions">
          <Link href="/parent/students" className="primaryLink">
            Book a Private Lesson
          </Link>

          <Link href="/parent/progress" className="secondaryLink">
            View Progress
          </Link>
        </div>

        <div className="kpiGrid">
          <KpiCard label="Students" value={String(studentCount)} />
          <KpiCard label="Upcoming" value={String(confirmedLessons.length)} />
          <KpiCard label="Pending Pay" value={String(pendingPayments.length)} />
          <KpiCard label="Lesson Type" value="1-to-1" />
        </div>
      </section>

      <section className="quickGrid">
        {quickActions.map((item) => (
          <Link href={item.href} className="quickCard" key={item.title}>
            <span>{item.tag}</span>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </Link>
        ))}
      </section>

      <section className="mainGrid">
        <div className="card nextCard">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Next Lesson</p>
              <h2>Your next private class</h2>
            </div>

            <Link href="/parent/sessions" className="smallLink">
              Sessions
            </Link>
          </div>

          {nextLesson ? (
            <div className="nextLesson">
              <div>
                <h3>{subjects[nextLesson.subject_id] || 'Selected subject'}</h3>
                <p>
                  {students[nextLesson.student_id] || 'Selected child'} •{' '}
                  {planLabels[nextLesson.plan_id] || 'Learning Plan'}
                </p>
              </div>

              <div className="lessonTimeBox">
                <strong>{formatDate(nextLesson.lesson_date)}</strong>
                <span>{nextLesson.lesson_time || 'Time pending'}</span>

                {nextLesson.id && (
  <a
    href={`/classroom/${nextLesson.id}`}
    className="joinBtn"
  >
    Enter Classroom
  </a>
)}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No confirmed lesson yet"
              text="Once payment is completed, your child’s upcoming private lesson will appear here."
              href="/parent/students"
              button="Start Learning"
            />
          )}
        </div>

        <aside className="card valueCard">
          <p className="sectionEyebrow">Progress Value</p>
          <h2>Parents stay informed after learning.</h2>

          <div className="reportPreview">
            <div>
              <strong>Lesson summary</strong>
              <span>What was covered</span>
            </div>
            <div>
              <strong>Improvement</strong>
              <span>What your child is getting better at</span>
            </div>
            <div>
              <strong>Next focus</strong>
              <span>What the tutor will work on next</span>
            </div>
          </div>

          <Link href="/parent/progress" className="primaryLink fullLink">
            Open Progress Reports
          </Link>
        </aside>
      </section>

      <section className="splitGrid">
        <div className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Children</p>
              <h2>Student overview</h2>
            </div>

            <Link href="/parent/students" className="smallLink">
              Manage
            </Link>
          </div>

          {studentList.length === 0 ? (
            <EmptyState
              title="No child profile yet"
              text="Add your child first so lessons can be matched to their level and learning needs."
              href="/parent/students"
              button="Add Child"
            />
          ) : (
            <div className="studentList">
              {studentList.map(([id, name]) => (
                <div className="studentCard" key={id}>
                  <div className="avatar">{name.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{name}</strong>
                    <span>Ready for private tutoring</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card paymentCard">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Payment Centre</p>
              <h2>Bookings and payments</h2>
            </div>

            <Link href="/parent/payments" className="smallLink">
              Open
            </Link>
          </div>

          <div className="paymentSummary">
            <div>
              <span>Pending payments</span>
              <strong>{pendingPayments.length}</strong>
            </div>
            <div>
              <span>Confirmed lessons</span>
              <strong>{confirmedLessons.length}</strong>
            </div>
          </div>

          <Link href="/parent/payments" className="primaryLink fullLink">
            Manage Payments
          </Link>
        </div>
      </section>

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">Upcoming Learning</p>
            <h2>Your child’s lesson schedule</h2>
          </div>

          <Link href="/parent/bookings" className="smallLink">
            View all
          </Link>
        </div>

        {confirmedLessons.length === 0 ? (
          <EmptyState
            title="No upcoming lessons yet"
            text="Book a subject and complete payment to activate your child’s private tutoring plan."
            href="/parent/students"
            button="Book a Lesson"
          />
        ) : (
          <div className="lessonList">
            {confirmedLessons.map((booking) => (
              <LessonRow
                key={booking.id}
                booking={booking}
                childName={students[booking.student_id] || 'Selected child'}
                subjectName={subjects[booking.subject_id] || 'Selected subject'}
              />
            ))}
          </div>
        )}
      </section>

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">Recommended Subjects</p>
            <h2>Continue your child’s learning journey</h2>
          </div>

          <Link href="/subjects" className="smallLink">
            Explore
          </Link>
        </div>

        <div className="subjectGrid">
          {recommendedSubjects.map((subject) => (
            <Link href="/subjects" key={subject} className="subjectPill">
              {subject}
            </Link>
          ))}
        </div>
      </section>

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">Helpful Navigation</p>
            <h2>Everything parents need</h2>
          </div>
        </div>

        <div className="helpGrid">
          {helpfulLinks.map((item) => (
            <Link href={item.href} key={item.href} className="helpLink">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <style jsx global>{styles}</style>
    </main>
  )
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="kpiCard">
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  )
}

function LessonRow({
  booking,
  childName,
  subjectName,
}: {
  booking: LessonBooking
  childName: string
  subjectName: string
}) {
  return (
    <div className="lessonRow">
      <div>
        <p className="lessonTitle">{subjectName}</p>
        <p className="lessonMeta">
          {childName} • {planLabels[booking.plan_id] || 'Learning Plan'}
        </p>
      </div>

      <div className="lessonDate">
        <strong>{formatDate(booking.lesson_date)}</strong>
        <span>{booking.lesson_time || 'Time pending'}</span>

        {booking.meeting_link ? (
          <a
            href={`/classroom/${booking.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="joinBtn smallJoin"
          >
            Join
          </a>
        ) : null}
      </div>
    </div>
  )
}

function EmptyState({
  title,
  text,
  href,
  button,
}: {
  title: string
  text: string
  href: string
  button: string
}) {
  return (
    <div className="emptyState">
      <h3>{title}</h3>
      <p>{text}</p>
      <Link href={href} className="primaryLink">
        {button}
      </Link>
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
      radial-gradient(circle at 92% 5%, rgba(236, 72, 153, 0.09), transparent 28%),
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
    position: relative;
    overflow: hidden;
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
    max-width: 890px;
    font-size: clamp(42px, 6.4vw, 76px);
    line-height: 0.95;
    letter-spacing: -0.065em;
    font-weight: 950;
  }

  .subtitle {
    max-width: 780px;
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
  .heroMiniLink {
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
  .heroMiniLink {
    color: #351e55;
    background: white;
    border: 1px solid rgba(124,58,237,0.16);
  }

  .smallLink,
  .heroMiniLink {
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
    min-height: 190px;
    padding: 23px;
    border-radius: 28px;
    color: inherit;
    text-decoration: none;
    transition: transform 180ms ease, box-shadow 180ms ease;
  }

  .quickCard:hover {
    transform: translateY(-3px);
    box-shadow: 0 28px 72px rgba(71,43,117,0.12);
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

  .sectionHeader h2,
  .valueCard h2 {
    margin: 8px 0 0;
    font-size: clamp(26px, 3.3vw, 42px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .nextLesson {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 22px;
    padding: 24px;
    border-radius: 26px;
    background: linear-gradient(135deg, #fbf8ff, #f3ecff);
    border: 1px solid rgba(124,58,237,0.12);
  }

  .nextLesson h3 {
    margin: 0;
    font-size: 28px;
    line-height: 1.05;
    letter-spacing: -0.04em;
    font-weight: 950;
  }

  .nextLesson p {
    margin: 10px 0 0;
    color: #6f637e;
    font-weight: 750;
  }

  .lessonTimeBox {
    min-width: 185px;
    padding: 18px;
    border-radius: 22px;
    background: white;
    border: 1px solid rgba(124,58,237,0.12);
    text-align: right;
  }

  .lessonTimeBox strong,
  .lessonTimeBox span {
    display: block;
  }

  .lessonTimeBox span,
  .lessonDate span {
    margin-top: 7px;
    color: #6d28d9;
    font-weight: 950;
  }

  .joinBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 0 15px;
    margin-top: 12px;
    border-radius: 15px;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    text-decoration: none;
    font-size: 13px;
    font-weight: 950;
    box-shadow: 0 14px 30px rgba(124,58,237,0.22);
  }

  .smallJoin {
    min-height: 38px;
  }

  .valueCard {
    background:
      radial-gradient(circle at top right, rgba(124,58,237,0.12), transparent 38%),
      rgba(255,255,255,0.94);
  }

  .reportPreview {
    margin: 22px 0;
    display: grid;
    gap: 12px;
  }

  .reportPreview div,
  .studentCard,
  .lessonRow,
  .bookingCard,
  .emptyState {
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .reportPreview div {
    padding: 15px;
    border-radius: 20px;
  }

  .reportPreview strong,
  .reportPreview span {
    display: block;
  }

  .reportPreview strong {
    font-weight: 950;
  }

  .reportPreview span {
    margin-top: 4px;
    color: #6f637e;
    font-size: 13.5px;
    line-height: 1.45;
  }

  .fullLink {
    width: 100%;
  }

  .studentList {
    display: grid;
    gap: 12px;
  }

  .studentCard {
    display: flex;
    gap: 13px;
    align-items: center;
    padding: 16px;
    border-radius: 22px;
  }

  .avatar {
    width: 46px;
    height: 46px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    font-weight: 950;
  }

  .studentCard strong,
  .studentCard span {
    display: block;
  }

  .studentCard strong {
    font-weight: 950;
  }

  .studentCard span {
    margin-top: 4px;
    color: #6f637e;
    font-size: 13.5px;
  }

  .paymentSummary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .paymentSummary div {
    padding: 18px;
    border-radius: 22px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .paymentSummary span,
  .paymentSummary strong {
    display: block;
  }

  .paymentSummary span {
    color: #6f637e;
    font-size: 13px;
    font-weight: 850;
  }

  .paymentSummary strong {
    margin-top: 8px;
    font-size: 30px;
    line-height: 1;
    font-weight: 950;
  }

  .lessonList {
    display: grid;
    gap: 14px;
  }

  .lessonRow {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 18px;
    border-radius: 22px;
  }

  .lessonTitle {
    margin: 0;
    font-size: 19px;
    font-weight: 950;
  }

  .lessonMeta {
    margin: 7px 0 0;
    color: #6f637e;
    font-size: 14px;
    line-height: 1.5;
  }

  .lessonDate {
    text-align: right;
    display: grid;
    gap: 6px;
  }

  .subjectGrid,
  .helpGrid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 12px;
  }

  .subjectPill,
  .helpLink {
    min-height: 52px;
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

  .helpGrid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
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
    margin: 10px 0 20px;
    color: #6f637e;
    line-height: 1.7;
  }

  @media (max-width: 980px) {
    .page {
      padding: 20px 10px 70px;
    }

    .hero {
      padding: 28px 20px;
      border-radius: 30px;
    }

    .heroTop {
      align-items: flex-start;
      flex-direction: column;
    }

    .hero h1 {
      font-size: clamp(38px, 12vw, 56px);
      line-height: 0.98;
    }

    .subtitle {
      font-size: 16px;
      line-height: 1.7;
    }

    .heroActions {
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
    .subjectGrid,
    .helpGrid {
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

    .sectionHeader,
    .nextLesson,
    .lessonRow {
      align-items: flex-start;
      flex-direction: column;
    }

    .lessonTimeBox,
    .lessonDate {
      width: 100%;
      text-align: left;
    }

    .paymentSummary {
      grid-template-columns: 1fr;
    }
  }
`