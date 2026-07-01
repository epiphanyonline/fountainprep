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
    const key = `${slot.tutor_id}-${slot.slot_date}-${slot.start_time}`
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

export function addWeeks(dateString: string, weeks: number) {
  const date = new Date(`${dateString}T00:00:00`)
  date.setDate(date.getDate() + weeks * 7)

  return date.toISOString().split('T')[0]
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${dateString}T00:00:00`))
}

export function formatShortDate(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${dateString}T00:00:00`))
}

export function getWeekdayName(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
  }).format(new Date(`${dateString}T00:00:00`))
}

export function formatTime(time: string) {
  return time?.slice(0, 5) || ''
}

export function slotTimeRange(slot: Slot) {
  return `${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}`
}