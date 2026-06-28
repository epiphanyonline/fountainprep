'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  onTutorApproved,
  onTutorInterviewInvite,
  onTutorListed,
} from '../../lib/events'

type LatestInterview = {
  id: string
  interview_date: string
  interview_time: string
  interview_link: string
  status: string
  created_at: string
}

type TutorRow = {
  id: string
  user_id: string
  email: string | null
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
  latest_interview?: LatestInterview | null
}

type TutorUpdate = {
  approval_status?: string
  verification_status?: string
  is_listed?: boolean
}

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<TutorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [interviewTutor, setInterviewTutor] = useState<TutorRow | null>(null)
  const [interviewDate, setInterviewDate] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [interviewTime, setInterviewTime] = useState('18:00')
  const [sendingInvite, setSendingInvite] = useState(false)

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
        user_id,
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

    const tutorRows = (data || []) as Omit<TutorRow, 'email'>[]
    const userIds = Array.from(
      new Set(tutorRows.map((tutor) => tutor.user_id).filter(Boolean))
    )
    const tutorIds = tutorRows.map((tutor) => tutor.id)

    const emailMap = new Map<string, string | null>()
    const interviewMap = new Map<string, LatestInterview>()

    if (userIds.length > 0) {
      const { data: profileRows, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, email')
        .in('id', userIds)

      if (profileError) {
        console.warn('Tutor email lookup failed:', profileError.message)
      }

      for (const profile of profileRows ?? []) {
        emailMap.set(profile.id, profile.email ?? null)
      }
    }

    if (tutorIds.length > 0) {
      const { data: interviewRows, error: interviewError } = await supabase
        .from('tutor_interviews')
        .select(`
          id,
          tutor_id,
          interview_date,
          interview_time,
          interview_link,
          status,
          created_at
        `)
        .in('tutor_id', tutorIds)
        .order('created_at', { ascending: false })

      if (interviewError) {
        console.warn('Tutor interview lookup failed:', interviewError.message)
      }

      for (const interview of interviewRows ?? []) {
        if (!interviewMap.has(interview.tutor_id)) {
          interviewMap.set(interview.tutor_id, {
            id: interview.id,
            interview_date: interview.interview_date,
            interview_time: interview.interview_time,
            interview_link: interview.interview_link,
            status: interview.status,
            created_at: interview.created_at,
          })
        }
      }
    }

    const enriched = await Promise.all(
      tutorRows.map(async (tutor) => ({
        ...tutor,
        email: emailMap.get(tutor.user_id) ?? null,
        latest_interview: interviewMap.get(tutor.id) ?? null,
        cv_signed_url: await signedUrl(tutor.cv_url),
        id_signed_url: await signedUrl(tutor.government_id_url),
        qualification_signed_url: await signedUrl(
          tutor.qualification_document_url
        ),
      }))
    )

    setTutors(enriched)
    setLoading(false)
  }

  useEffect(() => {
    loadTutors()
  }, [])

  async function updateTutor(id: string, updates: TutorUpdate) {
    const { error } = await supabase
      .from('tutor_profiles')
      .update(updates)
      .eq('id', id)

    if (error) {
      setMessage(error.message)
      return
    }

    await loadTutors()
  }

  async function approveTutor(tutor: TutorRow) {
    await updateTutor(tutor.id, {
      approval_status: 'approved',
      verification_status: 'verified',
      is_listed: true,
    })

    if (tutor.user_id) {
      await onTutorApproved({
        tutorUserId: tutor.user_id,
        tutorName: tutor.full_name,
        tutorEmail: tutor.email,
      })

      await onTutorListed({
        tutorUserId: tutor.user_id,
        tutorName: tutor.full_name,
        tutorEmail: tutor.email,
      })
    }
  }

  async function rejectTutor(id: string) {
    await updateTutor(id, {
      approval_status: 'rejected',
      is_listed: false,
    })
  }

  async function toggleListing(tutor: TutorRow) {
    const listing = !tutor.is_listed

    await updateTutor(tutor.id, {
      is_listed: listing,
    })

    if (listing && tutor.user_id) {
      await onTutorListed({
        tutorUserId: tutor.user_id,
        tutorName: tutor.full_name,
        tutorEmail: tutor.email,
      })
    }
  }

  async function sendInterviewInvite() {
  if (!interviewTutor) return

  setSendingInvite(true)
  setMessage('')

  try {
    if (!interviewTutor.email) {
      throw new Error('Tutor email is missing.')
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fountainprep.com'

    let interviewId = interviewTutor.latest_interview?.id || null
    let interviewLink = ''

    if (
      interviewTutor.latest_interview &&
      interviewTutor.latest_interview.status === 'SCHEDULED'
    ) {
      interviewId = interviewTutor.latest_interview.id
      interviewLink = `${siteUrl}/interview/${interviewId}`

      const { error: updateError } = await supabase
        .from('tutor_interviews')
        .update({
          interview_date: interviewDate,
          interview_time: interviewTime,
          tutor_name: interviewTutor.full_name,
          tutor_email: interviewTutor.email,
          interview_link: interviewLink,
          updated_at: new Date().toISOString(),
        })
        .eq('id', interviewId)

      if (updateError) {
        throw new Error(updateError.message)
      }
    } else {
      const { data: interviewRow, error: interviewError } = await supabase
        .from('tutor_interviews')
        .insert({
          tutor_id: interviewTutor.id,
          tutor_user_id: interviewTutor.user_id,
          tutor_name: interviewTutor.full_name,
          tutor_email: interviewTutor.email,
          interview_date: interviewDate,
          interview_time: interviewTime,
          interview_link: '',
          status: 'SCHEDULED',
        })
        .select('id')
        .single()

      if (interviewError) {
        throw new Error(interviewError.message)
      }

      interviewId = interviewRow.id
      interviewLink = `${siteUrl}/interview/${interviewId}`

      const { error: linkUpdateError } = await supabase
        .from('tutor_interviews')
        .update({
          interview_link: interviewLink,
          updated_at: new Date().toISOString(),
        })
        .eq('id', interviewId)

      if (linkUpdateError) {
        throw new Error(linkUpdateError.message)
      }
    }

    await onTutorInterviewInvite({
      tutorUserId: interviewTutor.user_id,
      tutorName: interviewTutor.full_name,
      tutorEmail: interviewTutor.email,
      interviewDate,
      interviewTime,
      interviewLink,
    })

    setMessage(
      interviewTutor.latest_interview?.status === 'SCHEDULED'
        ? `Interview updated and invitation resent to ${interviewTutor.full_name}.`
        : `Interview invitation sent to ${interviewTutor.full_name}.`
    )

    setInterviewTutor(null)
    await loadTutors()
  } catch (err) {
    console.error(err)
    setMessage(
      err instanceof Error
        ? err.message
        : 'Unable to send interview invitation.'
    )
  }

  setSendingInvite(false)
}

  async function markInterviewCompleted(tutor: TutorRow) {
    if (!tutor.latest_interview) return

    const { error } = await supabase
      .from('tutor_interviews')
      .update({
        status: 'COMPLETED',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tutor.latest_interview.id)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage(`Interview marked completed for ${tutor.full_name}.`)
    await loadTutors()
  }

  async function cancelInterview(tutor: TutorRow) {
    if (!tutor.latest_interview) return

    const confirmed = window.confirm(
      `Cancel the latest interview for ${tutor.full_name}?`
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('tutor_interviews')
      .update({
        status: 'CANCELLED',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tutor.latest_interview.id)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage(`Interview cancelled for ${tutor.full_name}.`)
    await loadTutors()
  }

  async function markInterviewNoShow(tutor: TutorRow) {
  if (!tutor.latest_interview) return

  const { error } = await supabase
    .from('tutor_interviews')
    .update({
      status: 'NO_SHOW',
      updated_at: new Date().toISOString(),
    })
    .eq('id', tutor.latest_interview.id)

  if (error) {
    setMessage(error.message)
    return
  }

  setMessage(`Interview marked as no-show for ${tutor.full_name}.`)
  await loadTutors()
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

  const interviewCount = useMemo(
    () => tutors.filter((t) => t.latest_interview).length,
    [tutors]
  )

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Admin Tutor Review</p>
        <h1>Tutor approval centre</h1>
        <p className="subtitle">
          Review tutor profiles, open CVs, verify identity documents, check
          qualifications, schedule interviews and control who appears on
          Fountain Prep.
        </p>

        <div className="kpiGrid">
          <Kpi label="Total Tutors" value={String(tutors.length)} />
          <Kpi label="Pending Review" value={String(pendingCount)} />
          <Kpi label="Verified" value={String(verifiedCount)} />
          <Kpi label="Interviews" value={String(interviewCount)} />
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
                    {formatDisplayDate(tutor.submitted_at || tutor.created_at)}
                    {tutor.email ? ` • ${tutor.email}` : ''}
                  </p>
                </div>

                <div className="badgeWrap">
                  <StatusBadge label="Approval" value={tutor.approval_status} />
                  <StatusBadge
                    label="Verification"
                    value={tutor.verification_status}
                  />
                  <StatusBadge
                    label="Listed"
                    value={tutor.is_listed ? 'yes' : 'no'}
                  />
                </div>
              </div>

              <p className="summary">
                {tutor.qualification_summary ||
                  'No qualification summary provided.'}
              </p>

              {tutor.latest_interview ? (
                <div className="interviewBox">
                  <div>
                    <p className="interviewLabel">Interview Status</p>
                    <h3>{formatInterviewStatus(tutor.latest_interview.status)}</h3>
                    <p className="interviewMeta">
                      {formatDisplayDate(tutor.latest_interview.interview_date)} at{' '}
                      {formatTime(tutor.latest_interview.interview_time)}
                    </p>
                  </div>

                  <div className="interviewActions">
                    <a
                      href={tutor.latest_interview.interview_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="joinInterviewButton"
                    >
                      Join Interview
                    </a>

                    <button
                      type="button"
                      onClick={() => setInterviewTutor(tutor)}
                      className="rescheduleButton"
                    >
                      Resend / Reschedule
                    </button>

                    <button
                      type="button"
                      onClick={() => markInterviewCompleted(tutor)}
                      className="completeButton"
                    >
                      Mark Completed
                    </button>

                    <button
  type="button"
  onClick={() => markInterviewNoShow(tutor)}
  className="cancelButton"
>
  No Show
</button>

                    <button
                      type="button"
                      onClick={() => cancelInterview(tutor)}
                      className="cancelButton"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="docPanel">
                <div className="docHeader">
                  <div>
                    <p className="eyebrow">Documents</p>
                    <h3>Review uploaded files</h3>
                  </div>
                  <span className="docCount">
                    {[
                      tutor.cv_url,
                      tutor.government_id_url,
                      tutor.qualification_document_url,
                    ].filter(Boolean).length}
                    /3
                  </span>
                </div>

                <div className="docGrid">
                  <DocumentLink
                    title="CV"
                    subtitle={fileLabel(tutor.cv_url)}
                    href={tutor.cv_signed_url}
                  />
                  <DocumentLink
                    title="Government ID"
                    subtitle={fileLabel(tutor.government_id_url)}
                    href={tutor.id_signed_url}
                  />
                  <DocumentLink
                    title="Qualification"
                    subtitle={fileLabel(tutor.qualification_document_url)}
                    href={tutor.qualification_signed_url}
                  />
                </div>
              </div>

              <div className="checksGrid">
                <CheckItem
                  label="GDPR"
                  value={tutor.gdpr_agreed ? 'Agreed' : 'Not agreed'}
                />
                <CheckItem
                  label="Terms"
                  value={tutor.terms_agreed ? 'Agreed' : 'Not agreed'}
                />
                <CheckItem
                  label="Safeguarding"
                  value={tutor.safeguarding_agreed ? 'Agreed' : 'Not agreed'}
                />
                <CheckItem label="DBS" value={tutor.dbs_status || 'Pending'} />
              </div>

              <div className="actions">
                {!tutor.latest_interview ? (
                  <button
                    type="button"
                    className="btnPrimary"
                    onClick={() => setInterviewTutor(tutor)}
                  >
                    Invite Interview
                  </button>
                ) : null}

                <button className="btnPrimary" onClick={() => approveTutor(tutor)}>
                  Approve & List
                </button>

                <button
                  className="btnSecondary"
                  onClick={() => rejectTutor(tutor.id)}
                >
                  Reject
                </button>

                <button
                  className="btnSecondary"
                  onClick={() => toggleListing(tutor)}
                >
                  {tutor.is_listed ? 'Unlist' : 'List'}
                </button>

                <button
                  className="btnDanger"
                  onClick={() => deleteTutorAndDocuments(tutor)}
                >
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

      {interviewTutor && (
        <div className="modalOverlay">
          <div className="modalCard">
            <p className="eyebrow">Tutor interview</p>
            <h2>
              {interviewTutor.latest_interview
                ? 'Resend or reschedule interview'
                : 'Schedule interview'}
            </h2>
            <p>
              {interviewTutor.full_name}
              {interviewTutor.email ? ` • ${interviewTutor.email}` : ''}
            </p>

            <div className="modalGrid">
              <label>
                <span>Date</span>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </label>

              <label>
                <span>Time</span>
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                />
              </label>
            </div>

            <div className="modalButtons">
              <button
                className="btnSecondary"
                onClick={() => setInterviewTutor(null)}
              >
                Cancel
              </button>

              <button
                className="btnPrimary"
                disabled={sendingInvite}
                onClick={sendInterviewInvite}
              >
                {sendingInvite ? 'Sending...' : 'Send Interview'}
              </button>
            </div>
          </div>
        </div>
      )}

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
  const good = clean === 'agreed' || clean === 'verified'

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

  return (
    <span className={className}>
      {label}: {value}
    </span>
  )
}

function fileLabel(path: string | null) {
  if (!path) return 'No file uploaded'
  const fileName = path.split('/').pop() || 'Uploaded file'
  return fileName.length > 28 ? `${fileName.slice(0, 28)}...` : fileName
}

function formatDisplayDate(value?: string | null) {
  if (!value) return 'Date not set'

  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function formatInterviewStatus(status?: string | null) {
  if (!status) return 'Scheduled'

  return status
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatTime(value?: string | null) {
  if (!value) return 'Time not set'
  return value.slice(0, 5)
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
    grid-template-columns: repeat(5, minmax(0, 1fr));
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

  .interviewBox {
    margin-top: 22px;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background:
      radial-gradient(circle at top right, rgba(124,58,237,0.16), transparent 36%),
      linear-gradient(135deg, #ffffff, #fbf8ff);
    border: 1px solid rgba(124,58,237,0.16);
    box-shadow: 0 18px 45px rgba(71,43,117,0.08);
  }

  .interviewLabel {
    margin: 0;
    color: #6d28d9;
    font-size: 12px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  .interviewBox h3 {
    margin: 8px 0 0;
    font-size: 24px;
    font-weight: 950;
    letter-spacing: -0.035em;
  }

  .interviewMeta {
    margin: 6px 0 0;
    color: #6f637e;
    font-weight: 800;
  }

  .interviewActions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .joinInterviewButton,
  .rescheduleButton,
  .completeButton,
  .cancelButton {
    min-height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 14px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 950;
    text-decoration: none;
    cursor: pointer;
  }

  .joinInterviewButton {
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    border: 0;
  }

  .rescheduleButton,
  .completeButton {
    color: #351e55;
    background: white;
    border: 1px solid rgba(124,58,237,0.16);
  }

  .cancelButton {
    color: #b42318;
    background: #fff7f7;
    border: 1px solid rgba(180,35,24,0.18);
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

  .btnPrimary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
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

  .modalOverlay {
    position: fixed;
    inset: 0;
    background: rgba(25, 14, 39, 0.48);
    display: grid;
    place-items: center;
    z-index: 5000;
    padding: 18px;
    backdrop-filter: blur(10px);
  }

  .modalCard {
    width: min(540px, 100%);
    background: white;
    border-radius: 30px;
    padding: 34px;
    box-shadow: 0 35px 100px rgba(0,0,0,.18);
    border: 1px solid rgba(124,58,237,0.12);
  }

  .modalCard h2 {
    margin: 10px 0 0;
    font-size: 34px;
    line-height: 1.05;
    font-weight: 950;
    letter-spacing: -0.045em;
  }

  .modalCard p {
    margin: 12px 0 26px;
    color: #6f637e;
    line-height: 1.55;
  }

  .modalGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .modalGrid label {
    display: grid;
    gap: 8px;
  }

  .modalGrid span {
    font-size: 13px;
    font-weight: 950;
    color: #351e55;
  }

  .modalGrid input {
    width: 100%;
    padding: 16px;
    border-radius: 16px;
    border: 1px solid #ddd2ef;
    font-size: 16px;
    outline: none;
  }

  .modalButtons {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 28px;
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
    .docHeader,
    .interviewBox {
      align-items: flex-start;
      flex-direction: column;
    }

    .badgeWrap,
    .interviewActions {
      justify-content: flex-start;
    }

    .actions,
    .modalButtons {
      flex-direction: column;
    }

    .btnPrimary,
    .btnSecondary,
    .btnDanger,
    .joinInterviewButton,
    .rescheduleButton,
    .completeButton,
    .cancelButton {
      width: 100%;
    }

    .modalGrid {
      grid-template-columns: 1fr;
    }

    .docCard {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`