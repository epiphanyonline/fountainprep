export type Student = {
  id: string
  full_name: string
  child_age: number | null
  country_system: string | null
  country_class_label: string | null
  learning_level_id: string | null
}

export type SubjectRow = {
  id: string
  name: string
  category: string | null
  is_active: boolean | null
}

export type LearningLevel = {
  id: string
  code: string
  name: string
}

export type SafeTutor = {
  id: string
  full_name: string
  photo_url: string | null
  bio: string | null
  years_of_experience: number | null
  qualification_summary: string | null
  languages_spoken: string[] | null
  average_rating: number | null
  rating_count: number | null
}

export type TutorProfile = Omit<SafeTutor, 'id'>

export type Slot = {
  id: string
  tutor_id: string
  subject_id: string
  learning_level_id: string | null
  slot_date: string
  start_time: string
  end_time: string
  starts_at: string | null
  ends_at: string | null
  timezone: string | null
  is_available: boolean
  is_booked: boolean
  tutor_profiles: TutorProfile | null
}

export type TutorGroup = {
  tutorId: string
  tutor: TutorProfile
  slots: Slot[]
  firstSlot: Slot
  slotsByDate: Record<string, Slot[]>
}

export type BookingFrequency = 'WEEKLY_SAME_TIME' | 'TWO_DAYS_WEEKLY'

export type BookingSummaryItem = {
  id: string
  label: string
  tutor: string
  weekday: string
  timeRange: string
  startDateLabel: string
  tutorTimezone: string
}
