'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Props = { bookingId: string; tutorName: string }

export default function LessonTutorReview({ bookingId, tutorName }: Props) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      const { data, error } = await supabase.from('lesson_tutor_reviews')
        .select('id').eq('booking_id', bookingId).maybeSingle()
      if (!active) return
      if (error) setMessage('Reviews are temporarily unavailable.')
      else setSubmitted(Boolean(data))
      setLoading(false)
    }
    void load()
    return () => { active = false }
  }, [bookingId])

  async function submit() {
    if (sending || submitted) return
    setSending(true)
    const { error } = await supabase.from('lesson_tutor_reviews').insert({
      booking_id: bookingId,
      rating,
      comment: comment.trim() || null,
    })
    if (error) setMessage('Your review was not saved. Please try again later.')
    else {
      setSubmitted(true)
      setMessage('Thank you for reviewing your tutor!')
    }
    setSending(false)
  }

  if (loading) return null
  if (submitted) return <p role="status">Thank you for reviewing this lesson.</p>

  return (
    <section aria-label="Review tutor" style={{ padding: 20, background: '#ffffff', border: '1px solid #e9d5ff', borderRadius: 22 }}>
      <h3 style={{ marginTop: 0 }}>How was your lesson with {tutorName}?</h3>
      <p>Parents can leave one review for each completed lesson. Your written feedback may be moderated before publication.</p>
      <div role="group" aria-label="Rating" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" aria-label={value + ' stars'} aria-pressed={rating === value}
            onClick={() => setRating(value)} style={{ fontSize: 25, border: 0, background: 'transparent', color: value <= rating ? '#d39a00' : '#a1a1aa', cursor: 'pointer' }}>★</button>
        ))}
      </div>
      <textarea aria-label="Optional written review" value={comment} maxLength={1000}
        onChange={(event) => setComment(event.target.value)} placeholder="Optional feedback"
        style={{ display: 'block', width: '100%', minHeight: 85, marginBottom: 12, padding: 12, borderRadius: 12, border: '1px solid #ddd6fe' }} />
      <button type="button" onClick={() => { void submit() }} disabled={sending}
        style={{ padding: '12px 18px', border: 0, borderRadius: 12, background: '#6d28d9', color: '#fff', fontWeight: 800 }}>
        {sending ? 'Submitting...' : 'Submit review'}
      </button>
      {message ? <p role="status">{message}</p> : null}
    </section>
  )
}
