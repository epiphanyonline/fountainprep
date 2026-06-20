'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type SupportThread = {
  id: string
  created_by: string | null
  role: string
  subject: string
  category: string
  status: string
  priority: string
  visitor_name: string | null
  visitor_email: string | null
  visitor_phone: string | null
  admin_read: boolean | null
  admin_read_at: string | null
  last_message_at: string | null
  created_at: string
  updated_at: string
}

type SupportMessage = {
  id: string
  thread_id: string
  sender_id: string | null
  sender_role: string
  message: string
  created_at: string
}

export default function AdminMessagesPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [adminUserId, setAdminUserId] = useState<string | null>(null)
  const [threads, setThreads] = useState<SupportThread[]>([])
  const [selectedThread, setSelectedThread] = useState<SupportThread | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [reply, setReply] = useState('')
  const [filter, setFilter] = useState('open')

  useEffect(() => {
    loadAdminMessages()
  }, [])

  async function loadAdminMessages() {
    setLoading(true)
    setNotice('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setAdminUserId(user.id)

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (!userProfile || userProfile.role !== 'ADMIN') {
      router.push('/account')
      return
    }

    const { data, error } = await supabase
      .from('support_threads')
      .select('*')
      .order('last_message_at', { ascending: false })

    if (error) {
      setNotice(error.message)
      setLoading(false)
      return
    }

    setThreads((data || []) as SupportThread[])
    setLoading(false)
  }

  async function openThread(thread: SupportThread) {
    setSelectedThread({ ...thread, admin_read: true })
    setNotice('')

    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('thread_id', thread.id)
      .order('created_at', { ascending: true })

    if (error) {
      setNotice(error.message)
      return
    }

    setMessages((data || []) as SupportMessage[])

    if (!thread.admin_read) {
      await supabase
        .from('support_threads')
        .update({
          admin_read: true,
          admin_read_at: new Date().toISOString(),
        })
        .eq('id', thread.id)

      setThreads((current) =>
        current.map((item) =>
          item.id === thread.id
            ? { ...item, admin_read: true, admin_read_at: new Date().toISOString() }
            : item
        )
      )
    }
  }

  async function sendReply() {
  if (!selectedThread || !adminUserId || !reply.trim()) return

  setNotice('Sending reply...')

  const res = await fetch('/api/support/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      threadId: selectedThread.id,
      adminUserId,
      reply: reply.trim(),
    }),
  })

  const result = await res.json()

  if (!res.ok) {
    setNotice(result.error || 'Unable to send reply.')
    return
  }

  const now = new Date().toISOString()

  setReply('')
  setNotice('Reply saved and email sent.')
  await loadAdminMessages()
  await openThread({
    ...selectedThread,
    status: 'pending',
    updated_at: now,
    last_message_at: now,
    admin_read: true,
    admin_read_at: now,
  })
}

  async function updateThreadStatus(status: string) {
    if (!selectedThread) return

    const now = new Date().toISOString()

    const { error } = await supabase
      .from('support_threads')
      .update({
        status,
        updated_at: now,
      })
      .eq('id', selectedThread.id)

    if (error) {
      setNotice(error.message)
      return
    }

    const updated = { ...selectedThread, status, updated_at: now }
    setSelectedThread(updated)
    await loadAdminMessages()
  }

  const filteredThreads = useMemo(() => {
    if (filter === 'all') return threads
    if (filter === 'unread') return threads.filter((thread) => !thread.admin_read)
    return threads.filter((thread) => thread.status === filter)
  }, [threads, filter])

  const unreadCount = threads.filter((t) => !t.admin_read).length
  const openCount = threads.filter((t) => t.status === 'open').length
  const urgentCount = threads.filter((t) => t.priority === 'urgent' || t.priority === 'high').length
  const safeguardingCount = threads.filter((t) => t.category === 'safeguarding').length

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Admin Messages</p>
        <h1>Support inbox</h1>
        <p className="subtitle">
          Manage enquiries, tutor messages, parent support, complaints and safeguarding messages.
        </p>

        <div className="kpiGrid">
          <Kpi label="Unread" value={String(unreadCount)} highlight />
          <Kpi label="Open" value={String(openCount)} />
          <Kpi label="High Priority" value={String(urgentCount)} />
          <Kpi label="Safeguarding" value={String(safeguardingCount)} />
        </div>
      </section>

      <section className="content">
        {notice ? <p className="notice">{notice}</p> : null}

        <div className="filterBar">
          {['unread', 'open', 'pending', 'resolved', 'closed', 'all'].map((item) => (
            <button
              key={item}
              className={filter === item ? 'filter active' : 'filter'}
              onClick={() => setFilter(item)}
            >
              {item}
              {item === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
            </button>
          ))}
        </div>

        <div className="inboxGrid">
          <aside className="threadList">
            {loading ? <p className="empty">Loading messages...</p> : null}

            {!loading && filteredThreads.length === 0 ? (
              <p className="empty">No messages found.</p>
            ) : null}

            {filteredThreads.map((thread) => (
              <button
                key={thread.id}
                className={
                  selectedThread?.id === thread.id ? 'threadCard selected' : 'threadCard'
                }
                onClick={() => openThread(thread)}
              >
                <div className="threadTop">
                  <div className="threadTitleWrap">
                    {!thread.admin_read ? <span className="unreadDot" /> : null}
                    <strong>{thread.subject}</strong>
                  </div>
                  <Status status={thread.status} />
                </div>

                <p>
                  {thread.visitor_name || thread.role} • {thread.category}
                </p>

                {thread.visitor_email ? (
                  <small className="emailLine">{thread.visitor_email}</small>
                ) : null}

                <span>{formatDate(thread.last_message_at || thread.updated_at || thread.created_at)}</span>
              </button>
            ))}
          </aside>

          <section className="conversation">
            {!selectedThread ? (
              <div className="emptyPanel">
                <h2>Select a message</h2>
                <p>Choose a support thread to view contact details, conversation and reply.</p>
              </div>
            ) : (
              <>
                <div className="conversationHeader">
                  <div>
                    <p className="eyebrow">{selectedThread.category}</p>
                    <h2>{selectedThread.subject}</h2>

                    <div className="contactBox">
                      <div>
                        <span>Name</span>
                        <strong>{selectedThread.visitor_name || selectedThread.role}</strong>
                      </div>

                      <div>
                        <span>Role</span>
                        <strong>{selectedThread.role}</strong>
                      </div>

                      <div>
                        <span>Email</span>
                        {selectedThread.visitor_email ? (
                          <a href={`mailto:${selectedThread.visitor_email}`}>
                            {selectedThread.visitor_email}
                          </a>
                        ) : (
                          <strong>-</strong>
                        )}
                      </div>

                      <div>
                        <span>Phone</span>
                        {selectedThread.visitor_phone ? (
                          <a href={`tel:${selectedThread.visitor_phone}`}>
                            {selectedThread.visitor_phone}
                          </a>
                        ) : (
                          <strong>-</strong>
                        )}
                      </div>
                    </div>

                    {selectedThread.visitor_email ? (
                      <a
                        className="replyEmail"
                        href={`mailto:${selectedThread.visitor_email}?subject=Re: ${encodeURIComponent(
                          selectedThread.subject
                        )}`}
                      >
                        Reply by Email
                      </a>
                    ) : null}
                  </div>

                  <div className="statusActions">
                    <button onClick={() => updateThreadStatus('resolved')}>Resolve</button>
                    <button onClick={() => updateThreadStatus('closed')}>Close</button>
                    <button onClick={() => updateThreadStatus('open')}>Reopen</button>
                  </div>
                </div>

                <div className="messages">
                  {messages.map((item) => (
                    <div
                      key={item.id}
                      className={item.sender_role === 'ADMIN' ? 'bubble admin' : 'bubble user'}
                    >
                      <span>{item.sender_role}</span>
                      <p>{item.message}</p>
                      <small>{formatDateTime(item.created_at)}</small>
                    </div>
                  ))}
                </div>

                <div className="replyBox">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write your internal admin reply..."
                    rows={5}
                  />

                  <button onClick={sendReply}>Save Admin Reply</button>
                </div>
              </>
            )}
          </section>
        </div>
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function Kpi({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={highlight ? 'kpiCard highlight' : 'kpiCard'}>
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  )
}

function Status({ status }: { status: string }) {
  return <span className={`status ${status}`}>{status}</span>
}

function formatDate(date: string | null) {
  if (!date) return 'No date'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date))
}

function formatDateTime(date: string | null) {
  if (!date) return 'No date'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

const styles = `
  .page {
    min-height: 100vh;
    padding: 34px 16px 90px;
    color: #21152d;
    background:
      radial-gradient(circle at 8% 0%, rgba(124, 58, 237, 0.14), transparent 30%),
      linear-gradient(180deg, #fffaff 0%, #fbf8ff 44%, #f4edff 100%);
  }

  .hero,
  .content {
    width: min(1180px, 100%);
    margin: 0 auto;
  }

  .hero {
    padding: 42px;
    border-radius: 38px;
    background: white;
    border: 1px solid rgba(126,87,194,0.14);
    box-shadow: 0 30px 90px rgba(71,43,117,0.12);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
  }

  .hero h1 {
    margin: 14px 0 0;
    font-size: clamp(42px, 6vw, 72px);
    line-height: 0.95;
    letter-spacing: -0.065em;
    font-weight: 950;
  }

  .subtitle {
    max-width: 780px;
    margin: 18px 0 0;
    color: #6f637e;
    font-size: 17px;
    line-height: 1.7;
  }

  .kpiGrid {
    margin-top: 28px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .kpiCard {
    padding: 18px;
    border-radius: 22px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .kpiCard.highlight {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
  }

  .kpiCard p {
    margin: 0;
    color: inherit;
    opacity: 0.78;
    font-size: 13px;
    font-weight: 850;
  }

  .kpiCard h2 {
    margin: 8px 0 0;
    font-size: 30px;
    font-weight: 950;
  }

  .content {
    margin-top: 24px;
  }

  .notice {
    padding: 16px;
    border-radius: 18px;
    background: white;
    color: #6f637e;
    font-weight: 850;
  }

  .filterBar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 18px;
  }

  .filter {
    min-height: 42px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid rgba(124,58,237,0.16);
    background: white;
    color: #351e55;
    font-weight: 950;
    cursor: pointer;
    text-transform: capitalize;
  }

  .filter.active {
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
  }

  .inboxGrid {
    display: grid;
    grid-template-columns: 0.85fr 1.4fr;
    gap: 20px;
  }

  .threadList,
  .conversation {
    min-height: 640px;
    padding: 20px;
    border-radius: 30px;
    background: white;
    border: 1px solid rgba(126,87,194,0.12);
    box-shadow: 0 22px 62px rgba(71,43,117,0.08);
  }

  .threadList {
    display: grid;
    align-content: start;
    gap: 12px;
  }

  .threadCard {
    width: 100%;
    text-align: left;
    padding: 16px;
    border-radius: 20px;
    border: 1px solid rgba(124,58,237,0.12);
    background: #fbf8ff;
    cursor: pointer;
  }

  .threadCard.selected {
    border-color: rgba(124,58,237,0.45);
    box-shadow: 0 12px 30px rgba(124,58,237,0.12);
  }

  .threadTop {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .threadTitleWrap {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .unreadDot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #ef4444;
    box-shadow: 0 0 0 5px rgba(239,68,68,0.1);
    flex-shrink: 0;
  }

  .threadTop strong {
    font-weight: 950;
  }

  .threadCard p {
    margin: 8px 0 0;
    color: #6f637e;
    font-size: 14px;
  }

  .threadCard span,
  .emailLine {
    display: inline-flex;
    margin-top: 8px;
    color: #7a7088;
    font-size: 12px;
    font-weight: 850;
  }

  .emailLine {
    display: block;
    color: #6d28d9;
  }

  .status {
    padding: 7px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 950;
    text-transform: capitalize;
  }

  .status.open {
    background: #fff7ed;
    color: #9a3412;
  }

  .status.pending {
    background: #eff6ff;
    color: #1d4ed8;
  }

  .status.resolved {
    background: #ecfdf3;
    color: #027a48;
  }

  .status.closed {
    background: #f3f0f8;
    color: #6f637e;
  }

  .empty,
  .emptyPanel p {
    color: #6f637e;
  }

  .emptyPanel {
    display: grid;
    place-content: center;
    min-height: 560px;
    text-align: center;
  }

  .emptyPanel h2,
  .conversationHeader h2 {
    margin: 8px 0 0;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .conversationHeader {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(124,58,237,0.12);
  }

  .contactBox {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
  }

  .contactBox div {
    padding: 12px;
    border-radius: 16px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.1);
  }

  .contactBox span {
    display: block;
    margin-bottom: 4px;
    color: #7a7088;
    font-size: 11px;
    font-weight: 950;
  }

  .contactBox strong,
  .contactBox a {
    color: #241438;
    font-size: 13px;
    font-weight: 950;
    text-decoration: none;
    word-break: break-word;
  }

  .replyEmail {
    display: inline-flex;
    margin-top: 14px;
    padding: 11px 14px;
    border-radius: 999px;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    text-decoration: none;
    font-size: 13px;
    font-weight: 950;
  }

  .statusActions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .statusActions button {
    min-height: 38px;
    padding: 0 13px;
    border-radius: 14px;
    border: 1px solid rgba(124,58,237,0.16);
    background: white;
    color: #351e55;
    font-weight: 950;
    cursor: pointer;
  }

  .messages {
    display: grid;
    gap: 12px;
    margin-top: 20px;
    max-height: 360px;
    overflow: auto;
    padding-right: 4px;
  }

  .bubble {
    max-width: 82%;
    padding: 14px;
    border-radius: 18px;
  }

  .bubble.user {
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .bubble.admin {
    margin-left: auto;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
  }

  .bubble span {
    display: block;
    font-size: 11px;
    font-weight: 950;
    opacity: 0.8;
  }

  .bubble p {
    margin: 7px 0;
    line-height: 1.55;
  }

  .bubble small {
    opacity: 0.75;
    font-size: 11px;
  }

  .replyBox {
    display: grid;
    gap: 12px;
    margin-top: 20px;
  }

  textarea {
    width: 100%;
    border: 1px solid rgba(124,58,237,0.16);
    border-radius: 18px;
    padding: 15px;
    font: inherit;
    resize: vertical;
  }

  .replyBox button {
    min-height: 52px;
    border: 0;
    border-radius: 17px;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    font-weight: 950;
    cursor: pointer;
  }

  @media (max-width: 980px) {
    .page {
      padding: 20px 10px 70px;
    }

    .hero {
      padding: 28px 20px;
      border-radius: 30px;
    }

    .kpiGrid,
    .inboxGrid,
    .contactBox {
      grid-template-columns: 1fr;
    }

    .conversationHeader {
      flex-direction: column;
    }

    .threadList,
    .conversation {
      min-height: auto;
      padding: 16px;
      border-radius: 26px;
    }

    .bubble {
      max-width: 100%;
    }
  }
`