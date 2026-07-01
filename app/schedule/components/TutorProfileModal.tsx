import type { TutorProfile } from './ScheduleTypes'

type Props = {
  tutor: TutorProfile
  onClose: () => void
}

export function TutorProfileModal({ tutor, onClose }: Props) {
  const tutorName = tutor.full_name || 'Fountain Prep Tutor'

  return (
    <div className="profileOverlay">
      <div className="profileModal">
        <div className="profileTop">
          <div className="profileIdentity">
            {tutor.photo_url ? (
              <img src={tutor.photo_url} alt={tutorName} className="profilePhoto" />
            ) : (
              <div className="profileInitial">{tutorName.charAt(0) ?? 'T'}</div>
            )}
            <div>
              <h2>{tutorName}</h2>
              <p>Fountain Prep Tutor</p>
            </div>
          </div>

          <button type="button" onClick={onClose} className="closeProfile" aria-label="Close tutor profile">
            ✕
          </button>
        </div>

        <div className="profileBody">
          {tutor.qualification_summary && (
            <div>
              <span>Qualification</span>
              <strong>{tutor.qualification_summary}</strong>
            </div>
          )}

          <div>
            <span>Experience</span>
            <strong>{tutor.years_of_experience ?? 0}+ years teaching experience</strong>
          </div>

          {!!tutor.languages_spoken?.length && (
            <div>
              <span>Languages spoken</span>
              <strong>{tutor.languages_spoken.join(', ')}</strong>
            </div>
          )}

          {tutor.rating_count && tutor.rating_count > 0 ? (
            <div>
              <span>Rating</span>
              <strong>⭐ {Number(tutor.average_rating ?? 0).toFixed(1)} / 5</strong>
            </div>
          ) : null}

          {tutor.bio && (
            <div>
              <span>About</span>
              <p>{tutor.bio}</p>
            </div>
          )}
        </div>

        <button type="button" onClick={onClose} className="profileContinue">
          Continue building timetable
        </button>
      </div>
    </div>
  )
}

