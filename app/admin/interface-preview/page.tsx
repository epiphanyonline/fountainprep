'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { formatBookingDate, formatBookingTime } from '../../lib/timezone'

type Booking = {
  id: string
  student_id: string
  tutor_id: string | null
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string
  payment_status: string
  classroom_status: string | null
  meeting_link: string | null
}
type Chat = { id: string; body: string; created_at: string }
type Award = { id: string; points: number }
type ViewRole = 'tutor' | 'parent'

/**
 * Admin-only, read-only approximation of the participant experience.
 * This NEVER changes the authenticated role or logs in as a learner/tutor.
 * All data is fetched with the logged-in admin session; no writes.
 */
export default function InterfacePreview() {
  const router = useRouter()
  const params = useSearchParams()
  const bookingId = params.get('bookingId') ?? ''
  const role: ViewRole = params.get('role') === 'parent' ? 'parent' : 'tutor'
  const [booking, setBooking] = useState<Booking | null>(null)
  const [learnerName, setLearnerName] = useState('Learner')
  const [tutorName, setTutorName] = useState('Tutor')
  const [messages, setMessages] = useState<Chat[]>([])
  const [points, setPoints] = useState<Award[]>([])
  const [notice, setNotice] = useState('Loading admin preview...')
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const { data: profile, error: pError } = await supabase.from('user_profiles')
        .select('role, is_active').eq('id', user.id).maybeSingle()
      if (pError || profile?.role !== 'ADMIN' || profile.is_active === false) {
        router.replace('/account')
        return
      }
      if (!active) return
      setAuthorized(true)
      if (!bookingId) { setNotice('Choose a booking from the Admin Lessons Control page.'); return }
      const { data: row, error } = await supabase.from('lesson_bookings')
        .select('id,student_id,tutor_id,lesson_date,lesson_time,timezone,status,payment_status,classroom_status,meeting_link')
        .eq('id', bookingId).maybeSingle()
      if (!active) return
      if (error || !row) { setNotice('Booking not found or unavailable.'); return }
      const b = row as Booking
      setBooking(b)
      const [student, tutor, chat, awards] = await Promise.all([
        supabase.from('student_profiles').select('full_name').eq('id', b.student_id).maybeSingle(),
        b.tutor_id ? supabase.from('tutor_profiles').select('full_name').eq('id', b.tutor_id).maybeSingle() : Promise.resolve({ data: null }),
        supabase.from('lesson_chat_messages').select('id,body,created_at').eq('booking_id', b.id).order('created_at', { ascending: false }).limit(20),
        supabase.from('lesson_point_awards').select('id,points').eq('booking_id', b.id),
      ])
      if (!active) return
      setLearnerName(student.data?.full_name || 'Learner')
      setTutorName(tutor.data?.full_name || 'Tutor')
      setMessages(((chat.data ?? []) as Chat[]).reverse())
      setPoints((awards.data ?? []) as Award[])
      setNotice('')
    }
    void load()
    return () => { active = false }
  }, [bookingId, router])

  const total = useMemo(() => points.reduce((n, a) => n + a.points, 0), [points])
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 pb-12 text-slate-900 sm:p-8">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="font-bold text-amber-900">Admin read-only interface preview</p>
        <p className="mt-1 text-sm text-amber-800">
          This illustrates the participant-facing experience without impersonating anyone.
          Buttons that award points, send messages, join meetings or change lesson status are disabled here.
          This is not a pixel-perfect copy of the user's dashboard.
        </p>
        <Link href="/admin/bookings" className="mt-2 inline-block text-sm font-bold underline">Back to Lessons Control</Link>
      </div>
      {authorized && <nav className="flex flex-wrap gap-2" aria-label="Preview role">
        <Link href={`/admin/interface-preview?bookingId=${encodeURIComponent(bookingId)}&role=tutor`}
          className={`rounded-full px-4 py-2 font-semibold ${role === 'tutor' ? 'bg-purple-700 text-white' : 'bg-slate-100'}`}>Tutor preview</Link>
        <Link href={`/admin/interface-preview?bookingId=${encodeURIComponent(bookingId)}&role=parent`}
          className={`rounded-full px-4 py-2 font-semibold ${role === 'parent' ? 'bg-purple-700 text-white' : 'bg-slate-100'}`}>Parent / learner preview</Link>
      </nav>}
      {notice && <p role="status">{notice}</p>}
      {booking && (
        <>
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div><h1 className="text-2xl font-black">Fountain Prep</h1>
                <p className="text-sm text-slate-500">{role === 'tutor' ? 'Tutor dashboard preview' : 'Parent / learner dashboard preview'}</p></div>
              <div className="flex gap-3 text-xl" aria-label="Navigation features preview">
                <span title="Notifications area preview">🔔</span><span title="Lesson chat preview">💬</span>
              </div>
            </div>
            <p className="text-sm font-bold uppercase text-purple-700">Next scheduled lesson</p>
            <h2 className="mt-1 text-xl font-bold">{role === 'tutor' ? learnerName : tutorName}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-purple-50 p-3"><p className="text-xs text-slate-600">Date</p>
                <p className="font-bold">{formatBookingDate(booking.lesson_date, booking.lesson_time, booking.timezone, role === 'tutor' ? 'Africa/Lagos' : 'America/Los_Angeles')}</p></div>
              <div className="rounded-lg bg-purple-50 p-3"><p className="text-xs text-slate-600">Time</p>
                <p className="font-bold">{formatBookingTime(booking.lesson_date, booking.lesson_time, booking.timezone, role === 'tutor' ? 'Africa/Lagos' : 'America/Los_Angeles')}</p></div>
              <div className="rounded-lg bg-purple-50 p-3"><p className="text-xs text-slate-600">Status</p>
                <p className="font-bold">{booking.status} · {booking.classroom_status ?? 'Not started'}</p></div>
            </div>
            <p className="mt-3 text-sm text-slate-500">Calendar timezone is illustrative: Nigeria for tutor and California for parent in this preview.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-xl bg-purple-700 px-4 py-3 font-bold text-white opacity-65">Enter Classroom · preview only</span>
              <span className="rounded-xl border px-4 py-3 font-bold text-slate-500">Google Meet · preview only</span>
              <Link href={`/classroom/${booking.id}`} className="rounded-xl border border-purple-700 px-4 py-3 font-bold text-purple-700">
                Open actual classroom as admin
              </Link>
            </div>
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border p-5">
              <h2 className="text-lg font-bold">⭐ Learning points</h2>
              <p className="mt-2 text-3xl font-black text-purple-700">{total} points</p>
              <p className="mt-2 text-sm text-slate-600">Recorded points for this lesson</p>
              {role === 'tutor' && <p className="mt-3 text-sm text-slate-500">+1 · +2 · +5 award controls appear for the assigned tutor during a live class (disabled in preview).</p>}
            </div>
            <div className="rounded-2xl border p-5">
              <h2 className="text-lg font-bold">💬 Lesson chat</h2>
              <p className="mb-3 text-sm text-slate-500">Read-only history for this booking, not the site's general support inbox</p>
              <div className="max-h-56 space-y-2 overflow-y-auto">
                {messages.length === 0 ? <p className="text-sm text-slate-500">No classroom chat messages yet.</p> :
                  messages.map(m => <p key={m.id} className="rounded-lg bg-slate-100 p-2 text-sm">{m.body}</p>)}
              </div>
              <p className="mt-3 rounded-lg border p-2 text-sm text-slate-400">Messaging disabled in preview</p>
            </div>
          </section>
          <p className="text-sm text-slate-600">Tutor reviews become available to eligible parents after the lesson is completed; this preview does not submit a review.</p>
        </>
      )}
    </main>
  )
}
