import { supabase } from '../../lib/supabase'
import type { SafeTutor, Slot, SubjectRow, TutorProfile } from './ScheduleTypes'

export const FIRST_LESSON_NOTICE_HOURS = 72
export const DEFAULT_TIMEZONE = 'Europe/London'

export const planLabels: Record<string, string> = {
  monthly: 'Monthly Plan',
  three_month: '3-Month Plan',
}

export const planWeeks: Record<string, number> = {
  monthly: 4,
  three_month: 12,
}

export const planPricePerClass: Record<string, number> = {
  monthly: 10,
  three_month: 9,
}

export const subjectLabels: Record<string, string> = {
  maths: 'Maths',
  mathematics: 'Maths',
  english: 'English',
  science: 'Science',
  coding: 'Coding',
  music: 'Music',
  yoruba: 'Yoruba',
  igbo: 'Igbo',
  hausa: 'Hausa',
}

export const languageNames = ['yoruba', 'igbo', 'hausa']
export const mathsNames = ['maths', 'mathematics']

export async function resolveSubject(subjectIdParam: string): Promise<{
  primarySubject: SubjectRow | null
  matchingSubjects: SubjectRow[]
  errorMessage?: string
}> {
  const looksLikeUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      subjectIdParam
    )

  if (looksLikeUuid) {
    const { data, error } = await supabase
      .from('subjects')
      .select('id, name, category, is_active')
      .eq('id', subjectIdParam)
      .maybeSingle()

    if (error || !data) {
      return {
        primarySubject: null,
        matchingSubjects: [],
        errorMessage: error?.message || 'Subject not found.',
      }
    }

    const primary = data as SubjectRow
    const canonical = normaliseSubjectName(primary.name)
    const aliases = mathsNames.includes(canonical) ? mathsNames : [canonical]

    const { data: matches } = await supabase
      .from('subjects')
      .select('id, name, category, is_active')
      .in('name', aliases.map(toTitleSubjectName))
      .eq('is_active', true)

    return {
      primarySubject: primary,
      matchingSubjects: ensureSubject(primary, (matches ?? []) as SubjectRow[]),
    }
  }

  const requested = subjectLabels[subjectIdParam.toLowerCase()] || subjectIdParam
  const canonical = normaliseSubjectName(requested)
  const aliases = mathsNames.includes(canonical) ? mathsNames : [canonical]

  const { data, error } = await supabase
    .from('subjects')
    .select('id, name, category, is_active')
    .in('name', aliases.map(toTitleSubjectName))
    .eq('is_active', true)

  if (error) {
    return {
      primarySubject: null,
      matchingSubjects: [],
      errorMessage: error.message,
    }
  }

  const matches = (data ?? []) as SubjectRow[]
  const primary =
    matches.find((subject) => normaliseSubjectName(subject.name) === canonical) ||
    matches[0] ||
    null

  return { primarySubject: primary, matchingSubjects: matches }
}

export function ensureSubject(primary: SubjectRow, matches: SubjectRow[]) {
  const map = new Map<string, SubjectRow>()

  matches.forEach((subject) => map.set(subject.id, subject))
  map.set(primary.id, primary)

  return Array.from(map.values())
}

export function normaliseSubjectName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function toTitleSubjectName(value: string) {
  if (value === 'maths') return 'Maths'
  if (value === 'mathematics') return 'Mathematics'

  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function displaySubjectName(value: string) {
  const normalised = normaliseSubjectName(value)
  if (mathsNames.includes(normalised)) return 'Maths'
  return value
}

export function toTutorProfile(tutor?: SafeTutor): TutorProfile | null {
  if (!tutor) return null

  return {
    full_name: tutor.full_name,
    photo_url: tutor.photo_url,
    bio: tutor.bio,
    years_of_experience: tutor.years_of_experience,
    qualification_summary: tutor.qualification_summary,
    languages_spoken: tutor.languages_spoken,
    average_rating: tutor.average_rating,
    rating_count: tutor.rating_count,
  }
}

export function removeDuplicateSlots(slots: Slot[]) {
  const seen = new Set<string>()
  const unique: Slot[] = []

  for (const slot of slots) {
    const key = `${slot.tutor_id}-${slot.starts_at || `${slot.slot_date}-${slot.start_time}`}`
    if (seen.has(key)) continue

    seen.add(key)
    unique.push(slot)
  }

  return unique
}

export function shorten(value: string, max = 140) {
  if (!value) return ''

  const clean = value.replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max).trim()}…` : clean
}

/**
 * Adds calendar weeks to the tutor-local booking date. The booking timezone is
 * stored separately and later converted to a canonical UTC instant.
 */
export function addWeeks(dateString: string, weeks: number) {
  const date = new Date(`${dateString}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + weeks * 7)

  return date.toISOString().split('T')[0]
}

// Retained for screens that intentionally display a raw calendar date.
export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${dateString}T12:00:00Z`))
}

// Retained for screens that intentionally display a raw calendar date.
export function formatShortDate(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${dateString}T12:00:00Z`))
}

// Retained for tutor-local recurrence rules.
export function getWeekdayName(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${dateString}T12:00:00Z`))
}

export function formatTime(time: string) {
  return time?.slice(0, 5) || ''
}

// Raw tutor-local range retained for booking writes. Do not use this to show a
// parent their time; use formatSlotTimeRange instead.
export function slotTimeRange(slot: Slot) {
  return `${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}`
}

/**
 * Returns a valid IANA timezone. Parent profile timezone is preferred, then the
 * browser timezone, then Europe/London.
 */
export function resolveViewerTimezone(profileTimezone?: string | null) {
  const browserTimezone =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : null

  for (const candidate of [profileTimezone, browserTimezone, DEFAULT_TIMEZONE]) {
    if (candidate && isValidTimezone(candidate)) return candidate
  }

  return DEFAULT_TIMEZONE
}

export function isValidTimezone(value: string) {
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: value }).format(new Date())
    return true
  } catch {
    return false
  }
}

/** Parent-local YYYY-MM-DD key for grouping slot buttons by the date the parent sees. */
export function slotViewerDateKey(slot: Slot, viewerTimezone: string) {
  const parts = dateParts(getSlotStart(slot), resolveViewerTimezone(viewerTimezone))
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`
}

export function formatSlotDate(slot: Slot, viewerTimezone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: resolveViewerTimezone(viewerTimezone),
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(getSlotStart(slot))
}

export function formatSlotShortDate(slot: Slot, viewerTimezone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: resolveViewerTimezone(viewerTimezone),
    day: 'numeric',
    month: 'short',
  }).format(getSlotStart(slot))
}

export function getSlotWeekday(slot: Slot, viewerTimezone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: resolveViewerTimezone(viewerTimezone),
    weekday: 'long',
  }).format(getSlotStart(slot))
}

export function formatSlotTimeRange(slot: Slot, viewerTimezone: string) {
  const timeZone = resolveViewerTimezone(viewerTimezone)
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })

  return `${formatter.format(getSlotStart(slot))} – ${formatter.format(getSlotEnd(slot))}`
}

export function formatSlotDateTime(slot: Slot, viewerTimezone: string) {
  const timeZone = resolveViewerTimezone(viewerTimezone)

  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).format(getSlotStart(slot))
}

/**
 * Formats an existing booking for any viewer. The stored lesson date/time is
 * interpreted in the booking timezone, then rendered in the viewer timezone.
 */
export function formatBookingDateTime(
  lessonDate: string,
  lessonTime: string,
  bookingTimezone: string | null,
  viewerTimezone: string
) {
  const instant = zonedDateTimeToUtc(
    lessonDate,
    lessonTime,
    bookingTimezone || DEFAULT_TIMEZONE
  )

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: resolveViewerTimezone(viewerTimezone),
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).format(instant)
}

function getSlotStart(slot: Slot) {
  if (slot.starts_at) return new Date(slot.starts_at)

  return zonedDateTimeToUtc(
    slot.slot_date,
    slot.start_time,
    slot.timezone || DEFAULT_TIMEZONE
  )
}

function getSlotEnd(slot: Slot) {
  if (slot.ends_at) return new Date(slot.ends_at)

  const start = getSlotStart(slot)
  let end = zonedDateTimeToUtc(
    slot.slot_date,
    slot.end_time,
    slot.timezone || DEFAULT_TIMEZONE
  )

  if (end.getTime() <= start.getTime()) {
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000)
  }

  return end
}

export function zonedDateTimeToUtc(
  dateValue: string,
  timeValue: string,
  timeZone: string
) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const [hour, minute, second = 0] = timeValue.split(':').map(Number)

  if (![year, month, day, hour, minute, second].every(Number.isFinite)) {
    throw new Error(`Invalid date/time: ${dateValue} ${timeValue}`)
  }

  const safeTimezone = resolveViewerTimezone(timeZone)
  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute, second)
  let candidate = new Date(targetAsUtc)

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = zonedParts(candidate, safeTimezone)
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

function dateParts(date: Date, timeZone: string) {
  const parts = zonedParts(date, timeZone)
  return { year: parts.year, month: parts.month, day: parts.day }
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
