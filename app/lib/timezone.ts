export const DEFAULT_VIEWER_TIMEZONE = 'Europe/London'

export function isValidTimezone(value?: string | null): value is string {
  if (!value) return false

  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: value }).format(new Date())
    return true
  } catch {
    return false
  }
}

export function resolveViewerTimezone(profileTimezone?: string | null) {
  const browserTimezone =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : null

  if (isValidTimezone(profileTimezone)) return profileTimezone
  if (isValidTimezone(browserTimezone)) return browserTimezone
  return DEFAULT_VIEWER_TIMEZONE
}

export function dateKeyInTimezone(
  instant: Date,
  viewerTimezone?: string | null
) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: resolveViewerTimezone(viewerTimezone),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const values = new Map(
    formatter
      .formatToParts(instant)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return `${values.get('year')}-${values.get('month')}-${values.get('day')}`
}

export function addCalendarDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().split('T')[0]
}

export function weekdayForDateKey(dateKey: string) {
  return new Date(`${dateKey}T12:00:00Z`).getUTCDay()
}

export function bookingInstant(
  lessonDate: string,
  lessonTime: string,
  bookingTimezone?: string | null
) {
  return zonedDateTimeToUtc(
    lessonDate,
    lessonTime,
    isValidTimezone(bookingTimezone)
      ? bookingTimezone
      : DEFAULT_VIEWER_TIMEZONE
  )
}

export function formatBookingDate(
  lessonDate: string | null,
  lessonTime: string | null,
  bookingTimezone: string | null,
  viewerTimezone?: string | null
) {
  if (!lessonDate || !lessonTime) return 'Date pending'

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: resolveViewerTimezone(viewerTimezone),
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(bookingInstant(lessonDate, lessonTime, bookingTimezone))
}

export function formatBookingTime(
  lessonDate: string | null,
  lessonTime: string | null,
  bookingTimezone: string | null,
  viewerTimezone?: string | null
) {
  if (!lessonDate || !lessonTime) return 'Time pending'

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: resolveViewerTimezone(viewerTimezone),
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).format(bookingInstant(lessonDate, lessonTime, bookingTimezone))
}

export function formatBookingDateTime(
  lessonDate: string | null,
  lessonTime: string | null,
  bookingTimezone: string | null,
  viewerTimezone?: string | null
) {
  if (!lessonDate || !lessonTime) return 'Lesson time pending'

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: resolveViewerTimezone(viewerTimezone),
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).format(bookingInstant(lessonDate, lessonTime, bookingTimezone))
}

/**
 * Converts a local calendar date/time in an IANA timezone to its unique UTC
 * instant. Never parse a lesson with `new Date(date + 'T' + time)` because
 * that silently uses the browser or server timezone.
 */
export function zonedDateTimeToUtc(
  dateValue: string,
  timeValue: string,
  timeZone: string
) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const [hour, minute, second = 0] = timeValue.split(':').map(Number)

  if (
    ![year, month, day, hour, minute, second].every(Number.isFinite) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(`Invalid lesson date/time: ${dateValue} ${timeValue}`)
  }

  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute, second)
  let candidate = new Date(targetAsUtc)

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = zonedParts(candidate, timeZone)
    const representedAsUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    )
    const difference = targetAsUtc - representedAsUtc

    if (difference === 0) return candidate
    candidate = new Date(candidate.getTime() + difference)
  }

  return candidate
}

function zonedParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const values = new Map(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return {
    year: Number(values.get('year')),
    month: Number(values.get('month')),
    day: Number(values.get('day')),
    hour: Number(values.get('hour')),
    minute: Number(values.get('minute')),
    second: Number(values.get('second')),
  }
}
