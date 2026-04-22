'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type UserProfile = {
  id: string
  role: string
  full_name: string | null
  email: string | null
  phone: string | null
  country: string | null
  timezone: string | null
}

type ParentProfile = {
  id: string
  user_id: string
  full_name: string
  phone: string | null
  country_of_residence: string | null
  timezone: string
  preferred_currency: string
}

export default function ParentOnboardingPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('Loading...')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [countryOfResidence, setCountryOfResidence] = useState('United Kingdom')
  const [timezone, setTimezone] = useState('Europe/London')
  const [preferredCurrency, setPreferredCurrency] = useState('GBP')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setMessage('Loading...')

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setMessage('You must be logged in first.')
        setLoading(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, role, full_name, email, phone, country, timezone')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        setMessage('User profile not found. Please contact admin or re-sign up.')
        setLoading(false)
        return
      }

      if (profile.role !== 'PARENT') {
        setMessage('This page is only for parent accounts.')
        setLoading(false)
        return
      }

      setUserProfile(profile)
      setFullName(profile.full_name ?? '')
      setPhone(profile.phone ?? '')
      setCountryOfResidence(profile.country ?? 'United Kingdom')
      setTimezone(profile.timezone ?? 'Europe/London')

      const { data: existingParent, error: parentError } = await supabase
        .from('parent_profiles')
        .select('id, user_id, full_name, phone, country_of_residence, timezone, preferred_currency')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!parentError && existingParent) {
        router.push('/parent/dashboard')
        return
      }

      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [router])

  async function handleCreateParentProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!userProfile) return

    setSaving(true)
    setMessage('')

    const payload = {
      user_id: userProfile.id,
      full_name: fullName.trim(),
      phone: phone.trim() || null,
      country_of_residence: countryOfResidence.trim() || null,
      timezone: timezone.trim() || 'Europe/London',
      preferred_currency: preferredCurrency.trim() || 'GBP',
    }

    const { error } = await supabase.from('parent_profiles').insert(payload)

    if (error) {
      setMessage(error.message)
      setSaving(false)
      return
    }

    router.push('/parent/dashboard')
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Parent Onboarding</h1>
          <p>{message}</p>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <form style={styles.card} onSubmit={handleCreateParentProfile}>
        <h1 style={styles.title}>Complete Parent Profile</h1>
        <p style={styles.subtext}>Set up your parent profile to continue.</p>

        <input
          style={styles.input}
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Country of residence"
          value={countryOfResidence}
          onChange={(e) => setCountryOfResidence(e.target.value)}
          required
        />

        <input
          style={styles.input}
          placeholder="Timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          required
        />

        <select
          style={styles.input}
          value={preferredCurrency}
          onChange={(e) => setPreferredCurrency(e.target.value)}
        >
          <option value="GBP">GBP</option>
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
          <option value="AUD">AUD</option>
        </select>

        <button style={styles.button} type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Create Parent Profile'}
        </button>

        {message ? <p style={styles.message}>{message}</p> : null}
      </form>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f6f3fb',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    background: '#fff',
    padding: 28,
    borderRadius: 18,
    boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  title: {
    fontSize: 30,
    marginBottom: 4,
  },
  subtext: {
    color: '#666',
    marginBottom: 10,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    border: '1px solid #ddd',
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    border: 'none',
    background: '#6f42c1',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
  },
  message: {
    color: '#333',
    whiteSpace: 'pre-wrap',
  },
}