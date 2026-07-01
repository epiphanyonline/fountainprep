import type { BookingFrequency, Slot, TutorGroup } from './ScheduleTypes'
import { formatDate, formatShortDate, formatTime, getWeekdayName, slotTimeRange } from './scheduleUtils'

type Props = {
  group: TutorGroup
  frequency: BookingFrequency
  weeksToBook: number
  selectedSlots: Slot[]
  requiredSlotCount: number
  onToggleSlot: (slot: Slot) => void
  onClose: () => void
  onViewProfile: () => void
}

export function WeeklyTimetableDrawer({
  group,
  frequency,
  selectedSlots,
  requiredSlotCount,
  onToggleSlot,
  onClose,
  onViewProfile,
}: Props) {
  const tutorName = group.tutor.full_name || 'Fountain Prep Tutor'
  const chosenForThisTutor = selectedSlots.filter((slot) => slot.tutor_id === group.tutorId)

  return (
    <div className="timesOverlay" onClick={onClose}>
      <aside className="timesPanel" onClick={(event) => event.stopPropagation()}>
        <div className="timesPanelTop">
          <div className="tutorIdentity">
            {group.tutor.photo_url ? (
              <img src={group.tutor.photo_url} alt={tutorName} className="avatar" />
            ) : (
              <div className="avatarInitial">{tutorName.charAt(0) || 'T'}</div>
            )}

            <div>
              <p className="eyebrow">Build weekly timetable</p>
              <h2>{tutorName}</h2>
              <span>
                {requiredSlotCount === 2
                  ? 'Choose the first TWO lessons. Each one repeats weekly.'
                  : 'Choose the first lesson. This same day and time repeats weekly.'}
              </span>
            </div>
          </div>

          <button type="button" onClick={onClose} className="closeProfile" aria-label="Close timetable panel">
            ✕
          </button>
        </div>

        <div className="timesPanelBody">
          <div className="recurringExplainer">
            <strong>
              {frequency === 'TWO_DAYS_WEEKLY'
                ? 'You are building a 2-day weekly timetable.'
                : 'You are choosing your weekly class start date.'}
            </strong>
            <p>
              {frequency === 'TWO_DAYS_WEEKLY'
                ? 'Pick the first date and time for Lesson 1, then pick the first date and time for Lesson 2. Fountain Prep will automatically schedule the rest of the plan on those same days and times.'
                : 'The date you choose below is the first lesson. Fountain Prep automatically schedules the remaining lessons on the same day and time each week.'}
            </p>

            <div className="miniTimeline">
              {chosenForThisTutor.length > 0 ? (
                chosenForThisTutor.map((slot, index) => (
                  <div key={slot.id} className="miniTimelineItem">
                    <span>Lesson {index + 1}</span>
                    <strong>
                      Every {getWeekdayName(slot.slot_date)} • {slotTimeRange(slot)}
                    </strong>
                    <small>Starts {formatShortDate(slot.slot_date)} • Repeats weekly</small>
                  </div>
                ))
              ) : (
                <div className="miniTimelineItem mutedTimeline">
                  <span>How it works</span>
                  <strong>Start date → same day and time every week</strong>
                  <small>Your full timetable appears in the Parent Dashboard after payment.</small>
                </div>
              )}
            </div>
          </div>

          {Object.keys(group.slotsByDate)
            .sort()
            .map((date) => (
              <div key={date} className="timeDateGroup">
                <div className="timeDateHead">
                  <div>
                    <strong>{formatDate(date)}</strong>
                    <p>Choose this date only if you want weekly lessons to begin here.</p>
                  </div>
                  <span>{group.slotsByDate[date].length} start option{group.slotsByDate[date].length > 1 ? 's' : ''}</span>
                </div>

                <div className="timeGrid">
                  {group.slotsByDate[date].map((slot) => {
                    const active = selectedSlots.some((item) => item.id === slot.id)
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => onToggleSlot(slot)}
                        className={active ? 'timeChip active' : 'timeChip'}
                      >
                        <span>{formatTime(slot.start_time)} – {formatTime(slot.end_time)}</span>
                        <small>{active ? 'Weekly start selected' : 'Start weekly class here'}</small>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>

        <div className="timesPanelFooter">
          <button type="button" className="outlineSmall" onClick={onViewProfile}>
            About this tutor
          </button>
          <button type="button" className="primarySmall" onClick={onClose}>
            {selectedSlots.length >= requiredSlotCount ? 'Timetable ready' : 'Done'}
          </button>
        </div>
      </aside>
    </div>
  )
}

