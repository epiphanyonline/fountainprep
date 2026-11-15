'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { LEARNING_REWARDS_ENABLED } from '../../lib/learningRewardsFlags'

type Award = {
  id: string
  booking_id: string
  awarded_by: string
  points: number
  created_at: string
}
type Booking = { id: string; student_id: string; tutor_id: string | null }
type Student = { id: string; full_name: string }
type Tutor = { id: string; user_id: string; full_name: string }
type LearnerTotal = { id: string; name: string; total: number; awards: number }
type TutorTotal = { id: string; name: string; total: number; awards: number }

const PAGE_SIZE = 500

// Reads all rows with explicit pagination; Supabase defaults to a 1,000-row cap.
// Access is independently enforced by the database's admin-only RLS policy.
async function readAll<T>(table: string, columns: string): Promise<T[]> {
  const all: T[] = []
  for (let start = 0; ; start += PAGE_SIZE) {
    const { data, error } = await supabase.from(table).select(columns)
      .range(start, start + PAGE_SIZE - 1)
    if (error) throw error
    const batch = (data ?? []) as T[]
    all.push(...batch)
    if (batch.length < PAGE_SIZE) return all
  }
}

export default function AdminLearnerPointsPage() {
  const router = useRouter()
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [awards, setAwards] = useState<Award[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!LEARNING_REWARDS_ENABLED) return
    let active = true
    async function load() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) { router.replace('/login'); return }
        const { data: profile, error: roleError } = await supabase.from('user_profiles')
          .select('role').eq('id', user.id).maybeSingle()
        if (roleError || profile?.role !== 'ADMIN') { router.replace('/account'); return }

        const [awardRows, bookingRows, studentRows, tutorRows] = await Promise.all([
          readAll<Award>('lesson_point_awards', 'id, booking_id, awarded_by, points, created_at'),
          readAll<Booking>('lesson_bookings', 'id, student_id, tutor_id'),
          readAll<Student>('student_profiles', 'id, full_name'),
          readAll<Tutor>('tutor_profiles', 'id, user_id, full_name'),
        ])
        if (!active) return
        setAwards(awardRows)
        setBookings(bookingRows)
        setStudents(studentRows)
        setTutors(tutorRows)
        setState('ready')
      } catch {
        if (!active) return
        setMessage('Rewards data is not available yet. The feature requires the reviewed staging schema and admin RLS policy.')
        setState('error')
      }
    }
    void load()
    return () => { active = false }
  }, [router])

  const results = useMemo(() => {
    const bookingMap = new Map(bookings.map(b => [b.id, b]))
    const studentMap = new Map(students.map(s => [s.id, s.full_name]))
    const tutorByUser = new Map(tutors.map(t => [t.user_id, t]))
    const learnerTotals = new Map<string, LearnerTotal>()
    const tutorTotals = new Map<string, TutorTotal>()
    let countedPoints = 0
    const history: Array<Award & { studentName: string; tutorName: string }> = []

    for (const award of awards) {
      const booking = bookingMap.get(award.booking_id)
      // No inferred identity: missing links are excluded and explicitly flagged.
      if (!booking || !studentMap.has(booking.student_id)) continue
      const tutor = tutorByUser.get(award.awarded_by)
      const studentName = studentMap.get(booking.student_id)!
      const prev = learnerTotals.get(booking.student_id) ?? {
        id: booking.student_id, name: studentName, total: 0, awards: 0,
      }
      prev.total += award.points
      prev.awards += 1
      learnerTotals.set(booking.student_id, prev)
      countedPoints += award.points
      if (tutor) {
        const t = tutorTotals.get(tutor.id) ?? {
          id: tutor.id, name: tutor.full_name, total: 0, awards: 0,
        }
        t.total += award.points
        t.awards += 1
        tutorTotals.set(tutor.id, t)
      }
      history.push({ ...award, studentName, tutorName: tutor?.full_name ?? 'Unknown tutor' })
    }

    return {
      total: countedPoints,
      missing: awards.length - history.length,
      learners: [...learnerTotals.values()].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name)),
      tutors: [...tutorTotals.values()].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name)),
      history: history.sort((a, b) => b.created_at.localeCompare(a.created_at)),
    }
  }, [awards, bookings, students, tutors])

  if (!LEARNING_REWARDS_ENABLED) {
    return <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-bold">Learner Points & Rewards</h1>
      <p className="mt-3">This feature is not enabled in this environment.</p>
      <Link href="/admin" className="mt-4 inline-block underline">Back to admin</Link>
    </main>
  }

  if (state !== 'ready') {
    return <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-bold">Learner Points & Rewards</h1>
      <p className="mt-3" role="status">{state === 'loading' ? 'Checking admin access and loading points…' : message}</p>
      <Link href="/admin" className="mt-4 inline-block underline">Back to admin</Link>
    </main>
  }

  const filtered = results.learners.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
  const number = (n: number) => n.toLocaleString('en-GB')

  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 text-slate-900">
    <div>
      <Link href="/admin" className="text-sm font-semibold text-purple-700 underline">Admin dashboard</Link>
      <h1 className="mt-3 text-3xl font-black">Learner Points & Rewards</h1>
      <p className="mt-2 text-slate-600">Read-only reward monitoring across live lessons. Totals reflect recorded lesson points only.</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
      {[
        ['Lifetime points awarded', number(results.total)],
        ['Learners awarded', number(results.learners.length)],
        ['Tutors awarding', number(results.tutors.length)],
      ].map(([label, value]) =>
        <div key={label} className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-black text-purple-800">{value}</p>
        </div>
      )}
    </div>

    {results.missing > 0 && <p role="alert" className="rounded-xl border border-amber-300 p-3 text-amber-900">
      {results.missing} award records could not be matched to learner bookings and are excluded from totals. Check data integrity.
    </p>}

    <section className="rounded-2xl border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Learner leaderboard</h2>
        <input aria-label="Search learners" className="rounded-lg border px-3 py-2"
          value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a learner" />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b text-slate-600"><th className="py-3">Learner</th><th>Lifetime points</th><th>Awards</th></tr></thead>
          <tbody>{filtered.map(l => <tr key={l.id} className="border-b">
            <td className="py-3 font-medium">{l.name}</td><td>{number(l.total)}</td><td>{number(l.awards)}</td>
          </tr>)}</tbody>
        </table>
        {filtered.length === 0 && <p className="py-4 text-slate-600">No recorded learner points found.</p>}
      </div>
    </section>

    <section className="rounded-2xl border p-5">
      <h2 className="text-xl font-bold">Tutor reward activity</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b text-slate-600"><th className="py-3">Tutor</th><th>Points awarded</th><th>Award events</th></tr></thead>
          <tbody>{results.tutors.map(t => <tr key={t.id} className="border-b">
            <td className="py-3">{t.name}</td><td>{number(t.total)}</td><td>{number(t.awards)}</td>
          </tr>)}</tbody>
        </table>
        {results.tutors.length === 0 && <p className="py-4 text-slate-600">No tutor rewards recorded.</p>}
      </div>
    </section>

    <section className="rounded-2xl border p-5">
      <h2 className="text-xl font-bold">Recent point awards</h2>
      <p className="mt-1 text-sm text-slate-600">Most recent 100 award events; lifetime totals above use all fetched records.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b text-slate-600"><th className="py-3">Date</th><th>Learner</th><th>Tutor</th><th>Points</th></tr></thead>
          <tbody>{results.history.slice(0, 100).map(a => <tr key={a.id} className="border-b">
            <td className="py-3">{new Date(a.created_at).toLocaleString('en-GB')}</td>
            <td>{a.studentName}</td><td>{a.tutorName}</td><td>+{a.points}</td>
          </tr>)}</tbody>
        </table>
        {results.history.length === 0 && <p className="py-4 text-slate-600">No point awards recorded yet.</p>}
      </div>
    </section>
  </main>
}
