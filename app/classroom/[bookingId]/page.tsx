 'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { onLessonReportReady } from '../../lib/events'
import LessonControlBar from './components/LessonControlBar'

type StudentRow = {
  full_name: string | null
}

type SubjectRow = {
  name: string | null
}

type TutorProfileRow = {
  id?: string | null
  user_id?: string | null
  full_name: string | null
  photo_url: string | null
  qualification_summary: string | null
  years_of_experience: number | null
}

type Booking = {
  id: string
  parent_id: string
  tutor_id: string | null
  student_id: string | null
  subject_id: string | null
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  meeting_link: string | null
  status: string | null
  payment_status: string | null
  notes: string | null
  classroom_status: string | null
  classroom_started_at: string | null
  classroom_ended_at: string | null
  classroom_duration_minutes: number | null
  attendance_status: string | null
  students?: StudentRow | null
  subjects?: SubjectRow | null
  tutor_profiles?: TutorProfileRow | null
}

type ClassroomNotes = {
  lesson_objectives: string | null
  tutor_notes: string | null
  homework: string | null
  resources: string | null
  completion_status: string | null
  completed_at: string | null
}

export default function ClassroomPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = String(params.bookingId || '')

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [canEdit, setCanEdit] = useState(false)

  const [lessonObjectives, setLessonObjectives] = useState('')
  const [tutorNotes, setTutorNotes] = useState('')
  const [homework, setHomework] = useState('')
  const [resources, setResources] = useState('')
  const [completionStatus, setCompletionStatus] = useState('IN_PROGRESS')
  const [completedAt, setCompletedAt] = useState<string | null>(null)
  const [savingNotes, setSavingNotes] = useState(false)

  const videoRef = useRef<HTMLDivElement | null>(null)

  const [classroomStatus, setClassroomStatus] = useState('NOT_STARTED')
  const [classroomStartedAt, setClassroomStartedAt] = useState<string | null>(
    null
  )
  const [classroomEndedAt, setClassroomEndedAt] = useState<string | null>(null)
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState('present')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [updatingClassroom, setUpdatingClassroom] = useState(false)

  useEffect(() => {
    async function loadClassroom() {
      setLoading(true)
      setMessage('')

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('lesson_bookings')
        .select(`
          id,
          parent_id,
          tutor_id,
          student_id,
          subject_id,
          lesson_date,
          lesson_time,
          timezone,
          meeting_link,
          status,
          payment_status,
          notes,
          classroom_status,
          classroom_started_at,
          classroom_ended_at,
          classroom_duration_minutes,
          attendance_status
        `)
        .eq('id', bookingId)
        .maybeSingle()

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      if (!data) {
        setMessage('Classroom not found.')
        setLoading(false)
        return
      }

      const raw = data as Booking

      let studentRow: StudentRow | null = null
      let subjectRow: SubjectRow | null = null
      let tutorRow: TutorProfileRow | null = null

      if (raw.student_id) {
        const { data: studentData } = await supabase
          .from('student_profiles')
          .select('full_name')
          .eq('id', raw.student_id)
          .maybeSingle()

        studentRow = studentData
      }

      if (raw.subject_id) {
        const { data: subjectData } = await supabase
          .from('subjects')
          .select('name')
          .eq('id', raw.subject_id)
          .maybeSingle()

        subjectRow = subjectData
      }

      if (raw.tutor_id) {
        const { data: tutorData } = await supabase
          .from('tutor_profiles')
          .select(`
            id,
            user_id,
            full_name,
            photo_url,
            qualification_summary,
            years_of_experience
          `)
          .eq('id', raw.tutor_id)
          .maybeSingle()

        tutorRow = tutorData
      }

      const row: Booking = {
        ...raw,
        students: studentRow,
        subjects: subjectRow,
        tutor_profiles: tutorRow,
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      const isParent = row.parent_id === user.id
      const isTutor = row.tutor_profiles?.user_id === user.id
      const isAdmin = profile?.role === 'ADMIN'

      if (!isParent && !isTutor && !isAdmin) {
        setMessage('You do not have access to this classroom.')
        setLoading(false)
        return
      }

      setCanEdit(isTutor || isAdmin)
      setBooking(row)

      setClassroomStatus(row.classroom_status || 'NOT_STARTED')
      setClassroomStartedAt(row.classroom_started_at || null)
      setClassroomEndedAt(row.classroom_ended_at || null)
      setDurationMinutes(row.classroom_duration_minutes || null)
      setAttendanceStatus(row.attendance_status || 'present')

      const { data: noteRow } = await supabase
        .from('lesson_classroom_notes')
        .select(`
          lesson_objectives,
          tutor_notes,
          homework,
          resources,
          completion_status,
          completed_at
        `)
        .eq('booking_id', bookingId)
        .maybeSingle()

      if (noteRow) {
        const notes = noteRow as ClassroomNotes
        setLessonObjectives(notes.lesson_objectives ?? '')
        setTutorNotes(notes.tutor_notes ?? '')
        setHomework(notes.homework ?? '')
        setResources(notes.resources ?? '')
        setCompletionStatus(notes.completion_status ?? 'IN_PROGRESS')
        setCompletedAt(notes.completed_at ?? null)
      }

      setLoading(false)
    }

    if (bookingId) loadClassroom()
  }, [bookingId, router])

  useEffect(() => {
  if (classroomStatus !== 'LIVE') {
    setElapsedSeconds(0)
    return
  }

  if (!classroomStartedAt) {
    setElapsedSeconds(0)
    return
  }

  function updateElapsed(startedAt: string) {
    const started = new Date(startedAt).getTime()
    const now = Date.now()
    setElapsedSeconds(Math.max(0, Math.floor((now - started) / 1000)))
  }

  updateElapsed(classroomStartedAt)

  const timer = window.setInterval(() => {
    updateElapsed(classroomStartedAt)
  }, 1000)

  return () => window.clearInterval(timer)
}, [classroomStatus, classroomStartedAt])

  const jitsiSrc = useMemo(() => {
    if (!booking?.meeting_link) return ''

    try {
      const url = new URL(booking.meeting_link)
      return `${url.origin}${url.pathname}#config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.startWithAudioMuted=false&config.startWithVideoMuted=false&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.DISABLE_JOIN_LEAVE_NOTIFICATIONS=true`
    } catch {
      return booking.meeting_link
    }
  }, [booking])

  async function saveLessonNotes(status?: string) {
    if (!booking || !canEdit) return

    if (!booking.tutor_id || !booking.student_id) {
      alert('This lesson is missing tutor or student information.')
      return
    }

    setSavingNotes(true)

    const completed = status === 'COMPLETED'
    const completedTimestamp = completed ? new Date().toISOString() : completedAt

    const classroomPayload = {
      booking_id: booking.id,
      tutor_id: booking.tutor_id,
      parent_id: booking.parent_id,
      lesson_objectives: lessonObjectives,
      tutor_notes: tutorNotes,
      homework,
      resources,
      completion_status: status || completionStatus,
      completed_at: completedTimestamp,
      updated_at: new Date().toISOString(),
    }

    const { error: classroomError } = await supabase
      .from('lesson_classroom_notes')
      .upsert(classroomPayload, { onConflict: 'booking_id' })

    if (classroomError) {
      setSavingNotes(false)
      alert(classroomError.message)
      return
    }

    if (completed) {
      const progressPayload = {
        lesson_booking_id: booking.id,
        tutor_id: booking.tutor_id,
        student_id: booking.student_id,
        lesson_date: booking.lesson_date,
        lesson_topic:
          lessonObjectives || booking.subjects?.name || 'Lesson completed',
        strengths: tutorNotes || 'Lesson completed successfully.',
        improvement_area: resources || 'To be reviewed in the next lesson.',
        homework: homework || 'No homework added.',
        tutor_comment:
          tutorNotes ||
          `The ${
            booking.subjects?.name || 'lesson'
          } lesson was completed successfully.`,
        attendance: 'present',
      }

      const { error: progressError } = await supabase
        .from('lesson_progress_notes')
        .upsert(progressPayload, {
          onConflict: 'lesson_booking_id',
        })

      if (progressError) {
        setSavingNotes(false)
        alert(progressError.message)
        return
      }

      const { data: parentProfile } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('id', booking.parent_id)
        .maybeSingle()

      await onLessonReportReady({
        parentUserId: booking.parent_id,
        parentEmail: parentProfile?.email ?? null,
        studentName: booking.students?.full_name ?? undefined,
        subjectName: booking.subjects?.name ?? undefined,
        reportLink: '/parent/progress',
      })

      setCompletionStatus('COMPLETED')
      setCompletedAt(completedTimestamp)
    }

    setSavingNotes(false)
  }

  async function startLesson() {
    if (!booking || !canEdit) return

    setUpdatingClassroom(true)

    const startedAt = classroomStartedAt || new Date().toISOString()

    const { error } = await supabase
      .from('lesson_bookings')
      .update({
        classroom_status: 'LIVE',
        classroom_started_at: startedAt,
        attendance_status: attendanceStatus,
      })
      .eq('id', booking.id)

    setUpdatingClassroom(false)

    if (error) {
      alert(error.message)
      return
    }

    setClassroomStatus('LIVE')
    setClassroomStartedAt(startedAt)
    setBooking({
      ...booking,
      classroom_status: 'LIVE',
      classroom_started_at: startedAt,
      attendance_status: attendanceStatus,
    })
  }

  async function endLesson() {
    if (!booking || !canEdit) return

    const confirmed = window.confirm(
      'End this lesson and send the progress report to the parent?'
    )

    if (!confirmed) return

    setUpdatingClassroom(true)

    const endedAt = new Date().toISOString()
    const start = classroomStartedAt
      ? new Date(classroomStartedAt).getTime()
      : Date.now()
    const end = new Date(endedAt).getTime()
    const minutes = Math.max(1, Math.round((end - start) / 60000))

    const { error } = await supabase
      .from('lesson_bookings')
      .update({
        classroom_status: 'COMPLETED',
        classroom_ended_at: endedAt,
        classroom_duration_minutes: minutes,
        attendance_status: attendanceStatus,
        status: 'COMPLETED',
      })
      .eq('id', booking.id)

    if (error) {
      setUpdatingClassroom(false)
      alert(error.message)
      return
    }

    setClassroomStatus('COMPLETED')
    setClassroomEndedAt(endedAt)
    setDurationMinutes(minutes)

    setBooking({
      ...booking,
      classroom_status: 'COMPLETED',
      classroom_ended_at: endedAt,
      classroom_duration_minutes: minutes,
      attendance_status: attendanceStatus,
      status: 'COMPLETED',
    })

    await saveLessonNotes('COMPLETED')

    setUpdatingClassroom(false)
  }

  async function toggleVideoFullScreen() {
    if (!videoRef.current) return

    if (!document.fullscreenElement) {
      await videoRef.current.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }

  if (loading) {
    return (
      <main className="page">
        <section className="panel">
          <p className="eyebrow">Fountain Prep Classroom</p>
          <h1>Preparing classroom...</h1>
          <p className="muted">Please wait while we load your lesson room.</p>
        </section>
        <style jsx>{styles}</style>
      </main>
    )
  }

  if (message || !booking) {
    return (
      <main className="page">
        <section className="panel">
          <p className="eyebrow">Classroom</p>
          <h1>Unable to open classroom</h1>
          <p className="muted">{message || 'Something went wrong.'}</p>
          <Link href="/parent/dashboard" className="backBtn">
            Back to Dashboard
          </Link>
        </section>
        <style jsx>{styles}</style>
      </main>
    )
  }

  const subjectName = booking.subjects?.name || 'Private Lesson'
  const studentName = booking.students?.full_name || 'Student'
  const tutorName = booking.tutor_profiles?.full_name || 'Fountain Prep Tutor'
  const isCompleted = completionStatus === 'COMPLETED'
  const isLive = classroomStatus === 'LIVE'

  return (
    <main className="page">
      <section className="classroomShell">
        <header className="lessonHeader">
          <div>
            <p className="eyebrow">Fountain Prep Classroom</p>
            <h1>{subjectName}</h1>
            <p className="muted">
              {formatDate(booking.lesson_date)} •{' '}
              {formatTime(booking.lesson_time)} •{' '}
              {booking.timezone || 'Local time'}
            </p>
          </div>

          <div className="topActions">
            <Link href="/parent/dashboard" className="secondaryBtn">
              Dashboard
            </Link>

            {booking.meeting_link ? (
              <a
                href={booking.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="primaryBtn"
              >
                Open backup meeting
              </a>
            ) : null}
          </div>
        </header>

        <section className="videoArea">
          <div className="statusStrip">
            <div>
              <p className="eyebrow">Live Lesson Control</p>
              <h2>{statusTitle(classroomStatus)}</h2>
              <p className="muted">
                {isLive
                  ? `Lesson is live${
                      elapsedSeconds ? ` • ${formatElapsed(elapsedSeconds)}` : ''
                    }`
                  : classroomStatus === 'COMPLETED'
                    ? `Lesson completed${
                        durationMinutes ? ` • ${durationMinutes} minutes` : ''
                      }`
                    : 'Start the lesson when tutor and learner are ready.'}
              </p>
            </div>

            <span className={isLive ? 'livePill active' : 'livePill'}>
              {formatStatus(classroomStatus)}
            </span>
          </div>

          <LessonControlBar
            canEdit={canEdit}
            classroomStatus={classroomStatus}
            elapsedSeconds={elapsedSeconds}
            durationMinutes={durationMinutes}
            attendanceStatus={attendanceStatus}
            updatingClassroom={updatingClassroom}
            onAttendanceChange={setAttendanceStatus}
            onStartLesson={startLesson}
            onEndLesson={endLesson}
          />

          <div className="videoShell" ref={videoRef}>
            <button
              type="button"
              className="fullScreenBtn"
              onClick={toggleVideoFullScreen}
            >
              Full screen
            </button>

            {jitsiSrc ? (
              <iframe
                src={jitsiSrc}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="meetingFrame"
                title="Fountain Prep Live Classroom"
              />
            ) : (
              <div className="noMeeting">
                <h2>Meeting link not ready</h2>
                <p>Your lesson room has not been created yet.</p>
              </div>
            )}
          </div>
        </section>

        <section className="mainGrid">
          <div className="workspaceWide">
            <p className="eyebrow">Lesson Workspace</p>
            <h2>Learning notes and progress</h2>
            <p className="muted">
              {canEdit
                ? 'Add what was covered, homework and resources for the parent.'
                : 'Your tutor’s lesson notes and homework will appear here.'}
            </p>

            <div className="workspaceGrid">
              <WorkspaceField
                label="Lesson Objectives"
                value={lessonObjectives}
                onChange={setLessonObjectives}
                canEdit={canEdit && !isCompleted}
              />

              <WorkspaceField
                label="Tutor Notes"
                value={tutorNotes}
                onChange={setTutorNotes}
                canEdit={canEdit && !isCompleted}
              />

              <WorkspaceField
                label="Homework"
                value={homework}
                onChange={setHomework}
                canEdit={canEdit && !isCompleted}
              />

              <WorkspaceField
                label="Resources"
                value={resources}
                onChange={setResources}
                canEdit={canEdit && !isCompleted}
              />
            </div>

            {canEdit ? (
              <div className="workspaceActions">
                <button
                  className="secondaryButton"
                  onClick={() => saveLessonNotes()}
                  disabled={savingNotes || isCompleted}
                >
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>

                <button
                  className="primaryButton"
                  onClick={() => saveLessonNotes('COMPLETED')}
                  disabled={savingNotes || isCompleted}
                >
                  {isCompleted ? 'Lesson Completed' : 'Complete Lesson'}
                </button>
              </div>
            ) : null}

            {isCompleted ? (
              <p className="completedText">
                Lesson completed{' '}
                {completedAt ? `on ${formatFullDate(completedAt)}` : ''}.
              </p>
            ) : null}
          </div>

          <aside className="sidebar">
            <div className="card">
              <p className="eyebrow">Lesson Details</p>
              <h2>{subjectName}</h2>

              <div className="detailList">
                <Detail label="Student" value={studentName} />
                <Detail label="Tutor" value={tutorName} />
                <Detail label="Date" value={formatDate(booking.lesson_date)} />
                <Detail label="Time" value={formatTime(booking.lesson_time)} />
                <Detail label="Status" value={booking.status || 'Confirmed'} />
                <Detail
                  label="Workspace"
                  value={isCompleted ? 'Completed' : 'In progress'}
                />
              </div>
            </div>

            <div className="card">
              <p className="eyebrow">Parent Note</p>
              <p className="note">
                {booking.notes || 'No parent note was added for this lesson.'}
              </p>
            </div>

            <div className="card purple">
              <p className="eyebrow light">Need Help?</p>
              <h2>Support is available</h2>
              <p>
                If there is a technical issue, return to dashboard or contact
                Fountain Prep support.
              </p>
            </div>
          </aside>
        </section>
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function WorkspaceField({
  label,
  value,
  onChange,
  canEdit,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  canEdit: boolean
}) {
  return (
    <div className="workspaceField">
      <label>{label}</label>
      {canEdit ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Add ${label.toLowerCase()}...`}
        />
      ) : (
        <div className="readOnlyBox">{value || 'Not added yet.'}</div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function statusTitle(status: string) {
  if (status === 'LIVE') return 'Class in progress'
  if (status === 'COMPLETED') return 'Lesson completed'
  return 'Ready to start'
}

function formatStatus(value: string | null) {
  if (!value) return 'Not started'

  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(
    2,
    '0'
  )}`
}

function formatDate(value: string | null) {
  if (!value) return 'Date not set'

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${value}T12:00:00`))
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatTime(value: string | null) {
  if (!value) return 'Time not set'
  return value.slice(0, 5)
}

const styles = `
  .page {
    min-height: 100vh;
    padding: 22px;
    color: #21152d;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 34%),
      radial-gradient(circle at top left, rgba(236, 72, 153, 0.07), transparent 30%),
      linear-gradient(180deg, #ffffff, #fbf8ff 45%, #f4edff);
  }

  .classroomShell,
  .panel {
    width: min(1500px, 100%);
    margin: 0 auto;
  }

  .panel {
    margin-top: 60px;
    padding: 42px;
    border-radius: 34px;
    background: white;
    border: 1px solid rgba(124,58,237,0.13);
    box-shadow: 0 24px 70px rgba(71,43,117,0.10);
  }

  .lessonHeader {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: center;
    padding: 26px;
    border-radius: 34px;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(124,58,237,0.13);
    box-shadow: 0 24px 70px rgba(71,43,117,0.10);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .light {
    color: #ddd6fe;
  }

  h1 {
    margin: 10px 0 0;
    font-size: clamp(38px, 5vw, 70px);
    line-height: 0.95;
    letter-spacing: -0.065em;
    font-weight: 950;
  }

  h2 {
    margin: 8px 0 0;
    font-size: clamp(25px, 3vw, 36px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .muted {
    margin: 12px 0 0;
    color: #6f637e;
    font-size: 16px;
    font-weight: 750;
    line-height: 1.55;
  }

  .topActions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .primaryBtn,
  .secondaryBtn,
  .backBtn,
  .primaryButton,
  .secondaryButton {
    min-height: 48px;
    padding: 0 20px;
    border-radius: 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 950;
    text-decoration: none;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
  }

  .primaryBtn,
  .backBtn,
  .primaryButton {
    border: 0;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 16px 38px rgba(124,58,237,0.24);
  }

  .secondaryBtn,
  .secondaryButton {
    color: #32174d;
    background: white;
    border: 1px solid rgba(124,58,237,0.16);
  }

  button:disabled {
    opacity: .58;
    cursor: not-allowed;
  }

  .backBtn {
    margin-top: 22px;
  }

  .videoArea {
    margin-top: 18px;
    padding: 18px;
    border-radius: 36px;
    background: rgba(255,255,255,0.86);
    border: 1px solid rgba(124,58,237,0.12);
    box-shadow: 0 24px 70px rgba(71,43,117,0.10);
  }

  .statusStrip {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    padding: 20px 22px;
    border-radius: 28px;
    background:
      radial-gradient(circle at top right, rgba(124,58,237,0.13), transparent 32%),
      #ffffff;
    border: 1px solid rgba(124,58,237,0.12);
    margin-bottom: 14px;
  }

  .livePill {
    display: inline-flex;
    min-height: 40px;
    align-items: center;
    justify-content: center;
    padding: 0 14px;
    border-radius: 999px;
    background: #f5f0ff;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
    white-space: nowrap;
  }

  .livePill.active {
    background: #ecfdf3;
    color: #027a48;
  }

  .videoShell {
    position: relative;
    overflow: hidden;
    min-height: 72vh;
    border-radius: 30px;
    background: #07020d;
    border: 1px solid rgba(124,58,237,0.18);
    box-shadow: 0 30px 90px rgba(71,43,117,0.18);
  }

  .meetingFrame {
    width: 100%;
    height: 72vh;
    min-height: 680px;
    border: 0;
    display: block;
    background: #07020d;
  }

  .noMeeting {
    min-height: 680px;
    display: grid;
    place-items: center;
    text-align: center;
    color: white;
    padding: 30px;
  }

  .noMeeting p {
    color: #d8c9ff;
  }

  .fullScreenBtn {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 100;
    border: 0;
    border-radius: 999px;
    padding: 10px 16px;
    background: rgba(255,255,255,.95);
    color: #21152d;
    font-weight: 950;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(0,0,0,.18);
    transition: all .2s ease;
  }

  .fullScreenBtn:hover {
    transform: translateY(-1px);
    background: #ffffff;
  }

  .videoShell:fullscreen {
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    border-radius: 0;
  }

  .videoShell:fullscreen .meetingFrame,
  .videoShell:fullscreen .noMeeting {
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
  }

  .mainGrid {
    margin-top: 20px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 20px;
    align-items: start;
  }

  .sidebar {
    display: grid;
    gap: 16px;
    position: sticky;
    top: 22px;
  }

  .card,
  .workspaceWide {
    padding: 24px;
    border-radius: 30px;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(124,58,237,0.13);
    box-shadow: 0 20px 55px rgba(71,43,117,0.08);
  }

  .workspaceGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 20px;
  }

  .card.purple {
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
  }

  .card.purple p {
    color: rgba(255,255,255,0.82);
  }

  .detailList {
    margin-top: 18px;
    display: grid;
    gap: 10px;
  }

  .detail {
    padding: 14px;
    border-radius: 18px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.10);
  }

  .detail span,
  .detail strong {
    display: block;
  }

  .detail span {
    color: #7a7088;
    font-size: 13px;
    font-weight: 850;
  }

  .detail strong {
    margin-top: 5px;
    font-size: 16px;
    font-weight: 950;
  }

  .note {
    margin: 12px 0 0;
    color: #6f637e;
    line-height: 1.65;
    font-weight: 750;
  }

  .workspaceField label {
    display: block;
    margin-bottom: 7px;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
  }

  .workspaceField textarea,
  .readOnlyBox {
    width: 100%;
    min-height: 130px;
    padding: 15px;
    border-radius: 20px;
    border: 1px solid rgba(124,58,237,0.14);
    background: #fff;
    font-family: inherit;
    font-size: 15px;
    line-height: 1.55;
    color: #2b1b3d;
  }

  .workspaceField textarea {
    resize: vertical;
    outline: none;
  }

  .readOnlyBox {
    color: #6f637e;
    white-space: pre-wrap;
  }

  .workspaceActions {
    margin-top: 20px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .completedText {
    margin: 16px 0 0;
    padding: 14px;
    border-radius: 18px;
    background: #ecfdf3;
    color: #027a48;
    font-weight: 900;
  }

  @media (max-width: 1100px) {
    .mainGrid {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: static;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .sidebar .purple {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 760px) {
    .page {
      padding: 10px;
    }

    .lessonHeader {
      align-items: flex-start;
      flex-direction: column;
      padding: 20px;
      border-radius: 28px;
    }

    .topActions,
    .primaryBtn,
    .secondaryBtn,
    .primaryButton,
    .secondaryButton {
      width: 100%;
    }

    .statusStrip {
      align-items: flex-start;
      flex-direction: column;
      padding: 18px;
      border-radius: 24px;
    }

    .videoArea {
      padding: 10px;
      border-radius: 28px;
    }

    .videoShell {
      min-height: auto;
      aspect-ratio: 16 / 10;
      border-radius: 22px;
    }

    .meetingFrame {
      width: 100%;
      height: 100%;
      min-height: 0;
      aspect-ratio: 16 / 10;
    }

    .noMeeting {
      min-height: 280px;
    }

    .fullScreenBtn {
      top: 10px;
      left: 10px;
      padding: 8px 12px;
      font-size: 12px;
    }

    .workspaceGrid,
    .sidebar {
      grid-template-columns: 1fr;
    }

    .workspaceActions {
      flex-direction: column;
    }

    .card,
    .workspaceWide {
      padding: 20px;
      border-radius: 26px;
    }
  }
`