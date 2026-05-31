'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type ParentProfile = {
  id: string
  full_name: string
}

type ProgressNote = {
  id: string
  lesson_booking_id: string
  tutor_id: string
  student_id: string
  lesson_topic: string | null
  strengths: string | null
  improvement_area: string | null
  homework: string | null
  tutor_comment: string | null
  attendance: string
  created_at: string
}

type LessonBooking = {
  id: string
  parent_id: string
  student_id: string
  subject_id: string
  tutor_id: string | null
  lesson_date: string | null
  lesson_time: string | null
  status: string
}

type NameMap = Record<string, string>

export default function ParentProgressPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading progress reports...')
  const [parent, setParent] = useState<ParentProfile | null>(null)
  const [notes, setNotes] = useState<ProgressNote[]>([])
  const [lessons, setLessons] = useState<Record<string, LessonBooking>>({})
  const [students, setStudents] = useState<NameMap>({})
  const [subjects, setSubjects] = useState<NameMap>({})
  const [tutors, setTutors] = useState<NameMap>({})

  useEffect(() => {
    async function loadProgress() {
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
        .select(
          'id, parent_id, student_id, subject_id, tutor_id, lesson_date, lesson_time, status'
        )
        .eq('parent_id', user.id)
        .eq('status', 'COMPLETED')
        .order('lesson_date', { ascending: false })

      if (lessonError) {
        setMessage(lessonError.message)
        setLoading(false)
        return
      }

      const cleanLessons = (lessonRows ?? []) as LessonBooking[]
      const lessonMap: Record<string, LessonBooking> = {}

      cleanLessons.forEach((lesson) => {
        lessonMap[lesson.id] = lesson
      })

      setLessons(lessonMap)

      const lessonIds = cleanLessons.map((lesson) => lesson.id)

      if (lessonIds.length === 0) {
        setNotes([])
        setMessage('')
        setLoading(false)
        return
      }

      const { data: noteRows, error: noteError } = await supabase
        .from('lesson_progress_notes')
        .select(
          'id, lesson_booking_id, tutor_id, student_id, lesson_topic, strengths, improvement_area, homework, tutor_comment, attendance, created_at'
        )
        .in('lesson_booking_id', lessonIds)
        .order('created_at', { ascending: false })

      if (noteError) {
        setMessage(noteError.message)
        setLoading(false)
        return
      }

      const cleanNotes = (noteRows ?? []) as ProgressNote[]
      setNotes(cleanNotes)

      const studentIds = Array.from(new Set(cleanLessons.map((x) => x.student_id)))
      const subjectIds = Array.from(new Set(cleanLessons.map((x) => x.subject_id)))
      const tutorIds = Array.from(
        new Set(cleanLessons.map((x) => x.tutor_id).filter(Boolean))
      ) as string[]

      if (studentIds.length > 0) {
        const { data } = await supabase
          .from('student_profiles')
          .select('id, full_name')
          .in('id', studentIds)

        const map: NameMap = {}
        ;((data ?? []) as any[]).forEach((row) => {
          map[row.id] = row.full_name
        })
        setStudents(map)
      }

      if (subjectIds.length > 0) {
        const { data } = await supabase
          .from('subjects')
          .select('id, name')
          .in('id', subjectIds)

        const map: NameMap = {}
        ;((data ?? []) as any[]).forEach((row) => {
          map[row.id] = row.name
        })
        setSubjects(map)
      }

      if (tutorIds.length > 0) {
        const { data } = await supabase
          .from('tutor_profiles')
          .select('id, full_name')
          .in('id', tutorIds)

        const map: NameMap = {}
        ;((data ?? []) as any[]).forEach((row) => {
          map[row.id] = row.full_name
        })
        setTutors(map)
      }

      setMessage('')
      setLoading(false)
    }

    loadProgress()
  }, [router])

  const attendanceSummary = useMemo(() => {
    const present = notes.filter((note) => note.attendance === 'present').length
    const late = notes.filter((note) => note.attendance === 'late').length
    const absent = notes.filter((note) => note.attendance === 'absent').length

    return { present, late, absent }
  }, [notes])

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Learning Progress</p>
          <h1>Loading progress reports...</h1>
          <p className="subtitle">{message}</p>
        </section>

        <style jsx>{styles}</style>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Learning Progress</p>

        <h1>
          {parent?.full_name ? `${parent.full_name.split(' ')[0]}, ` : ''}
          track your child’s progress.
        </h1>

        <p className="subtitle">
          View tutor lesson reports, strengths, homework, and areas to improve
          after each completed private 1-to-1 class.
        </p>

        <div className="kpiGrid">
          <Kpi label="Reports" value={String(notes.length)} />
          <Kpi label="Present" value={String(attendanceSummary.present)} />
          <Kpi label="Late" value={String(attendanceSummary.late)} />
          <Kpi label="Absent" value={String(attendanceSummary.absent)} />
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
          <p className="eyebrow">Tutor Reports</p>
          <h2>Recent learning updates</h2>
        </div>

        {notes.length === 0 ? (
          <div className="empty">
            <h3>No progress reports yet</h3>
            <p>
              Once a tutor completes a lesson and submits a report, it will
              appear here for you to review.
            </p>
            <Link href="/parent/students" className="primaryBtn">
              Start Learning
            </Link>
          </div>
        ) : (
          <div className="reportList">
            {notes.map((note) => {
              const lesson = lessons[note.lesson_booking_id]

              return (
                <article key={note.id} className="reportCard">
                  <div className="reportTop">
                    <div>
                      <p className="eyebrow">Private 1-to-1 Report</p>
                      <h3>{note.lesson_topic || 'Lesson Update'}</h3>

                      <p className="meta">
                        {students[note.student_id] || 'Selected child'} •{' '}
                        {lesson
                          ? subjects[lesson.subject_id] || 'Selected subject'
                          : 'Selected subject'}
                      </p>
                    </div>

                    <span
                      className={
                        note.attendance === 'present'
                          ? 'attendance present'
                          : note.attendance === 'late'
                            ? 'attendance late'
                            : 'attendance absent'
                      }
                    >
                      {note.attendance}
                    </span>
                  </div>

                  <div className="infoGrid">
                    <Info
                      label="Lesson Date"
                      value={formatDate(lesson?.lesson_date || note.created_at)}
                    />
                    <Info label="Time" value={lesson?.lesson_time || 'Time pending'} />
                    <Info
                      label="Tutor"
                      value={
                        lesson?.tutor_id
                          ? tutors[lesson.tutor_id] || 'Tutor'
                          : 'Tutor'
                      }
                    />
                    <Info label="Report Date" value={formatDate(note.created_at)} />
                  </div>

                  <div className="progressGrid">
                    <ProgressBox
                      title="Strengths"
                      text={note.strengths || 'No strengths added yet.'}
                    />

                    <ProgressBox
                      title="Area to Improve"
                      text={
                        note.improvement_area ||
                        'No improvement area added yet.'
                      }
                    />

                    <ProgressBox
                      title="Homework"
                      text={note.homework || 'No homework added yet.'}
                    />

                    <ProgressBox
                      title="Tutor Comment"
                      text={note.tutor_comment || 'No tutor comment added yet.'}
                    />
                  </div>
                </article>
              )
            })}
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ProgressBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="progressBox">
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  )
}

function formatDate(dateString: string | null) {
  if (!dateString) return '-'

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
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

  .sectionHead h2 {
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

  .empty p {
    margin: 10px 0 20px;
    color: #6f637e;
    line-height: 1.7;
  }

  .reportList {
    display: grid;
    gap: 22px;
  }

  .reportCard {
    padding: 24px;
    border-radius: 30px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .reportTop {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
  }

  .reportTop h3 {
    margin: 10px 0 0;
    font-size: 32px;
    letter-spacing: -0.04em;
  }

  .meta {
    margin: 8px 0 0;
    color: #6f637e;
    line-height: 1.6;
  }

  .attendance {
    padding: 8px 12px;
    border-radius: 999px;
    font-weight: 950;
    font-size: 12px;
    text-transform: capitalize;
  }

  .present {
    background: #ecfdf3;
    color: #027a48;
  }

  .late {
    background: #fff7ed;
    color: #9a3412;
  }

  .absent {
    background: #fef2f2;
    color: #b91c1c;
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

  .progressGrid {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .progressBox {
    padding: 18px;
    border-radius: 22px;
    background: white;
    border: 1px solid rgba(124,58,237,0.1);
  }

  .progressBox h4 {
    margin: 0;
    color: #241535;
    font-size: 17px;
    font-weight: 950;
  }

  .progressBox p {
    margin: 8px 0 0;
    color: #6f637e;
    line-height: 1.65;
    font-size: 14px;
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

    .kpiGrid,
    .infoGrid,
    .progressGrid {
      grid-template-columns: 1fr;
    }

    .actions,
    .reportTop {
      flex-direction: column;
    }

    .primaryBtn,
    .secondaryBtn {
      width: 100%;
    }

    .card,
    .reportCard {
      padding: 22px 18px;
      border-radius: 28px;
    }
  }
`