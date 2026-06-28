import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.fountainprep.com'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const expected = `Bearer ${process.env.CRON_SECRET}`

    if (authHeader !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY')
    if (!process.env.RESEND_FROM_EMAIL) throw new Error('Missing RESEND_FROM_EMAIL')
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')

    const { data: reminders, error: reminderError } = await supabaseAdmin
      .from('lesson_reminders')
      .select('id, booking_id, reminder_type, scheduled_for')
      .eq('sent', false)
      .lte('scheduled_for', new Date().toISOString())
      .limit(30)

    if (reminderError) throw new Error(reminderError.message)

    if (!reminders?.length) {
      return NextResponse.json({ sent: 0, message: 'No reminders due.' })
    }

    let sentCount = 0
    const errors: string[] = []

    for (const reminder of reminders as any[]) {
      const { data: booking, error: bookingError } = await supabaseAdmin
        .from('lesson_bookings')
        .select(
          'id, parent_id, tutor_id, student_id, subject_id, lesson_date, lesson_time, timezone, status, payment_status'
        )
        .eq('id', reminder.booking_id)
        .maybeSingle()

      if (bookingError || !booking) {
        errors.push(bookingError?.message || `Booking not found: ${reminder.booking_id}`)
        continue
      }

      if (booking.payment_status !== 'PAID' && booking.status !== 'CONFIRMED') {
        await markReminderSkipped(reminder.id, 'Booking not confirmed or paid.')
        continue
      }

      const classroomLink = `${appUrl}/classroom/${booking.id}`

      const { data: parentProfile } = await supabaseAdmin
        .from('parent_profiles')
        .select('full_name')
        .eq('user_id', booking.parent_id)
        .maybeSingle()

      const { data: parentUserProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('email')
        .eq('id', booking.parent_id)
        .maybeSingle()

      const { data: studentProfile } = await supabaseAdmin
        .from('student_profiles')
        .select('full_name')
        .eq('id', booking.student_id)
        .maybeSingle()

      const { data: tutorProfile } = await supabaseAdmin
        .from('tutor_profiles')
        .select('id, user_id, full_name')
        .eq('id', booking.tutor_id)
        .maybeSingle()

      let tutorEmail: string | null = null

      if (tutorProfile?.user_id) {
        const { data: tutorUserProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('email')
          .eq('id', tutorProfile.user_id)
          .maybeSingle()

        tutorEmail = tutorUserProfile?.email ?? null
      }

      const { data: subjectRow } = await supabaseAdmin
        .from('subjects')
        .select('name')
        .eq('id', booking.subject_id)
        .maybeSingle()

      const reminderLabel =
        reminder.reminder_type === '24_HOURS' ? 'tomorrow' : 'in 1 hour'

      const studentName = studentProfile?.full_name || 'your child'
      const tutorName = tutorProfile?.full_name || 'your tutor'
      const subjectName = subjectRow?.name || 'lesson'
      const lessonDate = formatDate(booking.lesson_date)
      const lessonTime = formatTime(booking.lesson_time)
      const timezone = booking.timezone || 'Europe/London'

      const parentEmail = parentUserProfile?.email ?? null

      if (isValidEmail(parentEmail)) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: parentEmail,
          subject: `Fountain Prep reminder: ${studentName} has a lesson ${reminderLabel}`,
          html: lessonEmailHtml({
            greetingName: parentProfile?.full_name || 'there',
            title: 'Fountain Prep Lesson Reminder',
            intro: `${studentName} has a private 1-to-1 ${subjectName} ${reminderLabel}.`,
            studentName,
            subjectName,
            tutorName,
            lessonDate,
            lessonTime,
            timezone,
            classroomLink,
            cta: 'Enter Classroom',
          }),
        })
      }

      if (tutorProfile?.user_id) {
        await createReminderNotification({
          userId: tutorProfile.user_id,
          role: 'tutor',
          title: 'Lesson reminder',
          message: `You have a ${subjectName} lesson with ${studentName} ${reminderLabel}.`,
          link: classroomLink,
        })
      }

      await createReminderNotification({
        userId: booking.parent_id,
        role: 'parent',
        title: 'Lesson reminder',
        message: `${studentName} has a ${subjectName} lesson ${reminderLabel}.`,
        link: classroomLink,
      })

      if (isValidEmail(tutorEmail)) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: tutorEmail,
          subject: `Fountain Prep tutor reminder: lesson ${reminderLabel}`,
          html: lessonEmailHtml({
            greetingName: tutorName,
            title: 'Fountain Prep Tutor Reminder',
            intro: `You have a private 1-to-1 ${subjectName} lesson with ${studentName} ${reminderLabel}.`,
            studentName,
            subjectName,
            tutorName,
            lessonDate,
            lessonTime,
            timezone,
            classroomLink,
            cta: 'Enter Classroom',
          }),
        })
      }

      const { error: updateError } = await supabaseAdmin
        .from('lesson_reminders')
        .update({
          sent: true,
          sent_at: new Date().toISOString(),
        })
        .eq('id', reminder.id)

      if (updateError) {
        errors.push(updateError.message)
        continue
      }

      sentCount++
    }

    return NextResponse.json({
      sent: sentCount,
      errors,
      message: 'Lesson reminders processed.',
    })
  } catch (error: any) {
    console.error('Reminder cron fatal error:', error)

    return NextResponse.json(
      {
        error: error?.message || 'Unknown reminder cron error',
        details: String(error),
      },
      { status: 500 }
    )
  }
}

async function createReminderNotification({
  userId,
  role,
  title,
  message,
  link,
}: {
  userId: string
  role: 'parent' | 'tutor'
  title: string
  message: string
  link: string
}) {
  const { error } = await supabaseAdmin.from('notifications').insert({
    user_id: userId,
    role,
    title,
    message,
    type: 'lesson_reminder',
    link,
    is_read: false,
  })

  if (error) {
    console.warn('Reminder notification failed:', error.message)
  }
}

async function markReminderSkipped(id: string, reason: string) {
  await supabaseAdmin
    .from('lesson_reminders')
    .update({
      sent: true,
      sent_at: new Date().toISOString(),
      notes: reason,
    })
    .eq('id', id)
}

function lessonEmailHtml({
  greetingName,
  title,
  intro,
  studentName,
  subjectName,
  tutorName,
  lessonDate,
  lessonTime,
  timezone,
  classroomLink,
  cta,
}: {
  greetingName: string
  title: string
  intro: string
  studentName: string
  subjectName: string
  tutorName: string
  lessonDate: string
  lessonTime: string
  timezone: string
  classroomLink: string
  cta: string
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:660px;margin:auto;padding:26px;color:#241535;background:#ffffff">
      <div style="background:linear-gradient(135deg,#7c3aed,#6d28d9);border-radius:24px;padding:26px;color:white">
        <p style="margin:0 0 8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:12px">Fountain Prep</p>
        <h1 style="margin:0;font-size:30px;line-height:1.05">${escapeHtml(title)}</h1>
      </div>

      <div style="padding:24px 4px 0">
        <p>Hello ${escapeHtml(greetingName)},</p>
        <p>${escapeHtml(intro)}</p>

        <div style="background:#f6f1ff;border:1px solid #e6d8ff;border-radius:18px;padding:18px;margin:20px 0">
          <p><strong>Student:</strong> ${escapeHtml(studentName)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subjectName)}</p>
          <p><strong>Tutor:</strong> ${escapeHtml(tutorName)}</p>
          <p><strong>Date:</strong> ${escapeHtml(lessonDate)}</p>
          <p><strong>Time:</strong> ${escapeHtml(lessonTime)}</p>
          <p><strong>Timezone:</strong> ${escapeHtml(timezone)}</p>
        </div>

        <p>
          <a href="${escapeHtml(classroomLink)}" style="display:inline-block;background:#6d28d9;color:white;padding:14px 22px;border-radius:14px;text-decoration:none;font-weight:bold">
            ${escapeHtml(cta)}
          </a>
        </p>

        <p style="color:#6f637e;margin-top:24px">
          Thank you,<br/>
          Fountain Prep
        </p>
      </div>
    </div>
  `
}

function formatDate(date: string | null) {
  if (!date) return 'Date pending'

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function formatTime(time: string | null) {
  if (!time) return 'Time pending'
  return time.slice(0, 5)
}

function isValidEmail(value?: string | null): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(value: string) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}