'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'

import { BookingSummary } from './components/BookingSummary'
import { ProgressStepper } from './components/ProgressStepper'
import { ScheduleLoading } from './components/ScheduleLoading'
import { scheduleStyles } from './components/ScheduleStyles'
import { SummaryCard } from './components/SummaryCard'
import { TutorCard } from './components/TutorCard'
import { TutorProfileModal } from './components/TutorProfileModal'
import { WeeklyTimetableDrawer } from './components/WeeklyTimetableDrawer'

import type {
  BookingFrequency,
  BookingSummaryItem,
  LearningLevel,
  SafeTutor,
  Slot,
  Student,
  TutorGroup,
  TutorProfile,
} from './components/ScheduleTypes'

import {
  DEFAULT_TIMEZONE,
  FIRST_LESSON_NOTICE_HOURS,
  addWeeks,
  displaySubjectName,
  formatTime,
  getWeekdayName,
  languageNames,
  normaliseSubjectName,
  planLabels,
  planPricePerClass,
  planWeeks,
  removeDuplicateSlots,
  resolveSubject,
  slotTimeRange,
  toTutorProfile,
} from './components/scheduleUtils'

export default function SchedulePage() {
  return (
    <Suspense fallback={<ScheduleLoading message="Loading available tutor slots..." />}>
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
  const [currency, setCurrency] = useState({
  symbol: '£',
  code: 'GBP',
  rate: 1,
})

  const [student, setStudent] = useState<Student | null>(null)
  const [subjectName, setSubjectName] = useState('Selected subject')
  const [resolvedSubjectId, setResolvedSubjectId] = useState<string | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([])
  const [frequency, setFrequency] = useState<BookingFrequency>('WEEKLY_SAME_TIME')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('Loading available tutor slots...')
  const [debugMessage, setDebugMessage] = useState('')
  const [profileTutor, setProfileTutor] = useState<TutorProfile | null>(null)
  const [activeTimesTutorId, setActiveTimesTutorId] = useState<string | null>(null)

  const planName = planLabels[planId]
  const weeksToBook = planWeeks[planId]
  const pricePerClass = planPricePerClass[planId]
  const requiredSlotCount = frequency === 'TWO_DAYS_WEEKLY' ? 2 : 1
  const totalLessonsRequired = weeksToBook * requiredSlotCount
  const totalAmount = pricePerClass * totalLessonsRequired

  const tutorGroups = useMemo<TutorGroup[]>(() => {
    const map = new Map<string, Slot[]>()

    slots.forEach((slot) => {
      if (!slot.tutor_profiles) return
      const existing = map.get(slot.tutor_id) || []
      existing.push(slot)
      map.set(slot.tutor_id, existing)
    })

    return Array.from(map.entries())
      .map(([tutorId, tutorSlots]) => {
        const sorted = [...tutorSlots].sort((a, b) => {
          const dateCompare = a.slot_date.localeCompare(b.slot_date)
          if (dateCompare !== 0) return dateCompare
          return a.start_time.localeCompare(b.start_time)
        })

        const slotsByDate: Record<string, Slot[]> = {}
        sorted.forEach((slot) => {
          if (!slotsByDate[slot.slot_date]) slotsByDate[slot.slot_date] = []
          slotsByDate[slot.slot_date].push(slot)
        })

        return {
          tutorId,
          tutor: sorted[0].tutor_profiles as TutorProfile,
          slots: sorted,
          firstSlot: sorted[0],
          slotsByDate,
        }
      })
      .sort((a, b) => {
        const dateCompare = a.firstSlot.slot_date.localeCompare(b.firstSlot.slot_date)
        if (dateCompare !== 0) return dateCompare
        const timeCompare = a.firstSlot.start_time.localeCompare(b.firstSlot.start_time)
        if (timeCompare !== 0) return timeCompare
        return (a.tutor.full_name || '').localeCompare(b.tutor.full_name || '')
      })
  }, [slots])

  const activeTimesGroup = useMemo(() => {
    if (!activeTimesTutorId) return null
    return tutorGroups.find((group) => group.tutorId === activeTimesTutorId) || null
  }, [activeTimesTutorId, tutorGroups])

  const bookingSummary = useMemo<BookingSummaryItem[]>(() => {
    return selectedSlots.map((slot, index) => ({
  id: slot.id,

  label:
    frequency === 'TWO_DAYS_WEEKLY'
      ? `Weekly Lesson ${index + 1}`
      : 'Weekly Lesson',

  tutor: slot.tutor_profiles?.full_name ?? '',

  weekday: getWeekdayName(slot.slot_date),

  timeRange: slotTimeRange(slot),

  startDate: slot.slot_date,

  dates: Array.from(
    { length: weeksToBook },
    (_, week) => addWeeks(slot.slot_date, week)
  ),
}))
  }, [selectedSlots, requiredSlotCount, weeksToBook])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setMessage('Loading available tutor slots...')
      setDebugMessage('')
      setSlots([])
      setSelectedSlots([])

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

      const countryCurrencyTable: Record<string, { symbol: string; code: string; rate: number }> = {
  UK: { symbol: '£', code: 'GBP', rate: 1 },
  USA: { symbol: '$', code: 'USD', rate: 1.27 },
  Canada: { symbol: 'CA$', code: 'CAD', rate: 1.72 },
  Australia: { symbol: 'A$', code: 'AUD', rate: 1.93 },
}

if (studentRow.country_system && countryCurrencyTable[studentRow.country_system]) {
  setCurrency(countryCurrencyTable[studentRow.country_system])
}

      const { data: levelRows } = await supabase
        .from('learning_levels')
        .select('id, code, name')
        .eq('is_active', true)

      const levels = (levelRows ?? []) as LearningLevel[]
      const allAgesLevel = levels.find(
        (level) => level.code?.toUpperCase() === 'ALL_AGES' || level.name?.toLowerCase() === 'all ages'
      )

      const { primarySubject, matchingSubjects, errorMessage } = await resolveSubject(subjectIdParam)

      if (errorMessage || !primarySubject || matchingSubjects.length === 0) {
        setMessage(errorMessage || 'Selected subject could not be found.')
        setLoading(false)
        return
      }

      const primaryName = normaliseSubjectName(primarySubject.name)
      const isLanguageSubject =
        primarySubject.category?.toLowerCase() === 'language' || languageNames.includes(primaryName)

      setResolvedSubjectId(primarySubject.id)
      setSubjectName(displaySubjectName(primarySubject.name))

      const subjectIds = Array.from(new Set(matchingSubjects.map((subject) => subject.id)))
      const allowedLevelIds = new Set<string>()

      if (isLanguageSubject) {
        if (allAgesLevel?.id) allowedLevelIds.add(allAgesLevel.id)
        allowedLevelIds.add(studentRow.learning_level_id)
      } else {
        allowedLevelIds.add(studentRow.learning_level_id)
        if (allAgesLevel?.id) allowedLevelIds.add(allAgesLevel.id)
      }

      const minimumNoticeDate = new Date()
      minimumNoticeDate.setHours(minimumNoticeDate.getHours() + FIRST_LESSON_NOTICE_HOURS)
      const earliestBookableDate = minimumNoticeDate.toISOString().split('T')[0]

      const { data: safeTutors, error: safeTutorError } = await supabase
        .from('vw_safe_tutor_profiles')
        .select(
          'id, full_name, photo_url, bio, years_of_experience, qualification_summary, languages_spoken, average_rating, rating_count'
        )

      if (safeTutorError) {
        setMessage(safeTutorError.message)
        setLoading(false)
        return
      }

      const safeTutorRows = (safeTutors ?? []) as SafeTutor[]
      const safeTutorIds = safeTutorRows.map((tutor) => tutor.id)

      if (safeTutorIds.length === 0) {
        setMessage('No approved tutors are available yet.')
        setLoading(false)
        return
      }

      const tutorMap = new Map(safeTutorRows.map((tutor) => [tutor.id, tutor]))
      let subjectTutorIds = safeTutorIds

      const { data: tutorSubjectRows } = await supabase
        .from('tutor_subjects')
        .select('tutor_id, subject_id, learning_level_id, approved_by_admin, is_active')
        .in('subject_id', subjectIds)
        .in('tutor_id', safeTutorIds)
        .eq('approved_by_admin', true)
        .eq('is_active', true)

      if (tutorSubjectRows?.length) {
        subjectTutorIds = Array.from(
          new Set(
            tutorSubjectRows
              .filter((row: any) => {
                if (!row.learning_level_id) return true
                return allowedLevelIds.has(row.learning_level_id)
              })
              .map((row: any) => row.tutor_id)
          )
        )
      }

      if (subjectTutorIds.length === 0) {
        setMessage('No approved tutors are assigned to this subject and level yet.')
        setLoading(false)
        return
      }

      const { data: availableSlotRows, error: availableSlotError } = await supabase
        .from('tutor_availability_slots')
        .select(
          'id, tutor_id, subject_id, learning_level_id, slot_date, start_time, end_time, starts_at, ends_at, timezone, is_available, is_booked'
        )
        .in('subject_id', subjectIds)
        .in('tutor_id', subjectTutorIds)
        .in('learning_level_id', Array.from(allowedLevelIds))
        .eq('is_available', true)
        .eq('is_booked', false)
        .gte('slot_date', earliestBookableDate)
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(500)

      if (availableSlotError) {
        setMessage(availableSlotError.message)
        setLoading(false)
        return
      }

      const rows = (availableSlotRows ?? []) as any[]

      const cleanSlots = rows
        .map((row) => ({
          ...row,
          tutor_profiles: toTutorProfile(tutorMap.get(row.tutor_id)),
        }))
        .filter((slot) => slot.tutor_profiles)
        .filter((slot) => {
          const startsAt = slot.starts_at ? new Date(slot.starts_at) : new Date(`${slot.slot_date}T${slot.start_time}`)
          return startsAt >= minimumNoticeDate
        }) as Slot[]

      const uniqueSlots = removeDuplicateSlots(cleanSlots)

      setSlots(uniqueSlots)
      setDebugMessage(`Matched ${uniqueSlots.length} first-lesson start option(s) from ${subjectTutorIds.length} approved tutor(s).`)

      setMessage(
        uniqueSlots.length
          ? ''
          : isLanguageSubject
            ? 'No language tutor start dates are available yet for the selected age group. Please message us and we will help arrange a suitable tutor.'
            : 'No available start dates found yet. First lessons require 72 hours notice. Please also confirm the child level matches the tutor availability.'
      )

      setLoading(false)
    }

    loadData()
  }, [router, studentId, subjectIdParam, planId])

  function convertPrice(gbp: number) {
  return `${currency.symbol}${Math.round(gbp * currency.rate)}`
}

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
    } else {
      setSelectedSlots([])
    }
  }

  function goBackToPricing() {
    const params = new URLSearchParams()
    if (studentId) params.set('studentId', studentId)
    if (subjectIdParam) params.set('subjectId', subjectIdParam)
    if (programId) params.set('programId', programId)
    router.push(`/pricing?${params.toString()}`)
  }

  async function continueToPayment() {
    if (!studentId || !student || !resolvedSubjectId) {
      alert('Missing booking details. Please start again.')
      router.push('/parent/students')
      return
    }

    if (selectedSlots.length < requiredSlotCount) {
      alert(requiredSlotCount === 2 ? 'Please choose the first date and time for both weekly lessons.' : 'Please choose the first date and time for the weekly lesson.')
      return
    }

    setSaving(true)
    setMessage('Creating your weekly learning timetable...')

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
        timezone: slot.timezone || DEFAULT_TIMEZONE,
        status: 'PENDING_PAYMENT',
        payment_status: 'UNPAID',
        amount_gbp: slotIndex === 0 && weekIndex === 0 ? totalAmount : 0,
        meeting_link: `https://meet.jit.si/fountainprep-${bookingGroupId}-${slotIndex + 1}-${weekIndex + 1}`,
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
      setMessage('Timetable created but payment reference was not returned.')
      return
    }

    router.push(`/payment?bookingId=${firstBookingId}`)
  }

  if (loading) return <ScheduleLoading message={message} />

  return (
    <main className="page">
      <section className="hero">
        <ProgressStepper />

        <div className="heroCopy">
          <p className="eyebrow">Private 1-to-1 weekly timetable</p>
          <h1>Build Your Child&apos;s Weekly Learning Timetable</h1>
          <p className="subtitle">
            Choose a dedicated tutor, then select the first lesson date for your child&apos;s recurring weekly classes.
            We automatically schedule the remaining lessons on the same day and time throughout your learning plan.
          </p>
        </div>

        <div className="policyBox">
          <strong>How scheduling works</strong>
          <span>
            The slot you choose is the first lesson date. That day of the week and time becomes your child&apos;s regular weekly class time.
            First lessons must be booked at least 72 hours in advance so your tutor can prepare properly.
          </span>
        </div>

        <div className="summaryGrid">
          <SummaryCard label="Learner" value={student?.full_name || 'Selected learner'} />
          <SummaryCard label="Subject" value={subjectName} />
          <SummaryCard
  label="Plan"
  value={planName}
  sub={`${totalLessonsRequired} lessons • ${convertPrice(totalAmount)}`}
/>
        </div>
      </section>

      <section className="layout">
        <div className="mainCard">
          <div className="sectionHead">
            <p className="eyebrow">Available approved tutors</p>
            <h2>Select a tutor, then build the weekly timetable</h2>
            <div className="premiumInfo">
              <strong>You are choosing the first lesson date only.</strong>
              <p>
                For one lesson per week, pick one start date and time. For two lessons per week, pick the first date and time for each weekly lesson.
                The remaining lessons will be automatically scheduled on the same days and times.
              </p>
            </div>
          </div>

          {message ? <div className="notice">{message}</div> : null}
          {debugMessage ? <div className="debugNote">{debugMessage}</div> : null}

          <div className="frequencyBox">
            <button type="button" onClick={() => changeFrequency('WEEKLY_SAME_TIME')} className={frequency === 'WEEKLY_SAME_TIME' ? 'freq active' : 'freq'}>
              <strong>1 lesson weekly</strong>
              <span>Choose one first lesson date • {weeksToBook} lessons • {convertPrice(pricePerClass)}/class</span>
            </button>

            <button type="button" onClick={() => changeFrequency('TWO_DAYS_WEEKLY')} className={frequency === 'TWO_DAYS_WEEKLY' ? 'freq active' : 'freq'}>
              <strong>2 lessons weekly</strong>
              <span>Choose two first lesson dates • {weeksToBook * 2} lessons • {convertPrice(pricePerClass)}/class</span>
            </button>
          </div>

          {tutorGroups.length === 0 ? (
            <div className="empty">
              <h3>No tutor start dates available yet</h3>
              <p>
                This usually means the selected subject, child level, or 72-hour notice window has no matching slots.
                You can check another plan or message us for help.
              </p>
              <button type="button" onClick={goBackToPricing} className="secondaryBtn">
                Back to Payment Plans
              </button>
            </div>
          ) : (
            <div className="tutorList">
              {tutorGroups.map((group) => (
                <TutorCard
                  key={group.tutorId}
                  group={group}
                  selectedForTutor={selectedSlots.some((slot) => slot.tutor_id === group.tutorId)}
                  onChooseTimetable={() => setActiveTimesTutorId(group.tutorId)}
                  onViewProfile={() => setProfileTutor(group.tutor)}
                />
              ))}
            </div>
          )}
        </div>

        <BookingSummary
  planName={planName}
  totalAmount={totalAmount}
  totalLessonsRequired={totalLessonsRequired}
  requiredSlotCount={requiredSlotCount}
  frequency={frequency}
  bookingSummary={bookingSummary}
  saving={saving}
  canContinue={selectedSlots.length >= requiredSlotCount}
  currency={currency}
  onContinue={continueToPayment}
  onBack={goBackToPricing}
/>
      </section>

      {activeTimesGroup && (
        <WeeklyTimetableDrawer
          group={activeTimesGroup}
          frequency={frequency}
          weeksToBook={weeksToBook}
          selectedSlots={selectedSlots}
          requiredSlotCount={requiredSlotCount}
          onToggleSlot={toggleSlot}
          onClose={() => setActiveTimesTutorId(null)}
          onViewProfile={() => {
            setProfileTutor(activeTimesGroup.tutor)
            setActiveTimesTutorId(null)
          }}
        />
      )}

      {profileTutor && <TutorProfileModal tutor={profileTutor} onClose={() => setProfileTutor(null)} />}

      <style>{scheduleStyles}</style>
    </main>
  )
}