import { bookingInstant } from './timezone'

/**
 * Keep a lesson accessible for four hours after its scheduled start.
 * All comparisons use the absolute instant, never the viewer's calendar date.
 * A lesson already marked completed/cancelled is no longer joinable.
 */
export const LESSON_JOIN_GRACE_MS = 4 * 60 * 60 * 1000

export function isLessonUpcomingOrJoinable(
  lessonDate: string | null,
  lessonTime: string | null,
  timezone: string | null,
  status: string | null,
  now: Date = new Date()
): boolean {
  if (!lessonDate || !lessonTime) return false
  if (status === 'COMPLETED' || status === 'CANCELLED') return false
  try {
    const startsAt = bookingInstant(lessonDate, lessonTime, timezone).getTime()
    return startsAt + LESSON_JOIN_GRACE_MS >= now.getTime()
  } catch {
    return false
  }
}
