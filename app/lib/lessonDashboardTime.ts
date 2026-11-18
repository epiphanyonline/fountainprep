import { bookingInstant, dateKeyInTimezone, resolveViewerTimezone } from './timezone'
import { isLessonUpcomingOrJoinable, LESSON_JOIN_GRACE_MS } from './lessonAccessWindow'

type Schedule = {
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string | null
}

/**
 * A calendar day is a property of the VIEWER, not the booking's stored timezone.
 * For an active class, retain it on the dashboard even when local midnight is crossed.
 */
export function isOperationalLessonToday(
  booking: Schedule,
  viewerTimezone: string | null | undefined,
  now: Date = new Date()
): boolean {
  if (!booking.lesson_date || !booking.lesson_time) return false
  try {
    const viewer = resolveViewerTimezone(viewerTimezone)
    const start = bookingInstant(booking.lesson_date, booking.lesson_time, booking.timezone)
    const sameViewerDay =
      dateKeyInTimezone(start, viewer) === dateKeyInTimezone(now, viewer)
    const activeAcrossMidnight =
      booking.status !== 'CANCELLED' &&
      booking.status !== 'COMPLETED' &&
      start.getTime() <= now.getTime() &&
      now.getTime() <= start.getTime() + LESSON_JOIN_GRACE_MS
    return sameViewerDay || activeAcrossMidnight
  } catch {
    return false
  }
}

export function isOperationalLessonUpcoming(
  booking: Schedule,
  now: Date = new Date()
): boolean {
  return isLessonUpcomingOrJoinable(
    booking.lesson_date, booking.lesson_time, booking.timezone, booking.status, now
  )
}

export function lessonStartMs(booking: Schedule): number | null {
  if (!booking.lesson_date || !booking.lesson_time) return null
  try {
    return bookingInstant(booking.lesson_date, booking.lesson_time, booking.timezone).getTime()
  } catch {
    return null
  }
}
