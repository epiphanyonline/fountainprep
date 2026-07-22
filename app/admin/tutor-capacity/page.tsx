'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type TutorProfile = {
  id: string
  user_id: string | null
  full_name: string | null
  photo_url: string | null
  bio: string | null
  qualification_summary: string | null
  years_of_experience: number | null
  languages_spoken: string[] | null
  average_rating: number | null
  rating_count: number | null
  timezone: string | null
  approval_status: string | null
  verification_status: string | null
  is_listed: boolean | null
}

type TutorSubjectRow = {
  tutor_id: string
  subject_id: string
  learning_level_id: string | null
  approved_by_admin: boolean | null
  is_active: boolean | null
  subjects: { name: string } | { name: string }[] | null
  learning_levels: { name: string } | { name: string }[] | null
}

type WeeklyAvailabilityRow = {
  id: string
  tutor_id: string
  subject_id: string
  learning_level_id: string | null
  day_of_week: number
  period_key: string
  start_time: string
  end_time: string
  ends_next_day: boolean | null
  timezone: string | null
  is_active: boolean | null
}

type AvailabilitySlotRow = {
  id: string
  tutor_id: string
  subject_id: string
  slot_date: string
  start_time: string
  end_time: string
  starts_at: string | null
  ends_at: string | null
  timezone: string | null
  is_available: boolean | null
  is_booked: boolean | null
}

type CapacityHealth = {
  label: string
  detail: string
  tone: 'critical' | 'warning' | 'healthy'
  priority: number
}

type TutorCapacity = {
  tutor: TutorProfile
  subjects: string[]
  levels: string[]
  subjectRows: TutorSubjectRow[]
  weeklyRows: WeeklyAvailabilityRow[]
  futureSlots: AvailabilitySlotRow[]
  openSlots: AvailabilitySlotRow[]
  bookedSlots: AvailabilitySlotRow[]
  blockedSlots: AvailabilitySlotRow[]
  fillRate: number
  coverageUntil: string | null
  coverageDays: number
  nextOpenSlot: AvailabilitySlotRow | null
  health: CapacityHealth
}

type ViewFilter = 'listed' | 'attention' | 'all'

const weekdayLabels = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

async function fetchAllAvailabilitySlots(
  tutorIds: string[],
  today: string
): Promise<AvailabilitySlotRow[]> {
  const pageSize = 1000
  const allSlots: AvailabilitySlotRow[] = []

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('tutor_availability_slots')
      .select(`
        id,
        tutor_id,
        subject_id,
        slot_date,
        start_time,
        end_time,
        starts_at,
        ends_at,
        timezone,
        is_available,
        is_booked
      `)
      .in('tutor_id', tutorIds)
      .gte('slot_date', today)
      .order('slot_date', { ascending: true })
      .order('start_time', { ascending: true })
      .order('id', { ascending: true })
      .range(from, from + pageSize - 1)

    if (error) {
      throw new Error(error.message)
    }

    const page = (data ?? []) as AvailabilitySlotRow[]
    allSlots.push(...page)

    if (page.length < pageSize) break
  }

  return allSlots
}

export default function TutorCapacityPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [profiles, setProfiles] = useState<TutorProfile[]>([])
  const [subjectRows, setSubjectRows] = useState<TutorSubjectRow[]>([])
  const [weeklyRows, setWeeklyRows] = useState<WeeklyAvailabilityRow[]>([])
  const [slots, setSlots] = useState<AvailabilitySlotRow[]>([])
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewFilter>('listed')

  useEffect(() => {
    let active = true

    async function loadCapacity() {
      setLoading(true)
      setErrorMessage('')

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      const { data: userProfile, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (userProfileError || !userProfile || userProfile.role !== 'ADMIN') {
        router.replace('/account')
        return
      }

      const { data: tutorProfiles, error: tutorError } = await supabase
        .from('tutor_profiles')
        .select(
          `
          id,
          user_id,
          full_name,
          photo_url,
          bio,
          qualification_summary,
          years_of_experience,
          languages_spoken,
          average_rating,
          rating_count,
          timezone,
          approval_status,
          verification_status,
          is_listed
        `
        )
        .order('full_name', { ascending: true })

      if (!active) return

      if (tutorError) {
        setErrorMessage(tutorError.message)
        setLoading(false)
        return
      }

      const tutors = (tutorProfiles ?? []) as TutorProfile[]
      const tutorIds = tutors.map((tutor) => tutor.id)

      if (tutorIds.length === 0) {
        setProfiles([])
        setSubjectRows([])
        setWeeklyRows([])
        setSlots([])
        setLoading(false)
        return
      }

      const today = new Date().toISOString().slice(0, 10)

      let subjectsResult
let weeklyResult
let loadedSlots: AvailabilitySlotRow[]

try {
  ;[subjectsResult, weeklyResult, loadedSlots] = await Promise.all([
    supabase
      .from('tutor_subjects')
      .select(
        `
        tutor_id,
        subject_id,
        learning_level_id,
        approved_by_admin,
        is_active,
        subjects(name),
        learning_levels(name)
      `
      )
      .in('tutor_id', tutorIds)
      .eq('is_active', true),

    supabase
      .from('tutor_weekly_availability')
      .select(
        `
        id,
        tutor_id,
        subject_id,
        learning_level_id,
        day_of_week,
        period_key,
        start_time,
        end_time,
        ends_next_day,
        timezone,
        is_active
      `
      )
      .in('tutor_id', tutorIds)
      .eq('is_active', true),

    fetchAllAvailabilitySlots(tutorIds, today),
  ])
} catch (error) {
  if (!active) return

  setErrorMessage(
    error instanceof Error
      ? error.message
      : 'Unable to load tutor availability.'
  )
  setLoading(false)
  return
}

if (!active) return

const firstError = subjectsResult.error || weeklyResult.error

if (firstError) {
  setErrorMessage(firstError.message)
  setLoading(false)
  return
}

setProfiles(tutors)
setSubjectRows((subjectsResult.data ?? []) as TutorSubjectRow[])
setWeeklyRows((weeklyResult.data ?? []) as WeeklyAvailabilityRow[])
setSlots(loadedSlots)
setLoading(false)
    }

    loadCapacity()

    return () => {
      active = false
    }
  }, [router])

  const capacityRows = useMemo<TutorCapacity[]>(() => {
    return profiles.map((tutor) => {
      const tutorSubjects = subjectRows.filter(
        (row) => row.tutor_id === tutor.id
      )
      const tutorWeeklyRows = weeklyRows.filter(
        (row) => row.tutor_id === tutor.id
      )
      const tutorSlots = slots.filter((slot) => slot.tutor_id === tutor.id)
      const openSlots = tutorSlots.filter(
        (slot) => slot.is_available === true && slot.is_booked !== true
      )
      const bookedSlots = tutorSlots.filter((slot) => slot.is_booked === true)
      const blockedSlots = tutorSlots.filter(
        (slot) => slot.is_available !== true && slot.is_booked !== true
      )
      const reservableSlotCount = openSlots.length + bookedSlots.length
      const fillRate = reservableSlotCount
        ? Math.round((bookedSlots.length / reservableSlotCount) * 100)
        : 0
      const coverageUntil = tutorSlots.reduce<string | null>((latest, slot) => {
        if (!latest || slot.slot_date > latest) return slot.slot_date
        return latest
      }, null)
      const coverageDays = coverageUntil ? daysUntil(coverageUntil) : 0
      const nextOpenSlot = [...openSlots].sort(compareSlots)[0] ?? null
      const subjects = unique(
        tutorSubjects
          .filter((row) => row.approved_by_admin === true)
          .map((row) => relationName(row.subjects))
          .filter(Boolean)
      )
      const levels = unique(
        tutorSubjects
          .filter((row) => row.approved_by_admin === true)
          .map((row) => relationName(row.learning_levels))
          .filter(Boolean)
      )
      const health = getCapacityHealth({
        weeklyPatternCount: tutorWeeklyRows.length,
        futureSlotCount: tutorSlots.length,
        openSlotCount: openSlots.length,
        fillRate,
        coverageDays,
      })

      return {
        tutor,
        subjects,
        levels,
        subjectRows: tutorSubjects,
        weeklyRows: tutorWeeklyRows,
        futureSlots: tutorSlots,
        openSlots,
        bookedSlots,
        blockedSlots,
        fillRate,
        coverageUntil,
        coverageDays,
        nextOpenSlot,
        health,
      }
    })
  }, [profiles, slots, subjectRows, weeklyRows])

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return capacityRows
      .filter((row) => {
        if (view === 'listed' && row.tutor.is_listed !== true) return false
        if (view === 'attention' && row.health.tone === 'healthy') return false

        if (!query) return true

        return [
          row.tutor.full_name,
          row.tutor.bio,
          row.tutor.qualification_summary,
          row.tutor.timezone,
          ...row.subjects,
          ...row.levels,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)
      })
      .sort((a, b) => {
        if (a.health.priority !== b.health.priority) {
          return a.health.priority - b.health.priority
        }

        if (a.openSlots.length !== b.openSlots.length) {
          return a.openSlots.length - b.openSlots.length
        }

        return (a.tutor.full_name || '').localeCompare(b.tutor.full_name || '')
      })
  }, [capacityRows, search, view])

  const listedTutors = capacityRows.filter(
    (row) => row.tutor.is_listed === true
  )
  const listedWithoutPatterns = listedTutors.filter(
    (row) => row.weeklyRows.length === 0
  ).length
  const listedNeedingAttention = listedTutors.filter(
    (row) => row.health.tone !== 'healthy'
  ).length
  const totalOpenStarts = listedTutors.reduce(
    (total, row) => total + row.openSlots.length,
    0
  )
  const totalBookedStarts = listedTutors.reduce(
    (total, row) => total + row.bookedSlots.length,
    0
  )
  const averageFill = average(
    listedTutors
      .filter((row) => row.openSlots.length + row.bookedSlots.length > 0)
      .map((row) => row.fillRate)
  )

  return (
    <main className="capacityPage">
      <section className="capacityShell">
        <div className="heroCard">
          <div>
            <p className="eyebrow">Tutor supply and availability</p>
            <h1>Tutor capacity centre</h1>
            <p className="heroCopy">
              Review listed tutor profiles, approved subjects, recurring weekly
              patterns, generated booking starts and how quickly availability is
              filling.
            </p>
          </div>

          <div className="heroActions">
            <Link href="/admin" className="outlineButton">
              Back to Admin
            </Link>
            <Link href="/admin/tutors" className="primaryButton">
              Tutor Approval Centre
            </Link>
          </div>
        </div>

        <div className="metricGrid" aria-label="Tutor capacity summary">
          <Metric label="Listed tutors" value={listedTutors.length} />
          <Metric
            label="Need attention"
            value={listedNeedingAttention}
            tone={listedNeedingAttention > 0 ? 'warning' : 'default'}
          />
          <Metric
            label="No weekly pattern"
            value={listedWithoutPatterns}
            tone={listedWithoutPatterns > 0 ? 'critical' : 'default'}
          />
          <Metric label="Open booking starts" value={totalOpenStarts} />
          <Metric label="Booked starts" value={totalBookedStarts} />
          <Metric label="Average fill" value={`${averageFill}%`} />
        </div>

        <section className="capacityPanel">
          <div className="panelTop">
            <div>
              <p className="eyebrow">Operational view</p>
              <h2>Listed tutor availability</h2>
            </div>

            <label className="searchBox">
              <span>Search</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tutor, subject, level or timezone"
              />
            </label>
          </div>

          <div className="filterRow" aria-label="Tutor view filter">
            <button
              type="button"
              className={view === 'listed' ? 'filterButton active' : 'filterButton'}
              onClick={() => setView('listed')}
            >
              Listed tutors
            </button>
            <button
              type="button"
              className={
                view === 'attention' ? 'filterButton active' : 'filterButton'
              }
              onClick={() => setView('attention')}
            >
              Needs attention
            </button>
            <button
              type="button"
              className={view === 'all' ? 'filterButton active' : 'filterButton'}
              onClick={() => setView('all')}
            >
              All tutor profiles
            </button>
          </div>

          <div className="capacityNote">
            <strong>How to read this page</strong>
            <span>
              “Starts” are generated booking start options. They are not the
              number of recurring lessons inside a paid package. Coverage warns
              you when a tutor’s generated availability is close to running out.
            </span>
          </div>

          {loading ? (
            <div className="stateCard">Loading tutor capacity…</div>
          ) : errorMessage ? (
            <div className="stateCard errorState">
              <strong>Unable to load tutor capacity</strong>
              <span>{errorMessage}</span>
            </div>
          ) : visibleRows.length === 0 ? (
            <div className="stateCard">
              No tutors match the current view or search.
            </div>
          ) : (
            <div className="tutorGrid">
              {visibleRows.map((row) => (
                <TutorCapacityCard key={row.tutor.id} row={row} />
              ))}
            </div>
          )}
        </section>
      </section>

      <style jsx>{pageStyles}</style>
    </main>
  )
}

function TutorCapacityCard({ row }: { row: TutorCapacity }) {
  const tutorName = row.tutor.full_name || 'Unnamed tutor'
  const timezone = row.tutor.timezone || 'Timezone not set'
  const schedulePreview = row.weeklyRows
    .slice()
    .sort((a, b) => {
      if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week
      return a.start_time.localeCompare(b.start_time)
    })
    .slice(0, 4)

  return (
    <article className="tutorCard">
      <div className="tutorTop">
        <div className="identity">
          {row.tutor.photo_url ? (
            <img className="avatar" src={row.tutor.photo_url} alt={tutorName} />
          ) : (
            <div className="avatarFallback">{tutorName.charAt(0) || 'T'}</div>
          )}

          <div>
            <h3>{tutorName}</h3>
            <p>{timezone}</p>
          </div>
        </div>

        <div className={`healthBadge ${row.health.tone}`}>
          <strong>{row.health.label}</strong>
          <span>{row.health.detail}</span>
        </div>
      </div>

      <div className="statusRow">
        <span className={row.tutor.is_listed ? 'pill listed' : 'pill'}>
          {row.tutor.is_listed ? 'Listed' : 'Not listed'}
        </span>
        <span className="pill">
          {prettyStatus(row.tutor.approval_status || 'unknown')}
        </span>
        <span className="pill">
          {prettyStatus(row.tutor.verification_status || 'unknown')}
        </span>
      </div>

      <p className="bio">
        {row.tutor.bio ||
          row.tutor.qualification_summary ||
          'No public tutor bio has been added yet.'}
      </p>

      <div className="subjectRow">
        {row.subjects.length ? (
          row.subjects.map((subject) => (
            <span key={subject} className="subjectPill">
              {subject}
            </span>
          ))
        ) : (
          <span className="subjectPill missing">No approved subject</span>
        )}
      </div>

      <div className="capacityStats">
        <CapacityStat label="Weekly patterns" value={row.weeklyRows.length} />
        <CapacityStat label="Open starts" value={row.openSlots.length} />
        <CapacityStat label="Booked starts" value={row.bookedSlots.length} />
        <CapacityStat label="Fill rate" value={`${row.fillRate}%`} />
      </div>

      <div className="fillTrack" aria-label={`${row.fillRate}% filled`}>
        <span style={{ width: `${Math.min(row.fillRate, 100)}%` }} />
      </div>

      <div className="availabilitySummary">
        <div>
          <span>Next open start</span>
          <strong>{formatNextSlot(row.nextOpenSlot, timezone)}</strong>
        </div>
        <div>
          <span>Generated coverage</span>
          <strong>
            {row.coverageUntil
              ? `${formatShortDate(row.coverageUntil)} · ${Math.max(
                  row.coverageDays,
                  0
                )} days left`
              : 'No future slots'}
          </strong>
        </div>
      </div>

      <div className="weeklySection">
        <strong>Active weekly availability</strong>
        {schedulePreview.length ? (
          <div className="weeklyList">
            {schedulePreview.map((item) => (
              <span key={item.id}>
                {weekdayLabels[item.day_of_week] || `Day ${item.day_of_week}`} ·{' '}
                {formatTime(item.start_time)}–{formatTime(item.end_time)}
                {item.ends_next_day ? ' next day' : ''}
              </span>
            ))}
            {row.weeklyRows.length > schedulePreview.length ? (
              <em>+{row.weeklyRows.length - schedulePreview.length} more</em>
            ) : null}
          </div>
        ) : (
          <span className="emptySchedule">No active recurring pattern.</span>
        )}
      </div>

      <div className="cardFooter">
        <span>
          {row.tutor.years_of_experience ?? 0}+ years ·{' '}
          {row.tutor.average_rating
            ? `${Number(row.tutor.average_rating).toFixed(1)} rating`
            : 'No rating yet'}
        </span>
        <Link href="/admin/tutors">Review tutor record →</Link>
      </div>
    </article>
  )
}

function Metric({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: string | number
  tone?: 'default' | 'warning' | 'critical'
}) {
  return (
    <div className={`metricCard ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function CapacityStat({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function getCapacityHealth({
  weeklyPatternCount,
  futureSlotCount,
  openSlotCount,
  fillRate,
  coverageDays,
}: {
  weeklyPatternCount: number
  futureSlotCount: number
  openSlotCount: number
  fillRate: number
  coverageDays: number
}): CapacityHealth {
  if (weeklyPatternCount === 0) {
    return {
      label: 'No weekly availability',
      detail: 'Tutor cannot receive new bookings',
      tone: 'critical',
      priority: 0,
    }
  }

  if (futureSlotCount === 0) {
    return {
      label: 'Slots not generated',
      detail: 'Weekly pattern exists but no future starts',
      tone: 'critical',
      priority: 0,
    }
  }

  if (openSlotCount === 0) {
    return {
      label: 'No open starts',
      detail: 'Fully booked, blocked or expired',
      tone: 'critical',
      priority: 0,
    }
  }

  if (coverageDays < 14) {
    return {
      label: 'Coverage expiring',
      detail: 'Generate more future availability',
      tone: 'warning',
      priority: 1,
    }
  }

  if (openSlotCount <= 4) {
    return {
      label: 'Low availability',
      detail: `${openSlotCount} open start${openSlotCount === 1 ? '' : 's'} left`,
      tone: 'warning',
      priority: 1,
    }
  }

  if (fillRate >= 75) {
    return {
      label: 'Filling quickly',
      detail: `${fillRate}% of reservable starts booked`,
      tone: 'warning',
      priority: 1,
    }
  }

  return {
    label: 'Healthy capacity',
    detail: `${openSlotCount} open starts available`,
    tone: 'healthy',
    priority: 2,
  }
}

function relationName(
  relation: { name: string } | { name: string }[] | null
) {
  if (!relation) return ''
  if (Array.isArray(relation)) return relation[0]?.name || ''
  return relation.name || ''
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

function average(values: number[]) {
  if (!values.length) return 0
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length)
}

function daysUntil(dateString: string) {
  const today = new Date()
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  )
  const target = new Date(`${dateString}T00:00:00Z`).getTime()
  return Math.ceil((target - todayUtc) / 86_400_000)
}

function compareSlots(a: AvailabilitySlotRow, b: AvailabilitySlotRow) {
  return slotTimestamp(a) - slotTimestamp(b)
}

function slotTimestamp(slot: AvailabilitySlotRow) {
  if (slot.starts_at) return new Date(slot.starts_at).getTime()
  return new Date(`${slot.slot_date}T${slot.start_time}`).getTime()
}

function formatNextSlot(slot: AvailabilitySlotRow | null, timezone: string) {
  if (!slot) return 'No open future start'

  if (slot.starts_at) {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: timezone,
      }).format(new Date(slot.starts_at))
    } catch {
      // Use the stored date and time if the timezone value is invalid.
    }
  }

  return `${formatShortDate(slot.slot_date)} · ${formatTime(slot.start_time)}`
}

function formatShortDate(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${dateString}T00:00:00Z`))
}

function formatTime(value: string) {
  return value?.slice(0, 5) || ''
}

function prettyStatus(value: string) {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const pageStyles = `
  .capacityPage {
    min-height: 100vh;
    padding: 48px 20px 90px;
    color: #21152d;
    background:
      radial-gradient(circle at 92% 8%, rgba(124, 58, 237, 0.14), transparent 30%),
      linear-gradient(180deg, #fbf8ff 0%, #f5efff 100%);
  }

  .capacityShell {
    width: min(1320px, 100%);
    margin: 0 auto;
  }

  .heroCard,
  .capacityPanel {
    border: 1px solid rgba(109, 40, 217, 0.13);
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 24px 70px rgba(62, 36, 105, 0.09);
  }

  .heroCard {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 30px;
    padding: 42px;
    border-radius: 34px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 38%),
      rgba(255, 255, 255, 0.97);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    max-width: 800px;
    margin: 13px 0 0;
    color: #21152d;
    font-size: clamp(42px, 6vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .heroCopy {
    max-width: 780px;
    margin: 20px 0 0;
    color: #655a73;
    font-size: 17px;
    line-height: 1.7;
  }

  .heroActions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  .primaryButton,
  .outlineButton {
    min-height: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    border-radius: 16px;
    text-decoration: none;
    font-weight: 900;
  }

  .primaryButton {
    color: #fff;
    background: linear-gradient(135deg, #7c3aed, #5b21b6);
  }

  .outlineButton {
    color: #21152d;
    border: 1px solid #e4d8f5;
    background: #fff;
  }

  .metricGrid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 14px;
    margin-top: 20px;
  }

  .metricCard {
    min-height: 118px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 22px;
    border: 1px solid #eadffd;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.95);
  }

  .metricCard.warning {
    border-color: #fed7aa;
    background: #fffaf3;
  }

  .metricCard.critical {
    border-color: #fecaca;
    background: #fff7f7;
  }

  .metricCard span {
    color: #756a80;
    font-size: 13px;
    font-weight: 800;
  }

  .metricCard strong {
    color: #21152d;
    font-size: 32px;
    letter-spacing: -0.04em;
  }

  .capacityPanel {
    margin-top: 24px;
    padding: 34px;
    border-radius: 34px;
  }

  .panelTop {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
  }

  .panelTop h2 {
    margin: 9px 0 0;
    font-size: clamp(30px, 4vw, 46px);
    line-height: 1;
    letter-spacing: -0.05em;
  }

  .searchBox {
    width: min(390px, 100%);
  }

  .searchBox span {
    display: block;
    margin-bottom: 8px;
    color: #6d6475;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .searchBox input {
    width: 100%;
    min-height: 50px;
    padding: 0 16px;
    border: 1px solid #e2d5f8;
    border-radius: 15px;
    color: #21152d;
    background: #fbf9ff;
    font: inherit;
  }

  .filterRow {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 25px;
  }

  .filterButton {
    min-height: 42px;
    padding: 0 16px;
    border: 1px solid #e2d5f8;
    border-radius: 999px;
    color: #3f3150;
    background: #fff;
    font: inherit;
    font-weight: 850;
    cursor: pointer;
  }

  .filterButton.active {
    color: #fff;
    border-color: #6d28d9;
    background: #6d28d9;
  }

  .capacityNote {
    display: grid;
    gap: 5px;
    margin-top: 20px;
    padding: 17px 19px;
    border: 1px solid #bfdbfe;
    border-radius: 18px;
    color: #1e3a8a;
    background: #eff6ff;
  }

  .capacityNote span {
    line-height: 1.55;
  }

  .tutorGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin-top: 25px;
  }

  .tutorCard {
    min-width: 0;
    padding: 25px;
    border: 1px solid #e9def8;
    border-radius: 28px;
    background: #fff;
    box-shadow: 0 15px 38px rgba(68, 40, 108, 0.07);
  }

  .tutorTop {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .identity {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .avatar,
  .avatarFallback {
    width: 58px;
    height: 58px;
    flex-shrink: 0;
    border-radius: 18px;
  }

  .avatar {
    object-fit: cover;
  }

  .avatarFallback {
    display: grid;
    place-items: center;
    color: #6d28d9;
    background: #f0e7ff;
    font-size: 25px;
    font-weight: 950;
  }

  .identity h3 {
    overflow: hidden;
    margin: 0;
    color: #21152d;
    font-size: 22px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .identity p {
    margin: 5px 0 0;
    color: #756b80;
    font-size: 13px;
  }

  .healthBadge {
    max-width: 210px;
    display: grid;
    gap: 4px;
    padding: 10px 12px;
    border-radius: 14px;
    font-size: 12px;
  }

  .healthBadge.critical {
    color: #991b1b;
    background: #fee2e2;
  }

  .healthBadge.warning {
    color: #9a3412;
    background: #ffedd5;
  }

  .healthBadge.healthy {
    color: #166534;
    background: #dcfce7;
  }

  .healthBadge span {
    line-height: 1.35;
  }

  .statusRow,
  .subjectRow {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
  }

  .statusRow {
    margin-top: 18px;
  }

  .pill,
  .subjectPill {
    padding: 7px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 850;
  }

  .pill {
    color: #66576f;
    background: #f5f1fa;
  }

  .pill.listed {
    color: #166534;
    background: #dcfce7;
  }

  .bio {
    display: -webkit-box;
    overflow: hidden;
    margin: 18px 0 0;
    color: #64596e;
    line-height: 1.65;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .subjectRow {
    margin-top: 15px;
  }

  .subjectPill {
    color: #5b21b6;
    border: 1px solid #e0cffd;
    background: #f5efff;
  }

  .subjectPill.missing {
    color: #9a3412;
    border-color: #fed7aa;
    background: #fff7ed;
  }

  .capacityStats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 9px;
    margin-top: 20px;
  }

  .capacityStats div {
    min-width: 0;
    display: grid;
    gap: 7px;
    padding: 13px;
    border-radius: 15px;
    background: #faf8fd;
  }

  .capacityStats span {
    color: #7a6f83;
    font-size: 11px;
    font-weight: 800;
  }

  .capacityStats strong {
    color: #21152d;
    font-size: 21px;
  }

  .fillTrack {
    height: 8px;
    overflow: hidden;
    margin-top: 11px;
    border-radius: 999px;
    background: #eee8f4;
  }

  .fillTrack span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #7c3aed, #ec4899);
  }

  .availabilitySummary {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 17px;
  }

  .availabilitySummary div {
    min-width: 0;
    display: grid;
    gap: 6px;
    padding: 14px;
    border: 1px solid #eadffd;
    border-radius: 16px;
  }

  .availabilitySummary span {
    color: #786c82;
    font-size: 11px;
    font-weight: 850;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .availabilitySummary strong {
    overflow: hidden;
    color: #33213f;
    font-size: 13px;
    line-height: 1.45;
    text-overflow: ellipsis;
  }

  .weeklySection {
    display: grid;
    gap: 9px;
    margin-top: 17px;
    padding: 15px;
    border-radius: 17px;
    background: #fbf9ff;
  }

  .weeklySection > strong {
    color: #33213f;
    font-size: 13px;
  }

  .weeklyList {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
  }

  .weeklyList span,
  .weeklyList em,
  .emptySchedule {
    color: #665a71;
    font-size: 12px;
    line-height: 1.45;
  }

  .weeklyList span {
    padding: 6px 8px;
    border-radius: 9px;
    background: #fff;
  }

  .cardFooter {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    margin-top: 18px;
    padding-top: 17px;
    border-top: 1px solid #eee6f6;
    color: #766b7f;
    font-size: 12px;
  }

  .cardFooter a {
    flex-shrink: 0;
    color: #6d28d9;
    font-weight: 900;
    text-decoration: none;
  }

  .stateCard {
    min-height: 170px;
    display: grid;
    place-content: center;
    gap: 6px;
    margin-top: 25px;
    padding: 30px;
    border: 1px dashed #d9c9ee;
    border-radius: 24px;
    color: #6d6178;
    text-align: center;
    background: #fcfaff;
  }

  .stateCard.errorState {
    color: #991b1b;
    border-color: #fecaca;
    background: #fff7f7;
  }

  @media (max-width: 1100px) {
    .metricGrid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .tutorGrid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .capacityPage {
      padding: 26px 12px 70px;
    }

    .heroCard,
    .panelTop,
    .tutorTop,
    .cardFooter {
      align-items: stretch;
      flex-direction: column;
    }

    .heroCard,
    .capacityPanel {
      padding: 24px;
      border-radius: 27px;
    }

    .heroActions,
    .searchBox,
    .healthBadge {
      width: 100%;
      max-width: none;
    }

    .primaryButton,
    .outlineButton {
      flex: 1;
    }

    .metricGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .capacityStats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .availabilitySummary {
      grid-template-columns: 1fr;
    }

    .cardFooter a {
      align-self: flex-start;
    }
  }

  @media (max-width: 430px) {
    .metricGrid {
      grid-template-columns: 1fr;
    }
  }
`