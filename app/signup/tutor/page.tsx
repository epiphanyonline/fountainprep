'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { sendEmail } from '../../lib/email'

const locationOptions = [
  { country: 'Nigeria', timezone: 'Africa/Lagos' },
  { country: 'United Kingdom', timezone: 'Europe/London' },
  { country: 'United States', timezone: 'America/New_York' },
  { country: 'Canada', timezone: 'America/Toronto' },
  { country: 'Australia', timezone: 'Australia/Sydney' },
  { country: 'Other', timezone: 'UTC' },
]

export default function TutorSignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('Nigeria')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  function handleCountryChange(value: string) {
    const selected = locationOptions.find((item) => item.country === value)
    setCountry(value)
    setTimezone(selected?.timezone || 'UTC')
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = fullName.trim()

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          role: 'TUTOR',
          full_name: cleanName,
          phone,
          country,
          timezone,
        },
      },
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    await sendEmail({
      to: cleanEmail,
      subject: 'Welcome to Fountain Prep Tutor Portal',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241235">
          <h2>Welcome to Fountain Prep, ${escapeHtml(cleanName)}</h2>
          <p>Your tutor account has been created.</p>
          <p>Next steps:</p>
          <ol>
            <li>Confirm your email address.</li>
            <li>Complete your tutor profile.</li>
            <li>Upload your documents.</li>
            <li>Set your availability.</li>
            <li>Wait for admin approval.</li>
          </ol>
          <p>
            <a href="https://www.fountainprep.com/login" style="display:inline-block;background:#6d28d9;color:white;padding:12px 18px;border-radius:14px;text-decoration:none;font-weight:700">
              Login to Tutor Portal
            </a>
          </p>
        </div>
      `,
    })

    if (!data.session) {
      setMessage('Check your email to confirm your account, then log in.')
      setLoading(false)
      return
    }

    router.push('/tutor/onboarding')
  }

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="card" style={{ padding: 32 }}>
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 700, fontSize: 14 }}>
            Tutor Portal
          </p>

          <h1 className="page-title" style={{ fontSize: 40, marginTop: 10 }}>
            Become a Tutor
          </h1>

          <p className="page-subtitle">
            Create your tutor account and continue to profile setup.
          </p>

          <form className="form-stack" style={{ marginTop: 24 }} onSubmit={handleSignup}>
            <input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password (minimum 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />

              <select value={country} onChange={(e) => handleCountryChange(e.target.value)} required>
                {locationOptions.map((item) => (
                  <option key={item.country} value={item.country}>
                    {item.country}
                  </option>
                ))}
              </select>
            </div>

            <input placeholder="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} required />

            <p style={{ margin: '-6px 0 0', color: 'var(--muted)', fontSize: 13 }}>
              We use this to show lesson times correctly.
            </p>

            <div className="panel" style={{ padding: 18, marginTop: 4 }}>
              <p style={{ margin: 0, fontWeight: 700 }}>What happens next?</p>
              <p style={{ margin: '8px 0 0', color: 'var(--muted)' }}>
                After creating your account, you will complete your tutor profile before admin review.
              </p>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Tutor Account'}
            </button>
          </form>

          {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}

          <p className="page-subtitle" style={{ marginTop: 20 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#6f42c1', fontWeight: 700 }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

function escapeHtml(value: string) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}