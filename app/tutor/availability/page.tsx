'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type TutorProfile = {
  id: string
  full_name: string
}

type LearningLevel = {
  id: string
  name: string
}

type Subject = {
  id: string
  name: string
  category: string
}

type WeeklyAvailability = {
  id: string
  subject_id: string
  learning_level_id: string
  day_of_week: number
  period_key: string
  start_time: string
  end_time: string
  ends_next_day: boolean
  timezone: string
  is_active: boolean
  subjects: { name: string } | null
  learning_levels: { name: string } | null
}

const timezoneOptions = [
  { label: 'Nigeria / Lagos', value: 'Africa/Lagos' },
  { label: 'UK / London', value: 'Europe/London' },
  { label: 'USA / New York', value: 'America/New_York' },
  { label: 'Canada / Toronto', value: 'America/Toronto' },
]

const days = [
  { key: 'monday', label: 'Monday', jsDay: 1, group: 'weekday' },
  { key: 'tuesday', label: 'Tuesday', jsDay: 2, group: 'weekday' },
  { key: 'wednesday', label: 'Wednesday', jsDay: 3, group: 'weekday' },
  { key: 'thursday', label: 'Thursday', jsDay: 4, group: 'weekday' },
  { key: 'friday', label: 'Friday', jsDay: 5, group: 'weekday' },
  { key: 'saturday', label: 'Saturday', jsDay: 6, group: 'weekend' },
  { key: 'sunday', label: 'Sunday', jsDay: 0, group: 'weekend' },
]

const periods = [
  { key: 'morning', label: 'Morning', time: '6:00 AM – 12:00 PM', start: '06:00', end: '12:00', nextDay: false },
  { key: 'afternoon', label: 'Afternoon', time: '12:00 PM – 5:00 PM', start: '12:00', end: '17:00', nextDay: false },
  { key: 'evening', label: 'Evening', time: '5:00 PM – 1:00 AM next day', start: '17:00', end: '01:00', nextDay: true },
]

type AvailabilitySelection = Record<string, Record<string, boolean>>

function emptySelection(): AvailabilitySelection {
  const result: AvailabilitySelection = {}
  days.forEach((day) => {
    result[day.key] = {}
    periods.forEach((period) => {
      result[day.key][period.key] = false
    })
  })
  return result
}

export default function TutorAvailabilityPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('Loading...')

  const [tutor, setTutor] = useState<TutorProfile | null>(null)
  const [levels, setLevels] = useState<LearningLevel[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [weeklyRows, setWeeklyRows] = useState<WeeklyAvailability[]>([])

  const [subjectId, setSubjectId] = useState('')
  const [learningLevelId, setLearningLevelId] = useState('')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [selection, setSelection] = useState<AvailabilitySelection>(() => emptySelection())

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: tutorProfile, error: tutorError } = await supabase
        .from('tutor_profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .maybeSingle()

      if (tutorError || !tutorProfile) {
        router.push('/tutor/onboarding')
        return
      }

      const { data: levelRows } = await supabase
        .from('learning_levels')
        .select('id, name')
        .eq('is_active', true)
        .order('min_age', { ascending: true })

      const currentLaunchSubjects = [
  'Maths',
  'English',
  'Science',
  'Coding',
  'Music',
  'Yoruba',
  'Igbo',
  'Hausa',
]

const { data: subjectRows } = await supabase
  .from('subjects')
  .select('id, name, category')
  .eq('is_active', true)
  .in('name', currentLaunchSubjects)
  .order('name', { ascending: true })

      setTutor(tutorProfile)
      setLevels((levelRows ?? []) as LearningLevel[])
      setSubjects((subjectRows ?? []) as Subject[])
      setLearningLevelId(levelRows?.[0]?.id ?? '')
      setSubjectId(subjectRows?.[0]?.id ?? '')

      await loadWeeklyAvailability(tutorProfile.id)

      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [router])

  const selectedCount = useMemo(() => {
    return days.reduce((total, day) => {
      return total + periods.filter((period) => selection[day.key]?.[period.key]).length
    }, 0)
  }, [selection])

  async function loadWeeklyAvailability(tutorId: string) {
    const { data } = await supabase
      .from('tutor_weekly_availability')
      .select(`
        id,
        subject_id,
        learning_level_id,
        day_of_week,
        period_key,
        start_time,
        end_time,
        ends_next_day,
        timezone,
        is_active,
        subjects (
          name
        ),
        learning_levels (
          name
        )
      `)
      .eq('tutor_id', tutorId)
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })

    const cleanRows = ((data ?? []) as any[]).map((row) => ({
      ...row,
      subjects: Array.isArray(row.subjects) ? row.subjects[0] ?? null : row.subjects ?? null,
      learning_levels: Array.isArray(row.learning_levels)
        ? row.learning_levels[0] ?? null
        : row.learning_levels ?? null,
    })) as WeeklyAvailability[]

    setWeeklyRows(cleanRows)
  }

  function togglePeriod(dayKey: string, periodKey: string) {
    setSelection((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [periodKey]: !prev[dayKey]?.[periodKey],
      },
    }))
  }

  function applyToGroup(group: 'weekday' | 'weekend', checked: boolean) {
    setSelection((prev) => {
      const next = { ...prev }

      days
        .filter((day) => day.group === group)
        .forEach((day) => {
          next[day.key] = { ...next[day.key] }
          periods.forEach((period) => {
            next[day.key][period.key] = checked
          })
        })

      return next
    })
  }

  async function ensureTutorSubjectMapping() {
    if (!tutor || !subjectId || !learningLevelId) return

    const { data: existing } = await supabase
      .from('tutor_subjects')
      .select('id')
      .eq('tutor_id', tutor.id)
      .eq('subject_id', subjectId)
      .eq('learning_level_id', learningLevelId)
      .maybeSingle()

    if (existing) return

    await supabase.from('tutor_subjects').insert({
      tutor_id: tutor.id,
      subject_id: subjectId,
      learning_level_id: learningLevelId,
    })
  }

  function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function overlaps(
  startA: string,
  endA: string,
  nextDayA: boolean,
  startB: string,
  endB: string,
  nextDayB: boolean
) {
  const aStart = timeToMinutes(startA)
  let aEnd = timeToMinutes(endA)
  if (nextDayA) aEnd += 24 * 60

  const bStart = timeToMinutes(startB)
  let bEnd = timeToMinutes(endB)
  if (nextDayB) bEnd += 24 * 60

  return aStart < bEnd && bStart < aEnd
}

async function handleSaveWeeklyAvailability() {
  if (!tutor) return

  if (!subjectId || !learningLevelId) {
    setMessage('Please select subject and learning level first.')
    return
  }

  if (selectedCount === 0) {
    setMessage('Please select at least one weekly shift.')
    return
  }

  setSaving(true)
  setMessage('')

  await ensureTutorSubjectMapping()

  const rowsToInsert: any[] = []
  const duplicateWarnings: string[] = []
  const overlapWarnings: string[] = []

  days.forEach((day) => {
    periods.forEach((period) => {
      if (!selection[day.key]?.[period.key]) return

      const exactDuplicate = weeklyRows.find(
        (row) =>
          row.subject_id === subjectId &&
          row.learning_level_id === learningLevelId &&
          row.day_of_week === day.jsDay &&
          row.period_key === period.key &&
          row.is_active
      )

      if (exactDuplicate) {
        duplicateWarnings.push(`${day.label} ${period.label}`)
        return
      }

      const overlap = weeklyRows.find(
        (row) =>
          row.day_of_week === day.jsDay &&
          row.is_active &&
          overlaps(
            period.start,
            period.end,
            period.nextDay,
            row.start_time.slice(0, 5),
            row.end_time.slice(0, 5),
            row.ends_next_day
          )
      )

      if (overlap) {
        overlapWarnings.push(`${day.label} ${period.label}`)
        return
      }

      rowsToInsert.push({
        tutor_id: tutor.id,
        subject_id: subjectId,
        learning_level_id: learningLevelId,
        day_of_week: day.jsDay,
        period_key: period.key,
        start_time: period.start,
        end_time: period.end,
        ends_next_day: period.nextDay,
        timezone,
        is_active: true,
      })
    })
  })

  if (rowsToInsert.length === 0) {
    setSaving(false)

    if (duplicateWarnings.length > 0) {
      setMessage(
        `Already exists: ${duplicateWarnings.join(', ')}. No duplicate shift was saved.`
      )
      return
    }

    if (overlapWarnings.length > 0) {
      setMessage(
        `Overlapping shift blocked: ${overlapWarnings.join(', ')}. Please remove the existing shift first.`
      )
      return
    }

    setMessage('No new shift was saved.')
    return
  }

  const { error } = await supabase
    .from('tutor_weekly_availability')
    .insert(rowsToInsert)

  if (error) {
    setMessage(error.message)
    setSaving(false)
    return
  }

  setSelection(emptySelection())
  await loadWeeklyAvailability(tutor.id)

  let finalMessage = `${rowsToInsert.length} permanent weekly shift(s) saved successfully.`

  if (duplicateWarnings.length > 0) {
    finalMessage += ` Already exists and skipped: ${duplicateWarnings.join(', ')}.`
  }

  if (overlapWarnings.length > 0) {
    finalMessage += ` Overlapping shift(s) skipped: ${overlapWarnings.join(', ')}.`
  }

  setMessage(finalMessage)
  setSaving(false)
}

  async function handleRemoveWeekly(row: WeeklyAvailability) {
    if (!tutor) return

    const { error } = await supabase
      .from('tutor_weekly_availability')
      .update({ is_active: false })
      .eq('id', row.id)
      .eq('tutor_id', tutor.id)

    if (error) {
      setMessage(error.message)
      return
    }

    await loadWeeklyAvailability(tutor.id)
    setMessage('Weekly shift removed.')
  }

  function dayName(dayNumber: number) {
    return days.find((day) => day.jsDay === dayNumber)?.label ?? 'Day'
  }

  function timezoneLabel(value: string) {
    return timezoneOptions.find((tz) => tz.value === value)?.label ?? value
  }

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="container">
          <div className="card" style={{ padding: 32 }}>
            <h1 className="page-title">Availability</h1>
            <p>{message}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <section
          className="card"
          style={{
            padding: 34,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(244,237,255,0.95) 100%)',
          }}
        >
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 800 }}>
            Tutor Availability
          </p>

          <h1 className="page-title" style={{ marginTop: 10 }}>
            Set your permanent weekly shifts
          </h1>

          <p className="page-subtitle">
            Select the subjects, levels and weekly shifts you can teach. These shifts stay active every week unless you update them.
          </p>

          <div style={{ marginTop: 22 }}>
            <Link href="/tutor/dashboard" className="btn-secondary">
              Back to Tutor Dashboard
            </Link>
          </div>
        </section>

        <section className="card" style={{ padding: 30, marginTop: 24 }}>
          <h2 style={{ marginTop: 0 }}>Teaching Match</h2>

          <div className="form-stack">
            <label>
              <span className="kpi-label">Subject you can teach</span>
              <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} {subject.category ? `• ${subject.category}` : ''}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="kpi-label">Learning level you can teach</span>
              <select
                value={learningLevelId}
                onChange={(e) => setLearningLevelId(e.target.value)}
                required
              >
                <option value="">Select learning level</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="kpi-label">Your timezone</span>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                {timezoneOptions.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {levels.length === 0 ? (
            <Notice message="No active learning levels found. Please activate EY, LP and UP in learning_levels." />
          ) : null}

          {message ? <Notice message={message} /> : null}
        </section>

        <section className="card" style={{ padding: 30, marginTop: 24 }}>
          <h2 style={{ marginTop: 0 }}>Quick Select</h2>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" className="btn-secondary" onClick={() => applyToGroup('weekday', true)}>
              Apply to all weekdays
            </button>

            <button type="button" className="btn-secondary" onClick={() => applyToGroup('weekend', true)}>
              Apply to all weekends
            </button>

            <button type="button" className="btn-secondary" onClick={() => setSelection(emptySelection())}>
              Clear Selection
            </button>
          </div>
        </section>

        <section className="card" style={{ padding: 30, marginTop: 24 }}>
          <h2 style={{ marginTop: 0 }}>Weekly Shifts</h2>

          <div style={{ display: 'grid', gap: 18 }}>
            {days.map((day) => (
              <div key={day.key} className="panel" style={{ padding: 18 }}>
                <h3 style={{ marginTop: 0 }}>{day.label}</h3>

                <div style={{ display: 'grid', gap: 12 }}>
                  {periods.map((period) => (
                    <label
                      key={period.key}
                      style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'center',
                        padding: 14,
                        borderRadius: 16,
                        background: '#fff',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selection[day.key]?.[period.key] ?? false}
                        onChange={() => togglePeriod(day.key, period.key)}
                        style={{ width: 18, height: 18 }}
                      />
                      <span>
                        <strong>{period.label}</strong> ({period.time})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 22 }}>
            <button className="btn-primary" disabled={saving} onClick={handleSaveWeeklyAvailability}>
              {saving ? 'Saving...' : `Save Permanent Weekly Shifts (${selectedCount} selected)`}
            </button>
          </div>
        </section>

        <section className="card" style={{ padding: 30, marginTop: 24 }}>
          <h2 style={{ marginTop: 0 }}>Your Permanent Weekly Shifts</h2>

          {weeklyRows.length === 0 ? (
            <p className="page-subtitle">
              You have not saved any permanent weekly shifts yet.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {weeklyRows.map((row) => (
                <div key={row.id} className="panel" style={{ padding: 18 }}>
                  <p style={{ margin: 0, fontWeight: 900 }}>
                    {dayName(row.day_of_week)} • {row.period_key.toUpperCase()}
                  </p>

                  <p className="page-subtitle" style={{ marginTop: 6 }}>
                    {row.start_time.slice(0, 5)} - {row.end_time.slice(0, 5)}
                    {row.ends_next_day ? ' next day' : ''} • {timezoneLabel(row.timezone)}
                  </p>

                  <p className="page-subtitle" style={{ marginTop: 6 }}>
                    Subject: {row.subjects?.name || '-'} • Level:{' '}
                    {row.learning_levels?.name || '-'}
                  </p>

                  <div style={{ marginTop: 12 }}>
                    <button type="button" className="btn-secondary" onClick={() => handleRemoveWeekly(row)}>
                      Remove Shift
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function Notice({ message }: { message: string }) {
  const isSuccess =
    message.toLowerCase().includes('success') ||
    message.toLowerCase().includes('saved') ||
    message.toLowerCase().includes('removed')

  return (
    <div
      style={{
        marginTop: 18,
        padding: '14px 16px',
        borderRadius: 16,
        background: isSuccess ? 'rgba(46, 204, 113, 0.14)' : 'rgba(245, 158, 11, 0.18)',
        border: isSuccess
          ? '1px solid rgba(46, 204, 113, 0.35)'
          : '1px solid rgba(245, 158, 11, 0.45)',
        color: isSuccess ? '#166534' : '#92400e',
        fontWeight: 800,
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  )
}