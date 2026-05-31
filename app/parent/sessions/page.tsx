'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type ParentProfile = {
  id: string
  full_name: string
}

type LessonBooking = {
  id: string
  parent_id: string
  student_id: string
  subject_id: string
  tutor_id: string | null
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  meeting_link: string | null
  booking_frequency: string | null
  repeat_weeks: number | null
  parent_booking_group_id: string | null
}

type NameRow = {
  id: string
  full_name?: string
  name?: string
}

export default function ParentSessionsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading your lessons...')
  const [parent, setParent] = useState<ParentProfile | null>(null)
  const [lessons, setLessons] = useState<LessonBooking[]>([])
  const [students, setStudents] = useState<Record<string, string>>({})
  const [subjects, setSubjects] = useState<Record<string, string>>({})
  const [tutors, setTutors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
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

      const { data: parentProfile, error: parentError } = await supabase
        .from('parent_profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .maybeSingle()

      if (parentError || !parentProfile) {
        router.push('/parent/onboarding')
        return
      }

      setParent(parentProfile as ParentProfile)

      const { data: lessonRows, error: lessonError } = await supabase
        .from('lesson_bookings')
        .select(`
          id,
          parent_id,
          student_id,
          subject_id,
          tutor_id,
          lesson_date,
          lesson_time,
          timezone,
          status,
          payment_status,
          amount_gbp,
          meeting_link,
          booking_frequency,
          repeat_weeks,
          parent_booking_group_id
        `)
        .eq('parent_id', user.id)
        .order('lesson_date', { ascending: true })
        .order('lesson_time', { ascending: true })

      if (lessonError) {
        setMessage(lessonError.message)
        setLoading(false)
        return
      }

      const cleanLessons = (lessonRows ?? []) as LessonBooking[]
      setLessons(cleanLessons)

      const studentIds = Array.from(new Set(cleanLessons.map((x) => x.student_id).filter(Boolean)))
      const subjectIds = Array.from(new Set(cleanLessons.map((x) => x.subject_id).filter(Boolean)))
      const tutorIds = Array.from(new Set(cleanLessons.map((x) => x.tutor_id).filter(Boolean))) as string[]

      if (studentIds.length > 0) {
        const { data } = await supabase
          .from('student_profiles')
          .select('id, full_name')
          .in('id', studentIds)

        const map: Record<string, string> = {}
        ;((data ?? []) as NameRow[]).forEach((row) => {
          map[row.id] = row.full_name || 'Selected child'
        })
        setStudents(map)
      }

      if (subjectIds.length > 0) {
        const { data } = await supabase
          .from('subjects')
          .select('id, name')
          .in('id', subjectIds)

        const map: Record<string, string> = {}
        ;((data ?? []) as NameRow[]).forEach((row) => {
          map[row.id] = row.name || 'Selected subject'
        })
        setSubjects(map)
      }

      if (tutorIds.length > 0) {
        const { data } = await supabase
          .from('tutor_profiles')
          .select('id, full_name')
          .in('id', tutorIds)

        const map: Record<string, string> = {}
        ;((data ?? []) as NameRow[]).forEach((row) => {
          map[row.id] = row.full_name || 'Approved tutor'
        })
        setTutors(map)
      }

      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [router])

  const upcomingLessons = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]

    return lessons.filter(
      (lesson) =>
        lesson.lesson_date &&
        lesson.lesson_date >= today &&
        (lesson.status === 'CONFIRMED' || lesson.payment_status === 'PAID')
    )
  }, [lessons])

  const pendingPayments = useMemo(() => {
    return lessons.filter((lesson) => lesson.payment_status !== 'PAID')
  }, [lessons])

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Parent Portal</p>
          <h1>Loading your lessons...</h1>
          <p className="subtitle">{message}</p>
        </section>

        <style jsx>{styles}</style>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Parent Portal</p>

        <h1>My Lessons</h1>

        <p className="subtitle">
          {parent
            ? `Track ${parent.full_name}'s private 1-to-1 lessons, meeting links, payment status, and learning schedule.`
            : 'Track private 1-to-1 lessons, meeting links, payment status, and learning schedule.'}
        </p>

        <div className="stats">
          <Stat label="Upcoming Lessons" value={String(upcomingLessons.length)} />
          <Stat label="Pending Payments" value={String(pendingPayments.length)} />
          <Stat label="Learning Type" value="1-to-1" />
        </div>

        <div className="actions">
          <Link href="/parent/dashboard" className="secondaryBtn">
            Back to Dashboard
          </Link>

          <Link href="/parent/students" className="primaryBtn">
            Book New Lesson
          </Link>
        </div>
      </section>

      <section className="card">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">Upcoming Learning</p>
            <h2>Confirmed lesson schedule</h2>
          </div>
        </div>

        {upcomingLessons.length === 0 ? (
          <EmptyState
            title="No confirmed lessons yet"
            text="Once payment is completed, your confirmed private lessons will appear here."
            href="/parent/students"
            button="Book a Lesson"
          />
        ) : (
          <div className="lessonList">
            {upcomingLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                studentName={students[lesson.student_id] || 'Selected child'}
                subjectName={subjects[lesson.subject_id] || 'Selected subject'}
                tutorName={
                  lesson.tutor_id
                    ? tutors[lesson.tutor_id] || 'Approved tutor'
                    : 'Tutor pending'
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">All Bookings</p>
            <h2>Payment and lesson records</h2>
          </div>
        </div>

        {lessons.length === 0 ? (
          <EmptyState
            title="No lessons yet"
            text="Start by choosing your child, subject, plan, and weekly lesson time."
            href="/parent/students"
            button="Start Learning"
          />
        ) : (
          <div className="bookingGrid">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bookingCard">
                <h3>{subjects[lesson.subject_id] || 'Selected subject'}</h3>

                <p>
                  {students[lesson.student_id] || 'Selected child'} •{' '}
                  {lesson.tutor_id
                    ? tutors[lesson.tutor_id] || 'Approved tutor'
                    : 'Tutor pending'}
                </p>

                <p>
                  {formatDate(lesson.lesson_date)} •{' '}
                  {lesson.lesson_time || 'Time pending'}
                </p>

                <StatusBadge
                  status={
                    lesson.payment_status === 'PAID'
                      ? 'Paid'
                      : 'Pending Payment'
                  }
                  paid={lesson.payment_status === 'PAID'}
                />

                {lesson.payment_status !== 'PAID' ? (
                  <Link href={`/payment?bookingId=${lesson.id}`} className="payLink">
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function LessonCard({
  lesson,
  studentName,
  subjectName,
  tutorName,
}: {
  lesson: LessonBooking
  studentName: string
  subjectName: string
  tutorName: string
}) {
  const canJoin =
    lesson.payment_status === 'PAID' &&
    lesson.status === 'CONFIRMED' &&
    Boolean(lesson.meeting_link)

  return (
    <article className="lessonCard">
      <div className="lessonMain">
        <p className="eyebrow">Private 1-to-1 Lesson</p>
        <h3>{subjectName}</h3>

        <p className="lessonMeta">
          Student: <strong>{studentName}</strong> • Tutor:{' '}
          <strong>{tutorName}</strong>
        </p>

        <div className="infoGrid">
          <Info label="Date" value={formatDate(lesson.lesson_date)} />
          <Info label="Time" value={lesson.lesson_time || 'Time pending'} />
          <Info label="Timezone" value={lesson.timezone || 'Europe/London'} />
          <Info label="Status" value={lesson.status} />
        </div>
      </div>

      <aside className="lessonSide">
        <StatusBadge
          status={lesson.payment_status === 'PAID' ? 'Paid' : 'Pending Payment'}
          paid={lesson.payment_status === 'PAID'}
        />

        {canJoin ? (
          <a
            href={lesson.meeting_link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="primaryBtn full"
          >
            Join Lesson
          </a>
        ) : lesson.payment_status !== 'PAID' ? (
          <Link href={`/payment?bookingId=${lesson.id}`} className="primaryBtn full">
            Complete Payment
          </Link>
        ) : (
          <button className="secondaryBtn full" disabled>
            Meeting Link Pending
          </button>
        )}

        <div className="progressBox">
          <strong>Progress tracking</strong>
          <p>
            Tutor notes and learning summaries can be added after each completed
            lesson.
          </p>
        </div>
      </aside>
    </article>
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

function StatusBadge({ status, paid }: { status: string; paid: boolean }) {
  return (
    <span className={paid ? 'status paid' : 'status pending'}>
      {status}
    </span>
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
    <div className="empty">
      <h3>{title}</h3>
      <p>{text}</p>
      <Link href={href} className="primaryBtn">
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
    year: 'numeric',
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
    max-width: 780px;
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

  .stats {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .stat {
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(124,58,237,0.12);
    box-shadow: 0 18px 45px rgba(71,43,117,0.07);
  }

  .stat span {
    display: block;
    color: #7a7088;
    font-weight: 850;
    font-size: 14px;
  }

  .stat strong {
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

  .secondaryBtn:disabled {
    opacity: 0.65;
  }

  .full {
    width: 100%;
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
    margin-bottom: 22px;
  }

  .sectionHead h2 {
    margin: 10px 0 0;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .lessonList {
    display: grid;
    gap: 18px;
  }

  .lessonCard {
    display: grid;
    grid-template-columns: 1fr 310px;
    gap: 22px;
    padding: 24px;
    border-radius: 28px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .lessonMain h3 {
    margin: 10px 0 0;
    font-size: 30px;
    letter-spacing: -0.04em;
  }

  .lessonMeta {
    margin: 10px 0 0;
    color: #6f637e;
    line-height: 1.6;
  }

  .infoGrid {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .info {
    padding: 14px;
    border-radius: 18px;
    background: white;
    border: 1px solid rgba(124,58,237,0.1);
  }

  .info span {
    display: block;
    color: #7a7088;
    font-size: 12px;
    font-weight: 850;
  }

  .info strong {
    display: block;
    margin-top: 6px;
    color: #241535;
    font-size: 14px;
  }

  .lessonSide {
    display: grid;
    gap: 14px;
    align-content: start;
  }

  .status {
    display: inline-flex;
    width: fit-content;
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

  .progressBox {
    padding: 18px;
    border-radius: 22px;
    background: white;
    border: 1px solid rgba(124,58,237,0.1);
  }

  .progressBox strong {
    display: block;
    color: #241535;
  }

  .progressBox p {
    margin: 8px 0 0;
    color: #6f637e;
    line-height: 1.6;
    font-size: 14px;
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

  .bookingCard h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 950;
  }

  .bookingCard p {
    margin: 8px 0 0;
    color: #6f637e;
    line-height: 1.5;
    font-size: 14px;
  }

  .payLink {
    display: inline-flex;
    margin-top: 14px;
    color: #6d28d9;
    font-weight: 950;
    text-decoration: none;
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
    margin: 10px 0 20px;
    color: #6f637e;
    line-height: 1.7;
  }

  @media (max-width: 920px) {
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

    .stats,
    .lessonCard,
    .infoGrid {
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

    .lessonCard {
      padding: 20px;
    }
  }
`