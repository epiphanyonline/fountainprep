'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type SubjectProgram = {
  id: string
  title: string
  description: string | null
  what_will_be_taught: string | null
  learning_outcomes: string | null
  duration_minutes: number
  subject_id: string
  learning_level_id: string
  subjects: {
    id: string
    name: string
    category: string
  } | null
  learning_levels: {
    id: string
    name: string
    uk_equivalent: string | null
    us_canada_equivalent: string | null
    nigeria_teacher_match: string | null
  } | null
}

type PricingPlan = {
  id: string
  plan_code: string
  plan_name: string
  billing_type: string
  duration_months: number | null
  sessions_per_week: number
  total_sessions: number
  price_per_session: number
  total_price: number
  currency: string
}

type Student = {
  id: string
  full_name: string
  child_age: number | null
  country_system: string | null
  country_class_label: string | null
  learning_level_id: string | null
}

export default function SubjectProgramDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const programId = params.programId as string
  const studentId = searchParams.get('studentId')

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading...')
  const [program, setProgram] = useState<SubjectProgram | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setMessage('Loading...')

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      if (!studentId) {
        setMessage('No student selected.')
        setLoading(false)
        return
      }

      const { data: parentProfile } = await supabase
        .from('parent_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!parentProfile) {
        router.push('/parent/onboarding')
        return
      }

      const { data: studentRow, error: studentError } = await supabase
        .from('student_profiles')
        .select('id, full_name, child_age, country_system, country_class_label, learning_level_id')
        .eq('id', studentId)
        .eq('parent_id', parentProfile.id)
        .maybeSingle()

      if (studentError || !studentRow) {
        setMessage('Student not found.')
        setLoading(false)
        return
      }

      const { data: programRow, error: programError } = await supabase
        .from('subject_programs')
        .select(`
          id,
          title,
          description,
          what_will_be_taught,
          learning_outcomes,
          duration_minutes,
          subject_id,
          learning_level_id,
          subjects (
            id,
            name,
            category
          ),
          learning_levels (
            id,
            name,
            uk_equivalent,
            us_canada_equivalent,
            nigeria_teacher_match
          )
        `)
        .eq('id', programId)
        .eq('is_active', true)
        .maybeSingle()

      if (programError || !programRow) {
        setMessage('Subject programme not found.')
        setLoading(false)
        return
      }

      const cleanProgram = {
        ...programRow,
        subjects: Array.isArray((programRow as any).subjects)
          ? (programRow as any).subjects[0] ?? null
          : (programRow as any).subjects ?? null,
        learning_levels: Array.isArray((programRow as any).learning_levels)
          ? (programRow as any).learning_levels[0] ?? null
          : (programRow as any).learning_levels ?? null,
      } as SubjectProgram

      if (studentRow.learning_level_id !== cleanProgram.learning_level_id) {
        setMessage('This subject does not match the selected child learning level.')
        setLoading(false)
        return
      }

      const { data: planRows, error: planError } = await supabase
        .from('learning_pricing_plans')
        .select(
          'id, plan_code, plan_name, billing_type, duration_months, sessions_per_week, total_sessions, price_per_session, total_price, currency'
        )
        .eq('subject_program_id', programId)
        .eq('is_active', true)
        .order('total_price', { ascending: true })

      if (planError) {
        setMessage(planError.message)
        setLoading(false)
        return
      }

      const cleanPlans = (planRows ?? []) as PricingPlan[]

      setStudent(studentRow as Student)
      setProgram(cleanProgram)
      setPlans(cleanPlans)
      setSelectedPlanId(cleanPlans[0]?.id ?? '')
      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [programId, router, studentId])

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId)

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="container">
          <div className="card" style={{ padding: 32 }}>
            <h1 className="page-title" style={{ fontSize: 36 }}>
              Subject
            </h1>
            <p>{message}</p>
          </div>
        </div>
      </main>
    )
  }

  if (!program || !student) {
    return (
      <main className="page-wrap">
        <div className="container">
          <div className="card" style={{ padding: 32 }}>
            <h1 className="page-title" style={{ fontSize: 36 }}>
              Subject
            </h1>
            <p>{message || 'Subject not found.'}</p>

            <div style={{ marginTop: 20 }}>
              <Link href="/parent/students" className="btn-secondary">
                Back to Children
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <div
          className="dashboard-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 0.85fr',
            gap: 24,
            alignItems: 'start',
          }}
        >
          <section className="card" style={{ padding: 34 }}>
            <p style={{ margin: 0, color: '#6f42c1', fontWeight: 800, fontSize: 14 }}>
              {program.subjects?.category === 'language'
                ? 'Language Programme'
                : program.subjects?.category === 'skill'
                  ? 'Skill Programme'
                  : 'Academic Programme'}
            </p>

            <h1 className="page-title" style={{ marginTop: 10 }}>
              {program.title}
            </h1>

            <p className="page-subtitle" style={{ maxWidth: 780, lineHeight: 1.7 }}>
              {program.description}
            </p>

            <div className="panel" style={{ marginTop: 22, padding: 20 }}>
              <p style={{ margin: 0, fontWeight: 800 }}>For</p>
              <p className="page-subtitle" style={{ marginTop: 8 }}>
                {student.full_name} • Age {student.child_age ?? '-'} •{' '}
                {student.country_system ?? '-'}{' '}
                {student.country_class_label ? `• ${student.country_class_label}` : ''}
              </p>
            </div>

            <div className="panel" style={{ marginTop: 18, padding: 20 }}>
              <p style={{ margin: 0, fontWeight: 800 }}>Learning level</p>
              <p className="page-subtitle" style={{ marginTop: 8 }}>
                {program.learning_levels?.name || '-'}
              </p>
              <p className="page-subtitle" style={{ marginTop: 8 }}>
                UK: {program.learning_levels?.uk_equivalent || '-'} • US/Canada:{' '}
                {program.learning_levels?.us_canada_equivalent || '-'} • Nigeria teacher match:{' '}
                {program.learning_levels?.nigeria_teacher_match || '-'}
              </p>
            </div>

            <div style={{ marginTop: 28 }}>
              <h2 style={{ fontSize: 26, marginBottom: 12 }}>What will be taught</h2>
              <div className="card" style={{ padding: 22 }}>
                <p className="page-subtitle" style={{ lineHeight: 1.8 }}>
                  {program.what_will_be_taught || 'Structured learning support.'}
                </p>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 26, marginBottom: 12 }}>Learning outcomes</h2>
              <div className="card" style={{ padding: 22 }}>
                <p className="page-subtitle" style={{ lineHeight: 1.8 }}>
                  {program.learning_outcomes || 'Improved confidence and measurable progress.'}
                </p>
              </div>
            </div>
          </section>

          <aside className="card" style={{ padding: 30 }}>
            <p style={{ margin: 0, color: '#6f42c1', fontWeight: 800, fontSize: 14 }}>
              Choose Plan
            </p>

            <h2 style={{ margin: '10px 0 8px', fontSize: 30 }}>
              Pricing
            </h2>

            <p className="page-subtitle">
              Pay per class is flexible. Monthly plans reduce the price to £6 per session.
            </p>

            <div style={{ display: 'grid', gap: 14, marginTop: 22 }}>
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className="panel"
                    style={{
                      padding: 18,
                      textAlign: 'left',
                      border: isSelected
                        ? '2px solid #6f42c1'
                        : '1px solid var(--border)',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(111,66,193,0.08), rgba(138,92,246,0.10))'
                        : '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 900 }}>
                          {plan.plan_name}
                        </p>
                        <p className="page-subtitle" style={{ marginTop: 6 }}>
                          {plan.total_sessions} session{plan.total_sessions > 1 ? 's' : ''} •{' '}
                          {plan.sessions_per_week} per week
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontWeight: 900, fontSize: 22 }}>
                          {plan.currency} {Number(plan.total_price).toFixed(2)}
                        </p>
                        <p className="page-subtitle" style={{ marginTop: 6 }}>
                          {plan.currency} {Number(plan.price_per_session).toFixed(2)}/class
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {selectedPlan ? (
              <div className="panel" style={{ marginTop: 22, padding: 18 }}>
                <div className="kpi-list">
                  <div className="kpi-row">
                    <span className="kpi-label">Selected plan</span>
                    <span className="kpi-value">{selectedPlan.plan_name}</span>
                  </div>

                  <div className="kpi-row">
                    <span className="kpi-label">Total sessions</span>
                    <span className="kpi-value">{selectedPlan.total_sessions}</span>
                  </div>

                  <div className="kpi-row">
                    <span className="kpi-label">Total</span>
                    <span className="kpi-value">
                      {selectedPlan.currency} {Number(selectedPlan.total_price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
              <Link
                href={
                  selectedPlan
                    ? `/schedule?studentId=${student.id}&programId=${program.id}&planId=${selectedPlan.id}`
                    : '#'
                }
                className="btn-primary"
                style={{
                  textAlign: 'center',
                  pointerEvents: selectedPlan ? 'auto' : 'none',
                  opacity: selectedPlan ? 1 : 0.5,
                }}
              >
                Continue to Schedule
              </Link>

              <Link
                href={`/subjects?studentId=${student.id}`}
                className="btn-secondary"
                style={{ textAlign: 'center' }}
              >
                Back to Subjects
              </Link>
            </div>

            {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
          </aside>
        </div>
      </div>
    </main>
  )
}