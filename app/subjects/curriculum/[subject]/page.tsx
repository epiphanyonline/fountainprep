'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

type Lesson = {
  id: string
  title: string
  objective: string | null
  sort_order: number | null
}

type Module = {
  id: string
  title: string
  sort_order: number | null
  curriculum_lessons: Lesson[]
}

type Strand = {
  id: string
  title: string
  sort_order: number | null
  curriculum_stages: {
    name: string
    sort_order: number | null
  } | null
  curriculum_modules: Module[]
}

type Subject = {
  id: string
  name: string
  curriculum_strands: Strand[]
}

function titleFromSlug(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function SubjectCurriculumPage() {
  return (
    <Suspense fallback={<main style={styles.page}>Loading curriculum...</main>}>
      <SubjectCurriculumContent />
    </Suspense>
  )
}

function SubjectCurriculumContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId') || ''

  const slug = String(params.subject || '')
  const subjectName = titleFromSlug(slug)

  const [subject, setSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCurriculum()
  }, [slug])

  async function loadCurriculum() {
    setLoading(true)

    const { data } = await supabase
      .from('curriculum_subjects')
      .select(`
        id,
        name,
        curriculum_strands (
          id,
          title,
          sort_order,
          curriculum_stages (
            name,
            sort_order
          ),
          curriculum_modules (
            id,
            title,
            sort_order,
            curriculum_lessons (
              id,
              title,
              objective,
              sort_order
            )
          )
        )
      `)
      .ilike('name', subjectName)
      .single()

    setSubject((data || null) as unknown as Subject)
    setLoading(false)
  }

  const totals = useMemo(() => {
    let modules = 0
    let lessons = 0

    subject?.curriculum_strands?.forEach((strand) => {
      modules += strand.curriculum_modules?.length || 0
      strand.curriculum_modules?.forEach((module) => {
        lessons += module.curriculum_lessons?.length || 0
      })
    })

    return {
      strands: subject?.curriculum_strands?.length || 0,
      modules,
      lessons,
    }
  }, [subject])

  const strands = useMemo(() => {
    return [...(subject?.curriculum_strands || [])].sort(
      (a, b) =>
        (a.curriculum_stages?.sort_order || 0) -
          (b.curriculum_stages?.sort_order || 0) ||
        (a.sort_order || 0) - (b.sort_order || 0)
    )
  }, [subject])

  if (loading) {
    return <main style={styles.page}>Loading curriculum...</main>
  }

  if (!subject) {
    return (
      <main style={styles.page}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Curriculum not found</h1>
          <Link href={`/subjects${studentId ? `?studentId=${studentId}` : ''}`} style={styles.button}>
            Back to Subjects
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>Fountain Prep Curriculum</p>
        <h1 style={styles.title}>{subject.name} Curriculum</h1>
        <p style={styles.subtitle}>
          A structured learning pathway with clear progression, tutor consistency and parent visibility.
        </p>

        <div style={styles.stats}>
          <Stat label="Learning Strands" value={totals.strands} />
          <Stat label="Modules" value={totals.modules} />
          <Stat label="Lessons" value={totals.lessons} />
        </div>

        <div style={styles.actions}>
          <Link href={`/subjects${studentId ? `?studentId=${studentId}` : ''}`} style={styles.secondary}>
            Back to Subjects
          </Link>
          <Link href={`/pricing${studentId ? `?studentId=${studentId}&subject=${subject.id}` : `?subject=${subject.id}`}`} style={styles.button}>
            Choose Learning Plan
          </Link>
        </div>
      </section>

      <section style={styles.grid}>
        {strands.map((strand) => {
          const modules = [...(strand.curriculum_modules || [])].sort(
            (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
          )

          return (
            <div key={strand.id} style={styles.card}>
              <span style={styles.stage}>{strand.curriculum_stages?.name}</span>
              <h2 style={styles.cardTitle}>{strand.title}</h2>

              <div style={styles.modules}>
                {modules.map((module) => {
                  const lessons = [...(module.curriculum_lessons || [])].sort(
                    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
                  )

                  return (
                    <details key={module.id} style={styles.module}>
                      <summary style={styles.summary}>
                        <strong>{module.title}</strong>
                        <span>{lessons.length} lessons</span>
                      </summary>

                      <div style={styles.lessonList}>
                        {lessons.slice(0, 8).map((lesson, index) => (
                          <div key={lesson.id} style={styles.lesson}>
                            <span style={styles.lessonNo}>{index + 1}</span>
                            <div>
                              <strong>{lesson.title}</strong>
                              {lesson.objective && <p>{lesson.objective}</p>}
                            </div>
                          </div>
                        ))}

                        {lessons.length > 8 && (
                          <p style={styles.more}>+ {lessons.length - 8} more lessons in this module</p>
                        )}
                      </div>
                    </details>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={styles.stat}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#f7f0ff,#fff,#eef6ff)',
    padding: '36px 20px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  hero: {
    maxWidth: 1100,
    margin: '0 auto',
    borderRadius: 34,
    padding: 34,
    background: 'linear-gradient(135deg,#170928,#291349,#111827)',
    color: '#fff',
    boxShadow: '0 24px 70px rgba(45,18,86,.25)',
  },
  kicker: {
    color: '#d8b4fe',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '.08em',
  },
  title: {
    fontSize: 48,
    lineHeight: 1,
    margin: '10px 0',
    fontWeight: 950,
  },
  subtitle: {
    color: '#d1d5db',
    maxWidth: 720,
    lineHeight: 1.7,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
    gap: 14,
    marginTop: 26,
  },
  stat: {
    background: 'rgba(255,255,255,.12)',
    border: '1px solid rgba(255,255,255,.15)',
    borderRadius: 22,
    padding: 18,
  },
  actions: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 26,
  },
  button: {
    background: '#7c3aed',
    color: '#fff',
    padding: '13px 18px',
    borderRadius: 999,
    textDecoration: 'none',
    fontWeight: 900,
  },
  secondary: {
    background: '#fff',
    color: '#111827',
    padding: '13px 18px',
    borderRadius: 999,
    textDecoration: 'none',
    fontWeight: 900,
  },
  grid: {
    maxWidth: 1100,
    margin: '28px auto 0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
    gap: 18,
  },
  card: {
    background: '#fff',
    borderRadius: 28,
    padding: 22,
    boxShadow: '0 18px 50px rgba(15,23,42,.08)',
  },
  stage: {
    display: 'inline-block',
    background: '#ede9fe',
    color: '#6d28d9',
    padding: '7px 12px',
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: 950,
  },
  modules: {
    display: 'grid',
    gap: 12,
  },
  module: {
    background: '#f8fafc',
    borderRadius: 18,
    padding: 14,
    border: '1px solid #e5e7eb',
  },
  summary: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
    gap: 12,
  },
  lessonList: {
    display: 'grid',
    gap: 10,
    marginTop: 14,
  },
  lesson: {
    display: 'flex',
    gap: 10,
    background: '#fff',
    borderRadius: 14,
    padding: 12,
  },
  lessonNo: {
    width: 28,
    height: 28,
    borderRadius: 999,
    background: '#7c3aed',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    flexShrink: 0,
  },
  more: {
    color: '#6d28d9',
    fontWeight: 800,
  },
}