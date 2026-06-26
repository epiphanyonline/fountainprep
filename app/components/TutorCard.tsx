'use client'

type TutorProfile = {
  full_name: string
  photo_url: string | null
  bio?: string | null
  years_of_experience?: number | null
  qualification_summary?: string | null
  languages_spoken?: string[] | null
  average_rating?: number | string | null
  rating_count?: number | null
}

type TutorCardProps = {
  tutor: TutorProfile | null
  startTime?: string
  endTime?: string
  active?: boolean
  ctaLabel?: string
  onSelect?: () => void
  onViewProfile?: () => void
}

export default function TutorCard({
  tutor,
  startTime,
  endTime,
  active = false,
  ctaLabel = 'Reserve this Tutor',
  onSelect,
  onViewProfile,
}: TutorCardProps) {
  const name = tutor?.full_name || 'Approved Tutor'
  const initial = name.charAt(0).toUpperCase()
  const experience = tutor?.years_of_experience ?? 0
  const qualification = tutor?.qualification_summary || 'Fountain Prep Tutor'
  const languages = tutor?.languages_spoken?.length
    ? tutor.languages_spoken.join(' • ')
    : 'English'
  const ratingCount = tutor?.rating_count ?? 0
  const rating = Number(tutor?.average_rating ?? 0)

  return (
    <div className={active ? 'tutorCard activeTutorCard' : 'tutorCard'}>
      <div className="tutorTop">
        {tutor?.photo_url ? (
          <img src={tutor.photo_url} alt={name} className="tutorPhoto" />
        ) : (
          <div className="tutorInitial">{initial}</div>
        )}

        <div>
          <h3>{name}</h3>
          <p>
            {ratingCount > 0
              ? `⭐ ${rating.toFixed(1)} (${ratingCount})`
              : '⭐ New Fountain Prep Tutor'}
          </p>
        </div>
      </div>

      <div className="tutorChips">
        <span>🎓 {qualification}</span>
        <span>👨‍🏫 {experience}+ years</span>
        <span>🌍 {languages}</span>
        <span>✓ Private 1-to-1</span>
      </div>

      {(startTime || endTime) && (
        <div className="timeBox">
          <small>Available time</small>
          <strong>
            {startTime || ''} {endTime ? `– ${endTime}` : ''}
          </strong>
        </div>
      )}

      <div className="tutorActions">
        {onSelect && (
          <button type="button" onClick={onSelect} className="reserveBtn">
            {active ? '✓ Selected' : ctaLabel}
          </button>
        )}

        {onViewProfile && (
          <button type="button" onClick={onViewProfile} className="profileBtn">
            View full profile →
          </button>
        )}
      </div>

      <style jsx>{styles}</style>
    </div>
  )
}

const styles = `
  .tutorCard {
    padding: 18px;
    border-radius: 24px;
    background: white;
    border: 1px solid rgba(124, 58, 237, 0.12);
    box-shadow: 0 18px 48px rgba(47, 25, 80, 0.08);
    transition: 0.2s ease;
  }

  .tutorCard:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 56px rgba(47, 25, 80, 0.12);
  }

  .activeTutorCard {
    border-color: #7c3aed;
    background: #f7f1ff;
  }

  .tutorTop {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .tutorPhoto,
  .tutorInitial {
    width: 64px;
    height: 64px;
    border-radius: 22px;
    flex: 0 0 auto;
  }

  .tutorPhoto {
    object-fit: cover;
  }

  .tutorInitial {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1e8ff;
    color: #6d28d9;
    font-size: 28px;
    font-weight: 950;
  }

  h3 {
    margin: 0;
    font-size: 20px;
    line-height: 1.1;
    letter-spacing: -0.035em;
    font-weight: 950;
    color: #201230;
  }

  p {
    margin: 7px 0 0;
    color: #6d647c;
    font-weight: 850;
    font-size: 13px;
  }

  .tutorChips {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tutorChips span {
    padding: 8px 10px;
    border-radius: 999px;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.1);
    color: #351e55;
    font-size: 12px;
    font-weight: 850;
  }

  .timeBox {
    margin-top: 16px;
    padding: 14px;
    border-radius: 18px;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
  }

  .timeBox small {
    display: block;
    opacity: 0.85;
    font-weight: 850;
  }

  .timeBox strong {
    display: block;
    margin-top: 5px;
    font-size: 20px;
    font-weight: 950;
  }

  .tutorActions {
    margin-top: 14px;
    display: grid;
    gap: 10px;
  }

  .reserveBtn,
  .profileBtn {
    min-height: 46px;
    border-radius: 16px;
    font-family: inherit;
    font-weight: 950;
    cursor: pointer;
  }

  .reserveBtn {
    border: 0;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 14px 34px rgba(109, 40, 217, 0.22);
  }

  .profileBtn {
    border: 1px solid rgba(124, 58, 237, 0.14);
    color: #6d28d9;
    background: white;
  }
`