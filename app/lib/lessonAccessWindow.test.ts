import { describe, expect, it } from 'vitest'
import { bookingInstant, dateKeyInTimezone } from './timezone'
import { isLessonUpcomingOrJoinable, LESSON_JOIN_GRACE_MS } from './lessonAccessWindow'

describe('international lesson access window', () => {
  it('keeps a Tuesday California booking visible on Wednesday in Nigeria', () => {
    const start = bookingInstant('2026-11-17', '18:00', 'America/Los_Angeles')
    expect(dateKeyInTimezone(start, 'Africa/Lagos')).toBe('2026-11-18')
    expect(dateKeyInTimezone(start, 'America/Los_Angeles')).toBe('2026-11-17')
    expect(isLessonUpcomingOrJoinable(
      '2026-11-17', '18:00', 'America/Los_Angeles', 'CONFIRMED',
      new Date(start.getTime() + 60 * 60 * 1000)
    )).toBe(true)
  })

  it('keeps a Wednesday 03:00 Nigeria booking accessible across the same instant', () => {
    const start = bookingInstant('2026-11-18', '03:00', 'Africa/Lagos')
    expect(dateKeyInTimezone(start, 'America/Los_Angeles')).toBe('2026-11-17')
    expect(isLessonUpcomingOrJoinable(
      '2026-11-18', '03:00', 'Africa/Lagos', 'CONFIRMED',
      new Date(start.getTime() + 30 * 60 * 1000)
    )).toBe(true)
  })

  it('does not join a completed or cancelled booking', () => {
    const now = new Date('2026-11-18T02:30:00Z')
    expect(isLessonUpcomingOrJoinable('2026-11-18', '03:00', 'Africa/Lagos', 'COMPLETED', now)).toBe(false)
    expect(isLessonUpcomingOrJoinable('2026-11-18', '03:00', 'Africa/Lagos', 'CANCELLED', now)).toBe(false)
  })

  it('expires joinability after the grace window', () => {
    const start = bookingInstant('2026-11-18', '03:00', 'Africa/Lagos')
    expect(isLessonUpcomingOrJoinable(
      '2026-11-18', '03:00', 'Africa/Lagos', 'PAID',
      new Date(start.getTime() + LESSON_JOIN_GRACE_MS + 1)
    )).toBe(false)
  })

  it('rejects missing dates and malformed schedule values', () => {
    expect(isLessonUpcomingOrJoinable(null, '03:00', 'Africa/Lagos', 'CONFIRMED')).toBe(false)
    expect(isLessonUpcomingOrJoinable('not-a-date', '03:00', 'Africa/Lagos', 'CONFIRMED')).toBe(false)
  })
})
