import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const expected = `Bearer ${process.env.CRON_SECRET}`

    if (authHeader !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY')
    if (!process.env.RESEND_FROM_EMAIL) throw new Error('Missing RESEND_FROM_EMAIL')
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
    }

    const { data: reminders, error: reminderError } = await supabaseAdmin
      .from('lesson_reminders')
      .select('id, booking_id, reminder_type, scheduled_for')
      .eq('sent', false)
      .lte('scheduled_for', new Date().toISOString())
      .limit(20)

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
          'id, parent_id, tutor_id, student_id, subject_id, lesson_date, lesson_time, timezone, meeting_link'
        )
        .eq('id', reminder.booking_id)
        .maybeSingle()

      if (bookingError || !booking) {
        errors.push(bookingError?.message || `Booking not found: ${reminder.booking_id}`)
        continue
      }

      const { data: parentProfile } = await supabaseAdmin
        .from('parent_profiles')
        .select('full_name, email')
        .eq('user_id', booking.parent_id)
        .maybeSingle()

      const { data: studentProfile } = await supabaseAdmin
        .from('student_profiles')
        .select('full_name')
        .eq('id', booking.student_id)
        .maybeSingle()

      const { data: tutorProfile } = await supabaseAdmin
        .from('tutor_profiles')
        .select('full_name, email')
        .eq('id', booking.tutor_id)
        .maybeSingle()

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
      const lessonTime = booking.lesson_time || 'Time pending'
      const timezone = booking.timezone || 'Timezone pending'

      const joinLink =
        booking.meeting_link ||
        `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.fountainprep.com'}/parent/dashboard`

      const parentHtml = lessonEmailHtml({
        greetingName: parentProfile?.full_name || 'there',
        title: 'FountainPrep Lesson Reminder',
        intro: `${studentName} has a private 1-to-1 ${subjectName} ${reminderLabel}.`,
        studentName,
        subjectName,
        tutorName,
        lessonDate,
        lessonTime,
        timezone,
        joinLink,
      })

      const tutorHtml = lessonEmailHtml({
        greetingName: tutorName,
        title: 'FountainPrep Tutor Reminder',
        intro: `You have a private 1-to-1 ${subjectName} lesson with ${studentName} ${reminderLabel}.`,
        studentName,
        subjectName,
        tutorName,
        lessonDate,
        lessonTime,
        timezone,
        joinLink,
      })

      if (parentProfile?.email) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: parentProfile.email,
          subject: `FountainPrep reminder: ${studentName} has a lesson ${reminderLabel}`,
          html: parentHtml,
        })
      }

      if (tutorProfile?.email) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: tutorProfile.email,
          subject: `FountainPrep tutor reminder: lesson ${reminderLabel}`,
          html: tutorHtml,
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
  joinLink,
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
  joinLink: string
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:24px;color:#241535">
      <h1 style="color:#6d28d9;margin-bottom:12px">${title}</h1>
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
        <a href="${joinLink}" style="display:inline-block;background:#6d28d9;color:white;padding:14px 22px;border-radius:14px;text-decoration:none;font-weight:bold">
          Join Lesson
        </a>
      </p>

      <p style="color:#6f637e;margin-top:24px">
        Thank you,<br/>
        FountainPrep
      </p>
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

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}