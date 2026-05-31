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

type AvailabilitySelection = Record<string, Record<string, boolean>>

const timezoneOptions = [
  { label: 'Nigeria / Lagos', value: 'Africa/Lagos' },
  { label: 'UK / London', value: 'Europe/London' },
  { label: 'USA / New York', value: 'America/New_York' },
  { label: 'Canada / Toronto', value: 'America/Toronto' },
]

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
  {
    key: 'morning',
    label: 'Morning',
    time: '6:00 AM – 12:00 PM',
    start: '06:00',
    end: '12:00',
    nextDay: false,
  },
  {
    key: 'afternoon',
    label: 'Afternoon',
    time: '12:00 PM – 5:00 PM',
    start: '12:00',
    end: '17:00',
    nextDay: false,
  },
  {
    key: 'evening',
    label: 'Evening',
    time: '5:00 PM – 1:00 AM next day',
    start: '17:00',
    end: '01:00',
    nextDay: true,
  },
]

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
  const [message, setMessage] = useState('Loading availability...')
  const [tutor, setTutor] = useState<TutorProfile | null>(null)
  const [levels, setLevels] = useState<LearningLevel[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [weeklyRows, setWeeklyRows] = useState<WeeklyAvailability[]>([])

  const [subjectId, setSubjectId] = useState('')
  const [learningLevelId, setLearningLevelId] = useState('')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [selection, setSelection] = useState<AvailabilitySelection>(() =>
    emptySelection()
  )

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!userProfile || userProfile.role !== 'TUTOR') {
        router.push('/account')
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

      const { data: subjectRows } = await supabase
        .from('subjects')
        .select('id, name, category')
        .eq('is_active', true)
        .in('name', currentLaunchSubjects)
        .order('name', { ascending: true })

      setTutor(tutorProfile as TutorProfile)
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
      return (
        total +
        periods.filter((period) => selection[day.key]?.[period.key]).length
      )
    }, 0)
  }, [selection])

  async function loadWeeklyAvailability(tutorId: string) {
    const { data } = await supabase
      .from('tutor_weekly_availability')
      .select(
        `
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
        subjects ( name ),
        learning_levels ( name )
      `
      )
      .eq('tutor_id', tutorId)
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })

    const cleanRows = ((data ?? []) as any[]).map((row) => ({
      ...row,
      subjects: Array.isArray(row.subjects)
        ? row.subjects[0] ?? null
        : row.subjects ?? null,
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
      is_active: true,
    })
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
    setMessage('Saving weekly shifts and creating bookable lesson slots...')

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
          `Already exists: ${duplicateWarnings.join(
            ', '
          )}. No duplicate shift was saved.`
        )
        return
      }

      if (overlapWarnings.length > 0) {
        setMessage(
          `Overlapping shift blocked: ${overlapWarnings.join(
            ', '
          )}. Please remove the existing shift first.`
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

    const generated = await createBookableSlots(rowsToInsert)

    setSelection(emptySelection())
    await loadWeeklyAvailability(tutor.id)

    let finalMessage = `${rowsToInsert.length} weekly shift(s) saved. ${generated} bookable lesson slot(s) created for parents.`

    if (duplicateWarnings.length > 0) {
      finalMessage += ` Already exists and skipped: ${duplicateWarnings.join(
        ', '
      )}.`
    }

    if (overlapWarnings.length > 0) {
      finalMessage += ` Overlapping shift(s) skipped: ${overlapWarnings.join(
        ', '
      )}.`
    }

    setMessage(finalMessage)
    setSaving(false)
  }

  async function createBookableSlots(rows: any[]) {
    if (!tutor) return 0

    const today = new Date()
    const horizon = new Date()
    horizon.setDate(today.getDate() + 84)

    const startDate = toDateString(today)
    const endDate = toDateString(horizon)

    const { data: existingSlots } = await supabase
      .from('tutor_availability_slots')
      .select('id, subject_id, learning_level_id, slot_date, start_time, end_time')
      .eq('tutor_id', tutor.id)
      .gte('slot_date', startDate)
      .lte('slot_date', endDate)

    const existingKeys = new Set(
      ((existingSlots ?? []) as any[]).map(
        (slot) =>
          `${slot.subject_id}|${slot.learning_level_id}|${slot.slot_date}|${slot.start_time?.slice(
            0,
            5
          )}|${slot.end_time?.slice(0, 5)}`
      )
    )

    const slotsToInsert: any[] = []

    rows.forEach((row) => {
      const dates = nextDatesForDay(row.day_of_week, 12)

      dates.forEach((slotDate) => {
        const key = `${row.subject_id}|${row.learning_level_id}|${slotDate}|${row.start_time}|${row.end_time}`

        if (existingKeys.has(key)) return

        const startsAt = makeDateTime(slotDate, row.start_time)
        const endsAt = makeDateTime(slotDate, row.end_time, row.ends_next_day)

        slotsToInsert.push({
          tutor_id: row.tutor_id,
          subject_id: row.subject_id,
          learning_level_id: row.learning_level_id,
          slot_date: slotDate,
          start_time: row.start_time,
          end_time: row.end_time,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          timezone: row.timezone,
          is_available: true,
          is_booked: false,
        })
      })
    })

    if (slotsToInsert.length === 0) return 0

    const { error } = await supabase
      .from('tutor_availability_slots')
      .insert(slotsToInsert)

    if (error) {
      setMessage(error.message)
      return 0
    }

    return slotsToInsert.length
  }

  async function handleRemoveWeekly(row: WeeklyAvailability) {
    if (!tutor) return

    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase
      .from('tutor_weekly_availability')
      .update({ is_active: false })
      .eq('id', row.id)
      .eq('tutor_id', tutor.id)

    if (error) {
      setMessage(error.message)
      return
    }

    await supabase
      .from('tutor_availability_slots')
      .update({ is_available: false })
      .eq('tutor_id', tutor.id)
      .eq('subject_id', row.subject_id)
      .eq('learning_level_id', row.learning_level_id)
      .eq('is_booked', false)
      .gte('slot_date', today)

    await loadWeeklyAvailability(tutor.id)
    setMessage('Weekly shift removed. Future unbooked slots were also hidden.')
  }

  function dayName(dayNumber: number) {
    return days.find((day) => day.jsDay === dayNumber)?.label ?? 'Day'
  }

  function timezoneLabel(value: string) {
    return timezoneOptions.find((tz) => tz.value === value)?.label ?? value
  }

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Tutor Availability</p>
          <h1>Loading your availability...</h1>
          <p className="subtitle">{message}</p>
        </section>

        <style jsx>{styles}</style>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Tutor Availability</p>

        <h1>Set your weekly teaching pattern.</h1>

        <p className="subtitle">
          Choose the subjects, levels, days and time blocks you can teach.
          Fountain Prep will automatically create bookable lesson slots for
          parents.
        </p>

        <div className="actions">
          <Link href="/tutor/dashboard" className="secondaryBtn">
            Back to Tutor Dashboard
          </Link>
        </div>
      </section>

      <section className="card">
        <div className="sectionHead">
          <p className="eyebrow">Teaching Match</p>
          <h2>What can you teach?</h2>
        </div>

        <div className="formGrid">
          <label>
            <span>Subject</span>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} {subject.category ? `• ${subject.category}` : ''}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Learning level</span>
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
            <span>Timezone</span>
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
          <Notice message="No active learning levels found. Please activate learning levels first." />
        ) : null}

        {message ? <Notice message={message} /> : null}
      </section>

      <section className="card">
        <div className="sectionHead">
          <p className="eyebrow">Quick Select</p>
          <h2>Select common patterns.</h2>
        </div>

        <div className="quickActions">
          <button type="button" className="secondaryBtn" onClick={() => applyToGroup('weekday', true)}>
            Apply to weekdays
          </button>

          <button type="button" className="secondaryBtn" onClick={() => applyToGroup('weekend', true)}>
            Apply to weekends
          </button>

          <button type="button" className="secondaryBtn" onClick={() => setSelection(emptySelection())}>
            Clear Selection
          </button>
        </div>
      </section>

      <section className="card">
        <div className="sectionHead">
          <p className="eyebrow">Weekly Shifts</p>
          <h2>Choose your available blocks.</h2>
        </div>

        <div className="dayGrid">
          {days.map((day) => (
            <div key={day.key} className="dayCard">
              <h3>{day.label}</h3>

              <div className="periodList">
                {periods.map((period) => (
                  <label key={period.key} className="periodCard">
                    <input
                      type="checkbox"
                      checked={selection[day.key]?.[period.key] ?? false}
                      onChange={() => togglePeriod(day.key, period.key)}
                    />

                    <span>
                      <strong>{period.label}</strong>
                      <small>{period.time}</small>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          className="primaryBtn saveBtn"
          disabled={saving}
          onClick={handleSaveWeeklyAvailability}
        >
          {saving ? 'Saving...' : `Save Weekly Shifts (${selectedCount})`}
        </button>
      </section>

      <section className="card">
        <div className="sectionHead">
          <p className="eyebrow">Current Availability</p>
          <h2>Your active weekly shifts.</h2>
        </div>

        {weeklyRows.length === 0 ? (
          <p className="subtitle compact">
            You have not saved any permanent weekly shifts yet.
          </p>
        ) : (
          <div className="savedGrid">
            {weeklyRows.map((row) => (
              <div key={row.id} className="savedCard">
                <h3>
                  {dayName(row.day_of_week)} • {row.period_key.toUpperCase()}
                </h3>

                <p>
                  {row.start_time.slice(0, 5)} - {row.end_time.slice(0, 5)}
                  {row.ends_next_day ? ' next day' : ''} •{' '}
                  {timezoneLabel(row.timezone)}
                </p>

                <p>
                  {row.subjects?.name || '-'} •{' '}
                  {row.learning_levels?.name || '-'}
                </p>

                <button
                  type="button"
                  className="secondaryBtn"
                  onClick={() => handleRemoveWeekly(row)}
                >
                  Remove Shift
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function Notice({ message }: { message: string }) {
  const isSuccess =
    message.toLowerCase().includes('success') ||
    message.toLowerCase().includes('saved') ||
    message.toLowerCase().includes('created') ||
    message.toLowerCase().includes('removed')

  return (
    <div className={isSuccess ? 'notice success' : 'notice warning'}>
      {message}
    </div>
  )
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

function nextDatesForDay(dayOfWeek: number, weeks: number) {
  const result: string[] = []
  const today = new Date()

  for (let i = 0; i < weeks * 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    if (date.getDay() === dayOfWeek) {
      result.push(toDateString(date))
    }

    if (result.length >= weeks) break
  }

  return result
}

function makeDateTime(dateString: string, time: string, nextDay = false) {
  const date = new Date(`${dateString}T${time}:00`)

  if (nextDay) {
    date.setDate(date.getDate() + 1)
  }

  return date
}

function toDateString(date: Date) {
  return date.toISOString().split('T')[0]
}

const styles = `
  .page {
    min-height: 100vh;
    padding: 42px 18px 90px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 30%),
      linear-gradient(180deg, #ffffff, #fbf8ff 45%, #f4edff);
    color: #21152d;
  }

  .hero,
  .card {
    max-width: 1180px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero,
  .card {
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(126,87,194,0.12);
    box-shadow: 0 24px 70px rgba(71,43,117,0.09);
  }

  .hero {
    padding: 48px;
    border-radius: 40px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,239,255,0.96));
  }

  .card {
    margin-top: 28px;
    padding: 32px;
    border-radius: 34px;
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-weight: 950;
    font-size: 14px;
  }

  h1 {
    margin: 14px 0 0;
    max-width: 820px;
    font-size: clamp(42px, 6vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .subtitle {
    max-width: 780px;
    margin: 20px 0 0;
    color: #6f637e;
    font-size: 18px;
    line-height: 1.75;
  }

  .compact {
    font-size: 16px;
  }

  .actions,
  .quickActions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }

  .primaryBtn,
  .secondaryBtn {
    min-height: 54px;
    padding: 0 24px;
    border-radius: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-weight: 950;
    border: 0;
    font-family: inherit;
    cursor: pointer;
  }

  .primaryBtn {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
    box-shadow: 0 16px 38px rgba(124,58,237,0.28);
  }

  .primaryBtn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .secondaryBtn {
    background: white;
    color: #351e55;
    border: 1px solid rgba(124,58,237,0.16);
  }

  .sectionHead {
    margin-bottom: 24px;
  }

  .sectionHead h2 {
    margin: 10px 0 0;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .formGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  label span {
    display: block;
    color: #7a7088;
    font-weight: 850;
    font-size: 14px;
    margin-bottom: 8px;
  }

  select {
    width: 100%;
    min-height: 54px;
    padding: 0 16px;
    border-radius: 18px;
    border: 1px solid rgba(124,58,237,0.16);
    background: white;
    color: #241535;
    font: inherit;
    font-weight: 800;
  }

  .notice {
    margin-top: 18px;
    padding: 15px 17px;
    border-radius: 18px;
    font-weight: 850;
    line-height: 1.5;
  }

  .success {
    background: #ecfdf3;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .warning {
    background: #fff7ed;
    color: #9a3412;
    border: 1px solid #fed7aa;
  }

  .dayGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .dayCard,
  .savedCard {
    padding: 22px;
    border-radius: 26px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .dayCard h3,
  .savedCard h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 950;
  }

  .periodList {
    margin-top: 16px;
    display: grid;
    gap: 12px;
  }

  .periodCard {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 15px;
    border-radius: 18px;
    background: white;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .periodCard input {
    width: 20px;
    height: 20px;
  }

  .periodCard small {
    display: block;
    margin-top: 4px;
    color: #6f637e;
    font-weight: 750;
  }

  .saveBtn {
    margin-top: 26px;
    width: 100%;
  }

  .savedGrid {
    display: grid;
    gap: 14px;
  }

  .savedCard p {
    margin: 8px 0 0;
    color: #6f637e;
    line-height: 1.6;
  }

  .savedCard button {
    margin-top: 16px;
  }

  @media (max-width: 900px) {
    .page {
      padding: 26px 12px 70px;
    }

    .hero {
      padding: 32px 20px;
      border-radius: 30px;
    }

    h1 {
      font-size: clamp(38px, 12vw, 56px);
    }

    .subtitle {
      font-size: 16px;
    }

    .card {
      padding: 24px 20px;
      border-radius: 28px;
    }

    .formGrid,
    .dayGrid {
      grid-template-columns: 1fr;
    }

    .actions,
    .quickActions {
      flex-direction: column;
    }

    .primaryBtn,
    .secondaryBtn {
      width: 100%;
    }
  }
`