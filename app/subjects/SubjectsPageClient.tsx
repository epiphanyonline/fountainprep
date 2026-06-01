'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'

type Student = {
  id: string
  full_name: string
  child_age: number | null
  country_system: string | null
  country_class_label: string | null
  learning_level_id: string | null
}

type LearningLevel = {
  id: string
  name: string
  uk_equivalent: string | null
  us_canada_equivalent: string | null
  nigeria_teacher_match: string | null
}

type SubjectInfo = {
  id: string
  name: string
  category: string
}

type SubjectProgram = {
  id: string
  title: string
  description: string | null
  what_will_be_taught: string | null
  learning_outcomes: string | null
  duration_minutes: number
  subject_id: string
  learning_level_id: string
  subjects: SubjectInfo | null
  learning_levels: LearningLevel | null
}

const catalogueSubjects = [
  {
    name: 'Maths',
    category: 'Academic',
    benefit: 'Builds confidence with numbers, problem-solving, and school maths.',
    childImprovement:
      'Parents should expect better number confidence, stronger homework independence, improved accuracy, and less fear around maths tasks.',
    taught:
      'Counting, arithmetic, fractions, word problems, times tables, reasoning, and exam-style practice depending on age.',
  },
  {
    name: 'English',
    category: 'Academic',
    benefit: 'Strengthens reading, writing, comprehension, spelling, and expression.',
    childImprovement:
      'Children become more confident readers and writers, with better vocabulary, clearer sentences, and stronger comprehension.',
    taught:
      'Phonics, reading fluency, comprehension, grammar, spelling, creative writing, handwriting support, and structured writing practice.',
  },
  {
    name: 'Science',
    category: 'Academic',
    benefit: 'Helps children understand the world through simple, clear explanations.',
    childImprovement:
      'Children improve curiosity, observation skills, scientific vocabulary, and confidence answering school science questions.',
    taught:
      'Living things, materials, forces, plants, animals, environment, simple experiments, and science reasoning.',
  },
  {
    name: 'Coding',
    category: 'Skill',
    benefit: 'Introduces children to logic, creativity, and digital problem-solving.',
    childImprovement:
      'Children develop better logical thinking, patience, sequencing, creativity, and confidence using technology productively.',
    taught:
      'Beginner coding concepts, sequencing, loops, simple games, block coding, problem-solving, and digital confidence.',
  },
  {
    name: 'Music',
    category: 'Skill',
    benefit: 'Supports creativity, rhythm, listening skills, and self-expression.',
    childImprovement:
      'Children gain confidence, focus, memory, rhythm awareness, and creative expression through structured music learning.',
    taught:
      'Rhythm, pitch, singing basics, listening skills, simple notation, practice routines, and age-appropriate music activities.',
  },
  {
    name: 'Yoruba',
    category: 'Language',
    benefit: 'Helps children connect with culture, family language, and identity.',
    childImprovement:
      'Children become more comfortable hearing, speaking, greeting, and understanding Yoruba in family and cultural settings.',
    taught:
      'Greetings, numbers, everyday words, simple sentences, pronunciation, songs, culture, and conversation practice.',
  },
  {
    name: 'Igbo',
    category: 'Language',
    benefit: 'Builds language connection for children in diaspora families.',
    childImprovement:
      'Children gain confidence with basic Igbo words, greetings, pronunciation, and simple family conversations.',
    taught:
      'Greetings, names, numbers, family words, common phrases, pronunciation, songs, and cultural learning.',
  },
  {
    name: 'Hausa',
    category: 'Language',
    benefit: 'Introduces children to Hausa language, greetings, and cultural expression.',
    childImprovement:
      'Children become more confident recognising and using simple Hausa words, greetings, and everyday expressions.',
    taught:
      'Greetings, numbers, basic vocabulary, pronunciation, simple sentences, songs, and cultural context.',
  },
]

export default function SubjectsPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId')

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading...')
  const [student, setStudent] = useState<Student | null>(null)
  const [level, setLevel] = useState<LearningLevel | null>(null)
  const [programs, setPrograms] = useState<SubjectProgram[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setMessage('Loading...')

      let selectedLearningLevelId: string | null = null

      const {
        data: { user },
      } = await supabase.auth.getUser()

      setIsLoggedIn(Boolean(user))

      if (studentId) {
        if (!user) {
          router.push('/login')
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
          .select(
            'id, full_name, child_age, country_system, country_class_label, learning_level_id'
          )
          .eq('id', studentId)
          .eq('parent_id', parentProfile.id)
          .maybeSingle()

        if (studentError || !studentRow) {
          setMessage('Student not found.')
          setLoading(false)
          return
        }

        if (!studentRow.learning_level_id) {
          setMessage('This child has not been mapped to a learning level yet.')
          setLoading(false)
          return
        }

        selectedLearningLevelId = studentRow.learning_level_id
        setStudent(studentRow as Student)

        const { data: levelRow } = await supabase
          .from('learning_levels')
          .select('id, name, uk_equivalent, us_canada_equivalent, nigeria_teacher_match')
          .eq('id', studentRow.learning_level_id)
          .maybeSingle()

        setLevel((levelRow ?? null) as LearningLevel | null)
      }

      let query = supabase
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
        .eq('is_active', true)
        .order('title', { ascending: true })

      if (selectedLearningLevelId) {
        query = query.eq('learning_level_id', selectedLearningLevelId)
      }

      const { data: programRows, error: programError } = await query

      if (programError) {
        setMessage(programError.message)
        setLoading(false)
        return
      }

      const cleanPrograms = ((programRows ?? []) as any[]).map((row) => ({
        ...row,
        subjects: Array.isArray(row.subjects) ? row.subjects[0] ?? null : row.subjects ?? null,
        learning_levels: Array.isArray(row.learning_levels)
          ? row.learning_levels[0] ?? null
          : row.learning_levels ?? null,
      })) as SubjectProgram[]

      setPrograms(cleanPrograms)
      setMessage('')
      setLoading(false)
    }

    loadData()
  }, [router, studentId])

  const personalised = Boolean(student)

  const categories = useMemo(() => {
    if (programs.length === 0) return ['All', 'Academic', 'Skill', 'Language']

    const unique = Array.from(
      new Set(
        programs
          .map((p) => p.subjects?.category)
          .filter((category): category is string => Boolean(category))
      )
    )

    return ['All', ...unique]
  }, [programs])

  const filteredPrograms = useMemo(() => {
    if (categoryFilter === 'All') return programs
    return programs.filter((p) => p.subjects?.category === categoryFilter)
  }, [programs, categoryFilter])

  const filteredCatalogue = useMemo(() => {
    if (categoryFilter === 'All') return catalogueSubjects
    return catalogueSubjects.filter(
      (subject) => subject.category.toLowerCase() === categoryFilter.toLowerCase()
    )
  }, [categoryFilter])

  function categoryLabel(category?: string | null) {
    if (category === 'academic') return 'Core Academic'
    if (category === 'language') return 'African Language'
    if (category === 'skill') return 'Creative Skill'

    if (category === 'Academic') return 'Core Academic'
    if (category === 'Language') return 'African Language'
    if (category === 'Skill') return 'Creative Skill'

    return category || 'Learning Area'
  }

  function filterLabel(category: string) {
    const normalised = category.toLowerCase()

    if (normalised === 'all') return 'All Learning Areas'
    if (normalised === 'academic') return 'Core Academics'
    if (normalised === 'skill') return 'Creative Skills'
    if (normalised === 'language') return 'African Languages'

    return category
  }

  function filterDescription(category: string) {
    const normalised = category.toLowerCase()

    if (normalised === 'all') return 'Explore the full FountainPrep learning catalogue'
    if (normalised === 'academic') return 'Maths, English, Science and school support'
    if (normalised === 'skill') return 'Coding, Music and confidence-building skills'
    if (normalised === 'language') return 'Yoruba, Igbo, Hausa and cultural connection'

    return 'Explore this learning pathway'
  }

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="container">
          <div className="card loading-card">
            <h1 className="page-title loading-title">Subjects</h1>
            <p className="page-subtitle">{message}</p>
          </div>
        </div>
      </main>
    )
  }

  const hasPrograms = filteredPrograms.length > 0

  return (
    <main className="page-wrap">
      <div className="container">
        <section className="subjects-hero">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="hero-main">
            <p className="hero-kicker">
              {personalised ? 'Personalised learning pathway' : 'FountainPrep subject catalogue'}
            </p>

            <h1 className="page-title hero-title">
              {personalised
                ? `Choose a learning area for ${student?.full_name}`
                : 'Learning areas designed to help children grow'}
            </h1>

            <p className="page-subtitle hero-copy">
              {personalised
                ? `We’ll use ${student?.full_name}’s age, class level, and learning stage to guide the next step in their FountainPrep learning plan.`
                : 'Explore structured learning areas across core academics, creative skills, and African languages. Each subject is designed to build confidence, consistency, and measurable progress.'}
            </p>

            {personalised ? (
              <div className="student-summary">
                <div>
                  <span className="summary-label">Child</span>
                  <strong>{student?.full_name}</strong>
                </div>

                <div>
                  <span className="summary-label">Age</span>
                  <strong>{student?.child_age ?? '-'}</strong>
                </div>

                <div>
                  <span className="summary-label">Class</span>
                  <strong>{student?.country_class_label || '-'}</strong>
                </div>
              </div>
            ) : null}

            {level ? (
              <div className="level-panel">
                <p>Learning level: {level.name}</p>
                <span>
                  UK: {level.uk_equivalent || '-'} • US/Canada:{' '}
                  {level.us_canada_equivalent || '-'} • Nigeria teacher match:{' '}
                  {level.nigeria_teacher_match || '-'}
                </span>
              </div>
            ) : null}

            <div className="hero-actions">
              {!isLoggedIn ? (
                <>
                  <Link href="/signup/parent" className="btn-primary">
                    Create Parent Profile
                  </Link>
                  <Link href="/login" className="btn-secondary">
                    Login to Continue
                  </Link>
                </>
              ) : personalised ? (
                <>
                  <Link href="#subjects-list" className="btn-primary">
                    Explore Learning Areas
                  </Link>
                  <Link href="/parent/students" className="btn-secondary">
                    Switch Child
                  </Link>
                </>
              ) : (
                <Link href="/parent/students" className="btn-primary">
                  Build a Learning Plan
                </Link>
              )}
            </div>
          </div>

          <div className="hero-side">
            <div className="journey-card">
              <p className="journey-kicker">Parent journey</p>

              <div className="journey-step">
                <span>01</span>
                <div>
                  <strong>Choose your child</strong>
                  <p>We personalise the journey around their level.</p>
                </div>
              </div>

              <div className="journey-step">
                <span>02</span>
                <div>
                  <strong>Select a learning area</strong>
                  <p>Pick the subject your child needs support with.</p>
                </div>
              </div>

              <div className="journey-step">
                <span>03</span>
                <div>
                  <strong>Continue to plans</strong>
                  <p>Choose a learning plan and book a convenient time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pathway-section">
          <div className="pathway-head">
            <div>
              <p className="hero-kicker">Learning pathways</p>
              <h2 className="section-heading">Choose the type of support your child needs</h2>
            </div>

            <p className="page-subtitle pathway-copy">
              Use the pathways below to focus the catalogue and find the most relevant
              learning area.
            </p>
          </div>

          <div className="pathway-grid">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCategoryFilter(category)}
                className={categoryFilter === category ? 'pathway-card active' : 'pathway-card'}
              >
                <span className="pathway-icon">{getCategoryIcon(category)}</span>
                <strong>{filterLabel(category)}</strong>
                <small>{filterDescription(category)}</small>
              </button>
            ))}
          </div>
        </section>

        <section id="subjects-list" className="subjects-list-section">
          <div className="list-head">
            <div>
              <p className="hero-kicker">{filterLabel(categoryFilter)}</p>
              <h2 className="section-heading">
                {personalised
                  ? `Available learning options for ${student?.full_name}`
                  : 'Explore FountainPrep learning areas'}
              </h2>
            </div>

            {!personalised && isLoggedIn ? (
              <Link href="/parent/students" className="btn-secondary compact-action">
                Build Plan First
              </Link>
            ) : null}
          </div>

          {hasPrograms ? (
            <ProgramGrid
              programs={filteredPrograms}
              personalised={personalised}
              studentId={student?.id ?? null}
              isLoggedIn={isLoggedIn}
              categoryLabel={categoryLabel}
            />
          ) : (
            <CatalogueGrid
              subjects={filteredCatalogue}
              personalised={personalised}
              isLoggedIn={isLoggedIn}
              studentId={student?.id ?? null}
              categoryLabel={categoryLabel}
            />
          )}
        </section>
      </div>

      <style jsx>{`
        .loading-card {
          padding: 32px;
        }

        .loading-title {
          font-size: 36px;
        }

        .subjects-hero {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 28px;
          align-items: stretch;
          padding: 38px;
          border-radius: 34px;
          border: 1px solid rgba(111, 66, 193, 0.14);
          background:
            radial-gradient(circle at top right, rgba(138, 92, 246, 0.16), transparent 34%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(246, 240, 255, 0.96));
          box-shadow: 0 24px 70px rgba(55, 35, 95, 0.11);
        }

        .hero-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(12px);
          pointer-events: none;
        }

        .hero-glow-one {
          width: 230px;
          height: 230px;
          right: -70px;
          top: -90px;
          background: rgba(138, 92, 246, 0.14);
        }

        .hero-glow-two {
          width: 150px;
          height: 150px;
          left: -55px;
          bottom: -55px;
          background: rgba(214, 188, 250, 0.24);
        }

        .hero-main,
        .hero-side {
          position: relative;
          z-index: 1;
        }

        .hero-kicker {
          margin: 0 0 8px;
          color: #6f42c1;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.02em;
        }

        .hero-title {
          margin-top: 0;
          max-width: 820px;
          letter-spacing: -0.045em;
          line-height: 1.02;
        }

        .hero-copy {
          max-width: 780px;
          line-height: 1.75;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 26px;
        }

        .student-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          max-width: 700px;
          margin-top: 24px;
        }

        .student-summary div {
          padding: 16px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(111, 66, 193, 0.12);
          box-shadow: 0 12px 34px rgba(55, 35, 95, 0.07);
        }

        .summary-label {
          display: block;
          margin-bottom: 5px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
        }

        .student-summary strong {
          color: #241438;
          font-size: 15px;
        }

        .level-panel {
          margin-top: 18px;
          padding: 18px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(111, 66, 193, 0.12);
        }

        .level-panel p {
          margin: 0 0 6px;
          font-weight: 900;
          color: #241438;
        }

        .level-panel span {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .journey-card {
          height: 100%;
          padding: 24px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(111, 66, 193, 0.13);
          box-shadow: 0 18px 50px rgba(55, 35, 95, 0.1);
          backdrop-filter: blur(14px);
          display: grid;
          gap: 14px;
          align-content: center;
        }

        .journey-kicker {
          margin: 0 0 4px;
          color: #6f42c1;
          font-weight: 900;
        }

        .journey-step {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 14px;
          padding: 16px;
          border-radius: 22px;
          background: #ffffff;
          border: 1px solid rgba(111, 66, 193, 0.1);
        }

        .journey-step span {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #efe7ff;
          color: #6f42c1;
          font-weight: 900;
          font-size: 13px;
        }

        .journey-step strong {
          display: block;
          margin-bottom: 4px;
          color: #241438;
        }

        .journey-step p {
          margin: 0;
          color: var(--muted);
          line-height: 1.5;
          font-size: 14px;
        }

        .pathway-section {
          margin-top: 34px;
          padding: 26px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.64);
          border: 1px solid rgba(111, 66, 193, 0.1);
        }

        .pathway-head {
          display: grid;
          grid-template-columns: 1fr 0.75fr;
          gap: 22px;
          align-items: end;
          margin-bottom: 18px;
        }

        .pathway-copy {
          line-height: 1.65;
        }

        .pathway-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .pathway-card {
          text-align: left;
          cursor: pointer;
          padding: 18px;
          min-height: 150px;
          border-radius: 26px;
          background: #ffffff;
          border: 1px solid rgba(111, 66, 193, 0.12);
          box-shadow: 0 12px 34px rgba(55, 35, 95, 0.07);
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease;
        }

        .pathway-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 44px rgba(55, 35, 95, 0.11);
        }

        .pathway-card.active {
          background:
            radial-gradient(circle at top right, rgba(255, 255, 255, 0.28), transparent 35%),
            linear-gradient(135deg, #6f42c1, #8a5cf6);
          border-color: rgba(111, 66, 193, 0.45);
          color: #ffffff;
        }

        .pathway-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          border-radius: 50%;
          background: #f3effb;
          font-size: 22px;
        }

        .pathway-card.active .pathway-icon {
          background: rgba(255, 255, 255, 0.18);
        }

        .pathway-card strong {
          display: block;
          margin-bottom: 6px;
          font-size: 16px;
        }

        .pathway-card small {
          display: block;
          color: var(--muted);
          line-height: 1.5;
          font-weight: 600;
        }

        .pathway-card.active small {
          color: rgba(255, 255, 255, 0.84);
        }

        .subjects-list-section {
          margin-top: 38px;
        }

        .list-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 20px;
          margin-bottom: 20px;
        }

        .compact-action {
          white-space: nowrap;
        }

        @media (max-width: 1000px) {
          .subjects-hero {
            grid-template-columns: 1fr;
          }

          .pathway-head {
            grid-template-columns: 1fr;
          }

          .pathway-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .subjects-hero {
            padding: 28px 20px;
            border-radius: 28px;
          }

          .hero-title {
            font-size: 42px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .hero-actions a {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          .student-summary {
            grid-template-columns: 1fr;
          }

          .pathway-section {
            padding: 20px;
            border-radius: 26px;
          }

          .pathway-grid {
            grid-template-columns: 1fr;
          }

          .pathway-card {
            min-height: auto;
          }

          .list-head {
            display: block;
          }

          .compact-action {
            width: 100%;
            justify-content: center;
            margin-top: 14px;
          }
        }
      `}</style>
    </main>
  )
}

function CatalogueGrid({
  subjects,
  personalised,
  isLoggedIn,
  studentId,
  categoryLabel,
}: {
  subjects: typeof catalogueSubjects
  personalised: boolean
  isLoggedIn: boolean
  studentId: string | null
  categoryLabel: (category?: string | null) => string
}) {
  return (
    <div className="subject-grid">
      {subjects.map((subject) => {
        const subjectSlug = subject.name.toLowerCase()

        return (
          <div key={subject.name} className="subject-card">
            <div>
              <div className="subject-topline">
                <span>{categoryLabel(subject.category)}</span>
              </div>

              <h2>{subject.name}</h2>

              <p className="subject-benefit">{subject.benefit}</p>

              <div className="subject-panel">
                <p>Learning focus</p>
                <span>{subject.taught}</span>
              </div>

              <div className="subject-panel">
                <p>Expected progress</p>
                <span>{subject.childImprovement}</span>
              </div>
            </div>

            <div className="subject-actions">
              {!isLoggedIn ? (
                <>
                  <Link href="/signup/parent" className="btn-secondary">
                    Create Profile
                  </Link>
                  <Link href="/pricing" className="btn-primary">
                    View Learning Plans
                  </Link>
                </>
              ) : personalised && studentId ? (
                <Link
                  href={`/pricing?studentId=${studentId}&subjectId=${subjectSlug}`}
                  className="btn-primary"
                >
                  Continue to Learning Plans
                </Link>
              ) : (
                <>
                  <Link href="/parent/students" className="btn-primary">
                    Start Learning Plan
                  </Link>
                  <Link href="/pricing" className="btn-secondary">
                    View Plans
                  </Link>
                </>
              )}
            </div>
          </div>
        )
      })}

      <style jsx>{`
        .subject-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .subject-card {
          min-height: 430px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px;
          border-radius: 30px;
          background:
            radial-gradient(circle at top right, rgba(138, 92, 246, 0.08), transparent 32%),
            #ffffff;
          border: 1px solid rgba(111, 66, 193, 0.1);
          box-shadow: 0 18px 52px rgba(55, 35, 95, 0.08);
        }

        .subject-topline span {
          display: inline-flex;
          padding: 8px 12px;
          border-radius: 999px;
          background: #f3effb;
          color: #6f42c1;
          font-weight: 900;
          font-size: 13px;
          margin-bottom: 14px;
        }

        .subject-card h2 {
          margin: 0 0 10px;
          font-size: 29px;
          letter-spacing: -0.03em;
          color: #241438;
        }

        .subject-benefit {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .subject-panel {
          margin-top: 16px;
          padding: 16px;
          border-radius: 22px;
          background: rgba(250, 248, 255, 0.94);
          border: 1px solid rgba(111, 66, 193, 0.09);
        }

        .subject-panel p {
          margin: 0 0 8px;
          font-weight: 900;
          color: #241438;
        }

        .subject-panel span {
          display: block;
          color: var(--muted);
          line-height: 1.6;
        }

        .subject-actions {
          display: flex;
          gap: 12px;
          margin-top: 22px;
          flex-wrap: wrap;
        }

        @media (max-width: 1000px) {
          .subject-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .subject-grid {
            grid-template-columns: 1fr;
          }

          .subject-card {
            min-height: auto;
            padding: 22px;
          }

          .subject-actions {
            flex-direction: column;
          }

          .subject-actions a {
            width: 100%;
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}

function ProgramGrid({
  programs,
  personalised,
  studentId,
  isLoggedIn,
  categoryLabel,
}: {
  programs: SubjectProgram[]
  personalised: boolean
  studentId: string | null
  isLoggedIn: boolean
  categoryLabel: (category?: string | null) => string
}) {
  return (
    <div className="program-grid">
      {programs.map((program) => (
        <div key={program.id} className="program-card">
          <div>
            <div className="program-topline">
              <span>{categoryLabel(program.subjects?.category)}</span>
            </div>

            <h2>{program.subjects?.name || program.title}</h2>

            {!personalised && program.learning_levels ? (
              <p className="program-level">{program.learning_levels.name}</p>
            ) : null}

            <p className="program-description">
              {program.description || program.title}
            </p>

            <div className="program-panel">
              <p>Learning focus</p>
              <span>
                {program.what_will_be_taught || 'Structured learning support.'}
              </span>
            </div>

            <div className="program-panel">
              <p>Expected progress</p>
              <span>
                {program.learning_outcomes ||
                  'Improved confidence, stronger understanding, better study habits, and clearer progress over time.'}
              </span>
            </div>
          </div>

          <div className="program-actions">
            {!isLoggedIn ? (
              <Link href="/signup/parent" className="btn-primary">
                Create Parent Profile
              </Link>
            ) : personalised && studentId ? (
              <Link
                href={`/pricing?studentId=${studentId}&subjectId=${program.subject_id}&programId=${program.id}`}
                className="btn-primary"
              >
                Continue to Learning Plans
              </Link>
            ) : (
              <Link href="/parent/students" className="btn-primary">
                Start Learning Plan
              </Link>
            )}
          </div>
        </div>
      ))}

      <style jsx>{`
        .program-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .program-card {
          min-height: 450px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px;
          border-radius: 30px;
          background:
            radial-gradient(circle at top right, rgba(138, 92, 246, 0.08), transparent 32%),
            #ffffff;
          border: 1px solid rgba(111, 66, 193, 0.1);
          box-shadow: 0 18px 52px rgba(55, 35, 95, 0.08);
        }

        .program-topline span {
          display: inline-flex;
          padding: 8px 12px;
          border-radius: 999px;
          background: #f3effb;
          color: #6f42c1;
          font-weight: 900;
          font-size: 13px;
          margin-bottom: 14px;
        }

        .program-card h2 {
          margin: 0 0 10px;
          font-size: 28px;
          letter-spacing: -0.03em;
          color: #241438;
        }

        .program-level {
          margin: 0 0 12px;
          font-weight: 900;
          color: #6f42c1;
        }

        .program-description {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .program-panel {
          margin-top: 16px;
          padding: 16px;
          border-radius: 22px;
          background: rgba(250, 248, 255, 0.94);
          border: 1px solid rgba(111, 66, 193, 0.09);
        }

        .program-panel p {
          margin: 0 0 8px;
          font-weight: 900;
          color: #241438;
        }

        .program-panel span {
          display: block;
          color: var(--muted);
          line-height: 1.6;
        }

        .program-actions {
          display: flex;
          gap: 12px;
          margin-top: 22px;
          flex-wrap: wrap;
        }

        @media (max-width: 1000px) {
          .program-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .program-grid {
            grid-template-columns: 1fr;
          }

          .program-card {
            min-height: auto;
            padding: 22px;
          }

          .program-actions a {
            width: 100%;
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}

function getCategoryIcon(category: string) {
  const normalised = category.toLowerCase()

  if (normalised === 'academic') return '📚'
  if (normalised === 'skill') return '🎨'
  if (normalised === 'language') return '🌍'

  return '✨'
}