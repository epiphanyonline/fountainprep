'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
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
  tutor_profiles: { full_name: string } | null
}

type BookingFrequency = 'WEEKLY_SAME_TIME' | 'TWO_DAYS_WEEKLY'

const FIRST_LESSON_NOTICE_HOURS = 72
const EARLIEST_BOOKABLE_HOUR = 8
const LATEST_BOOKABLE_START_HOUR = 19

const planLabels: Record<string, string> = {
  monthly: 'Monthly Plan',
  three_month: '3-Month Plan',
}

const planWeeks: Record<string, number> = {
  monthly: 4,
  three_month: 12,
}

const planPricePerClass: Record<string, number> = {
  monthly: 10,
  three_month: 9,
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
  const planIdParam = searchParams.get('planId') || 'monthly'
  const planId = planIdParam === 'three_month' ? 'three_month' : 'monthly'

  const [student, setStudent] = useState<Student | null>(null)
  const [subjectName, setSubjectName] = useState('Selected subject')
  const [resolvedSubjectId, setResolvedSubjectId] = useState<string | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([])
  const [notes, setNotes] = useState('')
  const [frequency, setFrequency] = useState<BookingFrequency>('WEEKLY_SAME_TIME')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('Loading available tutor slots...')

  const planName = planLabels[planId]
  const weeksToBook = planWeeks[planId]
  const pricePerClass = planPricePerClass[planId]
  const requiredSlotCount = frequency === 'TWO_DAYS_WEEKLY' ? 2 : 1
  const totalLessonsRequired = weeksToBook * requiredSlotCount
  const totalAmount = pricePerClass * totalLessonsRequired

  const earliestBookable = useMemo(() => {
    const date = new Date()
    date.setHours(date.getHours() + FIRST_LESSON_NOTICE_HOURS)
    return date
  }, [])

  const groupedSlots = useMemo(() => {
    const grouped: Record<string, Slot[]> = {}

    slots.forEach((slot) => {
      if (!grouped[slot.slot_date]) grouped[slot.slot_date] = []
      grouped[slot.slot_date].push(slot)
    })

    return grouped
  }, [slots])

  const availableDates = Object.keys(groupedSlots)

  const bookingSummary = useMemo(() => {
    return selectedSlots.slice(0, requiredSlotCount).map((slot, index) => ({
      id: slot.id,
      label: `Weekly pattern ${index + 1}`,
      tutor: slot.tutor_profiles?.full_name || 'Approved tutor',
      time: `Every ${getWeekdayName(slot.slot_date)}, ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`,
      dates: Array.from({ length: weeksToBook }).map((_, i) =>
        addWeeks(slot.slot_date, i)
      ),
    }))
  }, [selectedSlots, requiredSlotCount, weeksToBook])

  useEffect(() => {
    async function loadData() {
      setLoading(true)

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
        .select('id, full_name, child_age, country_system, country_class_label, learning_level_id')
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
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subjectIdParam)

      if (looksLikeUuid) {
        const { data } = await supabase
          .from('subjects')
          .select('id, name')
          .eq('id', subjectIdParam)
          .maybeSingle()

        if (data) {
          realSubjectId = data.id
          realSubjectName = data.name
        }
      } else {
        const label = subjectLabels[subjectIdParam] || subjectIdParam

        const { data } = await supabase
          .from('subjects')
          .select('id, name')
          .ilike('name', label)
          .maybeSingle()

        if (data) {
          realSubjectId = data.id
          realSubjectName = data.name
        }
      }

      setResolvedSubjectId(realSubjectId)
      setSubjectName(realSubjectName)

      const minimumNoticeDate = new Date()
      minimumNoticeDate.setHours(minimumNoticeDate.getHours() + FIRST_LESSON_NOTICE_HOURS)
      const earliestBookableDate = minimumNoticeDate.toISOString().split('T')[0]

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
        .gte('slot_date', earliestBookableDate)
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

      const premiumSlots = cleanSlots.filter((slot) => {
        const slotStart = slot.starts_at
          ? new Date(slot.starts_at)
          : new Date(`${slot.slot_date}T${slot.start_time}`)

        const hour = Number(slot.start_time.slice(0, 2))

        return (
          slotStart >= minimumNoticeDate &&
          hour >= EARLIEST_BOOKABLE_HOUR &&
          hour <= LATEST_BOOKABLE_START_HOUR
        )
      })

      setSlots(premiumSlots)

      setMessage(
        premiumSlots.length
          ? ''
          : 'No available tutor slots found yet. First lessons require 72 hours notice and are available from 08:00 to 20:00.'
      )

      setLoading(false)
    }

    loadData()
  }, [router, studentId, subjectIdParam, planId])

  function toggleSlot(slot: Slot) {
    setSelectedSlots((prev) => {
      const selected = prev.some((s) => s.id === slot.id)
      if (selected) return prev.filter((s) => s.id !== slot.id)
      if (frequency === 'WEEKLY_SAME_TIME') return [slot]
      if (prev.length >= 2) return [prev[1], slot]
      return [...prev, slot]
    })
  }

  function changeFrequency(next: BookingFrequency) {
    setFrequency(next)
    if (next === 'WEEKLY_SAME_TIME') {
      setSelectedSlots((prev) => prev.slice(0, 1))
    }
  }

  async function continueToPayment() {
    if (!studentId || !subjectIdParam || !student || !resolvedSubjectId) {
      alert('Missing booking details. Please start again.')
      router.push('/parent/students')
      return
    }

    if (selectedSlots.length < requiredSlotCount) {
      alert(
        requiredSlotCount === 2
          ? 'Please choose two weekly lesson slots.'
          : 'Please choose one weekly lesson slot.'
      )
      return
    }

    setSaving(true)
    setMessage('Creating your lesson bookings...')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
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
        meeting_link: `https://meet.jit.si/fountainprep-${bookingGroupId}-${slotIndex + 1}-${weekIndex + 1}`,
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

    await supabase
      .from('tutor_availability_slots')
      .update({ is_available: false, is_booked: true })
      .in('id', seedSlots.map((slot) => slot.id))

    const firstBookingId = bookings?.[0]?.id

    setSaving(false)

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

  if (loading) return <ScheduleLoading message={message} />

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Private 1-to-1 scheduling</p>
        <h1>Choose your child’s weekly learning time.</h1>

        <p className="subtitle">
          Select a weekly tutor slot and Fountain Prep will create the full lesson
          plan for your chosen package.
        </p>

        <div className="policyBox">
          <strong>Premium Tutor Preparation Policy</strong>
          <span>
            First lessons must be booked at least 72 hours in advance. This gives
            your tutor time to review your child’s profile, prepare the lesson,
            and deliver a better first class.
          </span>
        </div>

        <div className="summaryGrid">
          <SummaryCard label="Child" value={student?.full_name || 'Selected child'} />
          <SummaryCard label="Subject" value={subjectName} />
          <SummaryCard
            label="Plan"
            value={planName}
            sub={`${totalLessonsRequired} lessons • £${totalAmount}`}
          />
        </div>
      </section>

      <section className="layout">
        <div className="mainCard">
          <div className="sectionHead">
  <p className="eyebrow">Available tutor slots</p>
  <h2>Select weekly pattern</h2>

  <div className="premiumInfo">
    <strong>Choose one weekly lesson time.</strong>
    <p>
      Fountain Prep will automatically reserve this same time every week
      for the duration of your plan.
    </p>
  </div>
</div>

          {message ? <div className="notice">{message}</div> : null}

          <div className="frequencyBox">
            <button
              type="button"
              onClick={() => changeFrequency('WEEKLY_SAME_TIME')}
              className={frequency === 'WEEKLY_SAME_TIME' ? 'freq active' : 'freq'}
            >
              <strong>1 lesson weekly</strong>
              <span>{weeksToBook} lessons • £{pricePerClass}/class</span>
            </button>

            <button
              type="button"
              onClick={() => changeFrequency('TWO_DAYS_WEEKLY')}
              className={frequency === 'TWO_DAYS_WEEKLY' ? 'freq active' : 'freq'}
            >
              <strong>2 lessons weekly</strong>
              <span>{weeksToBook * 2} lessons • £{pricePerClass}/class</span>
            </button>
          </div>

          {availableDates.length === 0 ? (
            <div className="empty">
              <h3>No tutor slots available yet</h3>
              <p>
                Please check again later or choose another subject. First lessons
                require 72 hours notice.
              </p>
              <button onClick={goBackToPricing} className="secondaryBtn">
                Back to Pricing
              </button>
            </div>
          ) : (
            <div className="dateList">
              {availableDates.slice(0, 3).map((date) => (
                <div key={date} className="dateCard">
                  <div className="dateHeader">
                    <div>
                      <h3>{formatDate(date)}</h3>
                      <p>{groupedSlots[date].length} slot(s) available</p>
                    </div>
                    <span>Available</span>
                  </div>

                  {availableDates.length > 3 && (
  <button
    type="button"
    className="secondaryBtn"
    onClick={() =>
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    }
  >
    View More Available Dates
  </button>
)}

                  <div className="slotGrid">
                    {groupedSlots[date].map((slot) => {
                      const active = selectedSlots.some((s) => s.id === slot.id)

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => toggleSlot(slot)}
                          className={active ? 'slot activeSlot' : 'slot'}
                        >
                          <strong>
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </strong>
                          <span>{slot.tutor_profiles?.full_name || 'Approved tutor'}</span>

<small className="tutorMeta">
  ⭐ Experienced Tutor
</small>
                          <small>{active ? '✓ Selected' : 'Choose this time'}</small>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="sideCard">
          <p className="eyebrow">Booking summary</p>
          <h2>Your selected plan</h2>

          <div className="totalBox">
            <p>{planName}</p>
            <strong>£{totalAmount}</strong>
            <span>{totalLessonsRequired} private 1-to-1 lessons</span>
          </div>

          <div className="bookingPolicy">
  <span>✓ Private 1-to-1 tutoring</span>
  <span>✓ Weekly recurring lessons</span>
  <span>✓ Dedicated tutor</span>
  <span>✓ Same day and time every week</span>
  <span>✓ Parent dashboard tracking</span>
  <span>✓ 72-hour first lesson preparation notice</span>
</div>

          <div className="selectedBox">
            {bookingSummary.length === 0 ? (
              <p className="muted">
                Choose {requiredSlotCount === 2 ? 'two weekly slots' : 'one weekly slot'} to continue.
              </p>
            ) : (
              bookingSummary.map((item) => (
                <div key={item.id} className="selectedItem">
                  <small>{item.label}</small>
                  <strong>{item.time}</strong>
                  <p>Tutor: {item.tutor}</p>
                  <div className="datePills">
                    {item.dates.map((date) => (
                      <span key={date}>{formatShortDate(date)}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note for the tutor..."
          />

          <button
            type="button"
            onClick={continueToPayment}
            disabled={saving || selectedSlots.length < requiredSlotCount}
            className="primaryBtn"
          >
            {saving ? 'Creating bookings...' : 'Continue to Payment'}
          </button>

          <button type="button" onClick={goBackToPricing} className="ghostBtn">
            Back to Pricing
          </button>
        </aside>
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="summary">
      <span>{label}</span>
      <strong>{value}</strong>
      {sub ? <small>{sub}</small> : null}
    </div>
  )
}

function ScheduleLoading({ message = 'Loading schedule...' }: { message?: string }) {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Fountain Prep Schedule</p>
        <h1>Loading available tutor slots...</h1>
        <p className="subtitle">{message}</p>
      </section>

      <style jsx>{styles}</style>
    </main>
  )
}

function addWeeks(dateString: string, weeks: number) {
  const date = new Date(`${dateString}T00:00:00`)
  date.setDate(date.getDate() + weeks * 7)
  return date.toISOString().split('T')[0]
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${dateString}T00:00:00`))
}

function formatShortDate(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${dateString}T00:00:00`))
}

function getWeekdayName(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
  }).format(new Date(`${dateString}T00:00:00`))
}

function formatTime(time: string) {
  return time.slice(0, 5)
}

const styles = `
  .page {
    min-height: 100vh;
    padding: 44px 18px 90px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.14), transparent 30%),
      linear-gradient(180deg, #ffffff, #fbf8ff 45%, #f4edff);
    color: #201230;
  }

  .hero,
  .layout {
    max-width: 1180px;
    margin: 0 auto;
  }

  .hero {
    padding: 46px;
    border-radius: 38px;
    background: linear-gradient(135deg, #ffffff, #f4edff);
    border: 1px solid rgba(124, 58, 237, 0.12);
    box-shadow: 0 30px 90px rgba(47, 25, 80, 0.1);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-weight: 950;
  }

  h1 {
    margin: 14px 0 0;
    max-width: 850px;
    font-size: clamp(40px, 6vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .subtitle {
    max-width: 760px;
    margin: 20px 0 0;
    color: #6d647c;
    font-size: 18px;
    line-height: 1.75;
  }

  .policyBox {
    margin-top: 24px;
    padding: 18px;
    border-radius: 20px;
    background: #f6f1ff;
    border: 1px solid rgba(111, 66, 193, 0.18);
  }

  .policyBox strong {
    display: block;
    color: #6d28d9;
    font-weight: 950;
    margin-bottom: 7px;
  }

  .policyBox span {
    display: block;
    color: #5f5470;
    line-height: 1.65;
    font-weight: 700;
  }

  .summaryGrid {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .summary {
    padding: 20px;
    border-radius: 24px;
    background: white;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .summary span {
    color: #7a7088;
    font-size: 13px;
    font-weight: 850;
  }

  .summary strong {
    display: block;
    margin-top: 8px;
    font-size: 20px;
  }

  .summary small {
    display: block;
    margin-top: 6px;
    color: #766b84;
  }

  .layout {
    margin-top: 30px;
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
    align-items: start;
  }

  .mainCard,
  .sideCard {
    padding: 30px;
    border-radius: 34px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(124, 58, 237, 0.1);
    box-shadow: 0 24px 70px rgba(47, 25, 80, 0.09);
  }

  .sideCard {
    position: sticky;
    top: 24px;
  }

  .sectionHead h2,
  .sideCard h2 {
    margin: 8px 0 0;
    font-size: 32px;
    letter-spacing: -0.04em;
  }

  .notice {
    margin-top: 18px;
    padding: 16px;
    border-radius: 18px;
    background: #fff7ed;
    color: #7c2d12;
    font-weight: 750;
    line-height: 1.6;
  }

  .frequencyBox {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .freq,
  .slot,
  .primaryBtn,
  .secondaryBtn,
  .ghostBtn {
    cursor: pointer;
    font-family: inherit;
  }

  .freq {
    text-align: left;
    padding: 18px;
    border-radius: 22px;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.12);
  }

  .freq strong,
  .freq span {
    display: block;
  }

  .freq span {
    margin-top: 6px;
    color: #6d647c;
    font-weight: 750;
  }

  .active {
    border-color: #7c3aed;
    background: #f1e8ff;
    box-shadow: 0 16px 34px rgba(124, 58, 237, 0.12);
  }

  .dateList {
    margin-top: 26px;
    display: grid;
    gap: 18px;
  }

  .dateCard {
    padding: 22px;
    border-radius: 26px;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .dateHeader {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: center;
  }

  .dateHeader h3 {
    margin: 0;
    font-size: 22px;
  }

  .dateHeader p {
    margin: 6px 0 0;
    color: #7a7088;
  }

  .dateHeader span {
    padding: 8px 12px;
    border-radius: 999px;
    background: #dcfce7;
    color: #166534;
    font-weight: 900;
    font-size: 13px;
  }

  .slotGrid {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .slot {
    text-align: left;
    padding: 16px;
    border-radius: 20px;
    background: white;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .slot strong,
  .slot span,
  .slot small {
    display: block;
  }

  .slot span {
    margin-top: 7px;
    color: #6d647c;
  }

  .slot small {
    margin-top: 10px;
    color: #6d28d9;
    font-weight: 900;
  }

  .activeSlot {
    border-color: #7c3aed;
    background: #f1e8ff;
  }

  .totalBox {
    margin-top: 20px;
    padding: 22px;
    border-radius: 24px;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
  }

  .totalBox p {
    margin: 0;
    font-weight: 850;
  }

  .totalBox strong {
    display: block;
    margin-top: 8px;
    font-size: 46px;
    letter-spacing: -0.05em;
  }

  .totalBox span {
    display: block;
    margin-top: 6px;
    opacity: 0.9;
  }

  .bookingPolicy {
    margin-top: 16px;
    display: grid;
    gap: 10px;
    padding: 16px;
    border-radius: 20px;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .bookingPolicy span {
    color: #351e55;
    font-weight: 850;
    font-size: 14px;
  }

  .selectedBox {
    margin-top: 18px;
    display: grid;
    gap: 14px;
  }

  .muted {
    color: #6d647c;
    line-height: 1.7;
  }

  .selectedItem {
    padding: 16px;
    border-radius: 20px;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .selectedItem small {
    color: #6d28d9;
    font-weight: 900;
  }

  .selectedItem strong {
    display: block;
    margin-top: 8px;
  }

  .selectedItem p {
    margin: 8px 0 0;
    color: #6d647c;
  }

  .datePills {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .datePills span {
    padding: 7px 10px;
    border-radius: 999px;
    background: white;
    color: #352145;
    font-size: 12px;
    font-weight: 800;
  }

  textarea {
    width: 100%;
    min-height: 110px;
    margin-top: 18px;
    padding: 16px;
    border-radius: 20px;
    border: 1px solid rgba(124, 58, 237, 0.14);
    resize: vertical;
    font: inherit;
  }

  .primaryBtn,
  .secondaryBtn,
  .ghostBtn {
    width: 100%;
    margin-top: 14px;
    min-height: 54px;
    border-radius: 18px;
    font-weight: 950;
    border: 0;
  }

  .primaryBtn {
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 18px 42px rgba(109, 40, 217, 0.24);
  }

  .primaryBtn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .secondaryBtn,
  .ghostBtn {
    background: white;
    color: #241535;
    border: 1px solid rgba(124, 58, 237, 0.14);
  }

  .empty {
    margin-top: 24px;
    padding: 26px;
    border-radius: 24px;
    background: #fbf8ff;
    text-align: center;
  }

  .empty h3 {
    margin: 0;
  }

  .empty p {
    color: #6d647c;
    line-height: 1.7;
  }

  @media (max-width: 980px) {
    .page {
      padding: 26px 12px 70px;
    }

    .hero {
      padding: 30px 20px;
      border-radius: 30px;
    }

    .summaryGrid,
    .layout,
    .frequencyBox,
    .slotGrid {
      grid-template-columns: 1fr;
    }

    .sideCard {
      position: static;
    }

    h1 {
      font-size: clamp(38px, 12vw, 56px);
    }

    .premiumInfo {
  margin-top: 14px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(124, 58, 237, 0.06);
  border: 1px solid rgba(124, 58, 237, 0.12);
}

.premiumInfo strong {
  display: block;
  margin-bottom: 4px;
}

.premiumInfo p {
  margin: 0;
  opacity: 0.8;
}

.tutorMeta {
  display: block;
  margin-top: 6px;
  opacity: 0.7;
}

    .mainCard,
    .sideCard {
      padding: 22px;
      border-radius: 28px;
    }

    .dateHeader {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`