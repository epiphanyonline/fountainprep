'use client'

import { useEffect, useState } from 'react'
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
}

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<TutorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadTutors() {
    setLoading(true)

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
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) {
      setMessage(error.message)
    } else {
      setTutors(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadTutors()
  }, [])

  async function updateTutor(id: string, updates: Partial<TutorRow>) {
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

  return (
    <main className="page-wrap">
      <div className="container">

        <h1 className="page-title">Admin • Tutor Approval</h1>
        <p className="page-subtitle">
          Approve, verify and control which tutors appear on the platform.
        </p>

        {loading && <p style={{ marginTop: 20 }}>Loading tutors...</p>}
        {message && <p style={{ marginTop: 20 }}>{message}</p>}

        <div style={{ marginTop: 32, display: 'grid', gap: 20 }}>

          {tutors.map((tutor) => (
            <div key={tutor.id} className="card" style={{ padding: 24 }}>

              {/* HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ margin: 0 }}>{tutor.full_name}</h2>
                  <p className="page-subtitle">
                    {tutor.years_of_experience} yrs experience
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <StatusBadge label="Approval" value={tutor.approval_status} />
                  <StatusBadge label="Verification" value={tutor.verification_status} />
                  <StatusBadge label="Listed" value={tutor.is_listed ? 'yes' : 'no'} />
                </div>
              </div>

              {/* BODY */}
              <p style={{ marginTop: 16 }}>
                {tutor.qualification_summary || 'No summary provided'}
              </p>

              {/* ACTIONS */}
              <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>

                <button
                  className="btn-primary"
                  onClick={() => approveTutor(tutor.id)}
                >
                  Approve & List
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => rejectTutor(tutor.id)}
                >
                  Reject
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => toggleListing(tutor.id, tutor.is_listed)}
                >
                  {tutor.is_listed ? 'Unlist' : 'List'}
                </button>

              </div>

            </div>
          ))}

          {!loading && tutors.length === 0 && (
            <div className="card" style={{ padding: 24 }}>
              <p>No tutors found.</p>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}

/* STATUS BADGE COMPONENT */

function StatusBadge({
  label,
  value,
}: {
  label: string
  value: string
}) {
  const color =
    value === 'approved' || value === 'verified' || value === 'yes'
      ? '#2ecc71'
      : value === 'rejected'
      ? '#e74c3c'
      : '#f39c12'

  return (
    <span
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: `${color}20`,
        color,
      }}
    >
      {label}: {value}
    </span>
  )
}