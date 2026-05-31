'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

type TutorProfile = {
  id: string
  full_name: string
  phone: string | null
  country: string
  timezone: string
  bio: string | null
  years_of_experience: number
  qualification_summary: string | null
  approval_status: string
  verification_status: string
  average_rating: number
  rating_count: number
  is_listed: boolean
}

type LessonBooking = {
  id: string
  student_id: string
  subject_id: string
  plan_id: string
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  meeting_link: string | null
  notes: string | null
  student_profiles: {
    full_name: string
    child_age: number | null
    country_system: string | null
    country_class_label: string | null
  } | null
}

const subjectLabels: Record<string, string> = {
  maths: 'Maths',
  english: 'English',
  science: 'Science',
  coding: 'Coding',
  music: 'Music',
  yoruba: 'Yoruba',
  igbo: 'Igbo',
  hausa: 'Hausa',
}

const planLabels: Record<string, string> = {
  payg: 'Pay As You Go',
  monthly: 'Monthly Plan',
  three_month: '3-Month Plan',
  six_month: '6-Month Plan',
}

export default function TutorDashboardPage() {
  const router = useRouter()

  const [message, setMessage] = useState('Loading...')
  const [profile, setProfile] = useState<TutorProfile | null>(null)
  const [lessons, setLessons] = useState<LessonBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTutorDashboard() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!userProfile || userProfile.role !== 'TUTOR') {
        router.push('/account')
        return
      }

      const { data: tutorProfile, error: tutorError } = await supabase
        .from('tutor_profiles')
        .select(
          'id, full_name, phone, country, timezone, bio, years_of_experience, qualification_summary, approval_status, verification_status, average_rating, rating_count, is_listed'
        )
        .eq('user_id', user.id)
        .maybeSingle()

      if (tutorError) {
        setMessage(tutorError.message)
        setLoading(false)
        return
      }

      if (!tutorProfile) {
        router.push('/tutor/onboarding')
        return
      }

      setProfile(tutorProfile as TutorProfile)

      const today = new Date().toISOString().split('T')[0]

      const { data: bookingRows, error: bookingError } = await supabase
        .from('lesson_bookings')
        .select(`
          id,
          student_id,
          subject_id,
          plan_id,
          lesson_date,
          lesson_time,
          timezone,
          status,
          payment_status,
          amount_gbp,
          meeting_link,
          notes,
          student_profiles (
            full_name,
            child_age,
            country_system,
            country_class_label
          )
        `)
        .eq('tutor_id', tutorProfile.id)
        .gte('lesson_date', today)
        .order('lesson_date', { ascending: true })
        .order('lesson_time', { ascending: true })

      if (bookingError) {
        setMessage(bookingError.message)
        setLoading(false)
        return
      }

      const cleanLessons = ((bookingRows ?? []) as any[]).map((row) => ({
        ...row,
        student_profiles: Array.isArray(row.student_profiles)
          ? row.student_profiles[0] ?? null
          : row.student_profiles ?? null,
      })) as LessonBooking[]

      setLessons(cleanLessons)
      setMessage('')
      setLoading(false)
    }

    loadTutorDashboard()
  }, [router])

  const confirmedLessons = useMemo(() => {
    return lessons.filter(
      (lesson) => lesson.status === 'CONFIRMED' || lesson.payment_status === 'PAID'
    )
  }, [lessons])

  const pendingLessons = useMemo(() => {
    return lessons.filter(
      (lesson) => lesson.payment_status !== 'PAID' && lesson.status !== 'CONFIRMED'
    )
  }, [lessons])

  const todayLessons = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return confirmedLessons.filter((lesson) => lesson.lesson_date === today)
  }, [confirmedLessons])

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.hero}>
          <p style={styles.eyebrow}>Tutor Portal</p>
          <h1 style={styles.title}>Loading dashboard...</h1>
          <p style={styles.subtitle}>{message}</p>
        </section>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroGlow} />

        <p style={styles.eyebrow}>Tutor Portal</p>

        <h1 style={styles.title}>
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>

        <p style={styles.subtitle}>
          Track assigned lessons, join scheduled classes, and manage your availability.
        </p>

        <div style={styles.kpiGrid}>
          <KpiCard label="Today’s Lessons" value={String(todayLessons.length)} />
          <KpiCard label="Upcoming Lessons" value={String(confirmedLessons.length)} />
          <KpiCard label="Pending Payment" value={String(pendingLessons.length)} />
          <KpiCard label="Rating" value={profile ? profile.average_rating.toFixed(1) : '0.0'} />
        </div>

        <div style={styles.actions}>
          <Link href="/tutor/availability" style={styles.primaryLink}>
            Manage Availability
          </Link>

          <Link href="/tutor/sessions" style={styles.secondaryLink}>
            View Sessions
          </Link>

          <Link href="/account" style={styles.secondaryLink}>
            Account
          </Link>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.sectionEyebrow}>Assigned Lessons</p>
          <h2 style={styles.sectionTitle}>Upcoming classes</h2>

          {confirmedLessons.length === 0 ? (
            <EmptyState
              title="No assigned lessons yet"
              text="When parents book and pay for your available slots, lessons will appear here."
            />
          ) : (
            <div style={styles.lessonList}>
              {confirmedLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          )}
        </div>

        <aside style={styles.card}>
          <p style={styles.sectionEyebrow}>Profile Summary</p>

          {message ? <p style={styles.message}>{message}</p> : null}

          {profile ? (
            <div style={styles.profileList}>
              <ProfileRow label="Name" value={profile.full_name} />
              <ProfileRow label="Phone" value={profile.phone ?? '-'} />
              <ProfileRow label="Country" value={profile.country} />
              <ProfileRow label="Timezone" value={profile.timezone} />
              <ProfileRow label="Experience" value={`${profile.years_of_experience} yrs`} />
              <ProfileRow label="Approval" value={profile.approval_status} />
              <ProfileRow label="Verification" value={profile.verification_status} />
              <ProfileRow label="Listed" value={profile.is_listed ? 'Yes' : 'No'} />
            </div>
          ) : null}
        </aside>
      </section>

      <section style={styles.cardWide}>
        <p style={styles.sectionEyebrow}>Pending / Awaiting Payment</p>

        {pendingLessons.length === 0 ? (
          <EmptyState
            title="No pending lessons"
            text="You currently have no parent bookings awaiting payment."
          />
        ) : (
          <div style={styles.pendingGrid}>
            {pendingLessons.map((lesson) => (
              <div key={lesson.id} style={styles.pendingCard}>
                <p style={styles.pendingTitle}>
                  {subjectLabels[lesson.subject_id] || lesson.subject_id}
                </p>

                <p style={styles.pendingText}>
                  {lesson.student_profiles?.full_name || 'Student'} •{' '}
                  {planLabels[lesson.plan_id] || lesson.plan_id}
                </p>

                <p style={styles.pendingText}>
                  {lesson.lesson_date || 'Date pending'} • {lesson.lesson_time || 'Time pending'}
                </p>

                <span style={styles.pendingBadge}>Awaiting Payment</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function LessonCard({ lesson }: { lesson: LessonBooking }) {
  const child = lesson.student_profiles

  return (
    <div style={styles.lessonCard}>
      <div style={styles.lessonTop}>
        <div>
          <p style={styles.lessonSubject}>
            {subjectLabels[lesson.subject_id] || lesson.subject_id}
          </p>

          <p style={styles.lessonMeta}>
            {child?.full_name || 'Student'} • {planLabels[lesson.plan_id] || lesson.plan_id}
          </p>

          <p style={styles.lessonMeta}>
            {[child?.child_age ? `Age ${child.child_age}` : null, child?.country_system, child?.country_class_label]
              .filter(Boolean)
              .join(' • ') || 'Student profile'}
          </p>
        </div>

        <span style={styles.paidBadge}>Confirmed</span>
      </div>

      <div style={styles.lessonDetails}>
        <Detail label="Date" value={lesson.lesson_date || '-'} />
        <Detail label="Time" value={lesson.lesson_time || '-'} />
        <Detail label="Timezone" value={lesson.timezone || 'Europe/London'} />
      </div>

      {lesson.notes ? (
        <div style={styles.noteBox}>
          <p style={styles.noteLabel}>Parent note</p>
          <p style={styles.noteText}>{lesson.notes}</p>
        </div>
      ) : null}

      <div style={styles.lessonActions}>
        {lesson.meeting_link ? (
          <a
            href={lesson.meeting_link}
            target="_blank"
            rel="noreferrer"
            style={styles.primaryLink}
          >
            Join Lesson
          </a>
        ) : (
          <span style={styles.disabledButton}>No meeting link yet</span>
        )}

        {lesson.meeting_link ? (
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(lesson.meeting_link || '')}
            style={styles.secondaryButton}
          >
            Copy Link
          </button>
        ) : null}
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.detailBox}>
      <p style={styles.detailLabel}>{label}</p>
      <p style={styles.detailValue}>{value}</p>
    </div>
  )
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.kpiCard}>
      <p style={styles.kpiLabel}>{label}</p>
      <h2 style={styles.kpiValue}>{value}</h2>
    </div>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.profileRow}>
      <span style={styles.profileLabel}>{label}</span>
      <span style={styles.profileValue}>{value}</span>
    </div>
  )
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div style={styles.emptyState}>
      <h3 style={styles.emptyTitle}>{title}</h3>
      <p style={styles.emptyText}>{text}</p>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '42px 20px 90px',
    background:
      'radial-gradient(circle at top right, #efe4ff 0, #faf7ff 34%, #f8f5ff 100%)',
    color: '#21152d',
  },

  hero: {
    position: 'relative',
    maxWidth: 1180,
    margin: '0 auto',
    padding: '44px 36px',
    borderRadius: 34,
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(248,242,255,0.96))',
    border: '1px solid rgba(126,87,194,0.16)',
    boxShadow: '0 30px 90px rgba(88,52,150,0.12)',
  },

  heroGlow: {
    position: 'absolute',
    right: -120,
    top: -120,
    width: 360,
    height: 360,
    borderRadius: '50%',
    background: 'rgba(124,58,237,0.18)',
    filter: 'blur(20px)',
  },

  eyebrow: {
    position: 'relative',
    margin: 0,
    color: '#7441d8',
    fontWeight: 900,
    fontSize: 15,
  },

  title: {
    position: 'relative',
    margin: '14px 0 0',
    fontSize: 'clamp(34px, 5vw, 54px)',
    lineHeight: 1.05,
    fontWeight: 950,
    letterSpacing: -1.2,
  },

  subtitle: {
    position: 'relative',
    maxWidth: 760,
    margin: '18px 0 0',
    color: '#6f637e',
    fontSize: 17,
    lineHeight: 1.7,
  },

  kpiGrid: {
    position: 'relative',
    marginTop: 30,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16,
  },

  kpiCard: {
    padding: 20,
    borderRadius: 24,
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(124,58,237,0.14)',
    boxShadow: '0 18px 45px rgba(71,43,117,0.07)',
  },

  kpiLabel: {
    margin: 0,
    color: '#7a7088',
    fontWeight: 850,
    fontSize: 14,
  },

  kpiValue: {
    margin: '8px 0 0',
    fontSize: 30,
    fontWeight: 950,
  },

  actions: {
    position: 'relative',
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 28,
  },

  primaryLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    padding: '15px 22px',
    background: 'linear-gradient(135deg, #6f35d5, #8b5cf6)',
    color: 'white',
    fontWeight: 950,
    textDecoration: 'none',
    boxShadow: '0 16px 38px rgba(124,58,237,0.28)',
  },

  secondaryLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    padding: '15px 22px',
    background: 'white',
    color: '#351e55',
    fontWeight: 950,
    textDecoration: 'none',
    border: '1px solid rgba(124,58,237,0.18)',
  },

  grid: {
    maxWidth: 1180,
    margin: '30px auto 0',
    display: 'grid',
    gridTemplateColumns: '1.3fr 0.7fr',
    gap: 24,
  },

  card: {
    padding: 30,
    borderRadius: 30,
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid rgba(126,87,194,0.14)',
    boxShadow: '0 25px 70px rgba(71,43,117,0.10)',
  },

  cardWide: {
    maxWidth: 1180,
    margin: '30px auto 0',
    padding: 30,
    borderRadius: 30,
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid rgba(126,87,194,0.14)',
    boxShadow: '0 25px 70px rgba(71,43,117,0.10)',
  },

  sectionEyebrow: {
    margin: 0,
    color: '#7441d8',
    fontWeight: 950,
    fontSize: 14,
  },

  sectionTitle: {
    margin: '10px 0 22px',
    fontSize: 28,
    fontWeight: 950,
  },

  lessonList: {
    display: 'grid',
    gap: 18,
  },

  lessonCard: {
    padding: 22,
    borderRadius: 26,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  lessonTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
  },

  lessonSubject: {
    margin: 0,
    fontSize: 22,
    fontWeight: 950,
  },

  lessonMeta: {
    margin: '7px 0 0',
    color: '#6f637e',
    fontSize: 14,
    lineHeight: 1.5,
  },

  paidBadge: {
    padding: '8px 12px',
    borderRadius: 999,
    background: '#ecfdf3',
    color: '#027a48',
    fontWeight: 950,
    fontSize: 12,
    whiteSpace: 'nowrap',
  },

  lessonDetails: {
    marginTop: 18,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
  },

  detailBox: {
    padding: 14,
    borderRadius: 18,
    background: 'white',
    border: '1px solid rgba(124,58,237,0.1)',
  },

  detailLabel: {
    margin: 0,
    color: '#7a7088',
    fontWeight: 850,
    fontSize: 13,
  },

  detailValue: {
    margin: '7px 0 0',
    fontWeight: 950,
  },

  noteBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    background: 'rgba(124,58,237,0.06)',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  noteLabel: {
    margin: 0,
    fontWeight: 950,
  },

  noteText: {
    margin: '8px 0 0',
    color: '#6f637e',
    lineHeight: 1.6,
  },

  lessonActions: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 18,
  },

  secondaryButton: {
    border: '1px solid rgba(124,58,237,0.18)',
    borderRadius: 18,
    padding: '15px 22px',
    background: 'white',
    color: '#351e55',
    fontWeight: 950,
    cursor: 'pointer',
  },

  disabledButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    padding: '15px 22px',
    background: '#f3f0f8',
    color: '#7a7088',
    fontWeight: 950,
  },

  profileList: {
    marginTop: 20,
  },

  profileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 18,
    padding: '16px 0',
    borderBottom: '1px solid rgba(124,58,237,0.12)',
  },

  profileLabel: {
    color: '#7a7088',
    fontWeight: 850,
  },

  profileValue: {
    fontWeight: 950,
    textAlign: 'right',
  },

  pendingGrid: {
    marginTop: 20,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  },

  pendingCard: {
    padding: 20,
    borderRadius: 24,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  pendingTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 950,
  },

  pendingText: {
    margin: '8px 0 0',
    color: '#6f637e',
    lineHeight: 1.5,
  },

  pendingBadge: {
    display: 'inline-flex',
    marginTop: 14,
    padding: '8px 11px',
    borderRadius: 999,
    background: '#fff7ed',
    color: '#9a3412',
    fontWeight: 950,
    fontSize: 12,
  },

  emptyState: {
    padding: 24,
    borderRadius: 24,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  emptyTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 950,
  },

  emptyText: {
    margin: '10px 0 0',
    color: '#6f637e',
    lineHeight: 1.6,
  },

  message: {
    color: '#6f637e',
  },
}