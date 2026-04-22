'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage('Login succeeded but user session was not found.')
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      router.push('/account')
      return
    }

    if (profile.role === 'PARENT') {
      router.push('/parent/dashboard')
      return
    }

    if (profile.role === 'TUTOR') {
      router.push('/tutor/dashboard')
      return
    }

    router.push('/account')
  }

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 480 }}>
        <form className="card" style={{ padding: 32 }} onSubmit={handleLogin}>
          <h1 className="page-title">Welcome back</h1>
          <p className="page-subtitle">
            Login to continue your learning journey.
          </p>

          <div className="form-stack" style={{ marginTop: 20 }}>
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
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {message && <p>{message}</p>}
          </div>
        </form>
      </div>
    </main>
  )
}