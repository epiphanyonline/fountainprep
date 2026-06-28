import { supabase } from './supabase'
import { createNotification } from './notifications'
import { sendEmail } from './email'

function isValidEmail(value?: string | null): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(value?: string | null) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
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
  classroomLink,
}: {
  parentUserId: string
  parentEmail?: string | null
  tutorUserIds: string[]
  tutorEmails?: string[]
  studentName?: string
  subjectName?: string
  classroomLink?: string
}) {
  const lessonName = subjectName || 'lesson'
  const learnerName = studentName || 'your learner'
  const parentLink = classroomLink || '/parent/bookings'
  const tutorLink = classroomLink || '/tutor/bookings'

  await createNotification({
    userId: parentUserId,
    role: 'parent',
    title: 'Booking confirmed',
    message: `Your ${lessonName} booking for ${learnerName} has been confirmed.`,
    type: 'booking',
    link: parentLink,
  })

  if (isValidEmail(parentEmail)) {
    await sendEmail({
      to: parentEmail,
      subject: 'Your Fountain Prep booking is confirmed',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241235">
          <h2>Booking confirmed</h2>
          <p>Your ${escapeHtml(lessonName)} booking for ${escapeHtml(learnerName)} has been confirmed.</p>
          <p>You can enter the classroom from your Fountain Prep dashboard.</p>
          <p>
            <a href="${escapeHtml(parentLink)}" style="display:inline-block;background:#6d28d9;color:white;padding:12px 18px;border-radius:14px;text-decoration:none;font-weight:700">
              Enter Classroom
            </a>
          </p>
        </div>
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
      link: tutorLink,
    })
  }

  const uniqueTutorEmails = Array.from(new Set(tutorEmails)).filter(isValidEmail)

  for (const tutorEmail of uniqueTutorEmails) {
    await sendEmail({
      to: tutorEmail,
      subject: 'New Fountain Prep lesson booked',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241235">
          <h2>New lesson booked</h2>
          <p>A parent has booked a ${escapeHtml(lessonName)} session with you.</p>
          <p>Please enter the classroom from your tutor dashboard.</p>
          <p>
            <a href="${escapeHtml(tutorLink)}" style="display:inline-block;background:#6d28d9;color:white;padding:12px 18px;border-radius:14px;text-decoration:none;font-weight:700">
              Enter Classroom
            </a>
          </p>
        </div>
      `,
    })
  }

  await notifyAdmins({
    title: 'New booking confirmed',
    message: `A parent has completed payment for ${lessonName}.`,
    type: 'booking',
    link: classroomLink || '/admin',
  })
}

export async function onLessonReportReady({
  parentUserId,
  parentEmail,
  studentName,
  subjectName,
  reportLink = '/parent/progress',
}: {
  parentUserId: string
  parentEmail?: string | null
  studentName?: string | null
  subjectName?: string | null
  reportLink?: string
}) {
  const learnerName = studentName || 'your child'
  const lessonName = subjectName || 'lesson'

  await createNotification({
    userId: parentUserId,
    role: 'parent',
    title: 'Lesson report ready',
    message: `${learnerName}'s ${lessonName} report is now available.`,
    type: 'lesson_report',
    link: reportLink,
  })

  if (isValidEmail(parentEmail)) {
    await sendEmail({
      to: parentEmail,
      subject: `${learnerName}'s Fountain Prep lesson report is ready`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241235">
          <h2>Lesson report ready</h2>
          <p>${escapeHtml(learnerName)}'s ${escapeHtml(lessonName)} report is now available.</p>
          <p>You can review what was covered, strengths, homework and the next learning focus.</p>
          <p>
            <a href="${escapeHtml(reportLink)}" style="display:inline-block;background:#6d28d9;color:white;padding:12px 18px;border-radius:14px;text-decoration:none;font-weight:700">
              View Progress Report
            </a>
          </p>
        </div>
      `,
    })
  }

  await notifyAdmins({
    title: 'Lesson report completed',
    message: `${learnerName}'s ${lessonName} lesson report has been completed.`,
    type: 'lesson_report',
    link: reportLink,
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
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241235">
          <h2>Congratulations${tutorName ? `, ${escapeHtml(tutorName)}` : ''}</h2>
          <p>Your Fountain Prep tutor profile has been approved.</p>
          <p>You can now continue setting up your availability.</p>
        </div>
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
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241235">
          <h2>You are now listed on Fountain Prep</h2>
          <p>Your tutor profile is now visible to parents for booking.</p>
        </div>
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
export async function onTutorInterviewInvite({
  tutorUserId,
  tutorName,
  tutorEmail,
  interviewDate,
  interviewTime,
  interviewLink,
}: {
  tutorUserId: string
  tutorName?: string
  tutorEmail?: string | null
  interviewDate: string
  interviewTime: string
  interviewLink: string
}) {
  await createNotification({
    userId: tutorUserId,
    role: 'tutor',
    title: 'Tutor interview invitation',
    message: `You have been invited for a Fountain Prep tutor interview on ${interviewDate} at ${interviewTime}.`,
    type: 'tutor_interview',
    link: interviewLink || '/tutor/dashboard',
  })

  if (isValidEmail(tutorEmail)) {
    await sendEmail({
      to: tutorEmail,
      subject: 'Fountain Prep tutor interview invitation',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241235">
          <h2>Hello ${escapeHtml(tutorName || 'there')}</h2>
          <p>You have been invited for a Fountain Prep tutor interview.</p>

          <div style="background:#f6f1ff;border:1px solid #e6d8ff;border-radius:18px;padding:18px;margin:20px 0">
            <p><strong>Date:</strong> ${escapeHtml(interviewDate)}</p>
            <p><strong>Time:</strong> ${escapeHtml(interviewTime)}</p>
          </div>

          <p>
            <a href="${escapeHtml(interviewLink)}" style="display:inline-block;background:#6d28d9;color:white;padding:12px 18px;border-radius:14px;text-decoration:none;font-weight:700">
              Join Interview
            </a>
          </p>

          <p>Please be ready to discuss your teaching experience, availability, subject strengths, safeguarding awareness, and how you support children in 1-to-1 lessons.</p>

          <p>Thank you,<br/>Fountain Prep</p>
        </div>
      `,
    })
  }

  await notifyAdmins({
    title: 'Tutor interview invited',
    message: `${tutorName || 'A tutor'} has been invited for interview.`,
    type: 'tutor_interview',
    link: '/admin/tutors',
  })
}