'use client'

type Props = {
  canEdit: boolean
  classroomStatus: string
  elapsedSeconds: number
  durationMinutes: number | null
  attendanceStatus: string
  updatingClassroom: boolean
  onAttendanceChange: (value: string) => void
  onStartLesson: () => void
  onEndLesson: () => void
}

export default function LessonControlBar({
  canEdit,
  classroomStatus,
  elapsedSeconds,
  durationMinutes,
  attendanceStatus,
  updatingClassroom,
  onAttendanceChange,
  onStartLesson,
  onEndLesson,
}: Props) {
  return (
    <div className="lessonControl">
      <div>
        <p className="eyebrow">Live Lesson Control</p>
        <h2>
          {classroomStatus === 'LIVE'
            ? '● Live lesson'
            : classroomStatus === 'COMPLETED'
              ? 'Lesson completed'
              : 'Ready to start'}
        </h2>

        <p className="muted">
          {classroomStatus === 'LIVE'
            ? `Elapsed time: ${formatElapsed(elapsedSeconds)}`
            : classroomStatus === 'COMPLETED'
              ? `Duration: ${durationMinutes || 0} minutes`
              : 'Start the lesson when tutor and learner are ready.'}
        </p>
      </div>

      {canEdit ? (
        <div className="controlActions">
          <select
            value={attendanceStatus}
            onChange={(e) => onAttendanceChange(e.target.value)}
            disabled={classroomStatus === 'COMPLETED'}
          >
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
            <option value="technical_issue">Technical issue</option>
            <option value="parent_cancelled">Parent cancelled</option>
            <option value="tutor_cancelled">Tutor cancelled</option>
          </select>

          {classroomStatus !== 'LIVE' && classroomStatus !== 'COMPLETED' ? (
            <button
              type="button"
              className="primaryButton"
              onClick={onStartLesson}
              disabled={updatingClassroom}
            >
              {updatingClassroom ? 'Starting...' : 'Start Lesson'}
            </button>
          ) : null}

          {classroomStatus === 'LIVE' ? (
            <button
              type="button"
              className="primaryButton"
              onClick={onEndLesson}
              disabled={updatingClassroom}
            >
              {updatingClassroom ? 'Ending...' : 'End Lesson'}
            </button>
          ) : null}
        </div>
      ) : null}

      <style jsx>{styles}</style>
    </div>
  )
}

function formatElapsed(seconds: number) {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return `${mins}:${String(secs).padStart(2, '0')}`
}

const styles = `
  .lessonControl {
    margin-bottom: 16px;
    padding: 22px;
    border-radius: 28px;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(124,58,237,0.13);
    box-shadow: 0 20px 55px rgba(71,43,117,0.08);
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: center;
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  h2 {
    margin: 8px 0 0;
    font-size: 25px;
    line-height: 1.05;
    letter-spacing: -0.04em;
    font-weight: 950;
    color: #21152d;
  }

  .muted {
    margin: 12px 0 0;
    color: #6f637e;
    font-size: 16px;
    font-weight: 750;
  }

  .controlActions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  select {
    min-height: 48px;
    padding: 0 14px;
    border-radius: 16px;
    border: 1px solid rgba(124,58,237,0.16);
    background: white;
    color: #32174d;
    font-weight: 850;
    font-family: inherit;
  }

  .primaryButton {
    min-height: 48px;
    padding: 0 20px;
    border-radius: 17px;
    border: 0;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 16px 38px rgba(124,58,237,0.24);
    font-weight: 950;
    cursor: pointer;
    font-family: inherit;
  }

  .primaryButton:disabled,
  select:disabled {
    opacity: .58;
    cursor: not-allowed;
  }

  @media (max-width: 980px) {
    .lessonControl {
      flex-direction: column;
      align-items: flex-start;
    }

    .controlActions,
    select,
    .primaryButton {
      width: 100%;
    }
  }
`