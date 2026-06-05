'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

const categories = [
  'general',
  'tutor application',
  'pricing',
  'booking',
  'payment',
  'lesson',
  'complaint',
  'safeguarding',
  'technical',
]

export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorEmail, setVisitorEmail] = useState('')
  const [role, setRole] = useState('VISITOR')
  const [category, setCategory] = useState('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  async function submitEnquiry() {
    setStatus('Sending...')

    if (!subject || !message) {
      setStatus('Please enter a subject and message.')
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: thread, error: threadError } = await supabase
      .from('support_threads')
      .insert({
        created_by: user?.id ?? null,
        role: user ? role : 'VISITOR',
        visitor_name: user ? null : visitorName,
        visitor_email: user ? null : visitorEmail,
        subject,
        category,
        status: 'open',
        priority: category === 'safeguarding' || category === 'complaint' ? 'high' : 'normal',
      })
      .select('id')
      .single()

    if (threadError || !thread) {
      setStatus(threadError?.message || 'Unable to create enquiry.')
      return
    }

    const { error: messageError } = await supabase.from('support_messages').insert({
      thread_id: thread.id,
      sender_id: user?.id ?? null,
      sender_role: user ? role : 'VISITOR',
      message,
    })

    if (messageError) {
      setStatus(messageError.message)
      return
    }

    setStatus('Message sent. FountainPrep will respond as soon as possible.')
    setSubject('')
    setMessage('')
    setVisitorName('')
    setVisitorEmail('')
  }

  return (
    <>
      <button className="supportButton" onClick={() => setOpen(true)}>
        Need help?
      </button>

      {open ? (
        <div className="overlay">
          <div className="panel">
            <div className="top">
              <div>
                <p>FountainPrep Support</p>
                <h2>How can we help?</h2>
              </div>

              <button onClick={() => setOpen(false)}>×</button>
            </div>

            {!status.includes('sent') ? (
              <div className="form">
                <input
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Your name"
                />

                <input
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  placeholder="Your email"
                />

                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="VISITOR">Visitor</option>
                  <option value="PARENT">Parent</option>
                  <option value="TUTOR">Tutor</option>
                </select>

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                />

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  rows={5}
                />

                <button className="sendBtn" onClick={submitEnquiry}>
                  Send Message
                </button>
              </div>
            ) : null}

            {status ? <p className="status">{status}</p> : null}
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .supportButton {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 50;
          border: 0;
          border-radius: 999px;
          padding: 15px 20px;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          font-weight: 950;
          box-shadow: 0 18px 42px rgba(124, 58, 237, 0.35);
          cursor: pointer;
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 18px;
          background: rgba(32, 18, 48, 0.28);
        }

        .panel {
          width: min(440px, 100%);
          border-radius: 28px;
          padding: 22px;
          background: white;
          box-shadow: 0 28px 80px rgba(31, 18, 48, 0.28);
        }

        .top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 18px;
        }

        .top p {
          margin: 0;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 950;
        }

        .top h2 {
          margin: 6px 0 0;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .top button {
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 999px;
          background: #f5efff;
          color: #351e55;
          font-size: 24px;
          cursor: pointer;
        }

        .form {
          display: grid;
          gap: 11px;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid rgba(124, 58, 237, 0.16);
          border-radius: 16px;
          padding: 14px;
          font: inherit;
          outline: none;
        }

        textarea {
          resize: vertical;
        }

        .sendBtn {
          min-height: 52px;
          border: 0;
          border-radius: 17px;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          font-weight: 950;
          cursor: pointer;
        }

        .status {
          margin: 14px 0 0;
          color: #6f637e;
          line-height: 1.5;
          font-weight: 750;
        }

        @media (max-width: 640px) {
          .overlay {
            align-items: flex-end;
            padding: 10px;
          }

          .panel {
            border-radius: 24px;
          }
        }
      `}</style>
    </>
  )
}