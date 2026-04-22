'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ParentSignupPage() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('United Kingdom')
  const [timezone, setTimezone] = useState('Europe/London')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'PARENT',
          full_name: fullName,
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

    setMessage('Signup successful. Check your email.')
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

            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />

            <input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            />

            <input
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