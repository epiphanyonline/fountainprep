import type { BookingFrequency, BookingSummaryItem } from './ScheduleTypes'

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
  viewerTimezone: string
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
  viewerTimezone,
  onContinue,
  onBack,
}: Props) {
  const approximateLocalTotal = `${currency.symbol}${Math.round(
    totalAmount * currency.rate
  )}`

  return (
    <aside className="sideCard" id="booking-summary">
      <p className="eyebrow">Booking summary</p>
      <h2>{planName}</h2>

      <div className="timezoneSummary">
        <strong>Times shown in your timezone</strong>
        <span>{viewerTimezone}</span>
      </div>

      <div className="totalBox">
        <p>Total due</p>
        <strong>£{totalAmount}</strong>
        <span>{totalLessonsRequired} private 1-to-1 lessons • charged in GBP</span>
        {currency.code !== 'GBP' ? (
          <small>Approximately {approximateLocalTotal} {currency.code}</small>
        ) : null}
      </div>

      <div className="selectedBox">
        {bookingSummary.length === 0 ? (
          <p className="muted">
            {requiredSlotCount === 2
              ? 'Choose the first time for both weekly lessons.'
              : 'Choose your first weekly lesson time.'}
          </p>
        ) : (
          bookingSummary.map((item, index) => (
            <div key={item.id} className="selectedItem">
              <small>
                {requiredSlotCount === 2 ? `Weekly lesson ${index + 1}` : 'Weekly lesson'}
              </small>
              <strong>Every {item.weekday}</strong>
              <p>{item.timeRange}</p>
              <p>First lesson: {item.startDateLabel}</p>
              <p>Tutor: {item.tutor}</p>
              <em>Tutor timetable: {item.tutorTimezone}</em>
            </div>
          ))
        )}
      </div>

      <div className="timetableHelp">
        <strong>How your timetable works</strong>
        <span>✓ You choose the first lesson time.</span>
        <span>✓ The tutor keeps that weekly timetable.</span>
        <span>✓ Your local display adjusts automatically when timezones or daylight saving differ.</span>
        <span>✓ The complete timetable appears after payment.</span>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={saving || !canContinue}
        className="primaryBtn"
      >
        {saving ? 'Creating timetable...' : `Continue to Payment — £${totalAmount}`}
      </button>

      <button type="button" onClick={onBack} className="ghostBtn">
        Back to Plans
      </button>
    </aside>
  )
}
