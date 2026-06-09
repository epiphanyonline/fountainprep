'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { supabase } from '../../lib/supabase'

type Stage = { id: string; name: string; sort_order: number | null }
type Lesson = { id: string; title: string; objective: string | null; homework_hint: string | null; sort_order: number | null }
type Module = { id: string; title: string; sort_order: number | null; curriculum_lessons: Lesson[] }
type Strand = { id: string; title: string; sort_order: number | null; curriculum_stages: Stage | null; curriculum_modules: Module[] }
type Subject = { id: string; name: string; active: boolean; curriculum_strands: Strand[] }

export default function AdminCurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')

  const [newSubject, setNewSubject] = useState('')
  const [strandForm, setStrandForm] = useState({ subject_id: '', stage_id: '', title: '', sort_order: 1 })
  const [moduleForm, setModuleForm] = useState({ strand_id: '', title: '', sort_order: 1 })
  const [lessonForm, setLessonForm] = useState({ module_id: '', title: '', objective: '', homework_hint: '', sort_order: 1 })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    const { data: stageData } = await supabase
      .from('curriculum_stages')
      .select('id,name,sort_order')
      .order('sort_order')

    const { data } = await supabase
      .from('curriculum_subjects')
      .select(`
        id,
        name,
        active,
        curriculum_strands (
          id,
          title,
          sort_order,
          curriculum_stages (id,name,sort_order),
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

    setStages((stageData || []) as Stage[])
    setSubjects((data || []) as unknown as Subject[])
    setLoading(false)
  }

  const allStrands = useMemo(() => {
    return subjects.flatMap((s) =>
      (s.curriculum_strands || []).map((st) => ({
        ...st,
        subject_name: s.name,
      }))
    )
  }, [subjects])

  const allModules = useMemo(() => {
    return subjects.flatMap((s) =>
      (s.curriculum_strands || []).flatMap((st) =>
        (st.curriculum_modules || []).map((m) => ({
          ...m,
          subject_name: s.name,
          strand_title: st.title,
          stage_name: st.curriculum_stages?.name || '',
        }))
      )
    )
  }, [subjects])

  const filteredSubjects = useMemo(() => {
    const sorted = [...subjects].sort((a, b) => a.name.localeCompare(b.name))
    if (selectedSubject === 'All') return sorted
    return sorted.filter((s) => s.name === selectedSubject)
  }, [subjects, selectedSubject])

  async function addSubject() {
    if (!newSubject.trim()) return
    const { error } = await supabase
      .from('curriculum_subjects')
      .insert({ name: newSubject.trim(), active: true })

    if (error) setMessage(error.message)
    else {
      setMessage('Subject added successfully.')
      setNewSubject('')
      loadData()
    }
  }

  async function addStrand() {
    if (!strandForm.subject_id || !strandForm.stage_id || !strandForm.title.trim()) return

    const { error } = await supabase.from('curriculum_strands').insert({
      subject_id: strandForm.subject_id,
      stage_id: strandForm.stage_id,
      title: strandForm.title.trim(),
      sort_order: strandForm.sort_order,
    })

    if (error) setMessage(error.message)
    else {
      setMessage('Strand added successfully.')
      setStrandForm({ subject_id: '', stage_id: '', title: '', sort_order: 1 })
      loadData()
    }
  }

  async function addModule() {
    if (!moduleForm.strand_id || !moduleForm.title.trim()) return

    const { error } = await supabase.from('curriculum_modules').insert({
      strand_id: moduleForm.strand_id,
      title: moduleForm.title.trim(),
      sort_order: moduleForm.sort_order,
    })

    if (error) setMessage(error.message)
    else {
      setMessage('Module added successfully.')
      setModuleForm({ strand_id: '', title: '', sort_order: 1 })
      loadData()
    }
  }

  async function addLesson() {
    if (!lessonForm.module_id || !lessonForm.title.trim()) return

    const { error } = await supabase.from('curriculum_lessons').insert({
      module_id: lessonForm.module_id,
      title: lessonForm.title.trim(),
      objective: lessonForm.objective.trim() || null,
      homework_hint: lessonForm.homework_hint.trim() || null,
      sort_order: lessonForm.sort_order,
    })

    if (error) setMessage(error.message)
    else {
      setMessage('Lesson added successfully.')
      setLessonForm({ module_id: '', title: '', objective: '', homework_hint: '', sort_order: 1 })
      loadData()
    }
  }

  if (loading) {
    return <main style={styles.page}><div style={styles.container}>Loading...</div></main>
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <Link href="/admin" style={styles.backButton}>← Back to Admin</Link>
          <button onClick={loadData} style={styles.refreshButton}>Refresh</button>
        </div>

        <section style={styles.hero}>
          <p style={styles.kicker}>Fountain Prep Admin</p>
          <h1 style={styles.heroTitle}>Curriculum Editor</h1>
          <p style={styles.heroText}>
            Add subjects, stages, strands, modules and lessons without using SQL.
          </p>
        </section>

        {message && <div style={styles.messageBox}>{message}</div>}

        <section style={styles.editorGrid}>
          <EditorCard title="Add Subject">
            <input style={styles.input} placeholder="e.g. French" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
            <button style={styles.primaryButton} onClick={addSubject}>Add Subject</button>
          </EditorCard>

          <EditorCard title="Add Strand">
            <select style={styles.input} value={strandForm.subject_id} onChange={(e) => setStrandForm({ ...strandForm, subject_id: e.target.value })}>
              <option value="">Select subject</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <select style={styles.input} value={strandForm.stage_id} onChange={(e) => setStrandForm({ ...strandForm, stage_id: e.target.value })}>
              <option value="">Select stage</option>
              {stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <input style={styles.input} placeholder="Strand title" value={strandForm.title} onChange={(e) => setStrandForm({ ...strandForm, title: e.target.value })} />
            <input style={styles.input} type="number" value={strandForm.sort_order} onChange={(e) => setStrandForm({ ...strandForm, sort_order: Number(e.target.value) })} />
            <button style={styles.primaryButton} onClick={addStrand}>Add Strand</button>
          </EditorCard>

          <EditorCard title="Add Module">
            <select style={styles.input} value={moduleForm.strand_id} onChange={(e) => setModuleForm({ ...moduleForm, strand_id: e.target.value })}>
              <option value="">Select strand</option>
              {allStrands.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.subject_name} / {s.curriculum_stages?.name} / {s.title}
                </option>
              ))}
            </select>

            <input style={styles.input} placeholder="Module title" value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} />
            <input style={styles.input} type="number" value={moduleForm.sort_order} onChange={(e) => setModuleForm({ ...moduleForm, sort_order: Number(e.target.value) })} />
            <button style={styles.primaryButton} onClick={addModule}>Add Module</button>
          </EditorCard>

          <EditorCard title="Add Lesson">
            <select style={styles.input} value={lessonForm.module_id} onChange={(e) => setLessonForm({ ...lessonForm, module_id: e.target.value })}>
              <option value="">Select module</option>
              {allModules.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.subject_name} / {m.stage_name} / {m.strand_title} / {m.title}
                </option>
              ))}
            </select>

            <input style={styles.input} placeholder="Lesson title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
            <textarea style={styles.textarea} placeholder="Objective" value={lessonForm.objective} onChange={(e) => setLessonForm({ ...lessonForm, objective: e.target.value })} />
            <textarea style={styles.textarea} placeholder="Homework hint" value={lessonForm.homework_hint} onChange={(e) => setLessonForm({ ...lessonForm, homework_hint: e.target.value })} />
            <input style={styles.input} type="number" value={lessonForm.sort_order} onChange={(e) => setLessonForm({ ...lessonForm, sort_order: Number(e.target.value) })} />
            <button style={styles.primaryButton} onClick={addLesson}>Add Lesson</button>
          </EditorCard>
        </section>

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
          {filteredSubjects.map((subject) => {
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
                  </div>
                  <div style={styles.countBox}>
                    <strong>{strands.length}</strong>
                    <span>Strands</span>
                  </div>
                </div>

                <div style={styles.strandsGrid}>
                  {strands.map((strand) => {
                    const modules = [...(strand.curriculum_modules || [])].sort(
                      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
                    )

                    return (
                      <div key={strand.id} style={styles.strandCard}>
                        <span style={styles.stagePill}>{strand.curriculum_stages?.name}</span>
                        <h3 style={styles.strandTitle}>{strand.title}</h3>

                        <div style={styles.moduleList}>
                          {modules.map((module) => {
                            const lessons = [...(module.curriculum_lessons || [])].sort(
                              (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
                            )

                            return (
                              <details key={module.id} style={styles.moduleCard}>
                                <summary style={styles.moduleSummary}>
                                  <strong>{module.title}</strong>
                                  <span>{lessons.length} lessons</span>
                                </summary>

                                <div style={styles.lessonList}>
                                  {lessons.map((lesson, index) => (
                                    <div key={lesson.id} style={styles.lessonCard}>
                                      <div style={styles.lessonNumber}>{index + 1}</div>
                                      <div>
                                        <h4 style={styles.lessonTitle}>{lesson.title}</h4>
                                        {lesson.objective && <p style={styles.lessonText}>{lesson.objective}</p>}
                                        {lesson.homework_hint && <p style={styles.homeworkBox}>Homework: {lesson.homework_hint}</p>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}

function EditorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={styles.editorCard}>
      <h3 style={styles.editorTitle}>{title}</h3>
      <div style={styles.formStack}>{children}</div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg,#f7f0ff,#fff,#eef6ff)', padding: 24 },
  container: { maxWidth: 1280, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' },
  topBar: { display: 'flex', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { background: '#fff', padding: '11px 18px', borderRadius: 999, textDecoration: 'none', fontWeight: 800, color: '#111827' },
  refreshButton: { background: '#111827', color: '#fff', border: 0, padding: '11px 22px', borderRadius: 999, fontWeight: 800 },
  hero: { background: 'linear-gradient(135deg,#170928,#291349,#111827)', color: '#fff', padding: 34, borderRadius: 34, boxShadow: '0 24px 70px rgba(45,18,86,.25)' },
  kicker: { color: '#d8b4fe', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em' },
  heroTitle: { fontSize: 48, margin: 0, fontWeight: 950, letterSpacing: '-.04em' },
  heroText: { color: '#d1d5db', maxWidth: 700 },
  messageBox: { marginTop: 18, background: '#ecfdf5', color: '#047857', padding: 14, borderRadius: 18, fontWeight: 800 },
  editorGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18, marginTop: 24 },
  editorCard: { background: '#fff', borderRadius: 26, padding: 20, boxShadow: '0 18px 50px rgba(15,23,42,.08)' },
  editorTitle: { margin: 0, fontSize: 20, fontWeight: 950 },
  formStack: { display: 'grid', gap: 10, marginTop: 14 },
  input: { width: '100%', padding: 12, borderRadius: 14, border: '1px solid #e5e7eb', fontWeight: 700 },
  textarea: { width: '100%', padding: 12, borderRadius: 14, border: '1px solid #e5e7eb', minHeight: 80, fontWeight: 700 },
  primaryButton: { background: '#7c3aed', color: '#fff', border: 0, padding: 12, borderRadius: 16, fontWeight: 900 },
  filterCard: { marginTop: 24, background: '#fff', borderRadius: 26, padding: 14, display: 'flex', flexWrap: 'wrap', gap: 10 },
  filterButton: { border: 0, padding: '10px 16px', borderRadius: 999, background: '#f1f5f9', fontWeight: 850 },
  filterButtonActive: { background: '#7c3aed', color: '#fff' },
  subjectGrid: { marginTop: 26, display: 'grid', gap: 26 },
  subjectCard: { background: '#fff', borderRadius: 34, overflow: 'hidden', boxShadow: '0 24px 60px rgba(15,23,42,.08)' },
  subjectHeader: { background: 'linear-gradient(135deg,#faf5ff,#eff6ff)', padding: 26, display: 'flex', justifyContent: 'space-between' },
  smallLabel: { color: '#7c3aed', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '.16em' },
  subjectTitle: { fontSize: 34, margin: 0, fontWeight: 950 },
  countBox: { background: '#fff', borderRadius: 22, padding: 16, textAlign: 'center' },
  strandsGrid: { padding: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 18 },
  strandCard: { background: '#f8fafc', borderRadius: 26, padding: 18, border: '1px solid #e2e8f0' },
  stagePill: { background: '#ede9fe', color: '#6d28d9', padding: '7px 12px', borderRadius: 999, fontWeight: 900 },
  strandTitle: { fontSize: 21, fontWeight: 950 },
  moduleList: { display: 'grid', gap: 10 },
  moduleCard: { background: '#fff', borderRadius: 20, padding: 14, border: '1px solid #e5e7eb' },
  moduleSummary: { cursor: 'pointer', display: 'flex', justifyContent: 'space-between', gap: 12 },
  lessonList: { marginTop: 14, display: 'grid', gap: 10 },
  lessonCard: { display: 'flex', gap: 12, background: '#f8fafc', padding: 12, borderRadius: 16 },
  lessonNumber: { width: 32, height: 32, borderRadius: 999, background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, flexShrink: 0 },
  lessonTitle: { margin: 0, fontWeight: 900 },
  lessonText: { margin: '5px 0 0', color: '#475569' },
  homeworkBox: { background: '#faf5ff', color: '#6d28d9', padding: 10, borderRadius: 12 },
}