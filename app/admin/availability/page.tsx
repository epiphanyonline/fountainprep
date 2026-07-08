'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

type Tutor = {
  id: string
  user_id: string | null
  full_name: string | null
  approval_status: string | null
  is_listed: boolean | null
}

type UserProfile = {
  id: string
  email: string | null
}

type Subject = {
  id: string
  name: string
  category: string | null
}

type Level = {
  id: string
  name: string
  code: string | null
}

type TutorSubject = {
  tutor_id: string
  subject_id: string
  learning_level_id: string | null
  approved_by_admin: boolean | null
  is_active: boolean | null
}

type WeeklyAvailability = {
  tutor_id: string
  subject_id: string
  learning_level_id: string | null
  day_of_week: number
  period_key: string
  start_time: string
  end_time: string
  timezone: string | null
  is_active: boolean | null
}

type AvailabilitySlot = {
  tutor_id: string
  subject_id: string
  learning_level_id: string | null
  slot_date: string
  start_time: string
  end_time: string
  timezone: string | null
  is_available: boolean | null
  is_booked: boolean | null
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function AdminAvailabilityInspectorPage() {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')

  const [tutors, setTutors] = useState<Tutor[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [tutorSubjects, setTutorSubjects] = useState<TutorSubject[]>([])
  const [weekly, setWeekly] = useState<WeeklyAvailability[]>([])
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setMessage('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage('Please login as admin.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role !== 'ADMIN') {
      setMessage('Admin access required.')
      setLoading(false)
      return
    }

    const [
      tutorRes,
      userRes,
      subjectRes,
      levelRes,
      tutorSubjectRes,
      weeklyRes,
      slotRes,
    ] = await Promise.all([
      supabase
        .from('tutor_profiles')
        .select('id, user_id, full_name, approval_status, is_listed')
        .order('full_name', { ascending: true }),

      supabase
        .from('user_profiles')
        .select('id, email'),

      supabase
        .from('subjects')
        .select('id, name, category')
        .eq('is_active', true)
        .order('name', { ascending: true }),

      supabase
        .from('learning_levels')
        .select('id, name, code')
        .eq('is_active', true)
        .order('name', { ascending: true }),

      supabase
        .from('tutor_subjects')
        .select('tutor_id, subject_id, learning_level_id, approved_by_admin, is_active'),

      supabase
        .from('tutor_weekly_availability')
        .select('tutor_id, subject_id, learning_level_id, day_of_week, period_key, start_time, end_time, timezone, is_active'),

      supabase
        .from('tutor_availability_slots')
        .select('tutor_id, subject_id, learning_level_id, slot_date, start_time, end_time, timezone, is_available, is_booked')
        .gte('slot_date', new Date().toISOString().split('T')[0])
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(5000),
    ])

    if (tutorRes.error) setMessage(tutorRes.error.message)
    if (userRes.error) setMessage(userRes.error.message)
    if (subjectRes.error) setMessage(subjectRes.error.message)
    if (levelRes.error) setMessage(levelRes.error.message)
    if (tutorSubjectRes.error) setMessage(tutorSubjectRes.error.message)
    if (weeklyRes.error) setMessage(weeklyRes.error.message)
    if (slotRes.error) setMessage(slotRes.error.message)

    setTutors((tutorRes.data ?? []) as Tutor[])
    setUsers((userRes.data ?? []) as UserProfile[])
    setSubjects((subjectRes.data ?? []) as Subject[])
    setLevels((levelRes.data ?? []) as Level[])
    setTutorSubjects((tutorSubjectRes.data ?? []) as TutorSubject[])
    setWeekly((weeklyRes.data ?? []) as WeeklyAvailability[])
    setSlots((slotRes.data ?? []) as AvailabilitySlot[])

    setLoading(false)
  }

  const subjectMap = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects])
  const levelMap = useMemo(() => new Map(levels.map((l) => [l.id, l])), [levels])
  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users])

  const rows = useMemo(() => {
    return tutors
      .map((tutor) => {
        const email = tutor.user_id ? userMap.get(tutor.user_id)?.email || '' : ''

        const assignedSubjects = tutorSubjects.filter(
          (row) => row.tutor_id === tutor.id && row.is_active !== false
        )

        const approvedSubjects = assignedSubjects.filter(
          (row) => row.approved_by_admin === true
        )

        const tutorWeekly = weekly.filter((row) => row.tutor_id === tutor.id)
        const activeWeekly = tutorWeekly.filter((row) => row.is_active === true)

        const tutorSlots = slots.filter((slot) => slot.tutor_id === tutor.id)
        const futureAvailableSlots = tutorSlots.filter(
          (slot) => slot.is_available === true && slot.is_booked !== true
        )

        const nextSlots = futureAvailableSlots.slice(0, 8)

        const subjectNames = Array.from(
          new Set(
            approvedSubjects
              .map((row) => subjectMap.get(row.subject_id)?.name)
              .filter(Boolean)
          )
        ) as string[]

        const levelNames = Array.from(
          new Set(
            approvedSubjects
              .map((row) => {
                if (!row.learning_level_id) return 'All / not specified'
                return levelMap.get(row.learning_level_id)?.name || 'Unknown level'
              })
              .filter(Boolean)
          )
        ) as string[]

        const issues: string[] = []

        if (tutor.approval_status !== 'approved') issues.push('Not approved')
        if (!tutor.is_listed) issues.push('Not listed')
        if (approvedSubjects.length === 0) issues.push('No approved subject')
        if (activeWeekly.length === 0) issues.push('No active weekly availability')
        if (futureAvailableSlots.length === 0) issues.push('No future available slots')

        const hasSubjectWithoutSlots = subjectNames.some((name) => {
          const subject = subjects.find((s) => s.name === name)
          if (!subject) return false

          return !futureAvailableSlots.some((slot) => slot.subject_id === subject.id)
        })

        if (hasSubjectWithoutSlots) issues.push('Some subjects have no slots')

        return {
          tutor,
          email,
          subjectNames,
          levelNames,
          activeWeekly,
          futureAvailableSlots,
          nextSlots,
          issues,
        }
      })
      .filter((row) => {
        const q = search.trim().toLowerCase()
        if (!q) return true

        return (
          row.tutor.full_name?.toLowerCase().includes(q) ||
          row.email.toLowerCase().includes(q) ||
          row.subjectNames.join(' ').toLowerCase().includes(q) ||
          row.levelNames.join(' ').toLowerCase().includes(q) ||
          row.tutor.approval_status?.toLowerCase().includes(q)
        )
      })
  }, [tutors, users, tutorSubjects, weekly, slots, search, subjectMap, levelMap, userMap, subjects])

  return (
    <main className="page">
      <section className="hero">
        <Link href="/admin" className="backLink">← Back to Admin</Link>
        <p className="eyebrow">Admin Operations</p>
        <h1>Tutor Availability Inspector</h1>
        <p className="subtitle">
          Search tutors, check subjects, levels, listing status and future availability without running SQL.
        </p>

        <div className="searchBar">
          <input
            placeholder="Search tutor, email, subject, level or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" onClick={loadData}>
            Refresh
          </button>
        </div>

        {message ? <div className="notice">{message}</div> : null}
      </section>

      <section className="stats">
        <div><span>Total tutors</span><strong>{tutors.length}</strong></div>
        <div><span>Listed tutors</span><strong>{tutors.filter((t) => t.is_listed).length}</strong></div>
        <div><span>Approved tutors</span><strong>{tutors.filter((t) => t.approval_status === 'approved').length}</strong></div>
        <div><span>Future slots loaded</span><strong>{slots.length}</strong></div>
      </section>

      <section className="content">
        {loading ? (
          <div className="empty">Loading tutor availability...</div>
        ) : rows.length === 0 ? (
          <div className="empty">No tutors matched your search.</div>
        ) : (
          rows.map((row) => (
            <article key={row.tutor.id} className="card">
              <div className="top">
                <div>
                  <h2>{row.tutor.full_name || 'Unnamed tutor'}</h2>
                  <p>{row.email || 'No email found'}</p>
                </div>

                <div className="badges">
                  <span className={row.tutor.approval_status === 'approved' ? 'good' : 'warn'}>
                    {row.tutor.approval_status || 'unknown'}
                  </span>
                  <span className={row.tutor.is_listed ? 'good' : 'danger'}>
                    {row.tutor.is_listed ? 'Listed' : 'Not listed'}
                  </span>
                  <span className={row.futureAvailableSlots.length > 0 ? 'good' : 'danger'}>
                    {row.futureAvailableSlots.length} future slots
                  </span>
                </div>
              </div>

              <div className="grid">
                <div className="panel">
                  <h3>Subjects</h3>
                  {row.subjectNames.length ? (
                    <div className="chips">
                      {row.subjectNames.map((name) => <span key={name}>{name}</span>)}
                    </div>
                  ) : (
                    <p className="muted">No approved subjects.</p>
                  )}
                </div>

                <div className="panel">
                  <h3>Levels</h3>
                  {row.levelNames.length ? (
                    <div className="chips">
                      {row.levelNames.map((name) => <span key={name}>{name}</span>)}
                    </div>
                  ) : (
                    <p className="muted">No levels assigned.</p>
                  )}
                </div>

                <div className="panel">
                  <h3>Weekly Availability</h3>
                  {row.activeWeekly.length ? (
                    <div className="miniList">
                      {row.activeWeekly.slice(0, 8).map((item, index) => (
                        <span key={index}>
                          {dayNames[item.day_of_week]} • {item.period_key} • {item.start_time.slice(0, 5)}–{item.end_time.slice(0, 5)}
                        </span>
                      ))}
                      {row.activeWeekly.length > 8 ? <em>+{row.activeWeekly.length - 8} more</em> : null}
                    </div>
                  ) : (
                    <p className="muted">No active weekly availability.</p>
                  )}
                </div>

                <div className="panel">
                  <h3>Next Available Slots</h3>
                  {row.nextSlots.length ? (
                    <div className="miniList">
                      {row.nextSlots.map((slot, index) => {
                        const subject = subjectMap.get(slot.subject_id)?.name || 'Subject'
                        const level = slot.learning_level_id
                          ? levelMap.get(slot.learning_level_id)?.name || 'Level'
                          : 'No level'

                        return (
                          <span key={index}>
                            {slot.slot_date} • {slot.start_time.slice(0, 5)}–{slot.end_time.slice(0, 5)} • {subject} • {level}
                          </span>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="muted">No future slots available.</p>
                  )}
                </div>
              </div>

              <div className="issues">
                <h3>Checks</h3>
                {row.issues.length ? (
                  <div className="issueList">
                    {row.issues.map((issue) => (
                      <span key={issue}>⚠️ {issue}</span>
                    ))}
                  </div>
                ) : (
                  <span className="clear">✅ No obvious issue detected</span>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      <style>{styles}</style>
    </main>
  )
}

const styles = `
.page {
  min-height: 100vh;
  padding: 36px 18px 80px;
  background: linear-gradient(180deg, #fff, #f7f1ff);
  color: #241235;
}

.hero,
.stats,
.content {
  max-width: 1180px;
  margin: 0 auto;
}

.hero {
  padding: 34px;
  border-radius: 34px;
  background: #fff;
  border: 1px solid rgba(109, 40, 217, 0.12);
  box-shadow: 0 24px 70px rgba(47, 25, 80, 0.08);
}

.backLink {
  display: inline-block;
  margin-bottom: 16px;
  color: #6d28d9;
  font-weight: 900;
  text-decoration: none;
}

.eyebrow {
  margin: 0;
  color: #6d28d9;
  font-weight: 950;
  font-size: 0.78rem;
  letter-spacing: .12em;
  text-transform: uppercase;
}

h1 {
  margin: 10px 0 0;
  font-size: clamp(2.2rem, 5vw, 4.2rem);
  line-height: .95;
  letter-spacing: -.06em;
}

.subtitle {
  max-width: 760px;
  color: #6b5b7a;
  line-height: 1.7;
}

.searchBar {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.searchBar input {
  flex: 1;
  min-width: 240px;
  padding: 15px 18px;
  border-radius: 16px;
  border: 1px solid #ddd6fe;
  font-size: 1rem;
}

.searchBar button {
  border: 0;
  border-radius: 16px;
  padding: 15px 20px;
  background: #6d28d9;
  color: white;
  font-weight: 950;
  cursor: pointer;
}

.notice,
.empty {
  margin-top: 18px;
  padding: 18px;
  border-radius: 20px;
  background: #fff7ed;
  color: #7c2d12;
  border: 1px solid #fed7aa;
}

.stats {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.stats div {
  padding: 18px;
  background: #fff;
  border-radius: 22px;
  border: 1px solid rgba(109, 40, 217, 0.1);
}

.stats span {
  display: block;
  color: #7a6d85;
  font-weight: 800;
}

.stats strong {
  display: block;
  margin-top: 8px;
  font-size: 1.6rem;
}

.content {
  margin-top: 18px;
  display: grid;
  gap: 18px;
}

.card {
  padding: 24px;
  border-radius: 30px;
  background: rgba(255,255,255,.96);
  border: 1px solid rgba(109, 40, 217, 0.12);
  box-shadow: 0 18px 48px rgba(47, 25, 80, 0.08);
}

.top {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}

.top h2 {
  margin: 0;
  font-size: 1.35rem;
}

.top p {
  margin: 6px 0 0;
  color: #6b5b7a;
}

.badges,
.chips,
.issueList {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badges span,
.chips span,
.issueList span,
.clear {
  padding: 8px 11px;
  border-radius: 999px;
  font-size: .82rem;
  font-weight: 900;
}

.good {
  background: #ecfdf5;
  color: #047857;
}

.warn {
  background: #fff7ed;
  color: #c2410c;
}

.danger {
  background: #fef2f2;
  color: #b91c1c;
}

.chips span {
  background: #f5efff;
  color: #4c1d95;
}

.issueList span {
  background: #fff7ed;
  color: #9a3412;
}

.clear {
  display: inline-block;
  background: #ecfdf5;
  color: #047857;
}

.grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.panel {
  padding: 18px;
  border-radius: 22px;
  background: #faf7ff;
  border: 1px solid rgba(109, 40, 217, 0.1);
}

.panel h3,
.issues h3 {
  margin: 0 0 12px;
  font-size: .95rem;
}

.muted {
  margin: 0;
  color: #7a6d85;
}

.miniList {
  display: grid;
  gap: 8px;
}

.miniList span,
.miniList em {
  padding: 10px 12px;
  border-radius: 14px;
  background: #fff;
  color: #4b3b5a;
  font-size: .88rem;
  font-style: normal;
}

.issues {
  margin-top: 18px;
}

@media (max-width: 820px) {
  .stats,
  .grid {
    grid-template-columns: 1fr;
  }

  .top {
    flex-direction: column;
  }

  .hero,
  .card {
    padding: 22px;
    border-radius: 26px;
  }
}
`