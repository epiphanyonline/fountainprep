'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

type LessonMessage = {
  id: string
  sender_id: string
  body: string
  created_at: string
}

type Props = {
  bookingId: string
  viewerId: string
}

const REFRESH_MS = 5000

/**
 * A small in-platform fallback chat when the video meeting connection drops.
 * All authorisation is enforced by Supabase RLS, not by this component.
 */
export default function ClassroomChat({ bookingId, viewerId }: Props) {
  const [messages, setMessages] = useState<LessonMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')
  const [opened, setOpened] = useState(true)
  const previousCount = useRef(0)

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('lesson_chat_messages')
      .select('id, sender_id, body, created_at')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true })
      .limit(200)

    if (error) {
      setNotice('Class chat is temporarily unavailable. You can still use your lesson normally.')
      return
    }

    const next = (data ?? []) as LessonMessage[]
    previousCount.current = next.length
    setMessages(next)
    setNotice('')
  }, [bookingId])

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => { void refresh() }, REFRESH_MS)
    return () => window.clearInterval(timer)
  }, [refresh])

  async function sendMessage() {
    const body = draft.trim()
    if (!body || sending || body.length > 1000) return
    setSending(true)
    const { error } = await supabase
      .from('lesson_chat_messages')
      .insert({ booking_id: bookingId, body })
    if (error) {
      setNotice('Message could not be delivered. Please try again.')
    } else {
      setDraft('')
      await refresh()
    }
    setSending(false)
  }

  return (
    <section aria-label="Classroom direct chat" style={{ marginTop: 18, padding: 16, border: '1px solid #ddd6fe', borderRadius: 18, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>Lesson chat</h3>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Stay in touch with your tutor or parent if Google Meet disconnects.</p>
        </div>
        <button type="button" onClick={() => setOpened(v => !v)} aria-expanded={opened}
          style={{ border: '1px solid #ddd6fe', borderRadius: 9, padding: '8px 10px', background: '#faf5ff', cursor: 'pointer' }}>
          {opened ? 'Minimise' : 'Open chat'}
        </button>
      </div>
      {opened && (
        <div style={{ marginTop: 12 }}>
          <div aria-label="Lesson messages" aria-live="polite"
            style={{ maxHeight: 260, overflowY: 'auto', padding: 12, border: '1px solid #f1eafa', background: '#fafafa', borderRadius: 10 }}>
            {messages.length === 0 && <p style={{ color: '#64748b', margin: 0 }}>No messages yet. Say hello or ask for help reconnecting.</p>}
            {messages.map(m => (
              <div key={m.id} style={{ textAlign: m.sender_id === viewerId ? 'right' : 'left', marginBottom: 10 }}>
                <div style={{ display: 'inline-block', maxWidth: '85%', padding: '8px 12px', borderRadius: 12,
                  background: m.sender_id === viewerId ? '#ede9fe' : '#fff', border: '1px solid #e5e7eb', textAlign: 'left', overflowWrap: 'anywhere' }}>
                  <strong style={{ fontSize: 12 }}>{m.sender_id === viewerId ? 'You' : 'Class participant'}</strong>
                  <p style={{ margin: '4px 0', whiteSpace: 'pre-wrap' }}>{m.body}</p>
                  <small style={{ color: '#64748b' }}>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={event => { event.preventDefault(); void sendMessage() }}
            style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input aria-label="Write a lesson message" value={draft} maxLength={1000}
              onChange={e => setDraft(e.target.value)} placeholder="Message your tutor or parent..."
              style={{ flex: '1 1 200px', minWidth: 0, padding: 10, border: '1px solid #cbd5e1', borderRadius: 10 }} />
            <button type="submit" disabled={!draft.trim() || sending}
              style={{ padding: '10px 18px', borderRadius: 10, border: 0, background: '#6d28d9', color: '#fff', fontWeight: 700, opacity: sending ? 0.65 : 1 }}>
              {sending ? 'Sending…' : 'Send'}
            </button>
          </form>
        </div>
      )}
      {notice && <p role="status" style={{ fontSize: 13, color: '#92400e' }}>{notice}</p>}
      <p style={{ color: '#64748b', fontSize: 11, margin: '8px 0 0' }}>Messages are linked to this lesson. For emergencies or safeguarding concerns, use the official support channel.</p>
    </section>
  )
}
