'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'

type BookingRow = {
  id: string
  tutor_id: string | null
  status: string
  payment_status: string
  lesson_date: string | null
  parent_booking_group_id: string | null
}
type SessionRow = { booking_id: string; starts_at: string; ends_at: string }
type Preview = { id: string; oldStart: string; start: Date; end: Date; tutorId: string }

type Props = {
  bookingId: string
  tutorId: string
  timezone: string
  localDateTime: string
  durationMinutes: number
  reason: string
}

function parts(date: Date, timeZone: string) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date)
  const get = (key: string) => p.find(x => x.type === key)?.value || ''
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`
}
function toUtc(local: string, zone: string) {
  const naive = Date.parse(`${local}:00Z`)
  if (!Number.isFinite(naive)) throw new Error('Invalid local time')
  const matches: number[] = []
  for (let offset = -840; offset <= 840; offset += 15) {
    const candidate = new Date(naive - offset * 60000)
    if (parts(candidate, zone) === local) matches.push(candidate.getTime())
  }
  if (matches.length !== 1) throw new Error(`Ambiguous or invalid daylight-saving time: ${local}`)
  return new Date(matches[0])
}

export default function AdminApplyRemainingLessons({ bookingId, tutorId, timezone, localDateTime, durationMinutes, reason }: Props) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<Preview[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<Record<string, string>>({})
  const [applyTutor, setApplyTutor] = useState(false)
  const [approved, setApproved] = useState(false)

  async function loadPreview(changeTutor: boolean) {
    setBusy(true); setError(''); setPreview([]); setApproved(false)
    try {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(localDateTime)) throw new Error('First select a valid local date and time.')
      const { data: origin, error: originError } = await supabase.from('lesson_bookings')
        .select('id,parent_booking_group_id').eq('id', bookingId).single()
      if (originError || !origin?.parent_booking_group_id) throw new Error('No recurring booking group found.')
      const { data, error: bookingError } = await supabase.from('lesson_bookings')
        .select('id,tutor_id,status,payment_status,lesson_date,parent_booking_group_id')
        .eq('parent_booking_group_id', origin.parent_booking_group_id)
      if (bookingError) throw new Error(bookingError.message)
      const rows = (data || []) as BookingRow[]
      if (rows.length > 60) throw new Error('Unexpected group size. Review the bookings manually.')
      const eligible = rows.filter(b => b.id !== bookingId && b.status === 'CONFIRMED' && b.payment_status === 'PAID')
      if (!eligible.length) throw new Error('No other confirmed, paid lessons in this schedule.')
      const { data: sessions, error: sessionsError } = await supabase.from('lesson_sessions')
        .select('booking_id,starts_at,ends_at').in('booking_id', eligible.map(b => b.id))
      if (sessionsError) throw new Error(sessionsError.message)
      const sessionRows = (sessions || []) as SessionRow[]
      const now = Date.now()
      const selectedWeekday = new Date(`${localDateTime.slice(0, 10)}T12:00:00Z`).getUTCDay()
      const selectedTime = localDateTime.slice(11, 16)
      const items: Preview[] = []
      for (const booking of eligible) {
        const matching = sessionRows.filter(s => s.booking_id === booking.id)
        if (matching.length !== 1) throw new Error(`Booking ${booking.id} does not have exactly one session.`)
        const session = matching[0]
        const previous = new Date(session.starts_at)
        if (!Number.isFinite(previous.getTime())) throw new Error(`Invalid session start for ${booking.id}`)
        if (previous.getTime() <= now) continue // Never alter a started or past lesson.
        const localExisting = parts(previous, timezone)
        const oldDate = localExisting.slice(0, 10)
        // Existing session can be on the adjacent local day because of the original timezone bug.
        // Anchor to the date in the learner timezone, then move to the selected weekday within that week.
        const day = new Date(`${oldDate}T12:00:00Z`)
        const delta = selectedWeekday - day.getUTCDay()
        day.setUTCDate(day.getUTCDate() + delta)
        const targetDate = day.toISOString().slice(0, 10)
        const targetLocal = `${targetDate}T${selectedTime}`
        const start = toUtc(targetLocal, timezone)
        const end = new Date(start.getTime() + durationMinutes * 60000)
        if (start.getTime() <= now) continue
        if (!booking.tutor_id && !changeTutor) throw new Error(`No tutor assigned for ${booking.id}`)
        items.push({ id: booking.id, oldStart: session.starts_at, start, end, tutorId: changeTutor ? tutorId : booking.tutor_id! })
      }
      items.sort((a, b) => a.start.getTime() - b.start.getTime())
      if (!items.length) throw new Error('No future lessons remain to change.')
      // Avoid duplicates in the same tutor timetable in the proposed batch.
      for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
        if (items[i].tutorId === items[j].tutorId && items[i].start < items[j].end && items[j].start < items[i].end)
          throw new Error('Proposed lessons overlap for the same tutor.')
      }
      setPreview(items)
    } catch (e) { setError(e instanceof Error ? e.message : String(e)) }
    finally { setBusy(false) }
  }

  async function apply() {
    if (!approved || !preview.length || busy) return
    setBusy(true); setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('Admin session expired.')
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` }
      for (const item of preview) {
        if (results[item.id] === 'SYNCED') continue
        // A failed Calendar sync must be retried using its existing changeId, not by changing the lesson again.
        if (results[item.id]?.startsWith('CALENDAR FAILED')) throw new Error('A Calendar sync failed. Resolve it before continuing; do not repeat this lesson change.')
        const local = parts(item.start, timezone)
        const changeResponse = await fetch('/api/admin/lesson-management', {
          method: 'POST', headers,
          body: JSON.stringify({ bookingId: item.id, tutorId: item.tutorId, mode: 'manual',
            startIso: item.start.toISOString(), endIso: item.end.toISOString(),
            timezone, localDate: local.slice(0, 10), localTime: local.slice(11, 16),
            reason: `Recurring schedule correction: ${reason.trim()}` }),
        })
        const changed = await changeResponse.json()
        if (!changeResponse.ok || !changed.ok || !changed.changeId) throw new Error(`Stopped at ${item.id}: ${changed.error || 'Database change failed'}`)
        setResults(prev => ({ ...prev, [item.id]: `CALENDAR PENDING (${changed.changeId})` }))
        const syncResponse = await fetch('/api/admin/lesson-management/sync-calendar', {
          method: 'POST', headers, body: JSON.stringify({ changeId: changed.changeId }),
        })
        const synced = await syncResponse.json()
        if (!syncResponse.ok || !synced.ok || synced.calendarSyncStatus !== 'SYNCED') {
          setResults(prev => ({ ...prev, [item.id]: `CALENDAR FAILED (${changed.changeId})` }))
          throw new Error(`Stopped after updating ${item.id}: ${synced.error || 'Calendar sync failed'}. Retry Calendar using changeId ${changed.changeId}; do not repeat the database change.`)
        }
        setResults(prev => ({ ...prev, [item.id]: 'SYNCED' }))
      }
    } catch (e) { setError(e instanceof Error ? e.message : String(e)) }
    finally { setBusy(false) }
  }

  return <div style={{ marginTop: 14, borderTop: '1px solid #ddd0f5', paddingTop: 14 }}>
    <button type="button" className="detailsButton" disabled={busy} onClick={() => setOpen(v => !v)}>
      {open ? 'Close Remaining Lessons' : 'Apply This Time to Remaining Lessons'}
    </button>
    {open && <div style={{ marginTop: 12 }}>
      <p>This applies the selected learner-local weekday and time to future confirmed, paid lessons in the same booking group. The current lesson and past lessons are excluded.</p>
      <label style={{ display: 'block', marginBottom: 12 }}>
        <input type="checkbox" checked={applyTutor} disabled={busy} onChange={e => { setApplyTutor(e.target.checked); setPreview([]); setApproved(false) }} /> Also assign the selected tutor to remaining lessons
      </label>
      <button type="button" className="detailsButton" disabled={busy} onClick={() => void loadPreview(applyTutor)}>
        {busy ? 'Working…' : 'Preview Remaining Lessons'}
      </button>
      {!!preview.length && <div style={{ marginTop: 14 }}>
        <p><strong>{preview.length} future lessons to change.</strong> Timezone: {timezone}. Please confirm tutor availability and lesson duration before applying.</p>
        <div style={{ maxHeight: 260, overflowY: 'auto' }}>
          {preview.map(item => <p key={item.id} style={{ fontSize: 12, borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
            {new Date(item.oldStart).toLocaleString('en-GB', { timeZone: timezone })} → <strong>{parts(item.start, timezone).replace('T', ' ')}</strong> ({timezone}) — {results[item.id] || 'NOT CHANGED'}
          </p>)}
        </div>
        <label style={{ display: 'block', margin: '12px 0' }}><input type="checkbox" checked={approved} disabled={busy} onChange={e => setApproved(e.target.checked)} /> I have checked the dates, duration and tutor availability for every lesson.</label>
        <button type="button" className="detailsButton" disabled={!approved || busy} onClick={() => void apply()}>
          {busy ? 'Updating lessons one by one…' : `Confirm Changes to ${preview.length} Lessons`}
        </button>
      </div>}
      {error && <p role="alert" style={{ color: '#9a3412', overflowWrap: 'anywhere' }}>{error}</p>}
      <p style={{ fontSize: 12 }}>Changes are applied sequentially, not as one atomic transaction. Processing stops on the first error. Calendar failures require retrying the existing change ID.</p>
    </div>}
  </div>
}
