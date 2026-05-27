'use client'

import { Suspense, useEffect, useMemo, useState, type CSSProperties } from 'react'
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

type Slot = {
  id: string
  tutor_id: string
  subject_id: string
  learning_level_id: string
  slot_date: string
  start_time: string
  end_time: string
  starts_at: string
  ends_at: string
  timezone: string
  is_available: boolean
  is_booked: boolean
  tutor_profiles: {
    full_name: string
  } | null
}

type BookingFrequency = 'WEEKLY_SAME_TIME' | 'TWO_DAYS_WEEKLY'

type BookingPatternSummary = {
  id: string
  label: string
  dayTime: string
  tutor: string
  dates: string[]
}

const planLabels: Record<string, string> = {
  monthly: 'Monthly Plan',
  three_month: '3-Month Plan',
  six_month: '6-Month Plan',
}

const planWeeks: Record<string, number> = {
  monthly: 4,
  three_month: 12,
  six_month: 24,
}

const planBaseAmounts: Record<string, number> = {
  monthly: 24,
  three_month: 72,
  six_month: 144,
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

export default function SchedulePage() {
  return (
    <Suspense fallback={<ScheduleLoading />}>
      <ScheduleContent />
    </Suspense>
  )
}

function ScheduleContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const studentId = searchParams.get('studentId')
  const subjectIdParam = searchParams.get('subjectId')
  const programId = searchParams.get('programId')
  const planId = searchParams.get('planId') || 'monthly'

  const [student, setStudent] = useState<Student | null>(null)
  const [subjectName, setSubjectName] = useState('Selected subject')
  const [resolvedSubjectId, setResolvedSubjectId] = useState<string | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([])
  const [notes, setNotes] = useState('')
  const [frequency, setFrequency] =
    useState<BookingFrequency>('WEEKLY_SAME_TIME')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('Loading available tutor slots...')

  const planName = planLabels[planId] || 'Monthly Plan'
  const baseAmount = planBaseAmounts[planId] || 24
  const weeksToBook = planWeeks[planId] || 4
  const requiredSlotCount = frequency === 'TWO_DAYS_WEEKLY' ? 2 : 1
  const totalLessonsRequired = weeksToBook * requiredSlotCount

  const totalAmount = useMemo(() => {
    return frequency === 'TWO_DAYS_WEEKLY' ? baseAmount * 2 : baseAmount
  }, [baseAmount, frequency])

  const planDescription =
    frequency === 'TWO_DAYS_WEEKLY'
      ? `2 lessons weekly • ${totalLessonsRequired} total lessons`
      : `1 lesson weekly • ${totalLessonsRequired} total lessons`

  const groupedSlots = useMemo(() => {
    const grouped: Record<string, Slot[]> = {}

    slots.forEach((slot) => {
      if (!grouped[slot.slot_date]) grouped[slot.slot_date] = []
      grouped[slot.slot_date].push(slot)
    })

    return grouped
  }, [slots])

  const availableDates = Object.keys(groupedSlots)

  const bookingPatternSummary: BookingPatternSummary[] = useMemo(() => {
    if (selectedSlots.length === 0) return []

    return selectedSlots.slice(0, requiredSlotCount).map((slot, index) => {
      const dates = Array.from({ length: weeksToBook }).map((_, weekIndex) =>
        addWeeks(slot.slot_date, weekIndex)
      )

      return {
        id: slot.id,
        label: `Weekly pattern ${index + 1}`,
        dayTime: `Every ${getWeekdayName(slot.slot_date)}, ${formatTime(
          slot.start_time
        )} - ${formatTime(slot.end_time)}`,
        tutor: slot.tutor_profiles?.full_name || 'Approved tutor',
        dates,
      }
    })
  }, [selectedSlots, requiredSlotCount, weeksToBook])

  useEffect(() => {
    async function loadScheduleData() {
      setLoading(true)
      setMessage('Loading available tutor slots...')

      if (!studentId || !subjectIdParam || !planId) {
        setMessage('Missing booking details. Please start again.')
        setLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: studentRow, error: studentError } = await supabase
        .from('student_profiles')
        .select(
          'id, full_name, child_age, country_system, country_class_label, learning_level_id'
        )
        .eq('id', studentId)
        .maybeSingle()

      if (studentError || !studentRow) {
        setMessage(studentError?.message || 'Student not found.')
        setLoading(false)
        return
      }

      if (!studentRow.learning_level_id) {
        setMessage('This child has not been mapped to a learning level yet.')
        setLoading(false)
        return
      }

      setStudent(studentRow as Student)

      let realSubjectId = subjectIdParam
      let realSubjectName = subjectLabels[subjectIdParam] || 'Selected subject'

      const looksLikeUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          subjectIdParam
        )

      if (looksLikeUuid) {
        const { data: subjectRow } = await supabase
          .from('subjects')
          .select('id, name')
          .eq('id', subjectIdParam)
          .maybeSingle()

        if (subjectRow) {
          realSubjectId = subjectRow.id
          realSubjectName = subjectRow.name
        }
      } else {
        const label = subjectLabels[subjectIdParam] || subjectIdParam

        const { data: subjectRow } = await supabase
          .from('subjects')
          .select('id, name')
          .ilike('name', label)
          .maybeSingle()

        if (subjectRow) {
          realSubjectId = subjectRow.id
          realSubjectName = subjectRow.name
        }
      }

      setResolvedSubjectId(realSubjectId)
      setSubjectName(realSubjectName)

      const today = new Date().toISOString().split('T')[0]

      const { data: slotRows, error: slotError } = await supabase
        .from('tutor_availability_slots')
        .select(`
          id,
          tutor_id,
          subject_id,
          learning_level_id,
          slot_date,
          start_time,
          end_time,
          starts_at,
          ends_at,
          timezone,
          is_available,
          is_booked,
          tutor_profiles (
            full_name
          )
        `)
        .eq('subject_id', realSubjectId)
        .eq('learning_level_id', studentRow.learning_level_id)
        .eq('is_available', true)
        .eq('is_booked', false)
        .gte('slot_date', today)
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (slotError) {
        setMessage(slotError.message)
        setLoading(false)
        return
      }

      const cleanSlots = ((slotRows ?? []) as any[]).map((row) => ({
        ...row,
        tutor_profiles: Array.isArray(row.tutor_profiles)
          ? row.tutor_profiles[0] ?? null
          : row.tutor_profiles ?? null,
      })) as Slot[]

      setSlots(cleanSlots)
      setMessage(
        cleanSlots.length
          ? ''
          : 'No available tutor slots found yet for this subject and level.'
      )
      setLoading(false)
    }

    loadScheduleData()
  }, [router, studentId, subjectIdParam, planId])

  function toggleSlot(slot: Slot) {
    setSelectedSlots((prev) => {
      const alreadySelected = prev.some((item) => item.id === slot.id)

      if (alreadySelected) {
        return prev.filter((item) => item.id !== slot.id)
      }

      if (frequency === 'WEEKLY_SAME_TIME') {
        return [slot]
      }

      if (prev.length >= 2) {
        return [prev[1], slot]
      }

      return [...prev, slot]
    })
  }

  function changeFrequency(nextFrequency: BookingFrequency) {
    setFrequency(nextFrequency)

    if (nextFrequency === 'WEEKLY_SAME_TIME') {
      setSelectedSlots((prev) => prev.slice(0, 1))
    }
  }

  async function continueToPayment() {
    if (!studentId || !subjectIdParam || !planId || !student || !resolvedSubjectId) {
      alert('Missing booking details. Please start again.')
      router.push('/parent/students')
      return
    }

    if (selectedSlots.length < requiredSlotCount) {
      alert(
        frequency === 'TWO_DAYS_WEEKLY'
          ? 'Please choose two weekly lesson slots.'
          : 'Please choose one weekly lesson slot.'
      )
      return
    }

    setSaving(true)
    setMessage('Creating weekly lesson bookings...')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setSaving(false)
      router.push('/login')
      return
    }

    const bookingGroupId = crypto.randomUUID()
    const seedSlots = selectedSlots.slice(0, requiredSlotCount)

    const bookingRows = seedSlots.flatMap((slot, slotIndex) =>
      Array.from({ length: weeksToBook }).map((_, weekIndex) => ({
        parent_id: user.id,
        student_id: studentId,
        subject_id: resolvedSubjectId,
        program_id: programId || null,
        plan_id: planId,
        tutor_id: slot.tutor_id,
        availability_slot_id: weekIndex === 0 ? slot.id : null,
        lesson_date: addWeeks(slot.slot_date, weekIndex),
        lesson_time: formatTime(slot.start_time),
        timezone: slot.timezone || 'Europe/London',
        status: 'PENDING_PAYMENT',
        payment_status: 'UNPAID',
        amount_gbp: slotIndex === 0 && weekIndex === 0 ? totalAmount : 0,
        meeting_link: `https://meet.jit.si/fountainprep-${bookingGroupId}-${slot.tutor_id}`,
        notes,
        booking_frequency: frequency,
        repeat_weeks: weeksToBook,
        parent_booking_group_id: bookingGroupId,
      }))
    )

    const { data: bookings, error: bookingError } = await supabase
      .from('lesson_bookings')
      .insert(bookingRows)
      .select('id')

    if (bookingError) {
      setMessage(bookingError.message)
      setSaving(false)
      return
    }

    const selectedSlotIds = seedSlots.map((slot) => slot.id)

    const { error: slotUpdateError } = await supabase
      .from('tutor_availability_slots')
      .update({
        is_available: false,
        is_booked: true,
      })
      .in('id', selectedSlotIds)

    if (slotUpdateError) {
      setMessage(slotUpdateError.message)
      setSaving(false)
      return
    }

    setSaving(false)

    const firstBookingId = bookings?.[0]?.id

    if (!firstBookingId) {
      setMessage('Booking created but payment reference was not returned.')
      return
    }

    router.push(`/payment?bookingId=${firstBookingId}`)
  }

  function goBackToPricing() {
    const params = new URLSearchParams()

    if (studentId) params.set('studentId', studentId)
    if (subjectIdParam) params.set('subjectId', subjectIdParam)
    if (programId) params.set('programId', programId)

    router.push(`/pricing?${params.toString()}`)
  }

  if (loading) {
    return <ScheduleLoading message={message} />
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroGlow} />

        <p style={styles.eyebrow}>Fountain Prep Schedule</p>

        <h1 style={styles.title}>Choose your child’s weekly learning pattern</h1>

        <p style={styles.subtitle}>
          Select one weekly tutor slot, or choose two weekly slots. Fountain Prep
          will create the full set of lesson bookings for the selected plan before
          payment.
        </p>

        <div style={styles.summaryGrid}>
          <SummaryCard
            label="Child"
            value={student?.full_name || 'Selected child'}
            sub={`${student?.child_age ? `Age ${student.child_age}` : ''}${
              student?.country_system ? ` • ${student.country_system}` : ''
            }${student?.country_class_label ? ` • ${student.country_class_label}` : ''}`}
          />

          <SummaryCard
            label="Subject"
            value={subjectName}
            sub="Tutor-matched subject"
          />

          <SummaryCard
            label="Plan"
            value={planName}
            sub={`${planDescription} • £${totalAmount}`}
          />
        </div>
      </section>

      <section style={styles.contentGrid}>
        <div style={styles.card}>
          <p style={styles.sectionEyebrow}>Available Calendar</p>

          <h2 style={styles.sectionTitle}>Select weekly tutor slot</h2>

          {message ? <Notice message={message} /> : null}

          <div style={styles.frequencyBox}>
            <div style={styles.frequencyHeader}>
              <div>
                <p style={styles.frequencyTitle}>Choose lesson frequency</p>
                <p style={styles.frequencySub}>
                  Your selected day and time repeats weekly for the full plan.
                </p>
              </div>

              <span style={styles.priceBadge}>From £24</span>
            </div>

            <div style={styles.frequencyGrid}>
              <button
                type="button"
                onClick={() => changeFrequency('WEEKLY_SAME_TIME')}
                style={{
                  ...styles.frequencyButton,
                  ...(frequency === 'WEEKLY_SAME_TIME'
                    ? styles.frequencyActive
                    : {}),
                }}
              >
                <span style={styles.frequencyButtonTitle}>1 lesson weekly</span>
                <span style={styles.frequencyButtonMeta}>
                  £{baseAmount} • {weeksToBook} lessons
                </span>
              </button>

              <button
                type="button"
                onClick={() => changeFrequency('TWO_DAYS_WEEKLY')}
                style={{
                  ...styles.frequencyButton,
                  ...(frequency === 'TWO_DAYS_WEEKLY'
                    ? styles.frequencyActive
                    : {}),
                }}
              >
                <span style={styles.frequencyButtonTitle}>2 lessons weekly</span>
                <span style={styles.frequencyButtonMeta}>
                  £{baseAmount * 2} • {weeksToBook * 2} lessons
                </span>
              </button>
            </div>

            <p style={styles.frequencyFootnote}>
              {frequency === 'TWO_DAYS_WEEKLY'
                ? 'Select two weekly patterns. Each selected day and time will repeat weekly.'
                : 'Select one weekly pattern. The same day and time will repeat weekly.'}
            </p>
          </div>

          {availableDates.length === 0 ? (
            <div style={styles.emptyBox}>
              <h3 style={styles.emptyTitle}>No tutor slots available yet</h3>
              <p style={styles.emptyText}>
                Ask tutors to set availability for this subject and level, then
                generate 1-hour slots again.
              </p>

              <button
                type="button"
                onClick={goBackToPricing}
                style={styles.secondaryButton}
              >
                Back to Pricing
              </button>
            </div>
          ) : (
            <div style={styles.dateGrid}>
              {availableDates.map((date) => (
                <div key={date} style={styles.dateCard}>
                  <div style={styles.dateHeader}>
                    <div>
                      <p style={styles.dateDay}>{formatDate(date)}</p>
                      <p style={styles.dateMeta}>
                        {groupedSlots[date].length} slot(s) available
                      </p>
                    </div>

                    <span style={styles.greenDot}>Available</span>
                  </div>

                  <div style={styles.slotGrid}>
                    {groupedSlots[date].map((slot) => {
                      const active = selectedSlots.some(
                        (item) => item.id === slot.id
                      )

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => toggleSlot(slot)}
                          style={{
                            ...styles.slotButton,
                            ...(active ? styles.slotButtonActive : {}),
                          }}
                        >
                          <span style={styles.slotTime}>
                            {formatTime(slot.start_time)} -{' '}
                            {formatTime(slot.end_time)}
                          </span>

                          <span style={styles.slotTutor}>
                            Tutor:{' '}
                            {slot.tutor_profiles?.full_name || 'Approved tutor'}
                          </span>

                          <span style={styles.slotHint}>
                            {active
                              ? 'Selected weekly pattern'
                              : 'Tap to select weekly pattern'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside style={styles.sideCard}>
          <p style={styles.sectionEyebrow}>Booking Summary</p>

          <div style={styles.selectedBox}>
            {bookingPatternSummary.length === 0 ? (
              <>
                <p style={styles.selectedTitle}>No weekly slot selected</p>
                <p style={styles.selectedMuted}>
                  Choose{' '}
                  {requiredSlotCount === 2 ? 'two weekly slots' : 'one weekly slot'}{' '}
                  from the available calendar.
                </p>
              </>
            ) : (
              bookingPatternSummary.map((pattern) => (
                <div key={pattern.id} style={styles.selectedItem}>
                  <p style={styles.selectedSmall}>{pattern.label}</p>

                  <p style={styles.selectedTitle}>{pattern.dayTime}</p>

                  <p style={styles.selectedLine}>Tutor: {pattern.tutor}</p>

                  <p style={styles.selectedMuted}>
                    This will create these lesson dates:
                  </p>

                  <div style={styles.lessonDateList}>
                    {pattern.dates.map((date) => (
                      <span key={date} style={styles.lessonDatePill}>
                        {formatShortDate(date)}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={styles.totalBox}>
            <p style={styles.totalLabel}>Selected plan</p>

            <p style={styles.totalValue}>
              {frequency === 'TWO_DAYS_WEEKLY'
                ? '2 lessons weekly'
                : '1 lesson weekly'}
            </p>

            <p style={styles.totalMeta}>{planName}</p>

            <p style={styles.totalAmount}>£{totalAmount}</p>

            <p style={styles.totalSmall}>
              This will create {totalLessonsRequired} lesson booking
              {totalLessonsRequired > 1 ? 's' : ''} for this plan.
            </p>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any note? e.g. needs reading support, prefers patient tutor..."
            style={styles.textarea}
          />

          <button
            type="button"
            onClick={continueToPayment}
            disabled={saving || selectedSlots.length < requiredSlotCount}
            style={{
              ...styles.primaryButton,
              width: '100%',
              opacity:
                saving || selectedSlots.length < requiredSlotCount ? 0.65 : 1,
              cursor:
                saving || selectedSlots.length < requiredSlotCount
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            {saving ? 'Creating Bookings...' : 'Continue to Payment'}
          </button>

          <button
            type="button"
            onClick={goBackToPricing}
            style={styles.secondaryButtonFull}
          >
            Back to Pricing
          </button>
        </aside>
      </section>
    </main>
  )
}

function ScheduleLoading({
  message = 'Preparing available tutor slots.',
}: {
  message?: string
}) {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <p style={styles.eyebrow}>Fountain Prep Schedule</p>
        <h1 style={styles.title}>Loading schedule...</h1>
        <p style={styles.subtitle}>{message}</p>
      </section>
    </main>
  )
}

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub: string
}) {
  return (
    <div style={styles.summaryCard}>
      <p style={styles.summaryLabel}>{label}</p>
      <p style={styles.summaryValue}>{value}</p>
      <p style={styles.summarySub}>{sub}</p>
    </div>
  )
}

function Notice({ message }: { message: string }) {
  return <div style={styles.notice}>{message}</div>
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatShortDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function getWeekdayName(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
    weekday: 'long',
  })
}

function formatTime(time: string) {
  const [hourString, minuteString] = time.slice(0, 5).split(':')
  const hour = Number(hourString)
  const minute = Number(minuteString)

  const date = new Date()
  date.setHours(hour)
  date.setMinutes(minute)

  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function addWeeks(dateString: string, weeks: number) {
  const date = new Date(`${dateString}T12:00:00`)
  date.setDate(date.getDate() + weeks * 7)
  return date.toISOString().split('T')[0]
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top right, #eadcff 0, #faf7ff 34%, #f8f5ff 100%)',
    padding: '42px 20px 90px',
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
      'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,242,255,0.96))',
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
    maxWidth: 920,
    fontSize: 'clamp(34px, 5vw, 56px)',
    lineHeight: 1.04,
    fontWeight: 950,
    letterSpacing: -1.2,
  },
  subtitle: {
    position: 'relative',
    maxWidth: 850,
    margin: '18px 0 0',
    color: '#6f637e',
    fontSize: 17,
    lineHeight: 1.7,
  },
  summaryGrid: {
    position: 'relative',
    marginTop: 30,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 24,
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(124,58,237,0.14)',
    boxShadow: '0 18px 45px rgba(71,43,117,0.07)',
  },
  summaryLabel: {
    margin: 0,
    color: '#7a7088',
    fontWeight: 850,
    fontSize: 14,
  },
  summaryValue: {
    margin: '8px 0 0',
    fontSize: 21,
    fontWeight: 950,
  },
  summarySub: {
    margin: '8px 0 0',
    color: '#766b84',
    fontSize: 14,
  },
  contentGrid: {
    maxWidth: 1180,
    margin: '30px auto 0',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.35fr) minmax(330px, 0.75fr)',
    gap: 24,
  },
  card: {
    padding: 30,
    borderRadius: 30,
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid rgba(126,87,194,0.14)',
    boxShadow: '0 25px 70px rgba(71,43,117,0.10)',
  },
  sideCard: {
    padding: 30,
    borderRadius: 30,
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(249,245,255,0.98))',
    border: '1px solid rgba(126,87,194,0.16)',
    boxShadow: '0 25px 70px rgba(71,43,117,0.12)',
    alignSelf: 'start',
    position: 'sticky',
    top: 105,
    maxHeight: 'calc(100vh - 125px)',
    overflowY: 'auto',
  },
  sectionEyebrow: {
    margin: 0,
    color: '#7441d8',
    fontWeight: 950,
    fontSize: 14,
  },
  sectionTitle: {
    margin: '10px 0 22px',
    fontSize: 30,
    fontWeight: 950,
    letterSpacing: -0.4,
  },
  frequencyBox: {
    marginBottom: 22,
    padding: 18,
    borderRadius: 26,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },
  frequencyHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  frequencyTitle: {
    margin: 0,
    fontWeight: 950,
    fontSize: 17,
  },
  frequencySub: {
    margin: '6px 0 0',
    color: '#766b84',
    fontSize: 14,
  },
  priceBadge: {
    padding: '9px 12px',
    borderRadius: 999,
    background: '#f0e7ff',
    color: '#6f35d5',
    fontWeight: 950,
    fontSize: 13,
    whiteSpace: 'nowrap',
  },
  frequencyGrid: {
    marginTop: 16,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 12,
  },
  frequencyButton: {
    display: 'grid',
    gap: 6,
    textAlign: 'left',
    border: '1px solid rgba(124,58,237,0.16)',
    borderRadius: 18,
    padding: '16px 18px',
    background: 'white',
    color: '#351e55',
    fontWeight: 950,
    cursor: 'pointer',
  },
  frequencyActive: {
    background: 'linear-gradient(135deg, #6f35d5, #8b5cf6)',
    color: 'white',
    border: '1px solid #6f35d5',
    boxShadow: '0 16px 38px rgba(124,58,237,0.22)',
  },
  frequencyButtonTitle: {
    fontSize: 16,
    fontWeight: 950,
  },
  frequencyButtonMeta: {
    fontSize: 14,
    opacity: 0.9,
  },
  frequencyFootnote: {
    margin: '14px 0 0',
    color: '#6f637e',
    fontSize: 14,
    fontWeight: 750,
  },
  dateGrid: {
    display: 'grid',
    gap: 18,
  },
  dateCard: {
    padding: 20,
    borderRadius: 26,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },
  dateHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  dateDay: {
    margin: 0,
    fontSize: 19,
    fontWeight: 950,
  },
  dateMeta: {
    margin: '5px 0 0',
    color: '#6f637e',
    fontSize: 14,
  },
  greenDot: {
    padding: '8px 11px',
    borderRadius: 999,
    background: '#ecfdf3',
    color: '#027a48',
    fontWeight: 950,
    fontSize: 12,
  },
  slotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: 12,
  },
  slotButton: {
    display: 'grid',
    gap: 6,
    textAlign: 'left',
    padding: 16,
    borderRadius: 20,
    background: 'white',
    border: '1px solid rgba(124,58,237,0.14)',
    color: '#21152d',
    cursor: 'pointer',
  },
  slotButtonActive: {
    background: 'linear-gradient(135deg, #6f35d5, #8b5cf6)',
    color: 'white',
    border: '1px solid #6f35d5',
    boxShadow: '0 16px 38px rgba(124,58,237,0.28)',
  },
  slotTime: {
    fontWeight: 950,
    fontSize: 16,
  },
  slotTutor: {
    fontWeight: 850,
    fontSize: 14,
  },
  slotHint: {
    fontSize: 13,
    opacity: 0.85,
  },
  selectedBox: {
    marginTop: 20,
    padding: 22,
    borderRadius: 24,
    background: '#fbf8ff',
    border: '1px solid rgba(124,58,237,0.12)',
  },
  selectedItem: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottom: '1px solid rgba(124,58,237,0.1)',
  },
  selectedSmall: {
    margin: '0 0 8px',
    color: '#7441d8',
    fontSize: 13,
    fontWeight: 950,
  },
  selectedTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 950,
  },
  selectedLine: {
    margin: '10px 0 0',
    fontWeight: 850,
  },
  selectedMuted: {
    margin: '10px 0 0',
    color: '#6f637e',
  },
  lessonDateList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  lessonDatePill: {
    padding: '7px 10px',
    borderRadius: 999,
    background: '#f0e7ff',
    color: '#6f35d5',
    fontSize: 12,
    fontWeight: 900,
  },
  totalBox: {
    marginTop: 18,
    padding: 20,
    borderRadius: 24,
    background: 'white',
    border: '1px solid rgba(124,58,237,0.12)',
  },
  totalLabel: {
    margin: 0,
    color: '#7a7088',
    fontWeight: 850,
  },
  totalValue: {
    margin: '8px 0 0',
    fontWeight: 950,
    fontSize: 17,
  },
  totalMeta: {
    margin: '6px 0 0',
    color: '#6f637e',
    fontSize: 14,
  },
  totalAmount: {
    margin: '12px 0 0',
    fontSize: 38,
    fontWeight: 950,
    letterSpacing: -0.8,
  },
  totalSmall: {
    margin: '6px 0 0',
    color: '#6f637e',
    fontSize: 13,
    fontWeight: 750,
  },
  textarea: {
    width: '100%',
    minHeight: 130,
    boxSizing: 'border-box',
    marginTop: 18,
    borderRadius: 20,
    border: '1px solid rgba(124,58,237,0.2)',
    padding: '16px 18px',
    fontSize: 15,
    outline: 'none',
    resize: 'vertical',
    color: '#21152d',
    background: 'white',
  },
  primaryButton: {
    marginTop: 20,
    border: 0,
    borderRadius: 18,
    padding: '17px 22px',
    background: 'linear-gradient(135deg, #6f35d5, #8b5cf6)',
    color: 'white',
    fontWeight: 950,
    fontSize: 15,
    cursor: 'pointer',
    boxShadow: '0 16px 38px rgba(124,58,237,0.28)',
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
  secondaryButtonFull: {
    width: '100%',
    marginTop: 14,
    border: '1px solid rgba(124,58,237,0.18)',
    borderRadius: 18,
    padding: '16px 22px',
    background: 'white',
    color: '#351e55',
    fontWeight: 950,
    fontSize: 15,
    cursor: 'pointer',
  },
  notice: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 18,
    background: '#fff7ed',
    border: '1px solid #fed7aa',
    color: '#9a3412',
    fontWeight: 850,
  },
  emptyBox: {
    padding: 26,
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