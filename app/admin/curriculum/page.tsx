'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

type Lesson = {
  id: string
  title: string
  objective: string | null
  homework_hint: string | null
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
  active: boolean
  curriculum_strands: Strand[]
}

export default function AdminCurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')

  useEffect(() => {
    loadCurriculum()
  }, [])

  async function loadCurriculum() {
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase.from('curriculum_subjects').select(`
      id,
      name,
      active,
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
            homework_hint,
            sort_order
          )
        )
      )
    `)

    if (error) {
      setErrorMsg(error.message)
      setSubjects([])
    } else {
      setSubjects((data || []) as unknown as Subject[])
    }

    setLoading(false)
  }

  const sortedSubjects = useMemo(() => {
    const list = [...subjects].sort((a, b) => a.name.localeCompare(b.name))
    if (selectedSubject === 'All') return list
    return list.filter((s) => s.name === selectedSubject)
  }, [subjects, selectedSubject])

  const totals = useMemo(() => {
    let strands = 0
    let modules = 0
    let lessons = 0

    subjects.forEach((subject) => {
      strands += subject.curriculum_strands?.length || 0
      subject.curriculum_strands?.forEach((strand) => {
        modules += strand.curriculum_modules?.length || 0
        strand.curriculum_modules?.forEach((module) => {
          lessons += module.curriculum_lessons?.length || 0
        })
      })
    })

    return { subjects: subjects.length, strands, modules, lessons }
  }, [subjects])

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>Loading curriculum...</h1>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <Link href="/admin" style={styles.backButton}>
            ← Back to Admin
          </Link>

          <button onClick={loadCurriculum} style={styles.refreshButton}>
            Refresh
          </button>
        </div>

        <section style={styles.hero}>
          <div>
            <p style={styles.kicker}>Fountain Prep Curriculum Control</p>
            <h1 style={styles.heroTitle}>Structured learning, consistent tutoring.</h1>
            <p style={styles.heroText}>
              Manage subjects, stages, strands, modules and lessons in one premium
              curriculum control centre.
            </p>
          </div>

          <div style={styles.statsGrid}>
            <StatCard label="Subjects" value={totals.subjects} />
            <StatCard label="Strands" value={totals.strands} />
            <StatCard label="Modules" value={totals.modules} />
            <StatCard label="Lessons" value={totals.lessons} />
          </div>
        </section>

        {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}

        <section style={styles.filterCard}>
          {['All', ...subjects.map((s) => s.name)].map((name) => (
            <button
              key={name}
              onClick={() => setSelectedSubject(name)}
              style={{
                ...styles.filterButton,
                ...(selectedSubject === name ? styles.filterButtonActive : {}),
              }}
            >
              {name}
            </button>
          ))}
        </section>

        <div style={styles.subjectGrid}>
          {sortedSubjects.map((subject) => {
            const strands = [...(subject.curriculum_strands || [])].sort(
              (a, b) =>
                (a.curriculum_stages?.sort_order || 0) -
                  (b.curriculum_stages?.sort_order || 0) ||
                (a.sort_order || 0) - (b.sort_order || 0)
            )

            return (
              <section key={subject.id} style={styles.subjectCard}>
                <div style={styles.subjectHeader}>
                  <div>
                    <p style={styles.smallLabel}>Subject</p>
                    <h2 style={styles.subjectTitle}>{subject.name}</h2>
                    <p style={styles.mutedText}>
                      {subject.active ? 'Active curriculum' : 'Inactive curriculum'}
                    </p>
                  </div>

                  <div style={styles.countBox}>
                    <strong>{strands.length}</strong>
                    <span>Strands</span>
                  </div>
                </div>

                {strands.length === 0 ? (
                  <p style={styles.emptyBox}>No strands added yet.</p>
                ) : (
                  <div style={styles.strandsGrid}>
                    {strands.map((strand) => {
                      const modules = [...(strand.curriculum_modules || [])].sort(
                        (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
                      )

                      return (
                        <div key={strand.id} style={styles.strandCard}>
                          <span style={styles.stagePill}>
                            {strand.curriculum_stages?.name || 'No stage'}
                          </span>

                          <h3 style={styles.strandTitle}>{strand.title}</h3>

                          <div style={styles.moduleList}>
                            {modules.length === 0 ? (
                              <p style={styles.emptyBox}>No modules added yet.</p>
                            ) : (
                              modules.map((module) => {
                                const lessons = [
                                  ...(module.curriculum_lessons || []),
                                ].sort(
                                  (a, b) =>
                                    (a.sort_order || 0) - (b.sort_order || 0)
                                )

                                return (
                                  <details key={module.id} style={styles.moduleCard}>
                                    <summary style={styles.moduleSummary}>
                                      <div>
                                        <strong>{module.title}</strong>
                                        <p>{lessons.length} lessons</p>
                                      </div>
                                      <span>View</span>
                                    </summary>

                                    <div style={styles.lessonList}>
                                      {lessons.map((lesson, index) => (
                                        <div key={lesson.id} style={styles.lessonCard}>
                                          <div style={styles.lessonNumber}>
                                            {index + 1}
                                          </div>

                                          <div>
                                            <h4 style={styles.lessonTitle}>
                                              {lesson.title}
                                            </h4>

                                            {lesson.objective && (
                                              <p style={styles.lessonText}>
                                                {lesson.objective}
                                              </p>
                                            )}

                                            {lesson.homework_hint && (
                                              <p style={styles.homeworkBox}>
                                                Homework: {lesson.homework_hint}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </details>
                                )
                              })
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={styles.statCard}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg, #f7f0ff 0%, #ffffff 45%, #eef6ff 100%)',
    padding: '32px 20px',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  container: {
    maxWidth: 1280,
    margin: '0 auto',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  backButton: {
    background: '#ffffff',
    border: '1px solid #eadcff',
    color: '#241136',
    padding: '11px 18px',
    borderRadius: 999,
    textDecoration: 'none',
    fontWeight: 800,
    boxShadow: '0 10px 30px rgba(91, 33, 182, 0.08)',
  },
  refreshButton: {
    background: '#111827',
    color: '#ffffff',
    border: 0,
    padding: '11px 22px',
    borderRadius: 999,
    fontWeight: 800,
    cursor: 'pointer',
  },
  hero: {
    background:
      'radial-gradient(circle at top right, rgba(147,51,234,.45), transparent 28%), linear-gradient(135deg, #12051f, #1e1033 55%, #101827)',
    color: '#ffffff',
    padding: 36,
    borderRadius: 34,
    boxShadow: '0 24px 70px rgba(45, 18, 86, 0.25)',
  },
  kicker: {
    color: '#d8b4fe',
    fontWeight: 900,
    letterSpacing: '.08em',
    textTransform: 'uppercase',
    fontSize: 13,
    margin: 0,
  },
  heroTitle: {
    fontSize: 'clamp(32px, 5vw, 58px)',
    lineHeight: 1,
    margin: '12px 0 0',
    letterSpacing: '-0.04em',
    fontWeight: 950,
  },
  heroText: {
    color: '#d1d5db',
    maxWidth: 720,
    fontSize: 16,
    lineHeight: 1.7,
    marginTop: 18,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16,
    marginTop: 32,
  },
  statCard: {
    background: 'rgba(255,255,255,.12)',
    border: '1px solid rgba(255,255,255,.15)',
    borderRadius: 24,
    padding: 22,
    backdropFilter: 'blur(12px)',
  },
  filterCard: {
    marginTop: 24,
    background: 'rgba(255,255,255,.85)',
    border: '1px solid rgba(255,255,255,.9)',
    borderRadius: 28,
    padding: 14,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    boxShadow: '0 20px 50px rgba(15,23,42,.08)',
  },
  filterButton: {
    border: 0,
    padding: '10px 16px',
    borderRadius: 999,
    background: '#f1f5f9',
    color: '#334155',
    fontWeight: 850,
    cursor: 'pointer',
  },
  filterButtonActive: {
    background: '#7c3aed',
    color: '#ffffff',
    boxShadow: '0 12px 26px rgba(124,58,237,.25)',
  },
  subjectGrid: {
    marginTop: 28,
    display: 'grid',
    gap: 28,
  },
  subjectCard: {
    background: '#ffffff',
    borderRadius: 34,
    overflow: 'hidden',
    border: '1px solid #f1f5f9',
    boxShadow: '0 24px 60px rgba(15,23,42,.08)',
  },
  subjectHeader: {
    background: 'linear-gradient(135deg, #faf5ff, #eff6ff)',
    padding: 28,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'center',
    borderBottom: '1px solid #eef2ff',
  },
  smallLabel: {
    margin: 0,
    color: '#7c3aed',
    fontWeight: 950,
    fontSize: 12,
    letterSpacing: '.16em',
    textTransform: 'uppercase',
  },
  subjectTitle: {
    margin: '5px 0 0',
    fontSize: 34,
    fontWeight: 950,
    letterSpacing: '-0.04em',
    color: '#0f172a',
  },
  mutedText: {
    color: '#64748b',
    margin: '6px 0 0',
    fontSize: 14,
  },
  countBox: {
    background: '#ffffff',
    borderRadius: 22,
    padding: '16px 20px',
    minWidth: 110,
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(15,23,42,.08)',
  },
  strandsGrid: {
    padding: 24,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: 20,
  },
  strandCard: {
    background: '#f8fafc',
    borderRadius: 28,
    padding: 20,
    border: '1px solid #e2e8f0',
  },
  stagePill: {
    display: 'inline-block',
    background: '#ede9fe',
    color: '#6d28d9',
    padding: '7px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
  },
  strandTitle: {
    fontSize: 22,
    margin: '14px 0',
    color: '#0f172a',
    fontWeight: 950,
  },
  moduleList: {
    display: 'grid',
    gap: 12,
  },
  moduleCard: {
    background: '#ffffff',
    borderRadius: 22,
    padding: 16,
    border: '1px solid #e5e7eb',
    boxShadow: '0 10px 25px rgba(15,23,42,.05)',
  },
  moduleSummary: {
    listStyle: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
    color: '#0f172a',
  },
  lessonList: {
    marginTop: 16,
    display: 'grid',
    gap: 10,
  },
  lessonCard: {
    display: 'flex',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
    border: '1px solid #eef2f7',
  },
  lessonNumber: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: '#7c3aed',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 950,
    flexShrink: 0,
  },
  lessonTitle: {
    margin: 0,
    fontSize: 15,
    color: '#0f172a',
    fontWeight: 900,
  },
  lessonText: {
    margin: '5px 0 0',
    color: '#475569',
    fontSize: 14,
    lineHeight: 1.55,
  },
  homeworkBox: {
    margin: '10px 0 0',
    background: '#faf5ff',
    color: '#6d28d9',
    padding: '10px 12px',
    borderRadius: 14,
    fontSize: 13,
    fontWeight: 700,
  },
  emptyBox: {
    background: '#ffffff',
    borderRadius: 18,
    padding: 16,
    color: '#64748b',
  },
  errorBox: {
    marginTop: 20,
    background: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    padding: 16,
    borderRadius: 20,
    fontWeight: 700,
  },
}