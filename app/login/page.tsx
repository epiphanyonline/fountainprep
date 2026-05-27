'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    router.push('/account')
  }

  async function handlePasswordReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setResetLoading(true)
    setMessage('')

    const emailToUse = resetEmail || email

    if (!emailToUse) {
      setMessage('Please enter your email first.')
      setResetLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(emailToUse, {
      redirectTo: 'http://localhost:3000/reset-password',
    })

    if (error) {
      setMessage(error.message)
      setResetLoading(false)
      return
    }

    setMessage('Password reset link sent. Please check your email.')
    setResetLoading(false)
  }

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="card" style={{ padding: 32 }}>
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 700 }}>
            Welcome back
          </p>

          <h1 className="page-title" style={{ marginTop: 10 }}>
            Login
          </h1>

          <p className="page-subtitle">
            Access your TutorMe account.
          </p>

          <form onSubmit={handleLogin} className="form-stack" style={{ marginTop: 24 }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <form onSubmit={handlePasswordReset} style={{ marginTop: 22 }}>
            <p style={{ marginBottom: 8, fontWeight: 700 }}>
              Forgot password?
            </p>

            <input
              type="email"
              placeholder="Enter your email for reset link"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            <button
              className="btn-secondary"
              style={{ marginTop: 12 }}
              disabled={resetLoading}
            >
              {resetLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}

          <p className="page-subtitle" style={{ marginTop: 20 }}>
            New parent?{' '}
            <Link href="/signup/parent" style={{ color: '#6f42c1', fontWeight: 700 }}>
              Create parent account
            </Link>
          </p>

          <p className="page-subtitle" style={{ marginTop: 8 }}>
            New tutor?{' '}
            <Link href="/signup/tutor" style={{ color: '#6f42c1', fontWeight: 700 }}>
              Create tutor account
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}