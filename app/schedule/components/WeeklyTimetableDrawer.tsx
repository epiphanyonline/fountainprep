import type { BookingFrequency, Slot, TutorGroup } from './ScheduleTypes'
import {
  formatSlotDate,
  formatSlotShortDate,
  formatSlotTimeRange,
  getSlotWeekday,
} from './scheduleUtils'

type Props = {
  group: TutorGroup
  frequency: BookingFrequency
  weeksToBook: number
  selectedSlots: Slot[]
  requiredSlotCount: number
  viewerTimezone: string
  onToggleSlot: (slot: Slot) => void
  onClose: () => void
  onReview: () => void
  onViewProfile: () => void
}

export function WeeklyTimetableDrawer({
  group,
  frequency,
  selectedSlots,
  requiredSlotCount,
  viewerTimezone,
  onToggleSlot,
  onClose,
  onReview,
  onViewProfile,
}: Props) {
  const tutorName = group.tutor.full_name || 'Fountain Prep Tutor'
  const chosenForThisTutor = selectedSlots.filter(
    (slot) => slot.tutor_id === group.tutorId
  )
  const timetableReady = chosenForThisTutor.length >= requiredSlotCount

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
              <p className="eyebrow">Choose your weekly time</p>
              <h2>{tutorName}</h2>
              <span>Times shown in {viewerTimezone}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="closeProfile"
            aria-label="Close timetable panel"
          >
            ✕
          </button>
        </div>

        <div className="timesPanelBody">
          <div className="recurringExplainer">
            <strong>
              {frequency === 'TWO_DAYS_WEEKLY'
                ? `Choose ${requiredSlotCount} different weekly lesson times.`
                : 'Choose the first lesson time.'}
            </strong>
            <p>
              Fountain Prep will build the remaining weekly timetable automatically.
              Your tutor sees the corresponding time in their own timezone.
            </p>

            <div className="miniTimeline">
              {chosenForThisTutor.length > 0 ? (
                chosenForThisTutor.map((slot, index) => (
                  <div key={slot.id} className="miniTimelineItem">
                    <span>Lesson {index + 1}</span>
                    <strong>
                      Every {getSlotWeekday(slot, viewerTimezone)} •{' '}
                      {formatSlotTimeRange(slot, viewerTimezone)}
                    </strong>
                    <small>
                      Starts {formatSlotShortDate(slot, viewerTimezone)} • repeats weekly
                    </small>
                  </div>
                ))
              ) : (
                <div className="miniTimelineItem mutedTimeline">
                  <span>Next action</span>
                  <strong>Select an available time below</strong>
                  <small>The booking summary will appear when your timetable is ready.</small>
                </div>
              )}
            </div>
          </div>

          {Object.keys(group.slotsByDate)
            .sort()
            .map((dateKey) => {
              const dateSlots = group.slotsByDate[dateKey]
              const firstSlot = dateSlots[0]

              return (
                <div key={dateKey} className="timeDateGroup">
                  <div className="timeDateHead">
                    <div>
                      <strong>{formatSlotDate(firstSlot, viewerTimezone)}</strong>
                      <p>Select the time you want the weekly lesson to begin.</p>
                    </div>
                    <span>
                      {dateSlots.length} option{dateSlots.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="timeGrid">
                    {dateSlots.map((slot) => {
                      const active = selectedSlots.some((item) => item.id === slot.id)

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => onToggleSlot(slot)}
                          className={active ? 'timeChip active' : 'timeChip'}
                        >
                          <span>{formatSlotTimeRange(slot, viewerTimezone)}</span>
                          <small>{active ? 'Selected' : 'Choose this time'}</small>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
        </div>

        <div className="timesPanelFooter">
          <button type="button" className="outlineSmall" onClick={onViewProfile}>
            About this tutor
          </button>
          <button
            type="button"
            className="primarySmall"
            onClick={onReview}
            disabled={!timetableReady}
          >
            {timetableReady
              ? 'Review and Continue'
              : `Select ${requiredSlotCount - chosenForThisTutor.length} more`}
          </button>
        </div>
      </aside>
    </div>
  )
}
