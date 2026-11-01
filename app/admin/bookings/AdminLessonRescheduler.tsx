'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import AdminApplyRemainingLessons from './AdminApplyRemainingLessons'

type Props = {
  bookingId: string
  tutorId: string | null
  status: string
  paymentStatus: string
}
type Tutor = { id: string; full_name: string }
type Slot = { id: string; starts_at: string; ends_at: string; timezone: string }

function localParts(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(instant)
  const value = (key: string) => parts.find(p => p.type === key)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}T${value('hour')}:${value('minute')}`
}

// Convert a wall-clock time in an IANA timezone into an absolute instant.
// Reject nonexistent and ambiguous DST times instead of silently shifting them.
function localToUtc(local: string, zone: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) throw new Error('Choose a valid date and time.')
  const naive = Date.parse(`${local}:00Z`)
  if (!Number.isFinite(naive)) throw new Error('Invalid date/time.')
  const matches: number[] = []
  for (let offsetMinutes = -840; offsetMinutes <= 840; offsetMinutes += 15) {
    const candidate = new Date(naive - offsetMinutes * 60000)
    if (localParts(candidate, zone) === local) matches.push(candidate.getTime())
  }
  if (matches.length === 0) throw new Error('This local time does not exist in the selected timezone (DST change).')
  if (matches.length > 1) throw new Error('This local time occurs twice during a DST change. Choose a different time.')
  return new Date(matches[0])
}

export default function AdminLessonRescheduler({ bookingId, tutorId, status, paymentStatus }: Props) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'manual' | 'slot'>('manual')
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedTutor, setSelectedTutor] = useState(tutorId || '')
  const [slotId, setSlotId] = useState('')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [local, setLocal] = useState('')
  const [duration, setDuration] = useState(60)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [changeId, setChangeId] = useState('')
  const [syncStatus, setSyncStatus] = useState('')
  const [savedManual, setSavedManual] = useState<{ timezone: string; local: string; duration: number; reason: string; tutorId: string } | null>(null)
  const eligible = status === 'CONFIRMED' && paymentStatus === 'PAID'

  useEffect(() => {
    if (!open) return
    let active = true
    async function loadTutors() {
      const { data, error } = await supabase.from('tutor_profiles').select('id,full_name').order('full_name')
      if (active) {
        if (error) setMessage(`Could not load tutors: ${error.message}`)
        else setTutors((data || []) as Tutor[])
      }
    }
    void loadTutors()
    return () => { active = false }
  }, [open])

  useEffect(() => {
    if (!open || mode !== 'slot' || !selectedTutor) return
    let active = true
    async function loadSlots() {
      const { data, error } = await supabase.from('tutor_availability_slots')
        .select('id,starts_at,ends_at,timezone')
        .eq('tutor_id', selectedTutor).eq('is_available', true).eq('is_booked', false)
        .gte('starts_at', new Date().toISOString()).order('starts_at').limit(100)
      if (active) {
        if (error) setMessage(`Could not load available slots: ${error.message}`)
        else setSlots((data || []) as Slot[])
      }
    }
    void loadSlots()
    return () => { active = false }
  }, [open, mode, selectedTutor])

  async function syncCalendar(id: string) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) throw new Error('Admin session expired. Sign in again.')
    const response = await fetch('/api/admin/lesson-management/sync-calendar', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ changeId: id }),
    })
    const result = await response.json()
    if (!response.ok || !result.ok) throw new Error(result.error || 'Google Calendar synchronisation failed.')
    setSyncStatus(result.calendarSyncStatus || 'SYNCED')
    setMessage('Lesson saved and Google Calendar synchronised. Google has been asked to notify attendees; separate platform emails are not yet confirmed.')
  }

  async function save() {
    setMessage('')
    if (!eligible) return setMessage('Only confirmed, paid lessons can be rescheduled.')
    if (!selectedTutor) return setMessage('Select a tutor.')
    if (reason.trim().length < 5) return setMessage('Enter a reason of at least five characters.')
    setBusy(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('Admin session expired. Sign in again.')
      let payload: Record<string, unknown> = { bookingId, tutorId: selectedTutor, mode, reason: reason.trim() }
      if (mode === 'slot') {
        if (!slotId) throw new Error('Select an available tutor slot.')
        payload = { ...payload, slotId }
      } else {
        if (!local) throw new Error('Choose a local date and time.')
        if (!Number.isFinite(duration) || duration < 15 || duration > 240) throw new Error('Duration must be 15–240 minutes.')
        const start = localToUtc(local, timezone)
        const end = new Date(start.getTime() + duration * 60000)
        payload = {
          ...payload, startIso: start.toISOString(), endIso: end.toISOString(),
          localDate: local.slice(0, 10), localTime: local.slice(11, 16), timezone,
        }
      }
      const response = await fetch('/api/admin/lesson-management', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.error || 'Lesson change failed.')
      setChangeId(result.changeId)
      setSyncStatus('PENDING')
      setMessage('Database updated. Synchronising the existing Google Calendar event…')
      try { await syncCalendar(result.changeId); if (mode === 'manual') setSavedManual({ timezone, local, duration, reason, tutorId: selectedTutor }) }
      catch (error) {
        setSyncStatus('FAILED')
        setMessage(`Database changed, but Calendar synchronisation needs attention: ${error instanceof Error ? error.message : String(error)}. Do not repeat the lesson change; retry Calendar only.`)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error))
    } finally { setBusy(false) }
  }

  return (
    <div style={{ width: '100%', marginTop: 10 }}>
      <button type="button" className="detailsButton" disabled={!eligible} onClick={() => setOpen(v => !v)}>
        {open ? 'Close Rescheduling' : 'Change Time / Tutor'}
      </button>
      {open && <div style={{ marginTop: 12, padding: 18, border: '1px solid #ddd0f5', borderRadius: 16, background: '#faf7ff' }}>
        <h3 style={{ marginTop: 0 }}>Administrator lesson rescheduling</h3>
        <p style={{ fontSize: 13 }}>Changes one lesson only. For a recurring plan, change each occurrence separately. Existing payment and Meet link are retained.</p>
        <label style={{ display: 'block', marginBottom: 12 }}>Tutor<br />
          <select value={selectedTutor} onChange={e => { setSelectedTutor(e.target.value); setSlotId('') }} style={{ width: '100%', padding: 10 }}>
            <option value="">Select tutor</option>
            {tutors.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
          </select>
        </label>
        <label style={{ display: 'block', marginBottom: 12 }}>Scheduling method<br />
          <select value={mode} onChange={e => setMode(e.target.value as 'manual' | 'slot')} style={{ width: '100%', padding: 10 }}>
            <option value="manual">Manual time (admin override)</option>
            <option value="slot">Published available tutor slot</option>
          </select>
        </label>
        {mode === 'slot' ? <label style={{ display: 'block', marginBottom: 12 }}>Available slot<br />
          <select value={slotId} onChange={e => setSlotId(e.target.value)} style={{ width: '100%', padding: 10 }}>
            <option value="">Select available slot</option>
            {slots.map(s => <option key={s.id} value={s.id}>{new Date(s.starts_at).toLocaleString('en-GB', { timeZone: s.timezone })} ({s.timezone})</option>)}
          </select>
        </label> : <>
          <label style={{ display: 'block', marginBottom: 12 }}>Timezone (IANA)<br />
            <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{ width: '100%', padding: 10 }}>
              <option value="Africa/Lagos">Africa/Lagos — Nigeria</option>
              <option value="America/New_York">America/New_York — Knoxville</option>
              <option value="America/Los_Angeles">America/Los_Angeles — California</option>
              <option value="Europe/London">Europe/London — UK</option>
            </select>
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>New local lesson date and time<br />
            <input type="datetime-local" value={local} onChange={e => setLocal(e.target.value)} style={{ width: '100%', padding: 10 }} />
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>Duration (minutes)<br />
            <input type="number" min={15} max={240} value={duration} onChange={e => setDuration(Number(e.target.value))} style={{ width: '100%', padding: 10 }} />
          </label>
        </>}
        <label style={{ display: 'block', marginBottom: 12 }}>Reason for change<br />
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} style={{ width: '100%', padding: 10 }} placeholder="Parent requested new lesson time" />
        </label>
        <button type="button" className="detailsButton" disabled={busy || !eligible} onClick={() => void save()}>
          {busy ? 'Processing…' : 'Confirm Lesson Change'}
        </button>
        {changeId && <div style={{ marginTop: 12 }}>
          <p><strong>Calendar:</strong> {syncStatus || 'PENDING'}</p>
          {syncStatus !== 'SYNCED' && <button type="button" className="detailsButton" disabled={busy} onClick={async () => {
            setBusy(true)
            try { await syncCalendar(changeId) } catch (e) { setMessage(e instanceof Error ? e.message : String(e)) }
            finally { setBusy(false) }
          }}>Retry Calendar Sync Only</button>}
        </div>}
        {changeId && <button type="button" className="detailsButton" style={{ marginLeft: 8 }} onClick={() => window.location.reload()}>Refresh Lesson List</button>}
        {syncStatus === 'SYNCED' && savedManual && <AdminApplyRemainingLessons bookingId={bookingId} tutorId={savedManual.tutorId} timezone={savedManual.timezone} localDateTime={savedManual.local} durationMinutes={savedManual.duration} reason={savedManual.reason} />}
        {message && <p role="status" style={{ fontSize: 13, marginTop: 12, overflowWrap: 'anywhere' }}>{message}</p>}
      </div>}
    </div>
  )
}
