'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { BookingJourney } from '../../components/BookingJourney'

type ParentProfile = {
  id: string
  full_name: string
}

type LearningLevel = {
  id: string
  code: string
  name: string
  min_age: number | null
  max_age: number | null
  uk_equivalent: string | null
  us_canada_equivalent: string | null
  nigeria_teacher_match: string | null
}

type StudentProfile = {
  id: string
  full_name: string
  child_age: number | null
  country_system: string | null
  country_class_label: string | null
  school_year_level: string | null
  curriculum_type: string | null
  subjects_needed: string | null
  parent_goal_for_student: string | null
  learning_level_id: string | null
}

const ageOptions = [3, 4, 5, 6, 7, 8, 9, 10, 11]

const classOptionsByCountry: Record<string, string[]> = {
  UK: [
    'Nursery',
    'Reception',
    'Year 1',
    'Year 2',
    'Year 3',
    'Year 4',
    'Year 5',
    'Year 6',
  ],
  USA: [
    'Pre-K',
    'Kindergarten',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
  ],
  Canada: [
    'Pre-K',
    'Kindergarten',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
  ],
  Nigeria: [
    'Nursery 1',
    'Nursery 2',
    'KG',
    'Primary 1',
    'Primary 2',
    'Primary 3',
    'Primary 4',
    'Primary 5',
    'Primary 6',
  ],
  Other: [
    'Early Years / Nursery',
    'Kindergarten',
    'Lower Primary',
    'Upper Primary',
    'Not sure',
  ],
}

export default function ParentStudentsPage() {
  const router = useRouter()

  const [parent, setParent] = useState<ParentProfile | null>(null)
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [levels, setLevels] = useState<LearningLevel[]>([])
  const [message, setMessage] = useState('Loading...')
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const [fullName, setFullName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [countrySystem, setCountrySystem] = useState('UK')
  const [countryClassLabel, setCountryClassLabel] = useState('')
  const [goal, setGoal] = useState('')

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: parentProfile, error: parentError } = await supabase
        .from('parent_profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .maybeSingle()

      if (parentError || !parentProfile) {
        router.push('/parent/onboarding')
        return
      }

      setParent(parentProfile)

      const { data: levelRows, error: levelError } = await supabase
        .from('learning_levels')
        .select('id, code, name, min_age, max_age, uk_equivalent, us_canada_equivalent, nigeria_teacher_match')
        .eq('is_active', true)
        .order('min_age', { ascending: true })

      if (levelError) {
        setMessage(levelError.message)
        return
      }

      setLevels(levelRows ?? [])

      const { data: studentRows, error: studentsError } = await supabase
        .from('student_profiles')
        .select(
          'id, full_name, child_age, country_system, country_class_label, school_year_level, curriculum_type, subjects_needed, parent_goal_for_student, learning_level_id'
        )
        .eq('parent_id', parentProfile.id)
        .order('created_at', { ascending: false })

      if (studentsError) {
        setMessage(studentsError.message)
        return
      }

      const loadedStudents = studentRows ?? []
      setStudents(loadedStudents)
      setShowAddForm(loadedStudents.length === 0)
      setMessage('')
    }

    loadData()
  }, [router])

  const selectedLearningLevel = useMemo(() => {
    const age = Number(childAge)

    if (!childAge || Number.isNaN(age)) return null
    if (age < 3 || age > 11) return null

    const dbLevel =
      levels.find((level) => {
        const min = Number(level.min_age ?? 0)
        const max = Number(level.max_age ?? 999)
        return age >= min && age <= max
      }) ?? null

    if (dbLevel) return dbLevel

    if (age >= 3 && age <= 5) {
      return levels.find((level) => level.code === 'EY') ?? null
    }

    if (age >= 6 && age <= 7) {
      return levels.find((level) => level.code === 'LP') ?? null
    }

    if (age >= 8 && age <= 11) {
      return levels.find((level) => level.code === 'UP') ?? null
    }

    return null
  }, [childAge, levels])

  const classOptions = classOptionsByCountry[countrySystem] ?? classOptionsByCountry.Other

  async function handleAddStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!parent) return

    if (!selectedLearningLevel) {
      setMessage('Age is valid, but no matching learning level was found. Please check that EY, LP and UP are active in learning_levels.')
      return
    }

    setSaving(true)
    setMessage('')

    const payload = {
      parent_id: parent.id,
      full_name: fullName.trim(),
      child_age: Number(childAge),
      country_system: countrySystem,
      country_class_label: countryClassLabel || null,
      school_year_level: countryClassLabel || null,
      curriculum_type: countrySystem,
      learning_level_id: selectedLearningLevel.id,
      subjects_needed: null,
      parent_goal_for_student: goal.trim() || null,
    }

    const { data: createdStudent, error } = await supabase
      .from('student_profiles')
      .insert(payload)
      .select('id')
      .single()

    if (error) {
      setMessage(error.message)
      setSaving(false)
      return
    }

    if (!createdStudent?.id) {
      setMessage('The child was saved, but the next step could not be opened. Please select the child from the list.')
      setSaving(false)
      return
    }

    setMessage('Child saved. Opening subjects...')
    router.push(`/subjects?studentId=${createdStudent.id}`)
  }

  function getLevelName(levelId: string | null) {
    if (!levelId) return 'Not mapped'
    return levels.find((level) => level.id === levelId)?.name ?? 'Not mapped'
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <BookingJourney currentStep={1} />

        <section className="card" style={{ padding: 28, marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 900, fontSize: 14 }}>
            Step 1 — Choose who is learning
          </p>
          <h1 className="page-title" style={{ margin: '9px 0 0', fontSize: 38 }}>
            Select a child to continue
          </h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            One click opens the subjects matched to that child. If they are new, add their details once and we will continue automatically.
          </p>
        </section>

        <div
          className="dashboard-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: showAddForm
              ? 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))'
              : '1fr',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {showAddForm ? (
          <section className="card" style={{ padding: 32 }}>
            <p style={{ margin: 0, color: '#6f42c1', fontWeight: 800, fontSize: 14 }}>
              Student Setup
            </p>

            <h1 className="page-title" style={{ fontSize: 38, marginTop: 10 }}>
              Add a child
            </h1>

            <p className="page-subtitle">
              Select your child’s age and school system. FountainPrep will map them to the right learning level.
            </p>

            <form className="form-stack" style={{ marginTop: 22 }} onSubmit={handleAddStudent}>
              <input
                placeholder="Child full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <div
                className="two-col-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: 14,
                }}
              >
                <select
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  required
                >
                  <option value="">Select child age</option>
                  {ageOptions.map((age) => (
                    <option key={age} value={age}>
                      {age} years old
                    </option>
                  ))}
                </select>

                <select
                  value={countrySystem}
                  onChange={(e) => {
                    setCountrySystem(e.target.value)
                    setCountryClassLabel('')
                  }}
                >
                  <option value="UK">UK school system</option>
                  <option value="USA">USA school system</option>
                  <option value="Canada">Canada school system</option>
                  <option value="Nigeria">Nigeria school system</option>
                  <option value="Other">Other / not sure</option>
                </select>
              </div>

              <select
                value={countryClassLabel}
                onChange={(e) => setCountryClassLabel(e.target.value)}
                required
              >
                <option value="">Select class / year / grade</option>
                {classOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {selectedLearningLevel ? (
                <div className="panel" style={{ padding: 18 }}>
                  <p style={{ margin: 0, fontWeight: 800 }}>
                    Mapped level: {selectedLearningLevel.name}
                  </p>
                  <p className="page-subtitle" style={{ marginTop: 8 }}>
                    UK: {selectedLearningLevel.uk_equivalent || '-'} • US/Canada:{' '}
                    {selectedLearningLevel.us_canada_equivalent || '-'} • Nigeria teacher match:{' '}
                    {selectedLearningLevel.nigeria_teacher_match || '-'}
                  </p>
                </div>
              ) : (
                <div className="panel" style={{ padding: 18 }}>
                  <p style={{ margin: 0, fontWeight: 800 }}>Learning level pending</p>
                  <p className="page-subtitle" style={{ marginTop: 8 }}>
                    Select age 3–11 to map your child to Early Years, Lower Primary, or Upper Primary.
                  </p>
                </div>
              )}

              <textarea
                placeholder="Parent goal for this child e.g. reading, confidence, maths, language"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={4}
              />

              <button className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Child & Choose Subject →'}
              </button>
            </form>

            {message ? <Notice message={message} /> : null}
          </section>
          ) : null}

          <aside className="card" style={{ padding: 28 }}>
            <h2 style={{ marginTop: 0, fontSize: 24 }}>
              Choose a Child {parent ? `• ${parent.full_name}` : ''}
            </h2>

            {students.length === 0 ? (
              <p className="page-subtitle">
                No child profile added yet. Add your first child to choose subjects.
              </p>
            ) : (
              <div className="kpi-list" style={{ marginTop: 18 }}>
                {students.map((student) => (
                  <div key={student.id} className="panel" style={{ padding: 18 }}>
                    <h3 style={{ margin: '0 0 8px' }}>{student.full_name}</h3>

                    <p className="page-subtitle" style={{ marginBottom: 8 }}>
                      Age {student.child_age ?? '-'} • {student.country_system ?? '-'}{' '}
                      {student.country_class_label ? `• ${student.country_class_label}` : ''}
                    </p>

                    <p style={{ margin: '8px 0 0', fontWeight: 700 }}>
                      Level: {getLevelName(student.learning_level_id)}
                    </p>

                    {student.parent_goal_for_student ? (
                      <p className="page-subtitle" style={{ marginTop: 8 }}>
                        Goal: {student.parent_goal_for_student}
                      </p>
                    ) : null}

                    <div style={{ marginTop: 14 }}>
                      <Link
                        href={`/subjects?studentId=${student.id}`}
                        className="btn-primary"
                        style={{ display: 'inline-block' }}
                      >
                        Select {student.full_name.split(' ')[0]} & Continue →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!showAddForm && students.length > 0 ? (
              <button
                type="button"
                className="btn-secondary"
                style={{ marginTop: 18 }}
                onClick={() => setShowAddForm(true)}
              >
                Add Another Child
              </button>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  )
}

function Notice({ message }: { message: string }) {
  const isSuccess = message.toLowerCase().includes('success')

  return (
    <div
      style={{
        marginTop: 18,
        padding: '14px 16px',
        borderRadius: 16,
        background: isSuccess ? 'rgba(46, 204, 113, 0.14)' : 'rgba(245, 158, 11, 0.18)',
        border: isSuccess ? '1px solid rgba(46, 204, 113, 0.35)' : '1px solid rgba(245, 158, 11, 0.45)',
        color: isSuccess ? '#166534' : '#92400e',
        fontWeight: 700,
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  )
}
