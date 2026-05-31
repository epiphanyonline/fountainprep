'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type TutorProfile = {
  id: string
  full_name: string
}

type LessonBooking = {
  id: string
  student_id: string
  subject_id: string
  tutor_id: string
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string
  payment_status: string
  meeting_link: string | null
  amount_gbp: number | null
}

type ProgressNote = {
  id: string
  lesson_booking_id: string
  lesson_topic: string | null
  strengths: string | null
  improvement_area: string | null
  homework: string | null
  tutor_comment: string | null
  attendance: string
}

type NameMap = Record<string, string>

type ReportForm = {
  lesson_topic: string
  strengths: string
  improvement_area: string
  homework: string
  tutor_comment: string
  attendance: string
}

const TUTOR_RATE_USD = 4

function emptyForm(): ReportForm {
  return {
    lesson_topic: '',
    strengths: '',
    improvement_area: '',
    homework: '',
    tutor_comment: '',
    attendance: 'present',
  }
}

export default function TutorLessonReportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedBookingId = searchParams.get('bookingId')

  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [message, setMessage] = useState('Loading lesson reports...')
  const [tutor, setTutor] = useState<TutorProfile | null>(null)
  const [lessons, setLessons] = useState<LessonBooking[]>([])
  const [students, setStudents] = useState<NameMap>({})
  const [subjects, setSubjects] = useState<NameMap>({})
  const [notes, setNotes] = useState<Record<string, ProgressNote>>({})
  const [forms, setForms] = useState<Record<string, ReportForm>>({})

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
      await loadLessons(tutorProfile.id)

      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [router, selectedBookingId])

  async function loadLessons(tutorId: string) {
    let query = supabase
      .from('lesson_bookings')
      .select(`
        id,
        student_id,
        subject_id,
        tutor_id,
        lesson_date,
        lesson_time,
        timezone,
        status,
        payment_status,
        meeting_link,
        amount_gbp
      `)
      .eq('tutor_id', tutorId)
      .in('status', ['CONFIRMED', 'COMPLETED'])
      .order('lesson_date', { ascending: false })
      .order('lesson_time', { ascending: false })

    if (selectedBookingId) {
      query = query.eq('id', selectedBookingId)
    }

    const { data, error } = await query

    if (error) {
      setMessage(error.message)
      return
    }

    const cleanLessons = (data ?? []) as LessonBooking[]
    setLessons(cleanLessons)

    const studentIds = Array.from(new Set(cleanLessons.map((x) => x.student_id)))
    const subjectIds = Array.from(new Set(cleanLessons.map((x) => x.subject_id)))
    const lessonIds = cleanLessons.map((x) => x.id)

    if (studentIds.length > 0) {
      const { data: studentRows } = await supabase
        .from('student_profiles')
        .select('id, full_name')
        .in('id', studentIds)

      const map: NameMap = {}
      ;((studentRows ?? []) as any[]).forEach((row) => {
        map[row.id] = row.full_name
      })
      setStudents(map)
    }

    if (subjectIds.length > 0) {
      const { data: subjectRows } = await supabase
        .from('subjects')
        .select('id, name')
        .in('id', subjectIds)

      const map: NameMap = {}
      ;((subjectRows ?? []) as any[]).forEach((row) => {
        map[row.id] = row.name
      })
      setSubjects(map)
    }

    if (lessonIds.length > 0) {
      const { data: noteRows } = await supabase
        .from('lesson_progress_notes')
        .select(`
          id,
          lesson_booking_id,
          lesson_topic,
          strengths,
          improvement_area,
          homework,
          tutor_comment,
          attendance
        `)
        .in('lesson_booking_id', lessonIds)

      const noteMap: Record<string, ProgressNote> = {}
      const formMap: Record<string, ReportForm> = {}

      ;((noteRows ?? []) as ProgressNote[]).forEach((note) => {
        noteMap[note.lesson_booking_id] = note
        formMap[note.lesson_booking_id] = {
          lesson_topic: note.lesson_topic ?? '',
          strengths: note.strengths ?? '',
          improvement_area: note.improvement_area ?? '',
          homework: note.homework ?? '',
          tutor_comment: note.tutor_comment ?? '',
          attendance: note.attendance ?? 'present',
        }
      })

      cleanLessons.forEach((lesson) => {
        if (!formMap[lesson.id]) formMap[lesson.id] = emptyForm()
      })

      setNotes(noteMap)
      setForms(formMap)
    }
  }

  const completedCount = useMemo(
    () => lessons.filter((lesson) => lesson.status === 'COMPLETED').length,
    [lessons]
  )

  const pendingReports = useMemo(
    () => lessons.filter((lesson) => !notes[lesson.id]).length,
    [lessons, notes]
  )

  function updateForm(lessonId: string, field: keyof ReportForm, value: string) {
    setForms((prev) => ({
      ...prev,
      [lessonId]: {
        ...(prev[lessonId] ?? emptyForm()),
        [field]: value,
      },
    }))
  }

  async function saveLessonReport(lesson: LessonBooking) {
    if (!tutor) return

    const form = forms[lesson.id] ?? emptyForm()

    if (!form.lesson_topic.trim()) {
      setMessage('Please add the lesson topic before saving.')
      return
    }

    setSavingId(lesson.id)
    setMessage('Saving lesson report...')

    const existingNote = notes[lesson.id]

    if (existingNote) {
      const { error } = await supabase
        .from('lesson_progress_notes')
        .update({
          lesson_topic: form.lesson_topic.trim(),
          strengths: form.strengths.trim(),
          improvement_area: form.improvement_area.trim(),
          homework: form.homework.trim(),
          tutor_comment: form.tutor_comment.trim(),
          attendance: form.attendance,
        })
        .eq('id', existingNote.id)
        .eq('tutor_id', tutor.id)

      if (error) {
        setMessage(error.message)
        setSavingId('')
        return
      }
    } else {
      const { error } = await supabase.from('lesson_progress_notes').insert({
        lesson_booking_id: lesson.id,
        tutor_id: tutor.id,
        student_id: lesson.student_id,
        lesson_topic: form.lesson_topic.trim(),
        strengths: form.strengths.trim(),
        improvement_area: form.improvement_area.trim(),
        homework: form.homework.trim(),
        tutor_comment: form.tutor_comment.trim(),
        attendance: form.attendance,
      })

      if (error) {
        setMessage(error.message)
        setSavingId('')
        return
      }
    }

    await supabase
      .from('lesson_bookings')
      .update({ status: 'COMPLETED' })
      .eq('id', lesson.id)
      .eq('tutor_id', tutor.id)

    const { data: existingEarning } = await supabase
      .from('tutor_earnings')
      .select('id')
      .eq('booking_id', lesson.id)
      .eq('tutor_id', tutor.id)
      .maybeSingle()

    if (!existingEarning) {
      await supabase.from('tutor_earnings').insert({
        tutor_id: tutor.id,
        booking_id: lesson.id,
        lesson_amount: lesson.amount_gbp || 0,
        platform_fee: Math.max(Number(lesson.amount_gbp || 0) - TUTOR_RATE_USD, 0),
        tutor_amount: TUTOR_RATE_USD,
        status: 'pending',
        lesson_date: lesson.lesson_date,
      })
    }

    await loadLessons(tutor.id)

    setMessage('Lesson report saved, lesson marked completed, and $4 tutor earning created.')
    setSavingId('')
  }

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Lesson Report</p>
          <h1>Loading lesson reports...</h1>
          <p className="subtitle">{message}</p>
        </section>

        <style jsx>{styles}</style>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Tutor Lesson Report</p>

        <h1>Complete lessons and update parents.</h1>

        <p className="subtitle">
          Submit a short parent-friendly report after each private 1-to-1 lesson.
          Once saved, the lesson is marked completed and your <strong>$4 tutor earning</strong> is created.
        </p>

        <div className="kpiGrid">
          <Kpi label="Lessons" value={String(lessons.length)} />
          <Kpi label="Completed" value={String(completedCount)} />
          <Kpi label="Pending Reports" value={String(pendingReports)} />
          <Kpi label="Tutor Pay" value="$4/class" />
        </div>

        <div className="actions">
          <Link href="/tutor/dashboard" className="secondaryBtn">
            Back to Dashboard
          </Link>

          <Link href="/tutor/earnings" className="primaryBtn">
            View Earnings
          </Link>
        </div>
      </section>

      {message ? <div className="notice">{message}</div> : null}

      <section className="card">
        <div className="sectionHead">
          <p className="eyebrow">Assigned Lessons</p>
          <h2>Write lesson reports</h2>
        </div>

        {lessons.length === 0 ? (
          <div className="empty">
            <h3>No confirmed lessons found</h3>
            <p>
              Confirmed parent bookings will appear here after payment has been completed.
            </p>
            <Link href="/tutor/availability" className="primaryBtn">
              Manage Availability
            </Link>
          </div>
        ) : (
          <div className="lessonList">
            {lessons.map((lesson) => (
              <article key={lesson.id} className="lessonCard">
                <div className="lessonTop">
                  <div>
                    <p className="eyebrow">Private 1-to-1 Lesson</p>
                    <h3>{subjects[lesson.subject_id] || 'Selected subject'}</h3>

                    <p className="meta">
                      Student: <strong>{students[lesson.student_id] || 'Student'}</strong>
                    </p>
                  </div>

                  <span
                    className={
                      lesson.status === 'COMPLETED'
                        ? 'status completed'
                        : 'status confirmed'
                    }
                  >
                    {lesson.status}
                  </span>
                </div>

                <div className="infoGrid">
                  <Info label="Date" value={formatDate(lesson.lesson_date)} />
                  <Info label="Time" value={lesson.lesson_time || 'Time pending'} />
                  <Info label="Timezone" value={lesson.timezone || 'Europe/London'} />
                  <Info label="Payment" value={lesson.payment_status} />
                </div>

                <div className="reportBox">
                  <div className="sectionHead small">
                    <p className="eyebrow">Parent Progress Update</p>
                    <h2>{notes[lesson.id] ? 'Update report' : 'New report'}</h2>
                  </div>

                  <div className="formGrid">
                    <label>
                      <span>Attendance</span>
                      <select
                        value={forms[lesson.id]?.attendance ?? 'present'}
                        onChange={(e) =>
                          updateForm(lesson.id, 'attendance', e.target.value)
                        }
                      >
                        <option value="present">Present</option>
                        <option value="late">Late</option>
                        <option value="absent">Absent</option>
                      </select>
                    </label>

                    <label>
                      <span>Lesson topic</span>
                      <input
                        value={forms[lesson.id]?.lesson_topic ?? ''}
                        onChange={(e) =>
                          updateForm(lesson.id, 'lesson_topic', e.target.value)
                        }
                        placeholder="e.g. Fractions, Yoruba greetings, Coding loops"
                      />
                    </label>
                  </div>

                  <label>
                    <span>Strengths</span>
                    <textarea
                      value={forms[lesson.id]?.strengths ?? ''}
                      onChange={(e) =>
                        updateForm(lesson.id, 'strengths', e.target.value)
                      }
                      placeholder="What did the child do well?"
                    />
                  </label>

                  <label>
                    <span>Area to improve</span>
                    <textarea
                      value={forms[lesson.id]?.improvement_area ?? ''}
                      onChange={(e) =>
                        updateForm(lesson.id, 'improvement_area', e.target.value)
                      }
                      placeholder="What should the child practise next?"
                    />
                  </label>

                  <label>
                    <span>Homework / next task</span>
                    <textarea
                      value={forms[lesson.id]?.homework ?? ''}
                      onChange={(e) =>
                        updateForm(lesson.id, 'homework', e.target.value)
                      }
                      placeholder="Suggested homework or practice."
                    />
                  </label>

                  <label>
                    <span>Tutor comment</span>
                    <textarea
                      value={forms[lesson.id]?.tutor_comment ?? ''}
                      onChange={(e) =>
                        updateForm(lesson.id, 'tutor_comment', e.target.value)
                      }
                      placeholder="Short parent-friendly summary."
                    />
                  </label>

                  <button
                    type="button"
                    className="primaryBtn full"
                    disabled={savingId === lesson.id}
                    onClick={() => saveLessonReport(lesson)}
                  >
                    {savingId === lesson.id
                      ? 'Saving...'
                      : notes[lesson.id]
                        ? 'Update Lesson Report'
                        : 'Save Report & Complete Lesson'}
                  </button>
                </div>
              </article>
            ))}
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
    max-width: 820px;
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

  .secondaryBtn {
    background: white;
    color: #351e55;
    border: 1px solid rgba(124,58,237,0.16);
  }

  .primaryBtn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  .sectionHead.small {
    margin-bottom: 18px;
  }

  .sectionHead h2 {
    margin: 10px 0 0;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .sectionHead.small h2 {
    font-size: 26px;
  }

  .lessonList {
    display: grid;
    gap: 22px;
  }

  .lessonCard {
    padding: 24px;
    border-radius: 30px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .lessonTop {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
  }

  .lessonTop h3 {
    margin: 10px 0 0;
    font-size: 32px;
    letter-spacing: -0.04em;
  }

  .meta {
    color: #6f637e;
    line-height: 1.6;
  }

  .status {
    padding: 8px 12px;
    border-radius: 999px;
    font-weight: 950;
    font-size: 12px;
    white-space: nowrap;
  }

  .confirmed {
    background: #eff6ff;
    color: #1d4ed8;
  }

  .completed {
    background: #ecfdf3;
    color: #027a48;
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

  .reportBox {
    margin-top: 24px;
    padding: 22px;
    border-radius: 26px;
    background: white;
    border: 1px solid rgba(124,58,237,0.1);
  }

  .formGrid {
    display: grid;
    grid-template-columns: 0.65fr 1.35fr;
    gap: 14px;
  }

  label {
    display: block;
    margin-top: 14px;
  }

  label span {
    display: block;
    color: #7a7088;
    font-weight: 850;
    font-size: 14px;
    margin-bottom: 8px;
  }

  input,
  select,
  textarea {
    width: 100%;
    border-radius: 18px;
    border: 1px solid rgba(124,58,237,0.16);
    background: #fbf8ff;
    color: #241535;
    font: inherit;
    font-weight: 750;
  }

  input,
  select {
    min-height: 52px;
    padding: 0 14px;
  }

  textarea {
    min-height: 92px;
    padding: 14px;
    resize: vertical;
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
    .formGrid {
      grid-template-columns: 1fr;
    }

    .actions,
    .lessonTop {
      flex-direction: column;
    }

    .primaryBtn,
    .secondaryBtn {
      width: 100%;
    }

    .card,
    .lessonCard,
    .reportBox {
      padding: 22px 18px;
      border-radius: 28px;
    }
  }
`