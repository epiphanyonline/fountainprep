'use client'

import { useEffect, useState } from 'react'
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
  const [visitorPhone, setVisitorPhone] = useState('')
  const [role, setRole] = useState('VISITOR')
  const [category, setCategory] = useState('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('')

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  async function submitEnquiry() {
    setStatus('')
    setTicketNumber('')

    if (!subject.trim() || !message.trim()) {
      setStatus('Please enter a subject and message.')
      return
    }

    if (!visitorEmail.trim()) {
      setStatus('Please enter your email so we can reply.')
      return
    }

    setSending(true)
    setStatus('Sending...')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName,
          visitorEmail,
          visitorPhone,
          role: user ? role : role || 'VISITOR',
          category,
          subject,
          message,
          userId: user?.id ?? null,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setStatus(result.error || 'Unable to send message.')
        setSending(false)
        return
      }

      setTicketNumber(result.ticketNumber || '')
      setSubmitted(true)
      setStatus('')

      setSubject('')
      setMessage('')
      setVisitorName('')
      setVisitorEmail('')
      setVisitorPhone('')
      setCategory('general')
      setRole('VISITOR')
    } catch {
      setStatus('Unable to send message right now. Please try again.')
    } finally {
      setSending(false)
    }
  }

  function closePanel() {
    setOpen(false)
    setSubmitted(false)
    setStatus('')
    setTicketNumber('')
  }

  return (
    <>
      {!open ? (
        <button
          type="button"
          className="supportButton"
          onClick={() => setOpen(true)}
          aria-label="Open Fountain Prep support"
        >
          <span className="supportIcon" aria-hidden="true">?</span>
          <span className="supportText">Need help?</span>
        </button>
      ) : null}

      {open ? (
        <div
          className="overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePanel()
            }
          }}
        >
          <section
            className="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-heading"
          >
            <div className="top">
              <div>
                <p>Fountain Prep Support</p>
                <h2 id="support-heading">How can we help?</h2>
              </div>

              <button
                type="button"
                className="closeButton"
                onClick={closePanel}
                aria-label="Close support"
                title="Close support"
              >
                ×
              </button>
            </div>

            {!submitted ? (
              <div className="form">
                <input
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />

                <input
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  placeholder="Your email"
                  type="email"
                  autoComplete="email"
                />

                <input
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  placeholder="Phone number optional"
                  type="tel"
                  autoComplete="tel"
                />

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  aria-label="Your role"
                >
                  <option value="VISITOR">Visitor</option>
                  <option value="PARENT">Parent</option>
                  <option value="TUTOR">Tutor</option>
                </select>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  aria-label="Support category"
                >
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

                <button
                  type="button"
                  className="sendBtn"
                  onClick={submitEnquiry}
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            ) : (
              <div className="successBox">
                <strong>Thank you for contacting Fountain Prep.</strong>

                <p>
                  Your enquiry has been received successfully and assigned a
                  support reference number.
                </p>

                {ticketNumber ? (
                  <div className="ticketBox">
                    <span>Reference Number</span>
                    <strong>{ticketNumber}</strong>
                  </div>
                ) : null}

                <p>
                  Our team typically responds within 24 hours. Please keep your
                  reference number for future enquiries.
                </p>

                <button type="button" onClick={closePanel}>
                  Close
                </button>
              </div>
            )}

            {status ? <p className="status" role="status">{status}</p> : null}
          </section>
        </div>
      ) : null}

      <style jsx>{`
        .supportButton {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 50;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 52px;
          border: 0;
          border-radius: 999px;
          padding: 10px 18px 10px 10px;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          font-weight: 950;
          box-shadow: 0 18px 42px rgba(124, 58, 237, 0.35);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .supportIcon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          flex: 0 0 30px;
          border-radius: 999px;
          color: #6d28d9;
          background: white;
          font-size: 15px;
          font-weight: 950;
          line-height: 1;
        }

        .supportText {
          white-space: nowrap;
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 18px;
          background: rgba(32, 18, 48, 0.34);
          backdrop-filter: blur(6px);
        }

        .panel {
          width: min(460px, 100%);
          max-height: calc(100dvh - 36px);
          overflow-y: auto;
          overscroll-behavior: contain;
          border-radius: 28px;
          padding: 22px;
          background: white;
          box-shadow: 0 28px 80px rgba(31, 18, 48, 0.28);
          -webkit-overflow-scrolling: touch;
        }

        .top {
          position: sticky;
          top: -22px;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          margin: -22px -22px 18px;
          padding: 22px 22px 16px;
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 1px solid rgba(124, 58, 237, 0.08);
          backdrop-filter: blur(12px);
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

        .closeButton {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 999px;
          background: #f5efff;
          color: #351e55;
          font-size: 27px;
          line-height: 1;
          cursor: pointer;
        }

        .form {
          display: grid;
          gap: 11px;
        }

        input,
        select,
        textarea {
          box-sizing: border-box;
          width: 100%;
          border: 1px solid rgba(124, 58, 237, 0.16);
          border-radius: 16px;
          padding: 14px;
          color: #261832;
          background: white;
          font: inherit;
          outline: none;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.08);
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

        .sendBtn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .successBox {
          padding: 20px;
          border-radius: 24px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .successBox strong {
          display: block;
          color: #166534;
          font-size: 20px;
          font-weight: 950;
        }

        .successBox p {
          color: #166534;
          line-height: 1.55;
          font-weight: 650;
        }

        .ticketBox {
          margin: 16px 0;
          padding: 16px;
          border-radius: 16px;
          background: white;
          border: 2px solid #bbf7d0;
          text-align: center;
        }

        .ticketBox span {
          display: block;
          color: #166534;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }

        .ticketBox strong {
          display: block;
          color: #166534;
          font-size: 22px;
          font-weight: 950;
          letter-spacing: 0.04em;
        }

        .successBox button {
          border: 0;
          border-radius: 14px;
          padding: 12px 16px;
          background: #166534;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .status {
          margin: 14px 0 0;
          color: #6f637e;
          line-height: 1.5;
          font-weight: 750;
        }

        @media (max-width: 640px) {
          .supportButton {
            right: 10px;
            bottom: max(10px, env(safe-area-inset-bottom));
            width: 46px;
            min-width: 46px;
            height: 46px;
            min-height: 46px;
            padding: 7px;
            box-shadow: 0 10px 28px rgba(124, 58, 237, 0.28);
          }

          .supportIcon {
            width: 32px;
            height: 32px;
            flex-basis: 32px;
          }

          .supportText {
            display: none;
          }

          .overlay {
            padding: 8px;
          }

          .overlay {
            align-items: flex-start;
            padding:
              max(92px, calc(env(safe-area-inset-top) + 76px))
              10px
              max(16px, env(safe-area-inset-bottom));
          }

          .panel {
            width: 100%;
            max-height: min(
              calc(100dvh - 118px - env(safe-area-inset-bottom)),
              720px
            );
            border-radius: 22px;
            padding: 16px;
          }

          .top {
            top: -16px;
            margin: -16px -16px 12px;
            padding: 14px 14px 12px 16px;
            border-radius: 22px 22px 0 0;
          }

          .top p {
            font-size: 11px;
          }

          .top h2 {
            margin-top: 3px;
            font-size: 22px;
          }

          .closeButton {
            width: 42px;
            height: 42px;
            flex-basis: 42px;
            color: #ffffff;
            background: #6d28d9;
            border: 2px solid #ffffff;
            box-shadow: 0 7px 18px rgba(109, 40, 217, 0.28);
            font-size: 27px;
          }

          input,
          select,
          textarea {
            padding: 13px;
            font-size: 16px;
          }
        }
      `}</style>
    </>
  )
}
