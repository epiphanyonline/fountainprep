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

export default function TutorOnboardingPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('Loading...')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('Nigeria')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [bio, setBio] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState('0')
  const [qualificationSummary, setQualificationSummary] = useState('')
  const [languagesSpoken, setLanguagesSpoken] = useState('English')
  const [teachingLevels, setTeachingLevels] = useState('Primary, Secondary')

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

      if (profile.role !== 'TUTOR') {
        setMessage('This page is only for tutor accounts.')
        setLoading(false)
        return
      }

      setUserProfile(profile)
      setFullName(profile.full_name ?? '')
      setPhone(profile.phone ?? '')
      setCountry(profile.country ?? 'Nigeria')
      setTimezone(profile.timezone ?? 'Africa/Lagos')

      const { data: existingTutor, error: tutorError } = await supabase
        .from('tutor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!tutorError && existingTutor) {
        router.push('/tutor/dashboard')
        return
      }

      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [router])

  async function handleCreateTutorProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!userProfile) return

    setSaving(true)
    setMessage('')

    const payload = {
      user_id: userProfile.id,
      full_name: fullName.trim(),
      phone: phone.trim() || null,
      country: country.trim() || 'Nigeria',
      timezone: timezone.trim() || 'Africa/Lagos',
      bio: bio.trim() || null,
      years_of_experience: Number(yearsOfExperience) || 0,
      qualification_summary: qualificationSummary.trim() || null,
      languages_spoken: languagesSpoken
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      teaching_levels: teachingLevels
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    }

    const { error } = await supabase.from('tutor_profiles').insert(payload)

    if (error) {
      setMessage(error.message)
      setSaving(false)
      return
    }

    router.push('/tutor/dashboard')
  }

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="card" style={{ padding: 32 }}>
            <h1 className="page-title" style={{ fontSize: 34 }}>
              Tutor Onboarding
            </h1>
            <p>{message}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 760 }}>
        <form className="card" style={{ padding: 32 }} onSubmit={handleCreateTutorProfile}>
          <p
            style={{
              margin: 0,
              color: '#6f42c1',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Tutor Portal
          </p>

          <h1 className="page-title" style={{ fontSize: 38, marginTop: 10 }}>
            Complete Tutor Profile
          </h1>

          <p className="page-subtitle">
            Set up your tutor profile so parents can discover you after approval.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginTop: 24,
            }}
          >
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
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />

            <input
              placeholder="Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              required
            />

            <input
              placeholder="Years of experience"
              type="number"
              min="0"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
            />

            <input
              placeholder="Qualification summary"
              value={qualificationSummary}
              onChange={(e) => setQualificationSummary(e.target.value)}
            />
          </div>

          <div className="form-stack" style={{ marginTop: 16 }}>
            <textarea
              placeholder="Short bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: 14,
                font: 'inherit',
                resize: 'vertical',
              }}
            />

            <input
              placeholder="Languages spoken (comma separated)"
              value={languagesSpoken}
              onChange={(e) => setLanguagesSpoken(e.target.value)}
            />

            <input
              placeholder="Teaching levels (comma separated)"
              value={teachingLevels}
              onChange={(e) => setTeachingLevels(e.target.value)}
            />
          </div>

          <div
            className="panel"
            style={{
              marginTop: 24,
              padding: 18,
            }}
          >
            <p style={{ margin: 0, fontWeight: 700 }}>What happens next?</p>
            <p style={{ margin: '8px 0 0', color: 'var(--muted)' }}>
              Your profile will be saved with pending approval until reviewed by admin.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Create Tutor Profile'}
            </button>
          </div>

          {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
        </form>
      </div>
    </main>
  )
}