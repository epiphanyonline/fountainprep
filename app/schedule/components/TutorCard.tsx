import type { TutorGroup } from './ScheduleTypes'
import { formatDate, formatTime, shorten } from './scheduleUtils'

type Props = {
  group: TutorGroup
  selectedForTutor: boolean
  onChooseTimetable: () => void
  onViewProfile: () => void
}

export function TutorCard({ group, selectedForTutor, onChooseTimetable, onViewProfile }: Props) {
  const first = group.firstSlot
  const tutorName = group.tutor.full_name || 'Fountain Prep Tutor'

  return (
    <article className={selectedForTutor ? 'tutorPanel selected' : 'tutorPanel'}>
      <div className="tutorTop">
        <div className="tutorIdentity">
          {group.tutor.photo_url ? (
            <img src={group.tutor.photo_url} alt={tutorName} className="avatar" />
          ) : (
            <div className="avatarInitial">{tutorName.charAt(0) || 'T'}</div>
          )}

          <div>
            <h3>{tutorName}</h3>
            <p>
              ⭐{' '}
              {Number(group.tutor.average_rating || 0) > 0
                ? `${Number(group.tutor.average_rating).toFixed(1)} rating`
                : 'New Fountain Prep Tutor'}
            </p>
          </div>
        </div>

        {selectedForTutor ? (
          <span className="selectedBadge">Timetable selected</span>
        ) : (
          <span className="availableBadge">Available</span>
        )}
      </div>

      <div className="tutorMeta">
        {group.tutor.qualification_summary ? (
          <span>🎓 {shorten(group.tutor.qualification_summary, 22)}</span>
        ) : (
          <span>🎓 Qualified tutor</span>
        )}
        <span>👩🏫 {group.tutor.years_of_experience ?? 0}+ years</span>
        {!!group.tutor.languages_spoken?.length ? (
          <span>🌍 {group.tutor.languages_spoken.slice(0, 2).join(', ')}</span>
        ) : null}
        <span>✓ Private 1-to-1</span>
      </div>

      {group.tutor.bio ? <p className="bioPreview">{shorten(group.tutor.bio, 190)}</p> : null}

      <div className="nextAvailable">
        <span>Earliest first lesson date</span>
        <strong>
          {formatDate(first.slot_date)}, {formatTime(first.start_time)} – {formatTime(first.end_time)}
        </strong>
        <small>
          Choose one start date to repeat weekly
          {group.slots.length > 1 ? ` • ${group.slots.length} possible starts` : ''}
        </small>
      </div>

      <div className="tutorActions">
        <button type="button" className="primarySmall" onClick={onChooseTimetable}>
          Build Weekly Timetable with {shorten(tutorName.split(' ')[0] || tutorName, 16)}
        </button>
        <button type="button" className="outlineSmall" onClick={onViewProfile}>
          About this tutor
        </button>
      </div>
    </article>
  )
}

