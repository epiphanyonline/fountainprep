import type { BookingFrequency, BookingSummaryItem } from './ScheduleTypes'
import { formatShortDate } from './scheduleUtils'

type CurrencyDisplay = {
  symbol: string
  code: string
  rate: number
}

type Props = {
  planName: string
  totalAmount: number
  totalLessonsRequired: number
  requiredSlotCount: number
  frequency: BookingFrequency
  bookingSummary: BookingSummaryItem[]
  saving: boolean
  canContinue: boolean
  currency: CurrencyDisplay
  onContinue: () => void
  onBack: () => void
}

export function BookingSummary({
  planName,
  totalAmount,
  totalLessonsRequired,
  requiredSlotCount,
  bookingSummary,
  saving,
  canContinue,
  currency,
  onContinue,
  onBack,
}: Props) {
  const localTotal = `${currency.symbol}${Math.round(totalAmount * currency.rate)}`

  return (
    <aside className="sideCard">
      <p className="eyebrow">Weekly timetable summary</p>
      <h2>{planName}</h2>

      <div className="totalBox">
        <p>Total due</p>
        <strong>{localTotal}</strong>
        <span>{totalLessonsRequired} private 1-to-1 lessons</span>
      </div>

      <div className="selectedBox">
        {bookingSummary.length === 0 ? (
          <p className="muted">
            Choose {requiredSlotCount === 2 ? 'the first two weekly lesson dates' : 'the first weekly lesson date'} to continue.
          </p>
        ) : (
          bookingSummary.map((item, index) => (
            <div key={item.id} className="selectedItem">
              <small>Weekly Lesson {requiredSlotCount === 2 ? index + 1 : ''}</small>
              <strong>Every {item.weekday}</strong>
              <p>{item.timeRange}</p>
              <p>First lesson: {formatShortDate(item.startDate)}</p>
              <div className="datePills">
                {item.dates.map((date) => (
                  <span key={date}>{formatShortDate(date)}</span>
                ))}
              </div>
              <em>Remaining lessons are scheduled automatically.</em>
            </div>
          ))
        )}
      </div>

      <div className="timetableHelp">
        <strong>How your timetable works</strong>
        <span>✓ You are choosing the first lesson date only.</span>
        <span>✓ The same day and time repeats weekly.</span>
        <span>✓ Your tutor is reserved for this weekly pattern after payment.</span>
        <span>✓ Your full timetable appears in the Parent Dashboard.</span>
        <span>✓ Changes can later be requested through Fountain Prep messages.</span>
      </div>

      <button type="button" onClick={onContinue} disabled={saving || !canContinue} className="primaryBtn">
        {saving ? 'Creating timetable...' : 'Reserve Weekly Timetable'}
      </button>

      <button type="button" onClick={onBack} className="ghostBtn">
        Back to Payment Plans
      </button>
    </aside>
  )
}