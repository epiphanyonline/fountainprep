import { describe, it, expect } from 'vitest'
import { bookingInstant, resolveViewerTimezone } from './timezone'
import { isOperationalLessonToday, isOperationalLessonUpcoming } from './lessonDashboardTime'

const californiaLesson = {
  lesson_date: '2026-11-17',
  lesson_time: '18:00',
  timezone: 'America/Los_Angeles',
  status: 'CONFIRMED',
}

describe('cross-midnight admin and tutor lesson visibility', () => {
  it('normalises a legacy Nigerian tutor timezone without changing records', () => {
    expect(resolveViewerTimezone('Africa/Ibadan')).toBe('Africa/Lagos')
    expect(bookingInstant('2026-11-18', '03:00', 'Africa/Ibadan').toISOString())
      .toBe('2026-11-18T02:00:00.000Z')
  })

  it('shows a Tuesday California class as Wednesday in Nigeria and UK', () => {
    const now = new Date('2026-11-18T02:30:00Z')
    expect(isOperationalLessonToday(californiaLesson, 'Africa/Ibadan', now)).toBe(true)
    expect(isOperationalLessonToday(californiaLesson, 'Europe/London', now)).toBe(true)
    expect(isOperationalLessonUpcoming(californiaLesson, now)).toBe(true)
  })

  it('does not show a completed or cancelled class as joinable', () => {
    const now = new Date('2026-11-18T02:30:00Z')
    expect(isOperationalLessonUpcoming({ ...californiaLesson, status: 'COMPLETED' }, now)).toBe(false)
    expect(isOperationalLessonUpcoming({ ...californiaLesson, status: 'CANCELLED' }, now)).toBe(false)
  })

  it('preserves a lesson in the current calendar day while its own clock day differs', () => {
    const now = new Date('2026-11-18T02:01:00Z')
    expect(isOperationalLessonToday(californiaLesson, 'Africa/Lagos', now)).toBe(true)
    expect(isOperationalLessonToday(californiaLesson, 'America/Los_Angeles', now)).toBe(true)
  })
})
