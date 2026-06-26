'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import SectionHeader from '../components/ui/SectionHeader'

type Notification = {
  id: string
  user_id: string
  role: string
  title: string
  message: string
  type: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadNotifications()
  }, [])

  async function loadNotifications() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(80)

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setNotifications((data ?? []) as Notification[])
    setLoading(false)
  }

  async function markAsRead(id: string) {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_read: true } : item
      )
    )
  }

  async function markAllAsRead() {
    const unreadIds = notifications
      .filter((item) => !item.is_read)
      .map((item) => item.id)

    if (!unreadIds.length) return

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', unreadIds)

    setNotifications((prev) =>
      prev.map((item) => ({ ...item, is_read: true }))
    )
  }

  const unreadCount = notifications.filter((item) => !item.is_read).length

  return (
    <main className="page">
      <section className="wrap">
        <Card>
          <SectionHeader
            eyebrow="Notification Centre"
            title="Your Fountain Prep updates"
            text="Track bookings, lesson reminders, tutor updates, messages and important platform activity in one place."
            action={
              unreadCount > 0 ? (
                <Button variant="secondary" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              ) : null
            }
          />

          {loading ? (
            <p className="muted">Loading notifications...</p>
          ) : message ? (
            <p className="error">{message}</p>
          ) : notifications.length === 0 ? (
            <EmptyState
              title="No notifications yet"
              text="Important booking, lesson, tutor and payment updates will appear here."
            />
          ) : (
            <div className="list">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={item.is_read ? 'notice read' : 'notice unread'}
                >
                  <div className="noticeTop">
                    <div>
                      <div className="badgeRow">
                        <Badge tone={item.is_read ? 'purple' : 'green'}>
                          {item.is_read ? 'Read' : 'New'}
                        </Badge>
                        {item.type ? <Badge>{item.type}</Badge> : null}
                      </div>

                      <h2>{item.title}</h2>
                      <p>{item.message}</p>
                      <small>{formatDate(item.created_at)}</small>
                    </div>

                    <div className="actions">
                      {item.link ? (
                        <Link
                          href={item.link}
                          className="openLink"
                          onClick={() => markAsRead(item.id)}
                        >
                          Open
                        </Link>
                      ) : null}

                      {!item.is_read ? (
                        <button
                          type="button"
                          onClick={() => markAsRead(item.id)}
                          className="readBtn"
                        >
                          Mark read
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const styles = `
  .page {
    min-height: 100vh;
    padding: 44px 16px 90px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 30%),
      linear-gradient(180deg, #ffffff, #fbf8ff 45%, #f4edff);
    color: #201230;
  }

  .wrap {
    max-width: 980px;
    margin: 0 auto;
  }

  .muted {
    color: #6d647c;
    font-weight: 750;
  }

  .error {
    padding: 16px;
    border-radius: 18px;
    background: #fff1f2;
    color: #be123c;
    font-weight: 850;
  }

  .list {
    display: grid;
    gap: 14px;
  }

  .notice {
    padding: 20px;
    border-radius: 24px;
    border: 1px solid rgba(124, 58, 237, 0.12);
  }

  .unread {
    background: #f6f1ff;
  }

  .read {
    background: white;
  }

  .noticeTop {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .badgeRow {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  h2 {
    margin: 14px 0 0;
    font-size: 23px;
    letter-spacing: -0.035em;
  }

  p {
    margin: 8px 0 0;
    color: #6d647c;
    line-height: 1.65;
    font-weight: 700;
  }

  small {
    display: block;
    margin-top: 10px;
    color: #7a7088;
    font-weight: 750;
  }

  .actions {
    display: grid;
    gap: 10px;
    min-width: 120px;
  }

  .openLink,
  .readBtn {
    min-height: 42px;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 950;
    text-decoration: none;
    font-family: inherit;
    cursor: pointer;
  }

  .openLink {
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
  }

  .readBtn {
    border: 1px solid rgba(124, 58, 237, 0.14);
    background: white;
    color: #6d28d9;
  }

  @media (max-width: 760px) {
    .page {
      padding: 26px 12px 70px;
    }

    .noticeTop {
      flex-direction: column;
    }

    .actions {
      width: 100%;
    }
  }
`