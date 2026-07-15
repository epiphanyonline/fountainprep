'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type TutorProfile = {
  id: string
  user_id: string
  full_name: string
  phone: string | null
  country: string
  timezone: string
  bio: string | null
  years_of_experience: number
  qualification_summary: string | null
  approval_status: string
  verification_status: string
  average_rating: number
  rating_count: number
  is_listed: boolean
}

type FormState = {
  full_name: string
  phone: string
  country: string
  timezone: string
  bio: string
  years_of_experience: string
  qualification_summary: string
}

type NoticeType = 'success' | 'error' | ''

const countryOptions = [
  { name: 'Nigeria', timezone: 'Africa/Lagos' },
  { name: 'United Kingdom', timezone: 'Europe/London' },
  { name: 'United States', timezone: 'America/New_York' },
  { name: 'Canada', timezone: 'America/Toronto' },
  { name: 'Australia', timezone: 'Australia/Sydney' },
  { name: 'Ireland', timezone: 'Europe/Dublin' },
  { name: 'Other', timezone: 'Africa/Lagos' },
]

const initialForm: FormState = {
  full_name: '',
  phone: '',
  country: 'Nigeria',
  timezone: 'Africa/Lagos',
  bio: '',
  years_of_experience: '0',
  qualification_summary: '',
}

export default function TutorProfilePage() {
  const router = useRouter()

  const [profile, setProfile] = useState<TutorProfile | null>(null)
  const [form, setForm] = useState<FormState>(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState<NoticeType>('')

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      setNotice('')

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      const { data: userProfile, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (
        userProfileError ||
        !userProfile ||
        userProfile.role !== 'TUTOR'
      ) {
        router.replace('/account')
        return
      }

      const { data: tutorProfile, error: tutorError } = await supabase
        .from('tutor_profiles')
        .select(`
          id,
          user_id,
          full_name,
          phone,
          country,
          timezone,
          bio,
          years_of_experience,
          qualification_summary,
          approval_status,
          verification_status,
          average_rating,
          rating_count,
          is_listed
        `)
        .eq('user_id', user.id)
        .maybeSingle()

      if (tutorError) {
        setNoticeType('error')
        setNotice(tutorError.message)
        setLoading(false)
        return
      }

      if (!tutorProfile) {
        router.replace('/tutor/onboarding')
        return
      }

      const cleanProfile = tutorProfile as TutorProfile

      setProfile(cleanProfile)

      setForm({
        full_name: cleanProfile.full_name || '',
        phone: cleanProfile.phone || '',
        country: cleanProfile.country || 'Nigeria',
        timezone: cleanProfile.timezone || 'Africa/Lagos',
        bio: cleanProfile.bio || '',
        years_of_experience: String(
          cleanProfile.years_of_experience ?? 0
        ),
        qualification_summary:
          cleanProfile.qualification_summary || '',
      })

      setLoading(false)
    }

    loadProfile()
  }, [router])

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleCountryChange(country: string) {
    const selectedCountry = countryOptions.find(
      (item) => item.name === country
    )

    setForm((current) => ({
      ...current,
      country,
      timezone: selectedCountry?.timezone || current.timezone,
    }))
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!profile) return

    setSaving(true)
    setNotice('')
    setNoticeType('')

    const fullName = form.full_name.trim()
    const yearsOfExperience = Number(form.years_of_experience)

    if (!fullName) {
      setNoticeType('error')
      setNotice('Please enter your full name.')
      setSaving(false)
      return
    }

    if (
      Number.isNaN(yearsOfExperience) ||
      yearsOfExperience < 0 ||
      yearsOfExperience > 70
    ) {
      setNoticeType('error')
      setNotice('Please enter a valid number of years of experience.')
      setSaving(false)
      return
    }

    if (form.bio.trim().length < 40) {
      setNoticeType('error')
      setNotice(
        'Please write at least 40 characters in your biography so parents can understand your teaching approach.'
      )
      setSaving(false)
      return
    }

    const updates = {
      full_name: fullName,
      phone: form.phone.trim() || null,
      country: form.country,
      timezone: form.timezone.trim(),
      bio: form.bio.trim(),
      years_of_experience: yearsOfExperience,
      qualification_summary:
        form.qualification_summary.trim() || null,
      updated_at: new Date().toISOString(),
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from('tutor_profiles')
      .update(updates)
      .eq('id', profile.id)
      .select(`
        id,
        user_id,
        full_name,
        phone,
        country,
        timezone,
        bio,
        years_of_experience,
        qualification_summary,
        approval_status,
        verification_status,
        average_rating,
        rating_count,
        is_listed
      `)
      .single()

    if (updateError) {
      setNoticeType('error')
      setNotice(updateError.message)
      setSaving(false)
      return
    }

    await supabase
      .from('user_profiles')
      .update({
        full_name: fullName,
        phone: form.phone.trim() || null,
        country: form.country,
        timezone: form.timezone.trim(),
      })
      .eq('id', profile.user_id)

    setProfile(updatedProfile as TutorProfile)
    setNoticeType('success')
    setNotice(
      'Your tutor profile has been updated successfully. Parents will see the latest approved profile information.'
    )
    setSaving(false)
  }

  if (loading) {
    return (
      <main className="profile-page">
        <section className="profile-shell">
          <div className="loading-card">
            <p className="eyebrow">Tutor Profile</p>
            <h1>Preparing your profile...</h1>
          </div>
        </section>

        <style jsx global>{styles}</style>
      </main>
    )
  }

  if (!profile) {
    return null
  }

  const firstInitial =
    form.full_name.trim().charAt(0).toUpperCase() || 'T'

  return (
    <main className="profile-page">
      <section className="profile-shell">
        <div className="page-heading">
          <div>
            <Link href="/tutor/dashboard" className="back-link">
              ← Back to Tutor Dashboard
            </Link>

            <p className="eyebrow">My Tutor Profile</p>

            <h1>Keep your professional profile current.</h1>

            <p className="heading-copy">
              Update the information parents use when deciding whether you
              are the right tutor for their child or learning goals.
            </p>
          </div>

          <Link
            href={`/tutor/${profile.id}`}
            className="preview-link"
          >
            Preview Public Profile
          </Link>
        </div>

        <div className="profile-layout">
          <form className="editor-card" onSubmit={handleSave}>
            <section className="form-section profile-identity">
              <div className="avatar">{firstInitial}</div>

              <div>
                <p className="section-label">Public identity</p>
                <h2>{form.full_name || 'Tutor profile'}</h2>
                <p>
                  This is how your name and professional information will
                  appear to parents.
                </p>
              </div>
            </section>

            <section className="form-section">
              <SectionHeading
                number="01"
                title="Personal information"
              />

              <label>
                Full name
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(event) =>
                    updateField('full_name', event.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                />
              </label>

              <div className="two-column">
                <label>
                  Phone number
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField('phone', event.target.value)
                    }
                    placeholder="+234..."
                  />
                </label>

                <label>
                  Country
                  <select
                    value={form.country}
                    onChange={(event) =>
                      handleCountryChange(event.target.value)
                    }
                  >
                    {countryOptions.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Time zone
                <input
                  type="text"
                  value={form.timezone}
                  onChange={(event) =>
                    updateField('timezone', event.target.value)
                  }
                  placeholder="Africa/Lagos"
                  required
                />
                <small>
                  Lesson times will be displayed using this time zone.
                </small>
              </label>
            </section>

            <section className="form-section">
              <SectionHeading
                number="02"
                title="About me"
              />

              <label>
                Professional biography
                <textarea
                  value={form.bio}
                  onChange={(event) =>
                    updateField('bio', event.target.value)
                  }
                  placeholder="Tell parents about your teaching experience, approach, subject strengths and how you support learners..."
                  rows={8}
                  maxLength={1200}
                  required
                />

                <div className="field-footer">
                  <small>
                    Write in a warm, professional and parent-friendly tone.
                  </small>

                  <small>{form.bio.length}/1200</small>
                </div>
              </label>
            </section>

            <section className="form-section">
              <SectionHeading
                number="03"
                title="Professional experience"
              />

              <label>
                Years of teaching experience
                <input
                  type="number"
                  min="0"
                  max="70"
                  value={form.years_of_experience}
                  onChange={(event) =>
                    updateField(
                      'years_of_experience',
                      event.target.value
                    )
                  }
                  required
                />
              </label>

              <label>
                Qualification summary
                <textarea
                  value={form.qualification_summary}
                  onChange={(event) =>
                    updateField(
                      'qualification_summary',
                      event.target.value
                    )
                  }
                  placeholder="Example: B.Ed in English Education, TRCN certified, five years teaching primary learners."
                  rows={5}
                  maxLength={800}
                />

                <div className="field-footer">
                  <small>
                    Include relevant degrees, certificates and professional
                    training.
                  </small>

                  <small>
                    {form.qualification_summary.length}/800
                  </small>
                </div>
              </label>
            </section>

            {notice ? (
              <div
                className={
                  noticeType === 'success'
                    ? 'notice success'
                    : 'notice error'
                }
                role="alert"
              >
                <strong>
                  {noticeType === 'success'
                    ? 'Profile updated'
                    : 'Unable to save'}
                </strong>

                <span>{notice}</span>
              </div>
            ) : null}

            <div className="save-area">
              <button
                type="submit"
                className="save-button"
                disabled={saving}
              >
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>

              <Link
                href="/tutor/dashboard"
                className="cancel-button"
              >
                Return to Dashboard
              </Link>
            </div>
          </form>

          <aside className="profile-sidebar">
            <section className="status-card">
              <p className="section-label">Tutor status</p>
              <h2>Profile readiness</h2>

              <div className="status-list">
                <StatusRow
                  label="Approval"
                  value={profile.approval_status}
                />

                <StatusRow
                  label="Verification"
                  value={profile.verification_status}
                />

                <StatusRow
                  label="Listed"
                  value={profile.is_listed ? 'Yes' : 'No'}
                />

                <StatusRow
                  label="Rating"
                  value={
                    profile.rating_count > 0
                      ? `${profile.average_rating.toFixed(1)} (${profile.rating_count})`
                      : 'No ratings yet'
                  }
                />
              </div>

              <p className="status-note">
                Approval, verification and listing status are managed by
                Fountain Prep administration.
              </p>
            </section>

            <section className="preview-card">
              <p className="section-label">Parent preview</p>

              <div className="preview-header">
                <div className="preview-avatar">{firstInitial}</div>

                <div>
                  <h2>{form.full_name || 'Your name'}</h2>
                  <p>
                    {form.years_of_experience || '0'} years&apos;
                    experience
                  </p>
                </div>
              </div>

              <div className="preview-rating">
                <span>★</span>
                <strong>
                  {profile.rating_count > 0
                    ? profile.average_rating.toFixed(1)
                    : 'New Tutor'}
                </strong>
              </div>

              <p className="preview-bio">
                {form.bio.trim() ||
                  'Your professional biography will appear here as parents browse available tutors.'}
              </p>

              <div className="preview-qualification">
                <strong>Qualifications</strong>

                <span>
                  {form.qualification_summary.trim() ||
                    'Add your qualifications and professional training.'}
                </span>
              </div>

              <Link
                href={`/tutor/${profile.id}`}
                className="public-preview-button"
              >
                Open Full Public Profile
              </Link>
            </section>

            <section className="availability-card">
              <p className="section-label">Teaching schedule</p>
              <h2>Keep your availability current.</h2>

              <p>
                Updated availability helps parents find and book your
                suitable lesson times.
              </p>

              <Link href="/tutor/availability">
                Manage Availability →
              </Link>
            </section>
          </aside>
        </div>
      </section>

      <style jsx global>{styles}</style>
    </main>
  )
}

function SectionHeading({
  number,
  title,
}: {
  number: string
  title: string
}) {
  return (
    <div className="section-heading">
      <span>{number}</span>
      <h2>{title}</h2>
    </div>
  )
}

function StatusRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <strong>{formatStatus(value)}</strong>
    </div>
  )
}

function formatStatus(value: string) {
  if (!value) return '-'

  return value
    .toLowerCase()
    .split('_')
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(' ')
}

const styles = `
  .profile-page {
    min-height: 100vh;
    padding: 42px 16px 90px;
    color: #241235;
    background:
      radial-gradient(
        circle at 8% 0%,
        rgba(124, 58, 237, 0.14),
        transparent 30%
      ),
      radial-gradient(
        circle at 94% 8%,
        rgba(236, 72, 153, 0.07),
        transparent 28%
      ),
      linear-gradient(180deg, #fffaff 0%, #f6efff 100%);
  }

  .profile-shell {
    width: min(1180px, 100%);
    margin: 0 auto;
  }

  .loading-card {
    padding: 38px;
    border-radius: 34px;
    background: #ffffff;
    border: 1px solid rgba(124, 58, 237, 0.13);
    box-shadow: 0 28px 80px rgba(55, 35, 95, 0.1);
  }

  .loading-card h1 {
    margin: 12px 0 0;
    font-size: clamp(38px, 6vw, 66px);
    letter-spacing: -0.055em;
  }

  .page-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 28px;
  }

  .back-link {
    display: inline-flex;
    margin-bottom: 22px;
    color: #6d28d9;
    text-decoration: none;
    font-weight: 900;
  }

  .eyebrow,
  .section-label {
    margin: 0;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .page-heading h1 {
    max-width: 820px;
    margin: 12px 0 0;
    font-size: clamp(42px, 6vw, 70px);
    line-height: 0.98;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .heading-copy {
    max-width: 720px;
    margin: 18px 0 0;
    color: #6d647c;
    font-size: 17px;
    line-height: 1.7;
  }

  .preview-link {
    min-height: 52px;
    padding: 0 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 17px;
    color: #351e55;
    background: #ffffff;
    border: 1px solid rgba(124, 58, 237, 0.16);
    text-decoration: none;
    font-weight: 950;
    white-space: nowrap;
  }

  .profile-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
    gap: 24px;
    align-items: start;
  }

  .editor-card,
  .status-card,
  .preview-card,
  .availability-card {
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(124, 58, 237, 0.12);
    box-shadow: 0 25px 75px rgba(55, 35, 95, 0.09);
  }

  .editor-card {
    padding: 32px;
    border-radius: 34px;
  }

  .profile-sidebar {
    position: sticky;
    top: 96px;
    display: grid;
    gap: 18px;
  }

  .status-card,
  .preview-card,
  .availability-card {
    padding: 25px;
    border-radius: 28px;
  }

  .profile-identity {
    display: flex;
    align-items: center;
    gap: 18px;
    padding-top: 0;
  }

  .avatar,
  .preview-avatar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    background: linear-gradient(135deg, #7c3aed, #5b21b6);
    font-weight: 950;
  }

  .avatar {
    width: 74px;
    height: 74px;
    border-radius: 24px;
    font-size: 30px;
  }

  .profile-identity h2 {
    margin: 7px 0 0;
    font-size: 27px;
    letter-spacing: -0.04em;
  }

  .profile-identity p:last-child {
    margin: 7px 0 0;
    color: #756980;
    line-height: 1.55;
  }

  .form-section {
    padding: 29px 0;
    border-bottom: 1px solid #eee6f8;
  }

  .section-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .section-heading > span {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 14px;
    color: #6d28d9;
    background: #f0e7ff;
    font-size: 12px;
    font-weight: 950;
  }

  .section-heading h2 {
    margin: 0;
    font-size: 23px;
    letter-spacing: -0.035em;
  }

  .editor-card label {
    display: block;
    margin-top: 17px;
    color: #30203f;
    font-size: 14px;
    font-weight: 900;
  }

  .editor-card input,
  .editor-card select,
  .editor-card textarea {
    width: 100%;
    margin-top: 8px;
    padding: 15px;
    border: 1px solid #ded3ec;
    border-radius: 17px;
    color: #241235;
    background: #ffffff;
    font: inherit;
    font-weight: 700;
    outline: none;
  }

  .editor-card input,
  .editor-card select {
    min-height: 54px;
  }

  .editor-card textarea {
    min-height: 128px;
    line-height: 1.65;
    resize: vertical;
  }

  .editor-card input:focus,
  .editor-card select:focus,
  .editor-card textarea:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
  }

  .editor-card label > small {
    display: block;
    margin-top: 7px;
    color: #8a7e95;
    font-weight: 650;
  }

  .two-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .field-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-top: 7px;
    color: #8a7e95;
  }

  .field-footer small {
    font-weight: 650;
  }

  .notice {
    margin-top: 24px;
    padding: 17px;
    border-radius: 19px;
  }

  .notice strong,
  .notice span {
    display: block;
  }

  .notice span {
    margin-top: 5px;
    line-height: 1.55;
  }

  .notice.success {
    color: #166534;
    background: #ecfdf3;
    border: 1px solid #bbf7d0;
  }

  .notice.error {
    color: #9f1239;
    background: #fff1f2;
    border: 1px solid #fecdd3;
  }

  .save-area {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }

  .save-button,
  .cancel-button {
    min-height: 56px;
    padding: 0 21px;
    border-radius: 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 950;
  }

  .save-button {
    flex: 1;
    border: 0;
    color: #ffffff;
    background: linear-gradient(135deg, #7c3aed, #5b21b6);
    box-shadow: 0 17px 38px rgba(109, 40, 217, 0.24);
    cursor: pointer;
  }

  .save-button:disabled {
    cursor: not-allowed;
    opacity: 0.68;
  }

  .cancel-button {
    color: #351e55;
    background: #ffffff;
    border: 1px solid rgba(124, 58, 237, 0.16);
    text-decoration: none;
  }

  .status-card h2,
  .preview-card h2,
  .availability-card h2 {
    margin: 9px 0 0;
    font-size: 28px;
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  .status-list {
    display: grid;
    margin-top: 20px;
  }

  .status-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid #eee6f8;
  }

  .status-row span {
    color: #786c84;
    font-weight: 750;
  }

  .status-row strong {
    text-align: right;
    font-weight: 950;
  }

  .status-note {
    margin: 18px 0 0;
    color: #7b7086;
    font-size: 13px;
    line-height: 1.6;
  }

  .preview-header {
    display: flex;
    align-items: center;
    gap: 13px;
    margin-top: 19px;
  }

  .preview-avatar {
    width: 55px;
    height: 55px;
    border-radius: 18px;
    font-size: 22px;
  }

  .preview-header h2 {
    margin: 0;
    font-size: 21px;
  }

  .preview-header p {
    margin: 5px 0 0;
    color: #786c84;
    font-size: 13px;
    font-weight: 750;
  }

  .preview-rating {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 18px;
  }

  .preview-rating span {
    color: #f59e0b;
    font-size: 20px;
  }

  .preview-bio {
    margin: 17px 0 0;
    color: #685d74;
    line-height: 1.65;
  }

  .preview-qualification {
    margin-top: 18px;
    padding: 15px;
    border-radius: 18px;
    background: #faf7ff;
    border: 1px solid #eadfff;
  }

  .preview-qualification strong,
  .preview-qualification span {
    display: block;
  }

  .preview-qualification span {
    margin-top: 6px;
    color: #756980;
    font-size: 13px;
    line-height: 1.55;
  }

  .public-preview-button {
    width: 100%;
    min-height: 50px;
    margin-top: 18px;
    padding: 0 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    color: #ffffff;
    background: linear-gradient(135deg, #7c3aed, #5b21b6);
    text-decoration: none;
    font-weight: 950;
  }

  .availability-card p:not(.section-label) {
    margin: 13px 0 0;
    color: #756980;
    line-height: 1.6;
  }

  .availability-card a {
    display: inline-flex;
    margin-top: 16px;
    color: #6d28d9;
    text-decoration: none;
    font-weight: 950;
  }

  @media (max-width: 900px) {
    .profile-page {
      padding: 28px 12px 70px;
    }

    .page-heading {
      align-items: flex-start;
      flex-direction: column;
    }

    .preview-link {
      width: 100%;
    }

    .profile-layout {
      grid-template-columns: 1fr;
    }

    .profile-sidebar {
      position: static;
    }

    .editor-card {
      padding: 22px;
      border-radius: 28px;
    }

    .two-column {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .save-area {
      flex-direction: column;
    }

    .cancel-button {
      width: 100%;
    }
  }

  @media (max-width: 560px) {
    .profile-identity {
      align-items: flex-start;
      flex-direction: column;
    }

    .field-footer {
      align-items: flex-start;
      flex-direction: column;
      gap: 4px;
    }
  }
`