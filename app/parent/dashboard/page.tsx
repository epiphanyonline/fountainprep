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
          'id, full_name, phone, country_of_residence, timezone, preferred_currency'
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

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Parent Portal</p>
          <h1>Loading your learning dashboard...</h1>
          <p className="subtitle">{message}</p>
        </section>

        <style jsx>{styles}</style>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="heroGlow" />

        <p className="eyebrow">Parent Portal</p>

        <h1>
          Welcome back
          {profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>

        <p className="subtitle">
          Manage your child’s private 1-to-1 tutoring, upcoming lessons, payments,
          and learning journey in one place.
        </p>

        <div className="kpiGrid">
          <KpiCard label="Students" value={String(studentCount)} />
          <KpiCard label="Upcoming Lessons" value={String(confirmedLessons.length)} />
          <KpiCard label="Pending Payments" value={String(pendingPayments.length)} />
          <KpiCard label="Learning Type" value="1-to-1" />
        </div>

        <div className="actions">
          <Link href="/parent/students" className="primaryLink">
            Book New Lesson
          </Link>

          <Link href="/parent/students" className="secondaryLink">
            Add or Choose Child
          </Link>

          <Link href="/parent/bookings" className="secondaryLink">
            My Bookings
          </Link>
        </div>
      </section>

      <section className="topGrid">
        <div className="card mainCard">
          <p className="sectionEyebrow">Next Lesson</p>

          {nextLesson ? (
            <div className="nextLesson">
              <div>
                <h2>{subjects[nextLesson.subject_id] || 'Selected subject'}</h2>
                <p>
                  {students[nextLesson.student_id] || 'Selected child'} •{' '}
                  {planLabels[nextLesson.plan_id] || 'Learning Plan'}
                </p>
              </div>

              <div className="lessonTimeBox">
  <strong>{formatDate(nextLesson.lesson_date)}</strong>
  <span>{nextLesson.lesson_time || 'Time pending'}</span>

  {nextLesson.meeting_link ? (
    <a
      href={nextLesson.meeting_link}
      target="_blank"
      rel="noopener noreferrer"
      className="joinBtn"
    >
      Join Lesson
    </a>
  ) : null}
</div>
            </div>
          ) : (
            <EmptyState
              title="No confirmed lessons yet"
              text="Once payment is completed, your child's upcoming lessons will appear here."
              href="/parent/students"
              button="Start Learning"
            />
          )}
        </div>

        <aside className="card profileCard">
          <p className="sectionEyebrow">Family Profile</p>

          {profile ? (
            <div className="profileList">
              <ProfileRow label="Name" value={profile.full_name} />
              <ProfileRow label="Phone" value={profile.phone ?? '-'} />
              <ProfileRow
                label="Country"
                value={profile.country_of_residence ?? '-'}
              />
              <ProfileRow label="Timezone" value={profile.timezone} />
              <ProfileRow label="Currency" value={profile.preferred_currency} />
            </div>
          ) : null}
        </aside>
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
            text="Book a subject and complete payment to activate your private tutoring plan."
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
            <p className="sectionEyebrow">Payments & Bookings</p>
            <h2>Recent booking activity</h2>
          </div>
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            text="Start by choosing a child, subject, plan, and weekly lesson time."
            href="/parent/students"
            button="Start Learning"
          />
        ) : (
          <div className="bookingGrid">
            {bookings.map((booking) => (
              <div key={booking.id} className="bookingCard">
                <p className="bookingTitle">
                  {subjects[booking.subject_id] || 'Selected subject'}
                </p>

                <p className="bookingText">
                  {students[booking.student_id] || 'Selected child'} •{' '}
                  {planLabels[booking.plan_id] || 'Learning Plan'}
                </p>

                <p className="bookingText">
                  {formatDate(booking.lesson_date)} •{' '}
                  {booking.lesson_time || 'Time pending'}
                </p>

                <span
                  className={
                    booking.payment_status === 'PAID'
                      ? 'statusBadge statusPaid'
                      : 'statusBadge statusPending'
                  }
                >
                  {booking.payment_status === 'PAID' ? 'Paid' : 'Pending Payment'}
                </span>

                {booking.payment_status !== 'PAID' ? (
                  <Link href={`/payment?bookingId=${booking.id}`} className="payLink">
                    Complete Payment
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <style jsx>{styles}</style>
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

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="profileRow">
      <span>{label}</span>
      <strong>{value}</strong>
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
            href={booking.meeting_link}
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
    padding: 42px 18px 90px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 30%),
      linear-gradient(180deg, #ffffff, #fbf8ff 45%, #f4edff);
    color: #21152d;
  }

  .hero,
  .topGrid,
  .cardWide {
    max-width: 1180px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero {
    position: relative;
    overflow: hidden;
    padding: 48px;
    border-radius: 40px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,239,255,0.96));
    border: 1px solid rgba(126,87,194,0.14);
    box-shadow: 0 30px 90px rgba(71,43,117,0.12);
  }

  .heroGlow {
    position: absolute;
    right: -120px;
    top: -120px;
    width: 360px;
    height: 360px;
    border-radius: 999px;
    background: rgba(124,58,237,0.18);
    filter: blur(24px);
  }

  .eyebrow,
  .sectionEyebrow {
    position: relative;
    margin: 0;
    color: #6d28d9;
    font-weight: 950;
    font-size: 14px;
  }

  .hero h1 {
    position: relative;
    margin: 14px 0 0;
    max-width: 850px;
    font-size: clamp(40px, 6vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .subtitle {
    position: relative;
    max-width: 760px;
    margin: 20px 0 0;
    color: #6f637e;
    font-size: 18px;
    line-height: 1.75;
  }

  .kpiGrid {
    position: relative;
    margin-top: 32px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  .kpiCard {
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(124,58,237,0.12);
    box-shadow: 0 18px 45px rgba(71,43,117,0.07);
  }

  .kpiCard p {
    margin: 0;
    color: #7a7088;
    font-weight: 850;
    font-size: 14px;
  }

  .kpiCard h2 {
    margin: 8px 0 0;
    font-size: 34px;
    line-height: 1;
    letter-spacing: -0.05em;
    font-weight: 950;
  }

  .actions {
    position: relative;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 30px;
  }

  .primaryLink,
  .secondaryLink,
  .smallLink {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    min-height: 52px;
    padding: 0 22px;
    font-weight: 950;
    text-decoration: none;
  }

  .primaryLink {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
    box-shadow: 0 16px 38px rgba(124,58,237,0.28);
  }

  .secondaryLink,
  .smallLink {
    background: white;
    color: #351e55;
    border: 1px solid rgba(124,58,237,0.16);
  }

  .topGrid {
    margin-top: 28px;
    display: grid;
    grid-template-columns: 1.25fr 0.75fr;
    gap: 24px;
  }

  .card,
  .cardWide {
    padding: 32px;
    border-radius: 34px;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(126,87,194,0.12);
    box-shadow: 0 24px 70px rgba(71,43,117,0.09);
  }

  .cardWide {
    margin-top: 28px;
  }

  .sectionHeader {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: center;
    margin-bottom: 22px;
  }

  .sectionHeader h2,
  .nextLesson h2 {
    margin: 10px 0 0;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .nextLesson {
    margin-top: 22px;
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: center;
    padding: 24px;
    border-radius: 28px;
    background: linear-gradient(135deg, #fbf8ff, #f3ecff);
    border: 1px solid rgba(124,58,237,0.12);
  }

  .nextLesson p {
    margin: 10px 0 0;
    color: #6f637e;
    font-weight: 750;
  }

  .lessonTimeBox {
    min-width: 180px;
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

  .lessonTimeBox span {
    margin-top: 8px;
    color: #6d28d9;
    font-weight: 950;
  }

  .profileList {
    margin-top: 22px;
  }

  .profileRow {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(124,58,237,0.1);
  }

  .profileRow span {
    color: #7a7088;
    font-weight: 850;
  }

  .profileRow strong {
    text-align: right;
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
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .lessonTitle {
    margin: 0;
    font-weight: 950;
    font-size: 19px;
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

  .lessonDate span {
    color: #6d28d9;
    font-weight: 950;
  }

  .bookingGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  .bookingCard {
    padding: 20px;
    border-radius: 24px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .bookingTitle {
    margin: 0;
    font-size: 20px;
    font-weight: 950;
  }

  .bookingText {
    margin: 8px 0 0;
    color: #6f637e;
    font-size: 14px;
    line-height: 1.5;
  }

  .statusBadge {
    display: inline-flex;
    margin-top: 14px;
    padding: 8px 11px;
    border-radius: 999px;
    font-weight: 950;
    font-size: 12px;
  }

  .statusPaid {
    background: #ecfdf3;
    color: #027a48;
  }

  .statusPending {
    background: #fff7ed;
    color: #9a3412;
  }

  .payLink {
    display: inline-flex;
    margin-top: 14px;
    color: #6d28d9;
    font-weight: 950;
    text-decoration: none;
  }

  .emptyState {
    margin-top: 22px;
    padding: 24px;
    border-radius: 24px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
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

  @media (max-width: 900px) {
    .page {
      padding: 26px 12px 70px;
    }

    .hero {
      padding: 32px 20px;
      border-radius: 30px;
    }

    .hero h1 {
      font-size: clamp(38px, 12vw, 56px);
    }

    .subtitle {
      font-size: 16px;
    }

    .kpiGrid,
    .topGrid {
      grid-template-columns: 1fr;
    }

    .actions {
      flex-direction: column;
    }

    .primaryLink,
    .secondaryLink {
      width: 100%;
    }

    .card,
    .cardWide {
      padding: 24px 20px;
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

    .profileRow {
      align-items: flex-start;
      flex-direction: column;
      gap: 6px;
    }

    .joinBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 22px;
  margin-top: 14px;
  border-radius: 18px;
  text-decoration: none;
  font-weight: 900;
  color: white;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  box-shadow: 0 16px 38px rgba(124,58,237,0.25);
}

    .profileRow strong {
      text-align: left;
    }
  }

  .joinBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 16px;
  margin-top: 12px;
  border-radius: 15px;
  text-decoration: none;
  font-weight: 950;
  color: white;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  box-shadow: 0 14px 30px rgba(124,58,237,0.22);
}

.smallJoin {
  min-height: 38px;
  padding: 0 14px;
  font-size: 13px;
}
`