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
  const [visitorPhone, setVisitorPhone] = useState('')
  const [role, setRole] = useState('VISITOR')
  const [category, setCategory] = useState('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('')

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
      <button className="supportButton" onClick={() => setOpen(true)}>
        Need help?
      </button>

      {open ? (
        <div className="overlay">
          <div className="panel">
            <div className="top">
              <div>
                <p>Fountain Prep Support</p>
                <h2>How can we help?</h2>
              </div>

              <button onClick={closePanel}>×</button>
            </div>

            {!submitted ? (
              <div className="form">
                <input value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="Your name" />
                <input value={visitorEmail} onChange={(e) => setVisitorEmail(e.target.value)} placeholder="Your email" type="email" />
                <input value={visitorPhone} onChange={(e) => setVisitorPhone(e.target.value)} placeholder="Phone number optional" type="tel" />

                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="VISITOR">Visitor</option>
                  <option value="PARENT">Parent</option>
                  <option value="TUTOR">Tutor</option>
                </select>

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />

                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." rows={5} />

                <button className="sendBtn" onClick={submitEnquiry} disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            ) : (
              <div className="successBox">
                <strong>Thank you for contacting Fountain Prep.</strong>

                <p>Your enquiry has been received successfully and assigned a support reference number.</p>

                {ticketNumber ? (
                  <div className="ticketBox">
                    <span>Reference Number</span>
                    <strong>{ticketNumber}</strong>
                  </div>
                ) : null}

                <p>Our team typically responds within 24 hours. Please keep your reference number for future enquiries.</p>

                <button onClick={closePanel}>Close</button>
              </div>
            )}

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
          width: min(460px, 100%);
          max-height: calc(100vh - 36px);
          overflow-y: auto;
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
          .overlay {
            align-items: flex-end;
            padding: 10px;
          }

          .panel {
            border-radius: 24px;
            max-height: calc(100vh - 20px);
          }
        }
      `}</style>
    </>
  )
}