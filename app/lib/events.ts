import { supabase } from './supabase'
import { createNotification } from './notifications'
import { sendEmail } from './email'

function isValidEmail(value?: string | null): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function notifyAdmins({
  title,
  message,
  type = 'admin',
  link = '/admin',
}: {
  title: string
  message: string
  type?: string
  link?: string
}) {
  const { data: admins } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('role', 'ADMIN')

  for (const admin of admins ?? []) {
    await createNotification({
      userId: admin.id,
      role: 'admin',
      title,
      message,
      type,
      link,
    })
  }
}

export async function onBookingConfirmed({
  parentUserId,
  parentEmail,
  tutorUserIds,
  tutorEmails = [],
  studentName,
  subjectName,
}: {
  parentUserId: string
  parentEmail?: string | null
  tutorUserIds: string[]
  tutorEmails?: string[]
  studentName?: string
  subjectName?: string
}) {
  const lessonName = subjectName || 'lesson'
  const learnerName = studentName || 'your learner'

  await createNotification({
    userId: parentUserId,
    role: 'parent',
    title: 'Booking confirmed',
    message: `Your ${lessonName} booking for ${learnerName} has been confirmed.`,
    type: 'booking',
    link: '/parent/bookings',
  })

  if (isValidEmail(parentEmail)) {
    await sendEmail({
      to: parentEmail,
      subject: 'Your Fountain Prep booking is confirmed',
      html: `
        <h2>Booking confirmed</h2>
        <p>Your ${lessonName} booking for ${learnerName} has been confirmed.</p>
        <p>You can view your lessons from your parent dashboard.</p>
      `,
    })
  }

  for (const tutorUserId of tutorUserIds) {
    await createNotification({
      userId: tutorUserId,
      role: 'tutor',
      title: 'New lesson booked',
      message: `A parent has booked a ${lessonName} session with you.`,
      type: 'booking',
      link: '/tutor/bookings',
    })
  }

  const uniqueTutorEmails = Array.from(new Set(tutorEmails)).filter(isValidEmail)

  for (const tutorEmail of uniqueTutorEmails) {
    await sendEmail({
      to: tutorEmail,
      subject: 'New Fountain Prep lesson booked',
      html: `
        <h2>New lesson booked</h2>
        <p>A parent has booked a ${lessonName} session with you.</p>
        <p>Please check your tutor dashboard for the lesson details.</p>
      `,
    })
  }

  await notifyAdmins({
    title: 'New booking confirmed',
    message: `A parent has completed payment for ${lessonName}.`,
    type: 'booking',
    link: '/admin',
  })
}

export async function onTutorApproved({
  tutorUserId,
  tutorName,
  tutorEmail,
}: {
  tutorUserId: string
  tutorName?: string
  tutorEmail?: string | null
}) {
  await createNotification({
    userId: tutorUserId,
    role: 'tutor',
    title: 'Tutor profile approved',
    message: `Congratulations${
      tutorName ? `, ${tutorName}` : ''
    }. Your Fountain Prep tutor profile has been approved.`,
    type: 'tutor_approval',
    link: '/tutor/dashboard',
  })

  if (isValidEmail(tutorEmail)) {
    await sendEmail({
      to: tutorEmail,
      subject: 'Your Fountain Prep tutor profile has been approved',
      html: `
        <h2>Congratulations${tutorName ? `, ${tutorName}` : ''}</h2>
        <p>Your Fountain Prep tutor profile has been approved.</p>
        <p>You can now continue setting up your availability.</p>
      `,
    })
  }

  await notifyAdmins({
    title: 'Tutor approved',
    message: `${tutorName || 'A tutor'} has been approved.`,
    type: 'tutor_approval',
    link: '/admin/tutors',
  })
}

export async function onTutorListed({
  tutorUserId,
  tutorName,
  tutorEmail,
}: {
  tutorUserId: string
  tutorName?: string
  tutorEmail?: string | null
}) {
  await createNotification({
    userId: tutorUserId,
    role: 'tutor',
    title: 'You are now listed',
    message: 'Your tutor profile is now visible to parents on Fountain Prep.',
    type: 'tutor_listed',
    link: '/tutor/dashboard',
  })

  if (isValidEmail(tutorEmail)) {
    await sendEmail({
      to: tutorEmail,
      subject: 'Your Fountain Prep profile is now visible to parents',
      html: `
        <h2>You are now listed on Fountain Prep</h2>
        <p>Your tutor profile is now visible to parents for booking.</p>
      `,
    })
  }

  await notifyAdmins({
    title: 'Tutor listed',
    message: `${tutorName || 'A tutor'} is now listed for parent bookings.`,
    type: 'tutor_listed',
    link: '/admin/tutors',
  })
}