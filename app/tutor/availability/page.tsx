'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import {
  addCalendarDays,
  dateKeyInTimezone,
  resolveViewerTimezone,
  weekdayForDateKey,
  zonedDateTimeToUtc,
} from '../../lib/timezone'

type TutorProfile = {
  id: string
  full_name: string
  timezone: string
}

type LearningLevel = {
  id: string
  code: string | null
  name: string
}

type Subject = {
  id: string
  name: string
  category: string | null
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

const languageSubjects = ['yoruba', 'igbo', 'hausa']

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

  const selectedSubject = subjects.find((subject) => subject.id === subjectId)
  const isLanguageSubject = selectedSubject
    ? languageSubjects.includes(selectedSubject.name.toLowerCase())
    : false

  const allAgesLevel = levels.find(
    (level) =>
      level.code === 'ALL_AGES' ||
      level.name.toLowerCase() === 'all ages' ||
      level.name.toLowerCase() === 'language learners'
  )

  const normalLevels = levels.filter(
    (level) =>
      level.code !== 'ALL_AGES' &&
      level.name.toLowerCase() !== 'all ages' &&
      level.name.toLowerCase() !== 'language learners'
  )

  const effectiveLearningLevelId = isLanguageSubject
    ? allAgesLevel?.id || ''
    : learningLevelId

  const selectedCount = useMemo(() => {
    return days.reduce((total, day) => {
      return (
        total +
        periods.filter((period) => selection[day.key]?.[period.key]).length
      )
    }, 0)
  }, [selection])

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
        .select('id, full_name, timezone')
        .eq('user_id', user.id)
        .maybeSingle()

      if (tutorError || !tutorProfile) {
        router.push('/tutor/onboarding')
        return
      }

      const { data: levelRows } = await supabase
        .from('learning_levels')
        .select('id, code, name')
        .eq('is_active', true)
        .order('min_age', { ascending: true })

      const { data: subjectRows } = await supabase
        .from('subjects')
        .select('id, name, category')
        .eq('is_active', true)
        .in('name', currentLaunchSubjects)
        .order('name', { ascending: true })

      const cleanLevels = (levelRows ?? []) as LearningLevel[]
      const cleanSubjects = (subjectRows ?? []) as Subject[]

      setTutor(tutorProfile as TutorProfile)
      setTimezone(resolveViewerTimezone(tutorProfile.timezone || 'Africa/Lagos'))
      setLevels(cleanLevels)
      setSubjects(cleanSubjects)

      const firstSubject = cleanSubjects[0]
      const firstNormalLevel = cleanLevels.find(
        (level) =>
          level.code !== 'ALL_AGES' &&
          level.name.toLowerCase() !== 'all ages' &&
          level.name.toLowerCase() !== 'language learners'
      )

      setSubjectId(firstSubject?.id ?? '')
      setLearningLevelId(firstNormalLevel?.id ?? '')

      await loadWeeklyAvailability(tutorProfile.id)

      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [router])

  useEffect(() => {
    if (isLanguageSubject && allAgesLevel?.id) {
      setLearningLevelId(allAgesLevel.id)
    }

    if (!isLanguageSubject && normalLevels.length > 0) {
      const stillValid = normalLevels.some((level) => level.id === learningLevelId)

      if (!stillValid) {
        setLearningLevelId(normalLevels[0].id)
      }
    }
  }, [isLanguageSubject, allAgesLevel?.id, normalLevels, learningLevelId])

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

  async function ensureTutorSubjectMapping(
    tutorId: string,
    currentSubjectId: string,
    currentLevelId: string
  ) {
    const { data: existing } = await supabase
      .from('tutor_subjects')
      .select('id')
      .eq('tutor_id', tutorId)
      .eq('subject_id', currentSubjectId)
      .eq('learning_level_id', currentLevelId)
      .maybeSingle()

    if (existing) return

    await supabase.from('tutor_subjects').insert({
      tutor_id: tutorId,
      subject_id: currentSubjectId,
      learning_level_id: currentLevelId,
      approved_by_admin: true,
      is_active: true,
    })
  }

  function getNextDatesForDay(
    jsDay: number,
    timeZone: string,
    weeks = 8
  ) {
    const dates: string[] = []
    const todayKey = dateKeyInTimezone(new Date(), timeZone)

    for (let i = 0; i < weeks * 7; i += 1) {
      const candidate = addCalendarDays(todayKey, i)

      if (weekdayForDateKey(candidate) === jsDay) {
        dates.push(candidate)
      }
    }

    return dates.slice(0, weeks)
  }

  function buildTimestamp(
    date: string,
    time: string,
    nextDay: boolean,
    timeZone: string
  ) {
    const calendarDate = nextDay ? addCalendarDays(date, 1) : date
    return zonedDateTimeToUtc(calendarDate, time.slice(0, 5), timeZone).toISOString()
  }

  async function generateSlotsForWeeklyRows(rows: WeeklyAvailability[]) {
    const slotRows = rows.flatMap((row) => {
      const matchingDay = days.find((day) => day.jsDay === row.day_of_week)
      if (!matchingDay) return []

      const dates = getNextDatesForDay(row.day_of_week, row.timezone, 8)

      return dates.map((date) => ({
        tutor_id: tutor?.id,
        subject_id: row.subject_id,
        learning_level_id: row.learning_level_id,
        weekly_availability_id: row.id,
        slot_date: date,
        start_time: row.start_time,
        end_time: row.end_time,
        starts_at: buildTimestamp(date, row.start_time, false, row.timezone),
        ends_at: buildTimestamp(
          date,
          row.end_time,
          row.ends_next_day,
          row.timezone
        ),
        timezone: row.timezone,
        is_available: true,
        is_booked: false,
      }))
    })

    if (slotRows.length === 0) return

    await supabase.from('tutor_availability_slots').upsert(slotRows, {
      onConflict: 'tutor_id,subject_id,learning_level_id,slot_date,start_time',
      ignoreDuplicates: true,
    })
  }

  async function saveAvailability() {
    if (!tutor) return

    if (!subjectId) {
      setMessage('Please select a subject.')
      return
    }

    if (!effectiveLearningLevelId) {
      setMessage(
        isLanguageSubject
          ? 'All Ages level is missing. Please create ALL_AGES in learning_levels.'
          : 'Please select a learning level.'
      )
      return
    }

    if (selectedCount === 0) {
      setMessage('Please select at least one availability period.')
      return
    }

    setSaving(true)
    setMessage('Saving availability...')

    await ensureTutorSubjectMapping(tutor.id, subjectId, effectiveLearningLevelId)

    const rowsToCreate = days.flatMap((day) =>
      periods
        .filter((period) => selection[day.key]?.[period.key])
        .map((period) => ({
          tutor_id: tutor.id,
          subject_id: subjectId,
          learning_level_id: effectiveLearningLevelId,
          day_of_week: day.jsDay,
          period_key: period.key,
          start_time: period.start,
          end_time: period.end,
          ends_next_day: period.nextDay,
          timezone,
          is_active: true,
        }))
    )

    const existingKeys = new Set(
      weeklyRows.map(
        (row) =>
          `${row.subject_id}|${row.learning_level_id}|${row.day_of_week}|${row.period_key}`
      )
    )

    const newRows = rowsToCreate.filter(
      (row) =>
        !existingKeys.has(
          `${row.subject_id}|${row.learning_level_id}|${row.day_of_week}|${row.period_key}`
        )
    )

    if (newRows.length === 0) {
      setMessage('These availability periods already exist.')
      setSaving(false)
      return
    }

    const { data: insertedRows, error } = await supabase
      .from('tutor_weekly_availability')
      .insert(newRows)
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

    if (error) {
      setMessage(error.message)
      setSaving(false)
      return
    }

    const cleanInsertedRows = ((insertedRows ?? []) as any[]).map((row) => ({
      ...row,
      subjects: Array.isArray(row.subjects)
        ? row.subjects[0] ?? null
        : row.subjects ?? null,
      learning_levels: Array.isArray(row.learning_levels)
        ? row.learning_levels[0] ?? null
        : row.learning_levels ?? null,
    })) as WeeklyAvailability[]

    await generateSlotsForWeeklyRows(cleanInsertedRows)
    await loadWeeklyAvailability(tutor.id)

    setSelection(emptySelection())
    setMessage(
      isLanguageSubject
        ? 'Language availability saved for all learner ages.'
        : 'Availability saved successfully.'
    )
    setSaving(false)
  }

  async function removeAvailability(row: WeeklyAvailability) {
    if (!confirm('Remove this availability? Future unbooked slots will also be removed.')) {
      return
    }

    setMessage('Removing availability...')

    const { error } = await supabase
      .from('tutor_weekly_availability')
      .update({ is_active: false })
      .eq('id', row.id)

    if (error) {
      setMessage(error.message)
      return
    }

    await supabase
      .from('tutor_availability_slots')
      .delete()
      .eq('weekly_availability_id', row.id)
      .eq('is_booked', false)

    if (tutor?.id) {
      await loadWeeklyAvailability(tutor.id)
    }

    setMessage('Availability removed.')
  }

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">Tutor availability</p>
          <h1>Loading your weekly schedule...</h1>
          <p className="subtitle">{message}</p>
        </section>

        <style jsx>{styles}</style>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Tutor availability</p>
          <h1>Set the weekly times learners can book you.</h1>
          <p className="subtitle">
            Add the subjects you teach and choose the periods you are available.
            African language subjects use one All Ages availability, so parents
            and learners of any age can find your available slots.
          </p>
        </div>

        <Link href="/tutor/dashboard" className="backLink">
          Back to Dashboard
        </Link>
      </section>

      {message && <div className="message">{message}</div>}

      <section className="layout">
        <div className="card">
          <div className="sectionHead">
            <p className="eyebrow">Create availability</p>
            <h2>Subject and level</h2>
          </div>

          <div className="formGrid">
            <label>
              <span>Subject</span>
              <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>

            {isLanguageSubject ? (
              <div className="infoBox">
                <strong>All Ages language availability</strong>
                <p>
                  {selectedSubject?.name} availability will be shown to all
                  learner ages. The learner’s age, ability and goal will be
                  collected during booking.
                </p>
              </div>
            ) : (
              <label>
                <span>Learning level</span>
                <select
                  value={learningLevelId}
                  onChange={(e) => setLearningLevelId(e.target.value)}
                >
                  {normalLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              <span>Timezone</span>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                {timezoneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="quickActions">
            <button type="button" onClick={() => applyToGroup('weekday', true)}>
              Select weekdays
            </button>
            <button type="button" onClick={() => applyToGroup('weekend', true)}>
              Select weekend
            </button>
            <button type="button" onClick={() => setSelection(emptySelection())}>
              Clear all
            </button>
          </div>

          <div className="availabilityGrid">
            {days.map((day) => (
              <div key={day.key} className="dayCard">
                <h3>{day.label}</h3>

                <div className="periods">
                  {periods.map((period) => {
                    const checked = selection[day.key]?.[period.key] || false

                    return (
                      <button
                        key={period.key}
                        type="button"
                        onClick={() => togglePeriod(day.key, period.key)}
                        className={checked ? 'period activePeriod' : 'period'}
                      >
                        <strong>{period.label}</strong>
                        <span>{period.time}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={saveAvailability}
            disabled={saving}
            className="primaryBtn"
          >
            {saving
              ? 'Saving availability...'
              : `Save ${selectedCount || ''} availability period${
                  selectedCount === 1 ? '' : 's'
                }`}
          </button>
        </div>

        <aside className="card sideCard">
          <p className="eyebrow">Current availability</p>
          <h2>Your active weekly slots</h2>

          {weeklyRows.length === 0 ? (
            <div className="empty">
              <h3>No availability yet</h3>
              <p>Add your first subject and weekly times to begin receiving bookings.</p>
            </div>
          ) : (
            <div className="currentList">
              {weeklyRows.map((row) => (
                <div key={row.id} className="currentItem">
                  <div>
                    <strong>{row.subjects?.name || 'Subject'}</strong>
                    <span>
                      {row.learning_levels?.name || 'All Ages'} •{' '}
                      {getDayName(row.day_of_week)} • {formatTime(row.start_time)} -{' '}
                      {formatTime(row.end_time)}
                    </span>
                    <small>{row.timezone}</small>
                  </div>

                  <button type="button" onClick={() => removeAvailability(row)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </aside>
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function getDayName(jsDay: number) {
  return days.find((day) => day.jsDay === jsDay)?.label || 'Day'
}

function formatTime(time: string) {
  return time?.slice(0, 5) || ''
}

const styles = `
  .page {
    min-height: 100vh;
    padding: 44px 18px 90px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.14), transparent 30%),
      linear-gradient(180deg, #ffffff, #fbf8ff 45%, #f4edff);
    color: #201230;
  }

  .hero,
  .layout,
  .message {
    max-width: 1180px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
    padding: 46px;
    border-radius: 38px;
    background: linear-gradient(135deg, #ffffff, #f4edff);
    border: 1px solid rgba(124, 58, 237, 0.12);
    box-shadow: 0 30px 90px rgba(47, 25, 80, 0.1);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-weight: 950;
  }

  h1 {
    margin: 14px 0 0;
    max-width: 850px;
    font-size: clamp(38px, 6vw, 68px);
    line-height: 0.96;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .subtitle {
    max-width: 780px;
    margin: 20px 0 0;
    color: #6d647c;
    font-size: 18px;
    line-height: 1.75;
  }

  .backLink {
    flex: 0 0 auto;
    text-decoration: none;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    padding: 15px 18px;
    border-radius: 18px;
    font-weight: 950;
    box-shadow: 0 18px 42px rgba(109, 40, 217, 0.2);
  }

  .message {
    margin-top: 18px;
    padding: 16px 18px;
    border-radius: 20px;
    background: #fff7ed;
    color: #7c2d12;
    font-weight: 800;
    line-height: 1.6;
  }

  .layout {
    margin-top: 28px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 390px;
    gap: 24px;
    align-items: start;
  }

  .card {
    padding: 30px;
    border-radius: 34px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(124, 58, 237, 0.1);
    box-shadow: 0 24px 70px rgba(47, 25, 80, 0.09);
  }

  .sideCard {
    position: sticky;
    top: 110px;
    max-height: calc(100vh - 130px);
    overflow-y: auto;
  }

  .sectionHead h2,
  .sideCard h2 {
    margin: 8px 0 0;
    font-size: 32px;
    letter-spacing: -0.04em;
  }

  .formGrid {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  label span {
    display: block;
    margin-bottom: 8px;
    color: #6d28d9;
    font-weight: 950;
    font-size: 13px;
  }

  select {
    width: 100%;
    min-height: 56px;
    border-radius: 18px;
    border: 1px solid rgba(124, 58, 237, 0.16);
    background: #fbf8ff;
    padding: 0 14px;
    font: inherit;
    font-weight: 800;
    color: #201230;
  }

  .infoBox {
    padding: 16px;
    border-radius: 20px;
    background: #f1e8ff;
    border: 1px solid rgba(124, 58, 237, 0.16);
  }

  .infoBox strong {
    display: block;
    color: #4c1d95;
    font-weight: 950;
  }

  .infoBox p {
    margin: 7px 0 0;
    color: #5f5470;
    line-height: 1.6;
    font-weight: 700;
  }

  .quickActions {
    margin-top: 22px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .quickActions button {
    border: 1px solid rgba(124, 58, 237, 0.14);
    background: white;
    color: #241535;
    padding: 12px 14px;
    border-radius: 999px;
    font-weight: 950;
    cursor: pointer;
  }

  .availabilityGrid {
    margin-top: 24px;
    display: grid;
    gap: 16px;
  }

  .dayCard {
    padding: 20px;
    border-radius: 24px;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .dayCard h3 {
    margin: 0 0 14px;
    font-size: 22px;
  }

  .periods {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .period {
    text-align: left;
    padding: 16px;
    border-radius: 20px;
    background: white;
    border: 1px solid rgba(124, 58, 237, 0.12);
    cursor: pointer;
    font-family: inherit;
  }

  .period strong,
  .period span {
    display: block;
  }

  .period span {
    margin-top: 7px;
    color: #6d647c;
    font-weight: 750;
  }

  .activePeriod {
    border-color: #7c3aed;
    background: #f1e8ff;
    box-shadow: 0 16px 34px rgba(124, 58, 237, 0.12);
  }

  .primaryBtn {
    width: 100%;
    margin-top: 24px;
    min-height: 56px;
    border: 0;
    border-radius: 18px;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    font-weight: 950;
    cursor: pointer;
    box-shadow: 0 18px 42px rgba(109, 40, 217, 0.24);
  }

  .primaryBtn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .empty {
    margin-top: 22px;
    padding: 22px;
    border-radius: 24px;
    background: #fbf8ff;
    text-align: center;
  }

  .empty h3 {
    margin: 0;
  }

  .empty p {
    color: #6d647c;
    line-height: 1.7;
  }

  .currentList {
    margin-top: 22px;
    display: grid;
    gap: 12px;
  }

  .currentItem {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 16px;
    border-radius: 20px;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .currentItem strong,
  .currentItem span,
  .currentItem small {
    display: block;
  }

  .currentItem span {
    margin-top: 6px;
    color: #5f5470;
    line-height: 1.5;
    font-weight: 800;
  }

  .currentItem small {
    margin-top: 6px;
    color: #7c3aed;
    font-weight: 900;
  }

  .currentItem button {
    height: 38px;
    border-radius: 999px;
    border: 1px solid rgba(220, 38, 38, 0.16);
    background: #fff1f2;
    color: #be123c;
    font-weight: 950;
    cursor: pointer;
  }

  @media (max-width: 980px) {
    .page {
      padding: 26px 12px 70px;
    }

    .hero {
      flex-direction: column;
      padding: 30px 20px;
      border-radius: 30px;
    }

    .layout,
    .formGrid,
    .periods {
      grid-template-columns: 1fr;
    }

    .sideCard {
      position: static;
      max-height: none;
      overflow: visible;
    }

    h1 {
      font-size: clamp(38px, 12vw, 56px);
    }

    .card {
      padding: 22px;
      border-radius: 28px;
    }
  }
`
