'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

type TutorProfile = {
  id: string
  full_name: string
  phone: string | null
  country: string
  timezone: string
  bio: string | null
  years_of_experience: number
  qualification_summary: string | null
  approval_status: string
  verification_status: string
  average_rating: number
  rating_count: number
  is_listed: boolean
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
  notes: string | null
  student_profiles: {
    full_name: string
    child_age: number | null
    country_system: string | null
    country_class_label: string | null
  } | null
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

const planLabels: Record<string, string> = {
  payg: 'Pay As You Go',
  monthly: 'Monthly Plan',
  three_month: '3-Month Plan',
  six_month: '6-Month Plan',
}

const quickActions = [
  {
    title: 'Manage Availability',
    text: 'Keep your weekly teaching slots updated for parents.',
    href: '/tutor/availability',
    tag: 'Schedule',
  },
  {
    title: 'My Sessions',
    text: 'View upcoming, completed and assigned lessons.',
    href: '/tutor/sessions',
    tag: 'Lessons',
  },
  {
    title: 'Lesson Reports',
    text: 'Submit progress updates after each class.',
    href: '/tutor/lesson-report',
    tag: 'Reports',
  },
  {
    title: 'Earnings',
    text: 'Track lesson income and tutor payout activity.',
    href: '/tutor/earnings',
    tag: 'Payouts',
  },
]

export default function TutorDashboardPage() {
  const router = useRouter()

  const [message, setMessage] = useState('Loading...')
  const [profile, setProfile] = useState<TutorProfile | null>(null)
  const [lessons, setLessons] = useState<LessonBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTutorDashboard() {
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
        .select(
          'id, full_name, phone, country, timezone, bio, years_of_experience, qualification_summary, approval_status, verification_status, average_rating, rating_count, is_listed'
        )
        .eq('user_id', user.id)
        .maybeSingle()

      if (tutorError) {
        setMessage(tutorError.message)
        setLoading(false)
        return
      }

      if (!tutorProfile) {
        router.push('/tutor/onboarding')
        return
      }

      setProfile(tutorProfile as TutorProfile)

      const today = new Date().toISOString().split('T')[0]

      const { data: bookingRows, error: bookingError } = await supabase
        .from('lesson_bookings')
        .select(`
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
          meeting_link,
          notes,
          student_profiles (
            full_name,
            child_age,
            country_system,
            country_class_label
          )
        `)
        .eq('tutor_id', tutorProfile.id)
        .gte('lesson_date', today)
        .order('lesson_date', { ascending: true })
        .order('lesson_time', { ascending: true })

      if (bookingError) {
        setMessage(bookingError.message)
        setLoading(false)
        return
      }

      const cleanLessons = ((bookingRows ?? []) as any[]).map((row) => ({
        ...row,
        student_profiles: Array.isArray(row.student_profiles)
          ? row.student_profiles[0] ?? null
          : row.student_profiles ?? null,
      })) as LessonBooking[]

      setLessons(cleanLessons)
      setMessage('')
      setLoading(false)
    }

    loadTutorDashboard()
  }, [router])

  const confirmedLessons = useMemo(() => {
    return lessons.filter(
      (lesson) => lesson.status === 'CONFIRMED' || lesson.payment_status === 'PAID'
    )
  }, [lessons])

  const pendingLessons = useMemo(() => {
    return lessons.filter(
      (lesson) => lesson.payment_status !== 'PAID' && lesson.status !== 'CONFIRMED'
    )
  }, [lessons])

  const todayLessons = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return confirmedLessons.filter((lesson) => lesson.lesson_date === today)
  }, [confirmedLessons])

  const nextLesson = confirmedLessons[0]
  const firstName = profile?.full_name?.split(' ')[0] || 'Tutor'

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Tutor Portal</p>
          <h1>Loading tutor operations centre...</h1>
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
          <p className="eyebrow">Tutor Operations Centre</p>

          <Link href="/tutor/onboarding" className="miniLink">
            Edit Profile
          </Link>
        </div>

        <h1>
          {firstName}, <br />
          manage your tutoring work with confidence.
        </h1>

        <p className="subtitle">
          Track assigned lessons, join classes, submit progress reports, manage
          availability, and keep your tutor profile ready for parent bookings.
        </p>

        <div className="heroActions">
          <Link href="/tutor/availability" className="primaryLink">
            Manage Availability
          </Link>

          <Link href="/tutor/lesson-report" className="secondaryLink">
            Submit Lesson Report
          </Link>
        </div>

        <div className="kpiGrid">
          <KpiCard label="Today" value={String(todayLessons.length)} />
          <KpiCard label="Upcoming" value={String(confirmedLessons.length)} />
          <KpiCard label="Pending" value={String(pendingLessons.length)} />
          <KpiCard
            label="Rating"
            value={profile ? profile.average_rating.toFixed(1) : '0.0'}
          />
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
              <p className="sectionEyebrow">Next Class</p>
              <h2>Your next assigned lesson</h2>
            </div>

            <Link href="/tutor/sessions" className="smallLink">
              View Sessions
            </Link>
          </div>

          {nextLesson ? (
            <LessonCard lesson={nextLesson} featured />
          ) : (
            <EmptyState
              title="No confirmed lesson yet"
              text="When parents book and pay for your available slots, your next class will appear here."
            />
          )}
        </div>

        <aside className="card profileCard">
          <p className="sectionEyebrow">Tutor Status</p>
          <h2>Profile readiness</h2>

          {message ? <p className="message">{message}</p> : null}

          {profile ? (
            <div className="statusList">
              <StatusRow label="Approval" value={profile.approval_status} />
              <StatusRow label="Verification" value={profile.verification_status} />
              <StatusRow label="Listed" value={profile.is_listed ? 'Yes' : 'No'} />
              <StatusRow label="Experience" value={`${profile.years_of_experience} yrs`} />
              <StatusRow label="Timezone" value={profile.timezone} />
            </div>
          ) : null}

          <Link href="/tutor/onboarding" className="primaryLink fullLink">
            Update Tutor Profile
          </Link>
        </aside>
      </section>

      <section className="splitGrid">
        <div className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">Today</p>
              <h2>Today’s lessons</h2>
            </div>
          </div>

          {todayLessons.length === 0 ? (
            <EmptyState
              title="No lesson today"
              text="You have no confirmed class scheduled for today."
            />
          ) : (
            <div className="lessonList">
              {todayLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          )}
        </div>

        <div className="card reportCard">
          <p className="sectionEyebrow">After Each Lesson</p>
          <h2>Submit progress updates parents can value.</h2>

          <div className="reportPreview">
            <div>
              <strong>What was covered</strong>
              <span>Lesson topic, exercises and learning activity.</span>
            </div>
            <div>
              <strong>Child’s progress</strong>
              <span>Confidence, participation and improvement.</span>
            </div>
            <div>
              <strong>Next focus</strong>
              <span>What the next class should build on.</span>
            </div>
          </div>

          <Link href="/tutor/lesson-report" className="primaryLink fullLink">
            Open Lesson Reports
          </Link>
        </div>
      </section>

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">Assigned Lessons</p>
            <h2>Upcoming classes</h2>
          </div>

          <Link href="/tutor/sessions" className="smallLink">
            View all
          </Link>
        </div>

        {confirmedLessons.length === 0 ? (
          <EmptyState
            title="No assigned lessons yet"
            text="When parents book and pay for your available slots, confirmed lessons will appear here."
          />
        ) : (
          <div className="lessonList">
            {confirmedLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        )}
      </section>

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">Pending / Awaiting Payment</p>
            <h2>Parent bookings not yet confirmed</h2>
          </div>
        </div>

        {pendingLessons.length === 0 ? (
          <EmptyState
            title="No pending lessons"
            text="You currently have no parent bookings awaiting payment."
          />
        ) : (
          <div className="pendingGrid">
            {pendingLessons.map((lesson) => (
              <div key={lesson.id} className="pendingCard">
                <p className="pendingTitle">
                  {subjectLabels[lesson.subject_id] || lesson.subject_id}
                </p>

                <p className="pendingText">
                  {lesson.student_profiles?.full_name || 'Student'} •{' '}
                  {planLabels[lesson.plan_id] || lesson.plan_id}
                </p>

                <p className="pendingText">
                  {formatDate(lesson.lesson_date)} •{' '}
                  {lesson.lesson_time || 'Time pending'}
                </p>

                <span className="pendingBadge">Awaiting Payment</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <style jsx global>{styles}</style>
    </main>
  )
}

function LessonCard({
  lesson,
  featured = false,
}: {
  lesson: LessonBooking
  featured?: boolean
}) {
  const child = lesson.student_profiles

  return (
    <div className={featured ? 'lessonCard lessonCardFeatured' : 'lessonCard'}>
      <div className="lessonTop">
        <div>
          <p className="lessonSubject">
            {subjectLabels[lesson.subject_id] || lesson.subject_id}
          </p>

          <p className="lessonMeta">
            {child?.full_name || 'Student'} • {planLabels[lesson.plan_id] || lesson.plan_id}
          </p>

          <p className="lessonMeta">
            {[
              child?.child_age ? `Age ${child.child_age}` : null,
              child?.country_system,
              child?.country_class_label,
            ]
              .filter(Boolean)
              .join(' • ') || 'Student profile'}
          </p>
        </div>

        <span className="paidBadge">Confirmed</span>
      </div>

      <div className="lessonDetails">
        <Detail label="Date" value={formatDate(lesson.lesson_date)} />
        <Detail label="Time" value={lesson.lesson_time || '-'} />
        <Detail label="Timezone" value={lesson.timezone || 'Europe/London'} />
      </div>

      {lesson.notes ? (
        <div className="noteBox">
          <p className="noteLabel">Parent note</p>
          <p className="noteText">{lesson.notes}</p>
        </div>
      ) : null}

      <div className="lessonActions">
        {lesson.meeting_link ? (
  <Link
    href={`/classroom/${lesson.id}`}
    className="primaryLink actionBtn"
  >
    Join Lesson
  </Link>
) : (
  <span className="disabledButton">No meeting link yet</span>
)}

        {lesson.meeting_link ? (
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(lesson.meeting_link || '')}
            className="secondaryButton"
          >
            Copy Link
          </button>
        ) : null}

        <Link href="/tutor/lesson-report" className="secondaryButton">
          Add Report
        </Link>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detailBox">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
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

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="statusRow">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function EmptyState({ title, text }: { title: string; text: string }) {
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
    max-width: 900px;
    font-size: clamp(40px, 6vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.064em;
    font-weight: 950;
  }

  .subtitle {
    max-width: 780px;
    margin: 20px 0 0;
    color: #6f637e;
    font-size: 17px;
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
  .secondaryButton {
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
  .miniLink,
  .secondaryButton {
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
    min-height: 190px;
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

  .sectionHeader h2,
  .profileCard h2,
  .reportCard h2 {
    margin: 8px 0 0;
    font-size: clamp(26px, 3.3vw, 42px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .lessonList {
    display: grid;
    gap: 16px;
  }

  .lessonCard {
    padding: 22px;
    border-radius: 26px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .lessonCardFeatured {
    background: linear-gradient(135deg, #fbf8ff, #f3ecff);
  }

  .lessonTop {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
  }

  .lessonSubject {
    margin: 0;
    font-size: 23px;
    line-height: 1.1;
    letter-spacing: -0.03em;
    font-weight: 950;
  }

  .lessonMeta {
    margin: 7px 0 0;
    color: #6f637e;
    font-size: 14px;
    line-height: 1.5;
  }

  .paidBadge {
    padding: 8px 12px;
    border-radius: 999px;
    background: #ecfdf3;
    color: #027a48;
    font-weight: 950;
    font-size: 12px;
    white-space: nowrap;
  }

  .lessonDetails {
    margin-top: 18px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .detailBox {
    padding: 14px;
    border-radius: 18px;
    background: white;
    border: 1px solid rgba(124,58,237,0.1);
  }

  .detailBox p {
    margin: 0;
    color: #7a7088;
    font-weight: 850;
    font-size: 13px;
  }

  .detailBox strong {
    display: block;
    margin-top: 7px;
    font-weight: 950;
  }

  .noteBox {
    margin-top: 16px;
    padding: 16px;
    border-radius: 18px;
    background: rgba(124,58,237,0.06);
    border: 1px solid rgba(124,58,237,0.12);
  }

  .noteLabel {
    margin: 0;
    font-weight: 950;
  }

  .noteText {
    margin: 8px 0 0;
    color: #6f637e;
    line-height: 1.6;
  }

  .lessonActions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 18px;
  }

  .actionBtn,
  .secondaryButton,
  .disabledButton {
    min-height: 46px;
    padding: 0 17px;
    border-radius: 16px;
  }

  .secondaryButton {
    cursor: pointer;
    font-size: 14px;
  }

  .disabledButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #f3f0f8;
    color: #7a7088;
    font-weight: 950;
  }

  .statusList {
    margin: 22px 0;
    display: grid;
    gap: 0;
  }

  .statusRow {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 15px 0;
    border-bottom: 1px solid rgba(124,58,237,0.12);
  }

  .statusRow span {
    color: #7a7088;
    font-weight: 850;
  }

  .statusRow strong {
    text-align: right;
    font-weight: 950;
  }

  .fullLink {
    width: 100%;
  }

  .reportPreview {
    margin: 22px 0;
    display: grid;
    gap: 12px;
  }

  .reportPreview div {
    padding: 15px;
    border-radius: 20px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
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

  .pendingGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  .pendingCard {
    padding: 20px;
    border-radius: 24px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .pendingTitle {
    margin: 0;
    font-size: 20px;
    font-weight: 950;
  }

  .pendingText {
    margin: 8px 0 0;
    color: #6f637e;
    line-height: 1.5;
  }

  .pendingBadge {
    display: inline-flex;
    margin-top: 14px;
    padding: 8px 11px;
    border-radius: 999px;
    background: #fff7ed;
    color: #9a3412;
    font-weight: 950;
    font-size: 12px;
  }

  .emptyState {
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
    margin: 10px 0 0;
    color: #6f637e;
    line-height: 1.6;
  }

  .message {
    color: #6f637e;
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
    .lessonTop,
    .lessonActions {
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

    .heroActions {
      flex-direction: column;
    }

    .primaryLink,
    .secondaryLink,
    .secondaryButton,
    .disabledButton {
      width: 100%;
    }

    .kpiGrid,
    .quickGrid,
    .mainGrid,
    .splitGrid,
    .lessonDetails {
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

    .statusRow {
      align-items: flex-start;
      flex-direction: column;
      gap: 5px;
    }

    .statusRow strong {
      text-align: left;
    }
  }
`