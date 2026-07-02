'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { sendEmail } from '../../lib/email'

const locationOptions = [
  { country: 'United Kingdom', timezone: 'Europe/London' },
  { country: 'United States', timezone: 'America/New_York' },
  { country: 'Canada', timezone: 'America/Toronto' },
  { country: 'Australia', timezone: 'Australia/Sydney' },
  { country: 'Nigeria', timezone: 'Africa/Lagos' },
  { country: 'Other', timezone: 'UTC' },
]

export default function ParentSignupPage() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('United Kingdom')
  const [timezone, setTimezone] = useState('Europe/London')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

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

    await supabase.auth.signOut()

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          role: 'PARENT',
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

    const userId = data.user?.id

    if (userId) {
      await supabase.from('user_profiles').upsert({
        id: userId,
        email: cleanEmail,
        role: 'PARENT',
        full_name: cleanName,
        phone,
        country,
        timezone,
        is_active: true,
      })

      await supabase.from('parent_profiles').upsert({
        user_id: userId,
        full_name: cleanName,
        phone,
        country,
        timezone,
      })
    }

    await sendEmail({
      to: cleanEmail,
      subject: 'Welcome to Fountain Prep',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241235">
          <h2>Welcome to Fountain Prep, ${escapeHtml(cleanName)}</h2>
          <p>Your parent account has been created.</p>
          <p>Next steps:</p>
          <ol>
            <li>Confirm your email address.</li>
            <li>Add your child’s profile.</li>
            <li>Choose a subject.</li>
            <li>Book your first private 1-to-1 lesson.</li>
          </ol>
          <p>
            <a href="https://www.fountainprep.com/login" style="display:inline-block;background:#6d28d9;color:white;padding:12px 18px;border-radius:14px;text-decoration:none;font-weight:700">
              Login to Fountain Prep
            </a>
          </p>
        </div>
      `,
    })

    setMessage('Signup successful. Check your email to confirm your account.')
    setLoading(false)
  }

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 520 }}>
        <form className="card" style={{ padding: 32 }} onSubmit={handleSignup}>
          <h1 className="page-title">Create Parent Account</h1>
          <p className="page-subtitle">
            Start managing your child’s tutoring experience.
          </p>

          <div className="form-stack" style={{ marginTop: 20 }}>
            <input
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <select value={country} onChange={(e) => handleCountryChange(e.target.value)} required>
              {locationOptions.map((item) => (
                <option key={item.country} value={item.country}>
                  {item.country}
                </option>
              ))}
            </select>

            <input
              placeholder="Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              required
            />

            <p style={{ margin: '-6px 0 0', color: 'var(--muted)', fontSize: 13 }}>
              We use this to show lesson times and pricing correctly.
            </p>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            {message && <p>{message}</p>}
          </div>
        </form>
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