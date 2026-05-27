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
  const [message, setMessage] = useState('')
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

  const [cvFile, setCvFile] = useState<File | null>(null)
  const [idFile, setIdFile] = useState<File | null>(null)
  const [qualificationFile, setQualificationFile] = useState<File | null>(null)

  const [dataProtectionAgreed, setDataProtectionAgreed] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [safeguardingAgreed, setSafeguardingAgreed] = useState(false)
  const [accuracyConfirmed, setAccuracyConfirmed] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setMessage('Loading tutor onboarding...')

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, role, full_name, email, phone, country, timezone')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        setMessage('User profile not found. Please contact admin.')
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

      const { data: existingTutor } = await supabase
        .from('tutor_profiles')
        .select('id, approval_status, verification_status')
        .eq('user_id', user.id)
        .maybeSingle()

      if (existingTutor) {
        router.push('/tutor/dashboard')
        return
      }

      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [router])

  async function uploadDocument(file: File, folder: string) {
    if (!userProfile) throw new Error('Tutor profile not ready.')

    const extension = file.name.split('.').pop() || 'file'
    const fileName = `${crypto.randomUUID()}.${extension}`
    const path = `${userProfile.id}/${folder}/${fileName}`

    const { error } = await supabase.storage
      .from('tutor-documents')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    return path
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!userProfile) return

    setSaving(true)
    setMessage('')

    if (!fullName.trim()) {
      setMessage('Please enter your full name.')
      setSaving(false)
      return
    }

    if (!bio.trim()) {
      setMessage('Please add a short professional bio.')
      setSaving(false)
      return
    }

    if (!qualificationSummary.trim()) {
      setMessage('Please add your qualification summary.')
      setSaving(false)
      return
    }

    if (!cvFile) {
      setMessage('Please upload your CV.')
      setSaving(false)
      return
    }

    if (!idFile) {
      setMessage('Please upload an ID or passport proof.')
      setSaving(false)
      return
    }

    if (!qualificationFile) {
      setMessage('Please upload qualification proof.')
      setSaving(false)
      return
    }

    if (
      !dataProtectionAgreed ||
      !termsAgreed ||
      !safeguardingAgreed ||
      !accuracyConfirmed
    ) {
      setMessage('Please read and accept all required agreements before submitting.')
      setSaving(false)
      return
    }

    try {
      setMessage('Uploading documents...')

      const cvPath = await uploadDocument(cvFile, 'cv')
      const idPath = await uploadDocument(idFile, 'identity')
      const qualificationPath = await uploadDocument(
        qualificationFile,
        'qualifications'
      )

      setMessage('Submitting tutor application...')

      const payload = {
        user_id: userProfile.id,
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        country: country.trim() || 'Nigeria',
        timezone: timezone.trim() || 'Africa/Lagos',
        bio: bio.trim(),
        years_of_experience: Number(yearsOfExperience) || 0,
        qualification_summary: qualificationSummary.trim(),

        languages_spoken: languagesSpoken
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),

        teaching_levels: teachingLevels
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),

        cv_url: cvPath,
        government_id_url: idPath,
        qualification_document_url: qualificationPath,

        dbs_status: 'pending',
        gdpr_agreed: true,
        terms_agreed: true,
        safeguarding_agreed: true,
        onboarding_status: 'pending_review',
        approval_status: 'pending_review',
        verification_status: 'pending',
        submitted_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('tutor_profiles').insert(payload)

      if (error) {
        setMessage(error.message)
        setSaving(false)
        return
      }

      router.push('/tutor/dashboard')
    } catch (error: any) {
      setMessage(error.message || 'Something went wrong while submitting.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="card" style={{ padding: 32 }}>
            <h1 className="page-title" style={{ fontSize: 34 }}>
              Tutor Onboarding
            </h1>
            <p className="page-subtitle">{message}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 1180 }}>
        <div className="onboarding-grid">
          <aside className="card side-card">
            <p className="eyebrow">Fountain Prep Tutor Portal</p>

            <h1 className="page-title side-title">
              Complete your tutor application
            </h1>

            <p className="page-subtitle">
              Submit your profile, CV, proof of identity, qualification evidence,
              and compliance confirmations. Your profile will only go public after
              admin approval.
            </p>

            <div className="info-panel">
              <p className="panel-title">What happens next?</p>
              <p className="page-subtitle panel-text">
                Your application enters pending review. Admin will check your
                documents, safeguarding agreement, data protection agreement, and
                teaching suitability before approval.
              </p>
            </div>

            <div className="kpi-list">
              <div className="kpi-row">
                <span className="kpi-label">Onboarding</span>
                <span className="kpi-value">pending_review</span>
              </div>

              <div className="kpi-row">
                <span className="kpi-label">Verification</span>
                <span className="kpi-value">pending</span>
              </div>

              <div className="kpi-row">
                <span className="kpi-label">Public listing</span>
                <span className="kpi-value">not active yet</span>
              </div>
            </div>
          </aside>

          <form className="card form-card" onSubmit={handleSubmit}>
            <section>
              <p className="eyebrow">Step 1</p>
              <h2>Profile Details</h2>
              <p className="page-subtitle">
                Keep your profile professional. Parents will see this after admin
                approval.
              </p>

              <div className="two-col-grid">
                <Field label="Full name">
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </Field>

                <Field label="Phone">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Field>

                <Field label="Country">
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </Field>

                <Field label="Timezone">
                  <input
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    required
                  />
                </Field>

                <Field label="Years of experience">
                  <input
                    type="number"
                    min="0"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                  />
                </Field>

                <Field label="Qualification summary">
                  <input
                    value={qualificationSummary}
                    onChange={(e) => setQualificationSummary(e.target.value)}
                    placeholder="e.g. BEd, MSc, PGCE, Teaching Certificate"
                    required
                  />
                </Field>
              </div>

              <div className="form-stack">
                <Field label="Short professional bio">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={5}
                    placeholder="Briefly describe your teaching experience, strengths, and subject focus."
                    required
                  />
                </Field>

                <Field label="Languages spoken">
                  <input
                    value={languagesSpoken}
                    onChange={(e) => setLanguagesSpoken(e.target.value)}
                    placeholder="English, Yoruba, Igbo..."
                  />
                </Field>

                <Field label="Teaching levels">
                  <input
                    value={teachingLevels}
                    onChange={(e) => setTeachingLevels(e.target.value)}
                    placeholder="Primary, Secondary, GCSE..."
                  />
                </Field>
              </div>
            </section>

            <section className="section-box">
              <p className="eyebrow">Step 2</p>
              <h2>Documents & Proofs</h2>
              <p className="page-subtitle">
                Upload your CV and supporting documents for admin verification.
              </p>

              <div className="upload-grid">
                <UploadField
                  label="CV"
                  help="PDF, DOC or DOCX"
                  accept=".pdf,.doc,.docx"
                  file={cvFile}
                  onChange={setCvFile}
                />

                <UploadField
                  label="Government ID / Passport"
                  help="PDF, JPG or PNG"
                  accept=".pdf,.jpg,.jpeg,.png"
                  file={idFile}
                  onChange={setIdFile}
                />

                <UploadField
                  label="Qualification proof"
                  help="Certificate, degree, transcript or teaching proof"
                  accept=".pdf,.jpg,.jpeg,.png"
                  file={qualificationFile}
                  onChange={setQualificationFile}
                />
              </div>
            </section>

            <section className="section-box">
              <p className="eyebrow">Step 3</p>
              <h2>Compliance Agreements</h2>
              <p className="page-subtitle">
                Please open and read each policy before ticking the agreement box.
                Your application cannot be reviewed until these confirmations are
                completed.
              </p>

              <div className="policy-link-grid">
                <a href="/data-protection-policy" target="_blank" rel="noreferrer">
                  Read Data Protection Policy
                </a>

                <a href="/terms" target="_blank" rel="noreferrer">
                  Read Tutor Terms
                </a>

                <a href="/safeguarding" target="_blank" rel="noreferrer">
                  Read Safeguarding Policy
                </a>
              </div>

              <div className="agreement-list">
                <Agreement
                  checked={dataProtectionAgreed}
                  onChange={setDataProtectionAgreed}
                >
                  I have read, understood, and agree to Fountain Prep’s{' '}
                  <a
                    href="/data-protection-policy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Data Protection Policy
                  </a>
                  , including how personal data, parent information, and child
                  information must be handled.
                </Agreement>

                <Agreement checked={termsAgreed} onChange={setTermsAgreed}>
                  I have read, understood, and agree to the{' '}
                  <a href="/terms" target="_blank" rel="noreferrer">
                    Tutor Terms and Conditions
                  </a>
                  , including professional conduct, lesson delivery expectations,
                  platform rules, and payment-related obligations.
                </Agreement>

                <Agreement
                  checked={safeguardingAgreed}
                  onChange={setSafeguardingAgreed}
                >
                  I have read, understood, and agree to Fountain Prep’s{' '}
                  <a href="/safeguarding" target="_blank" rel="noreferrer">
                    Safeguarding and Child Protection Policy
                  </a>
                  .
                </Agreement>

                <Agreement
                  checked={accuracyConfirmed}
                  onChange={setAccuracyConfirmed}
                >
                  I confirm that all information and documents submitted are
                  accurate, genuine, and belong to me.
                </Agreement>
              </div>
            </section>

            {message ? <p className="form-message">{message}</p> : null}

            <div className="form-actions">
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? 'Submitting Application...' : 'Submit Tutor Application'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .onboarding-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 24px;
          align-items: start;
        }

        .side-card,
        .form-card {
          padding: 32px;
        }

        .side-card {
          position: sticky;
          top: 110px;
        }

        .eyebrow {
          margin: 0;
          color: #6f42c1;
          font-weight: 900;
          font-size: 14px;
        }

        .side-title {
          font-size: 38px;
          margin-top: 10px;
        }

        .info-panel,
        .section-box {
          margin-top: 28px;
          padding: 24px;
          border-radius: 24px;
          background: linear-gradient(
            135deg,
            rgba(111, 66, 193, 0.06),
            rgba(138, 92, 246, 0.1)
          );
          border: 1px solid rgba(111, 66, 193, 0.12);
        }

        .panel-title {
          margin: 0;
          font-weight: 900;
        }

        .panel-text {
          margin-top: 8px;
        }

        .kpi-list {
          margin-top: 20px;
          display: grid;
          gap: 12px;
        }

        .kpi-row {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 16px;
          background: #fff;
          border: 1px solid rgba(111, 66, 193, 0.1);
        }

        .kpi-label {
          color: #6f637e;
          font-weight: 700;
        }

        .kpi-value {
          color: #21152d;
          font-weight: 900;
        }

        h2 {
          margin: 8px 0 0;
          font-size: 28px;
        }

        .two-col-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
        }

        .form-stack {
          display: grid;
          gap: 16px;
          margin-top: 16px;
        }

        .field {
          display: grid;
          gap: 8px;
        }

        .field-label {
          font-weight: 800;
          color: #21152d;
        }

        input,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid rgba(111, 66, 193, 0.16);
          border-radius: 16px;
          padding: 14px 15px;
          font: inherit;
          outline: none;
          background: white;
        }

        textarea {
          resize: vertical;
        }

        input:focus,
        textarea:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.08);
        }

        .upload-grid {
          display: grid;
          gap: 16px;
          margin-top: 20px;
        }

        .upload-card {
          padding: 18px;
          border-radius: 20px;
          background: white;
          border: 1px solid rgba(111, 66, 193, 0.14);
        }

        .upload-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
        }

        .upload-label {
          font-weight: 900;
        }

        .upload-help {
          color: #6f637e;
          font-size: 13px;
          font-weight: 700;
        }

        .file-name {
          margin: 10px 0 0;
          color: #6f42c1;
          font-weight: 800;
          font-size: 13px;
        }

        .policy-link-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 20px;
        }

        .policy-link-grid a {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 12px 14px;
          border-radius: 16px;
          background: white;
          color: #6f42c1;
          font-weight: 900;
          text-align: center;
          text-decoration: none;
          border: 1px solid rgba(111, 66, 193, 0.14);
        }

        .agreement-list {
          margin-top: 20px;
          display: grid;
          gap: 14px;
        }

        .agreement {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 16px;
          border-radius: 18px;
          background: white;
          border: 1px solid rgba(111, 66, 193, 0.12);
          color: #332044;
          line-height: 1.55;
          font-weight: 700;
        }

        .agreement input {
          width: 18px;
          height: 18px;
          margin-top: 3px;
          flex-shrink: 0;
        }

        .agreement a {
          color: #6f42c1;
          font-weight: 900;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .form-message {
          margin-top: 18px;
          padding: 14px 16px;
          border-radius: 16px;
          background: #fff7ed;
          color: #9a3412;
          border: 1px solid #fed7aa;
          font-weight: 800;
        }

        .form-actions {
          margin-top: 28px;
          display: flex;
          justify-content: flex-end;
        }

        .btn-primary:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {
          .onboarding-grid {
            grid-template-columns: 1fr;
          }

          .side-card {
            position: static;
          }

          .two-col-grid,
          .policy-link-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            justify-content: stretch;
          }

          .form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  )
}

function UploadField({
  label,
  help,
  accept,
  file,
  onChange,
}: {
  label: string
  help: string
  accept: string
  file: File | null
  onChange: (file: File | null) => void
}) {
  return (
    <div className="upload-card">
      <div className="upload-top">
        <span className="upload-label">{label}</span>
        <span className="upload-help">{help}</span>
      </div>

      <input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />

      {file ? <p className="file-name">{file.name}</p> : null}
    </div>
  )
}

function Agreement({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label className="agreement">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{children}</span>
    </label>
  )
}