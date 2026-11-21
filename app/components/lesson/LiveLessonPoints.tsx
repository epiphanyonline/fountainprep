'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Award = { id: string; points: number }
type Props = {
  bookingId: string
  studentName: string
  canAward: boolean
  isLive: boolean
}

export default function LiveLessonPoints({ bookingId, studentName, canAward, isLive }: Props) {
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [awarding, setAwarding] = useState(false)
  const [showCorrections, setShowCorrections] = useState(false)
  const [message, setMessage] = useState('')

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('lesson_point_awards')
      .select('id, points')
      .eq('booking_id', bookingId)

    if (error) {
      setMessage('Rewards are temporarily unavailable. Your lesson can continue.')
    } else {
      // Positive awards and negative corrections form an append-only audit trail.
      setTotal(((data || []) as Award[]).reduce((sum, award) => sum + award.points, 0))
      setMessage('')
    }
    setLoading(false)
  }, [bookingId])

  useEffect(() => {
    void refresh()
    if (!isLive) return
    const timer = window.setInterval(() => { void refresh() }, 5000)
    return () => window.clearInterval(timer)
  }, [refresh, isLive])

  async function adjust(points: number) {
    if (!canAward || !isLive || awarding) return
    if (points < 0 && !window.confirm(`Remove ${Math.abs(points)} point(s) from this lesson? The correction will be recorded in the history.`)) return

    setAwarding(true)
    try {
      if (points < 0) {
        // Re-read rather than relying on a possibly stale displayed balance.
        // The staging database trigger also enforces non-negative totals atomically.
        const { data: current, error: readError } = await supabase
          .from('lesson_point_awards')
          .select('id, points')
          .eq('booking_id', bookingId)
        if (readError) throw readError
        const available = ((current || []) as Award[]).reduce((sum, row) => sum + row.points, 0)
        if (available < Math.abs(points)) {
          setTotal(available)
          setMessage('Not enough points to make that correction.')
          return
        }
      }

      const { error } = await supabase.from('lesson_point_awards').insert({
        booking_id: bookingId,
        points,
      })
      if (error) throw error
      await refresh()
      if (points < 0) setMessage(`Corrected by ${points} point(s). The original award remains in the history.`)
    } catch {
      setMessage('Could not save the point change. Please try again.')
    } finally {
      setAwarding(false)
    }
  }

  return (
    <section aria-label="Lesson rewards" style={{ padding: 20, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 22 }}>
      <p style={{ margin: 0, color: '#6d28d9', fontWeight: 800 }}>⭐ Learning rewards</p>
      <h3 style={{ margin: '8px 0' }}>{studentName}: {loading ? '...' : total} points this lesson</h3>
      <p style={{ margin: '0 0 12px', color: '#695b77' }}>Keep up the great work! Points are saved for this lesson.</p>
      {canAward && isLive ? (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[1, 2, 5].map((points) => (
              <button key={points} type="button" disabled={awarding} onClick={() => { void adjust(points) }}
                style={{ padding: '10px 18px', borderRadius: 12, background: '#6d28d9', color: 'white', border: 0, cursor: 'pointer', fontWeight: 800 }}>
                +{points} point{points === 1 ? '' : 's'}
              </button>
            ))}
          </div>
          <button type="button" aria-expanded={showCorrections} onClick={() => setShowCorrections(value => !value)}
            style={{ marginTop: 12, padding: '8px 0', color: '#6d28d9', background: 'transparent', border: 0, textDecoration: 'underline', cursor: 'pointer' }}>
            {showCorrections ? 'Hide corrections' : 'Correct an accidental award'}
          </button>
          {showCorrections ? (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} aria-label="Deduct points">
              {[1, 2, 5].map((points) => (
                <button key={points} type="button" disabled={awarding || loading || total < points}
                  aria-label={`Deduct ${points} point${points === 1 ? '' : 's'}`}
                  onClick={() => { void adjust(-points) }}
                  style={{ padding: '8px 16px', borderRadius: 12, background: '#fff', color: '#92400e', border: '1px solid #fbbf24', cursor: 'pointer', fontWeight: 700 }}>
                  -{points} point{points === 1 ? '' : 's'}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      {message ? <p role="status" style={{ color: '#795548' }}>{message}</p> : null}
    </section>
  )
}
