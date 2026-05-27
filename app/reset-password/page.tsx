'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('Password updated successfully.')
    setTimeout(() => {
      router.push('/login')
    }, 1200)
  }

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="card" style={{ padding: 32 }}>
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 700 }}>
            Account Security
          </p>

          <h1 className="page-title" style={{ marginTop: 10 }}>
            Reset Password
          </h1>

          <p className="page-subtitle">
            Enter a new password for your account.
          </p>

          <form onSubmit={handleResetPassword} className="form-stack" style={{ marginTop: 24 }}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
        </div>
      </div>
    </main>
  )
}