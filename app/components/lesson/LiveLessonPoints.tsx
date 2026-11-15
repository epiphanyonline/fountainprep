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
  const [message, setMessage] = useState('')

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('lesson_point_awards')
      .select('id, points')
      .eq('booking_id', bookingId)
    if (error) {
      setMessage('Rewards are temporarily unavailable. Your lesson can continue.')
    } else {
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

  async function award(points: number) {
    if (!canAward || !isLive || awarding) return
    setAwarding(true)
    const { error } = await supabase.from('lesson_point_awards').insert({
      booking_id: bookingId,
      points,
    })
    if (error) {
      setMessage('Could not save the points. Please try again.')
    } else {
      await refresh()
    }
    setAwarding(false)
  }

  return (
    <section aria-label="Lesson rewards" style={{ padding: 20, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 22 }}>
      <p style={{ margin: 0, color: '#6d28d9', fontWeight: 800 }}>⭐ Learning rewards</p>
      <h3 style={{ margin: '8px 0' }}>{studentName}: {loading ? '...' : total} points this lesson</h3>
      <p style={{ margin: '0 0 12px', color: '#695b77' }}>Keep up the great work! Points are saved for this lesson.</p>
      {canAward && isLive ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[1, 2, 5].map((points) => (
            <button key={points} type="button" disabled={awarding} onClick={() => { void award(points) }}
              style={{ padding: '10px 18px', borderRadius: 12, background: '#6d28d9', color: 'white', border: 0, cursor: 'pointer', fontWeight: 800 }}>
              +{points} point{points === 1 ? '' : 's'}
            </button>
          ))}
        </div>
      ) : null}
      {message ? <p role="status" style={{ color: '#795548' }}>{message}</p> : null}
    </section>
  )
}
