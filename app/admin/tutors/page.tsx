'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

type TutorRow = {
  id: string
  full_name: string
  qualification_summary: string | null
  years_of_experience: number
  approval_status: string
  verification_status: string
  is_listed: boolean
  created_at: string
  cv_url: string | null
  government_id_url: string | null
  qualification_document_url: string | null
  dbs_status: string | null
  gdpr_agreed: boolean | null
  terms_agreed: boolean | null
  safeguarding_agreed: boolean | null
  submitted_at: string | null
  cv_signed_url?: string | null
  id_signed_url?: string | null
  qualification_signed_url?: string | null
}

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<TutorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function signedUrl(path: string | null) {
    if (!path) return null

    const { data, error } = await supabase.storage
      .from('tutor-documents')
      .createSignedUrl(path, 3600)

    if (error) {
      console.warn('Signed URL unavailable:', path, error.message)
      return null
    }

    return data?.signedUrl || null
  }

  async function loadTutors() {
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('tutor_profiles')
      .select(`
        id,
        full_name,
        qualification_summary,
        years_of_experience,
        approval_status,
        verification_status,
        is_listed,
        created_at,
        cv_url,
        government_id_url,
        qualification_document_url,
        dbs_status,
        gdpr_agreed,
        terms_agreed,
        safeguarding_agreed,
        submitted_at
      `)
      .order('created_at', { ascending: false })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    const enriched = await Promise.all(
      ((data || []) as TutorRow[]).map(async (tutor) => ({
        ...tutor,
        cv_signed_url: await signedUrl(tutor.cv_url),
        id_signed_url: await signedUrl(tutor.government_id_url),
        qualification_signed_url: await signedUrl(tutor.qualification_document_url),
      }))
    )

    setTutors(enriched)
    setLoading(false)
  }

  useEffect(() => {
    loadTutors()
  }, [])

  async function updateTutor(id: string, updates: Partial<TutorRow>) {
    const { error } = await supabase.from('tutor_profiles').update(updates).eq('id', id)

    if (error) {
      setMessage(error.message)
      return
    }

    await loadTutors()
  }

  async function approveTutor(id: string) {
    await updateTutor(id, {
      approval_status: 'approved',
      verification_status: 'verified',
      is_listed: true,
    })
  }

  async function rejectTutor(id: string) {
    await updateTutor(id, {
      approval_status: 'rejected',
      is_listed: false,
    })
  }

  async function toggleListing(id: string, current: boolean) {
    await updateTutor(id, {
      is_listed: !current,
    })
  }

  async function deleteTutorAndDocuments(tutor: TutorRow) {
    const confirmed = window.confirm(
      `Delete ${tutor.full_name} and all uploaded documents? This cannot be undone.`
    )

    if (!confirmed) return

    setMessage(`Deleting ${tutor.full_name}...`)

    const filesToDelete = [
      tutor.cv_url,
      tutor.government_id_url,
      tutor.qualification_document_url,
    ].filter(Boolean) as string[]

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('tutor-documents')
        .remove(filesToDelete)

      if (storageError) {
        setMessage(`Storage delete failed: ${storageError.message}`)
        return
      }
    }

    const { error: profileError } = await supabase
      .from('tutor_profiles')
      .delete()
      .eq('id', tutor.id)

    if (profileError) {
      setMessage(`Tutor delete failed: ${profileError.message}`)
      return
    }

    setMessage(`${tutor.full_name} and uploaded documents deleted.`)
    await loadTutors()
  }

  const pendingCount = useMemo(
    () => tutors.filter((t) => t.approval_status !== 'approved').length,
    [tutors]
  )

  const listedCount = useMemo(
    () => tutors.filter((t) => t.is_listed).length,
    [tutors]
  )

  const verifiedCount = useMemo(
    () => tutors.filter((t) => t.verification_status === 'verified').length,
    [tutors]
  )

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Admin Tutor Review</p>
        <h1>Tutor approval centre</h1>
        <p className="subtitle">
          Review tutor profiles, open CVs, verify identity documents, check
          qualifications and control who appears on FountainPrep.
        </p>

        <div className="kpiGrid">
          <Kpi label="Total Tutors" value={String(tutors.length)} />
          <Kpi label="Pending Review" value={String(pendingCount)} />
          <Kpi label="Verified" value={String(verifiedCount)} />
          <Kpi label="Listed" value={String(listedCount)} />
        </div>
      </section>

      <section className="content">
        {loading && <p className="message">Loading tutors...</p>}
        {message && <p className="message">{message}</p>}

        <div className="tutorGrid">
          {tutors.map((tutor) => (
            <article key={tutor.id} className="tutorCard">
              <div className="cardTop">
                <div>
                  <p className="eyebrow">Tutor Profile</p>
                  <h2>{tutor.full_name}</h2>
                  <p className="meta">
                    {tutor.years_of_experience} yrs experience • Submitted{' '}
                    {formatDate(tutor.submitted_at || tutor.created_at)}
                  </p>
                </div>

                <div className="badgeWrap">
                  <StatusBadge label="Approval" value={tutor.approval_status} />
                  <StatusBadge label="Verification" value={tutor.verification_status} />
                  <StatusBadge label="Listed" value={tutor.is_listed ? 'yes' : 'no'} />
                </div>
              </div>

              <p className="summary">
                {tutor.qualification_summary || 'No qualification summary provided.'}
              </p>

              <div className="docPanel">
                <div className="docHeader">
                  <div>
                    <p className="eyebrow">Documents</p>
                    <h3>Review uploaded files</h3>
                  </div>
                  <span className="docCount">
                    {[tutor.cv_url, tutor.government_id_url, tutor.qualification_document_url].filter(Boolean).length}/3
                  </span>
                </div>

                <div className="docGrid">
                  <DocumentLink title="CV" subtitle={fileLabel(tutor.cv_url)} href={tutor.cv_signed_url} />
                  <DocumentLink title="Government ID" subtitle={fileLabel(tutor.government_id_url)} href={tutor.id_signed_url} />
                  <DocumentLink title="Qualification" subtitle={fileLabel(tutor.qualification_document_url)} href={tutor.qualification_signed_url} />
                </div>
              </div>

              <div className="checksGrid">
                <CheckItem label="GDPR" value={tutor.gdpr_agreed ? 'Agreed' : 'Not agreed'} />
                <CheckItem label="Terms" value={tutor.terms_agreed ? 'Agreed' : 'Not agreed'} />
                <CheckItem label="Safeguarding" value={tutor.safeguarding_agreed ? 'Agreed' : 'Not agreed'} />
                <CheckItem label="DBS" value={tutor.dbs_status || 'Pending'} />
              </div>

              <div className="actions">
                <button className="btnPrimary" onClick={() => approveTutor(tutor.id)}>
                  Approve & List
                </button>

                <button className="btnSecondary" onClick={() => rejectTutor(tutor.id)}>
                  Reject
                </button>

                <button className="btnSecondary" onClick={() => toggleListing(tutor.id, tutor.is_listed)}>
                  {tutor.is_listed ? 'Unlist' : 'List'}
                </button>

                <button className="btnDanger" onClick={() => deleteTutorAndDocuments(tutor)}>
                  Delete Tutor & Documents
                </button>
              </div>
            </article>
          ))}

          {!loading && tutors.length === 0 && (
            <div className="emptyState">
              <h3>No tutors found</h3>
              <p>Tutor applications will appear here once submitted.</p>
            </div>
          )}
        </div>
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="kpiCard">
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  )
}

function DocumentLink({
  title,
  subtitle,
  href,
}: {
  title: string
  subtitle: string
  href?: string | null
}) {
  return (
    <div className="docCard">
      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>

      {href ? (
        <a href={href} target="_blank" rel="noreferrer">
          View
        </a>
      ) : (
        <em>Missing</em>
      )}
    </div>
  )
}

function CheckItem({ label, value }: { label: string; value: string }) {
  const clean = value.toLowerCase()
  const good = clean.includes('agreed') || clean === 'verified'

  return (
    <div className="checkItem">
      <span>{label}</span>
      <strong className={good ? 'goodText' : ''}>{value}</strong>
    </div>
  )
}

function StatusBadge({ label, value }: { label: string; value: string }) {
  const clean = String(value || '').toLowerCase()

  const className =
    clean === 'approved' || clean === 'verified' || clean === 'yes'
      ? 'badge good'
      : clean === 'rejected'
        ? 'badge bad'
        : 'badge warn'

  return <span className={className}>{label}: {value}</span>
}

function fileLabel(path: string | null) {
  if (!path) return 'No file uploaded'
  const fileName = path.split('/').pop() || 'Uploaded file'
  return fileName.length > 28 ? `${fileName.slice(0, 28)}...` : fileName
}

function formatDate(date: string | null) {
  if (!date) return 'Not submitted'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

const styles = `
  .page {
    min-height: 100vh;
    padding: 34px 16px 90px;
    color: #21152d;
    background:
      radial-gradient(circle at 8% 0%, rgba(124, 58, 237, 0.14), transparent 30%),
      radial-gradient(circle at 92% 5%, rgba(236, 72, 153, 0.08), transparent 28%),
      linear-gradient(180deg, #fffaff 0%, #fbf8ff 44%, #f4edff 100%);
  }

  .hero,
  .content {
    width: min(1180px, 100%);
    margin: 0 auto;
  }

  .hero {
    padding: 42px;
    border-radius: 38px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,239,255,0.96));
    border: 1px solid rgba(126,87,194,0.14);
    box-shadow: 0 30px 90px rgba(71,43,117,0.12);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
  }

  .hero h1 {
    margin: 16px 0 0;
    max-width: 900px;
    font-size: clamp(42px, 6.4vw, 76px);
    line-height: 0.95;
    letter-spacing: -0.065em;
    font-weight: 950;
  }

  .subtitle {
    max-width: 820px;
    margin: 20px 0 0;
    color: #6f637e;
    font-size: 17px;
    line-height: 1.75;
  }

  .kpiGrid {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .kpiCard,
  .tutorCard,
  .emptyState {
    background: rgba(255,255,255,0.94);
    border: 1px solid rgba(126,87,194,0.12);
    box-shadow: 0 22px 62px rgba(71,43,117,0.08);
  }

  .kpiCard {
    padding: 19px;
    border-radius: 23px;
  }

  .kpiCard p {
    margin: 0;
    color: #7a7088;
    font-size: 13px;
    font-weight: 850;
  }

  .kpiCard h2 {
    margin: 8px 0 0;
    font-size: 31px;
    line-height: 1;
    letter-spacing: -0.05em;
    font-weight: 950;
  }

  .content {
    margin-top: 24px;
  }

  .message {
    padding: 18px;
    border-radius: 20px;
    background: white;
    color: #6f637e;
    font-weight: 850;
  }

  .tutorGrid {
    display: grid;
    gap: 20px;
  }

  .tutorCard {
    padding: 28px;
    border-radius: 32px;
  }

  .cardTop {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
  }

  .cardTop h2 {
    margin: 8px 0 0;
    font-size: clamp(26px, 3vw, 40px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .meta,
  .summary {
    color: #6f637e;
    line-height: 1.65;
  }

  .meta {
    margin: 10px 0 0;
    font-weight: 750;
  }

  .summary {
    margin: 20px 0 0;
  }

  .badgeWrap {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .badge {
    display: inline-flex;
    padding: 8px 11px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 950;
  }

  .badge.good {
    background: #ecfdf3;
    color: #027a48;
  }

  .badge.warn {
    background: #fff7ed;
    color: #9a3412;
  }

  .badge.bad {
    background: #fef3f2;
    color: #b42318;
  }

  .docPanel {
    margin-top: 22px;
    padding: 20px;
    border-radius: 26px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .docHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .docHeader h3 {
    margin: 7px 0 0;
    font-size: 24px;
    letter-spacing: -0.035em;
    font-weight: 950;
  }

  .docCount {
    display: inline-flex;
    padding: 8px 12px;
    border-radius: 999px;
    background: white;
    color: #6d28d9;
    font-weight: 950;
  }

  .docGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .docCard {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    padding: 16px;
    border-radius: 20px;
    background: white;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .docCard strong,
  .docCard span {
    display: block;
  }

  .docCard strong {
    font-weight: 950;
  }

  .docCard span {
    max-width: 190px;
    margin-top: 4px;
    color: #6f637e;
    font-size: 12px;
    overflow-wrap: anywhere;
  }

  .docCard a,
  .docCard em {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 38px;
    padding: 0 14px;
    border-radius: 14px;
    font-size: 13px;
    font-style: normal;
    font-weight: 950;
    text-decoration: none;
  }

  .docCard a {
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
  }

  .docCard em {
    color: #9a3412;
    background: #fff7ed;
  }

  .checksGrid {
    margin-top: 18px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .checkItem {
    padding: 15px;
    border-radius: 18px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .checkItem span,
  .checkItem strong {
    display: block;
  }

  .checkItem span {
    color: #7a7088;
    font-size: 13px;
    font-weight: 850;
  }

  .checkItem strong {
    margin-top: 6px;
    font-weight: 950;
  }

  .goodText {
    color: #027a48;
  }

  .actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 22px;
  }

  .btnPrimary,
  .btnSecondary,
  .btnDanger {
    min-height: 50px;
    padding: 0 20px;
    border-radius: 17px;
    font-weight: 950;
    cursor: pointer;
  }

  .btnPrimary {
    border: 0;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 16px 38px rgba(124,58,237,0.24);
  }

  .btnSecondary {
    color: #351e55;
    background: white;
    border: 1px solid rgba(124,58,237,0.16);
  }

  .btnDanger {
    color: #b42318;
    background: #fef3f2;
    border: 1px solid rgba(180,35,24,0.18);
  }

  .emptyState {
    padding: 28px;
    border-radius: 28px;
  }

  .emptyState h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 950;
  }

  .emptyState p {
    margin: 10px 0 0;
    color: #6f637e;
  }

  @media (max-width: 980px) {
    .page {
      padding: 20px 10px 70px;
    }

    .hero {
      padding: 28px 20px;
      border-radius: 30px;
    }

    .hero h1 {
      font-size: clamp(38px, 12vw, 56px);
      line-height: 0.98;
    }

    .kpiGrid,
    .docGrid,
    .checksGrid {
      grid-template-columns: 1fr;
    }

    .tutorCard {
      padding: 22px 18px;
      border-radius: 28px;
    }

    .cardTop,
    .docHeader {
      align-items: flex-start;
      flex-direction: column;
    }

    .badgeWrap {
      justify-content: flex-start;
    }

    .actions {
      flex-direction: column;
    }

    .btnPrimary,
    .btnSecondary,
    .btnDanger {
      width: 100%;
    }

    .docCard {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`