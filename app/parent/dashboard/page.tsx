'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type ParentProfile = {
  id: string
  full_name: string
  phone: string | null
  country_of_residence: string | null
  timezone: string
  preferred_currency: string
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
}

type Student = {
  id: string
  full_name: string
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

export default function ParentDashboardPage() {
  const router = useRouter()

  const [message, setMessage] = useState('Loading...')
  const [profile, setProfile] = useState<ParentProfile | null>(null)
  const [studentCount, setStudentCount] = useState(0)
  const [bookings, setBookings] = useState<LessonBooking[]>([])
  const [students, setStudents] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadDashboard() {
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

      if (!userProfile || userProfile.role !== 'PARENT') {
        router.push('/account')
        return
      }

      const { data: parentProfile, error } = await supabase
        .from('parent_profiles')
        .select('id, full_name, phone, country_of_residence, timezone, preferred_currency')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        setMessage(error.message)
        return
      }

      if (!parentProfile) {
        router.push('/parent/onboarding')
        return
      }

      setProfile(parentProfile)
      setMessage('')

      const { count: studentsTotal } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('parent_id', parentProfile.id)

      setStudentCount(studentsTotal ?? 0)

      const { data: studentRows } = await supabase
        .from('student_profiles')
        .select('id, full_name')
        .eq('parent_id', parentProfile.id)

      const studentMap: Record<string, string> = {}

      ;((studentRows ?? []) as Student[]).forEach((student) => {
        studentMap[student.id] = student.full_name
      })

      setStudents(studentMap)

      const today = new Date().toISOString().split('T')[0]

      const { data: bookingRows } = await supabase
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
          amount_gbp
        `)
        .eq('parent_id', user.id)
        .gte('lesson_date', today)
        .order('lesson_date', { ascending: true })
        .limit(5)

      setBookings((bookingRows ?? []) as LessonBooking[])
    }

    loadDashboard()
  }, [router])

  const confirmedLessons = useMemo(() => {
    return bookings.filter(
      (booking) =>
        booking.status === 'CONFIRMED' ||
        booking.payment_status === 'PAID'
    )
  }, [bookings])

  const pendingPayments = useMemo(() => {
    return bookings.filter(
      (booking) =>
        booking.payment_status !== 'PAID' &&
        booking.status !== 'CONFIRMED'
    )
  }, [bookings])

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroGlow} />

        <p style={styles.eyebrow}>Parent Portal</p>

        <h1 style={styles.title}>
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>

        <p style={styles.subtitle}>
          Manage your children, track upcoming lessons, complete pending payments, and book new support.
        </p>

        <div style={styles.kpiGrid}>
          <KpiCard label="Students" value={String(studentCount)} />
          <KpiCard label="Upcoming Lessons" value={String(confirmedLessons.length)} />
          <KpiCard label="Pending Payments" value={String(pendingPayments.length)} />
          <KpiCard label="Currency" value={profile?.preferred_currency ?? '-'} />
        </div>

        <div style={styles.actions}>
          <Link href="/parent/students" style={styles.primaryLink}>
            Add or Choose Child
          </Link>

          <Link href="/parent/students" style={styles.secondaryLink}>
            Book New Lesson
          </Link>

          <Link href="/parent/bookings" style={styles.secondaryLink}>
            My Bookings
          </Link>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.sectionEyebrow}>Upcoming Lessons</p>

          {confirmedLessons.length === 0 ? (
            <EmptyState
              title="No upcoming lessons yet"
              text="Once payment is completed, your scheduled lessons will appear here."
              href="/parent/students"
              button="Book a Lesson"
            />
          ) : (
            <div style={styles.lessonList}>
              {confirmedLessons.map((booking) => (
                <LessonRow
                  key={booking.id}
                  booking={booking}
                  childName={students[booking.student_id] || 'Selected child'}
                />
              ))}
            </div>
          )}
        </div>

        <aside style={styles.card}>
          <p style={styles.sectionEyebrow}>Profile Summary</p>

          {message ? <p>{message}</p> : null}

          {profile ? (
            <div style={styles.profileList}>
              <ProfileRow label="Name" value={profile.full_name} />
              <ProfileRow label="Phone" value={profile.phone ?? '-'} />
              <ProfileRow label="Country" value={profile.country_of_residence ?? '-'} />
              <ProfileRow label="Timezone" value={profile.timezone} />
              <ProfileRow label="Currency" value={profile.preferred_currency} />
            </div>
          ) : null}
        </aside>
      </section>

      <section style={styles.cardWide}>
        <p style={styles.sectionEyebrow}>Recent / Pending Bookings</p>

        {bookings.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            text="Start by choosing a child, subject, plan, and lesson time."
            href="/parent/students"
            button="Start Learning"
          />
        ) : (
          <div style={styles.bookingGrid}>
            {bookings.map((booking) => (
              <div key={booking.id} style={styles.bookingCard}>
                <p style={styles.bookingTitle}>
                  {subjectLabels[booking.subject_id] || booking.subject_id}
                </p>

                <p style={styles.bookingText}>
                  {students[booking.student_id] || 'Selected child'} •{' '}
                  {planLabels[booking.plan_id] || booking.plan_id}
                </p>

                <p style={styles.bookingText}>
                  {booking.lesson_date || 'Date pending'} • {booking.lesson_time || 'Time pending'}
                </p>

                <span
                  style={{
                    ...styles.statusBadge,
                    ...(booking.payment_status === 'PAID'
                      ? styles.statusPaid
                      : styles.statusPending),
                  }}
                >
                  {booking.payment_status === 'PAID' ? 'Paid' : 'Pending Payment'}
                </span>

                {booking.payment_status !== 'PAID' ? (
                  <Link
                    href={`/payment?bookingId=${booking.id}`}
                    style={styles.payLink}
                  >
                    Complete Payment
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
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

function LessonRow({
  booking,
  childName,
}: {
  booking: LessonBooking
  childName: string
}) {
  return (
    <div style={styles.lessonRow}>
      <div>
        <p style={styles.lessonTitle}>
          {subjectLabels[booking.subject_id] || booking.subject_id}
        </p>
        <p style={styles.lessonMeta}>
          {childName} • {planLabels[booking.plan_id] || booking.plan_id}
        </p>
      </div>

      <div style={styles.lessonTime}>
        <strong>{booking.lesson_date}</strong>
        <span>{booking.lesson_time}</span>
      </div>
    </div>
  )
}

function EmptyState({
  title,
  text,
  href,
  button,
}: {
  title: string
  text: string
  href: string
  button: string
}) {
  return (
    <div style={styles.emptyState}>
      <h3 style={styles.emptyTitle}>{title}</h3>
      <p style={styles.emptyText}>{text}</p>
      <Link href={href} style={styles.primaryLink}>
        {button}
      </Link>
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

  lessonList: {
    marginTop: 20,
    display: 'grid',
    gap: 14,
  },

  lessonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 18,
    padding: 18,
    borderRadius: 22,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  lessonTitle: {
    margin: 0,
    fontWeight: 950,
    fontSize: 18,
  },

  lessonMeta: {
    margin: '6px 0 0',
    color: '#6f637e',
    fontSize: 14,
  },

  lessonTime: {
    textAlign: 'right',
    display: 'grid',
    gap: 5,
    color: '#21152d',
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

  bookingGrid: {
    marginTop: 20,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  },

  bookingCard: {
    padding: 20,
    borderRadius: 24,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },

  bookingTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 950,
  },

  bookingText: {
    margin: '8px 0 0',
    color: '#6f637e',
    fontSize: 14,
    lineHeight: 1.5,
  },

  statusBadge: {
    display: 'inline-flex',
    marginTop: 14,
    padding: '8px 11px',
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
  },

  statusPaid: {
    background: '#ecfdf3',
    color: '#027a48',
  },

  statusPending: {
    background: '#fff7ed',
    color: '#9a3412',
  },

  payLink: {
    display: 'inline-flex',
    marginTop: 14,
    color: '#6f35d5',
    fontWeight: 950,
    textDecoration: 'none',
  },

  emptyState: {
    marginTop: 20,
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
    margin: '10px 0 20px',
    color: '#6f637e',
    lineHeight: 1.6,
  },
}