import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type SupportRequestBody = {
  visitorName?: string
  visitorEmail?: string
  visitorPhone?: string
  role?: string
  category?: string
  subject?: string
  message?: string
  userId?: string | null
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SupportRequestBody

    const role = cleanText(body.role || 'VISITOR').toUpperCase()
    const category = cleanText(body.category || 'general')
    const subject = cleanText(body.subject)
    const message = cleanText(body.message)
    const userId = body.userId || null
    const visitorPhone = cleanText(body.visitorPhone)

    let visitorName = cleanText(body.visitorName)
    let visitorEmail = cleanText(body.visitorEmail).toLowerCase()

    if (userId && !visitorEmail) {
      const { data: authUser, error: authError } =
        await supabaseAdmin.auth.admin.getUserById(userId)

      if (!authError && authUser?.user) {
        visitorEmail = authUser.user.email || ''
        visitorName =
          visitorName ||
          authUser.user.user_metadata?.full_name ||
          authUser.user.user_metadata?.name ||
          role
      }
    }

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required.' },
        { status: 400 }
      )
    }

    if (!visitorEmail) {
      return NextResponse.json(
        { error: 'Email is required so Fountain Prep can reply.' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const ticketNumber = makeTicketNumber()

    const { data: thread, error: threadError } = await supabaseAdmin
      .from('support_threads')
      .insert({
        created_by: userId,
        role,
        visitor_name: visitorName || role,
        visitor_email: visitorEmail,
        visitor_phone: visitorPhone || null,
        subject,
        category,
        status: 'open',
        priority:
          category === 'safeguarding' || category === 'complaint'
            ? 'high'
            : 'normal',
        admin_read: false,
        last_message_at: now,
        updated_at: now,
        ticket_number: ticketNumber,
      })
      .select('id')
      .single()

    if (threadError || !thread) {
      return NextResponse.json(
        { error: threadError?.message || 'Unable to create enquiry.' },
        { status: 500 }
      )
    }

    const { error: messageError } = await supabaseAdmin
      .from('support_messages')
      .insert({
        thread_id: thread.id,
        sender_id: userId,
        sender_role: role,
        message,
      })

    if (messageError) {
      return NextResponse.json(
        { error: messageError.message },
        { status: 500 }
      )
    }

    await sendAdminNotification({
      visitorName: visitorName || role,
      visitorEmail,
      visitorPhone,
      role,
      category,
      subject,
      message,
      threadId: thread.id,
      ticketNumber,
    })

    await sendCustomerAcknowledgement({
      visitorName: visitorName || role,
      visitorEmail,
      subject,
      ticketNumber,
    })

    return NextResponse.json({
      success: true,
      threadId: thread.id,
      ticketNumber,
    })
  } catch (error: any) {
    console.error('SUPPORT API ERROR:', error)

    return NextResponse.json(
      { error: 'Unable to send message right now. Please try again.' },
      { status: 500 }
    )
  }
}

async function sendAdminNotification({
  visitorName,
  visitorEmail,
  visitorPhone,
  role,
  category,
  subject,
  message,
  threadId,
  ticketNumber,
}: {
  visitorName?: string
  visitorEmail?: string
  visitorPhone?: string
  role?: string
  category?: string
  subject?: string
  message?: string
  threadId?: string
  ticketNumber?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const adminEmail =
    process.env.ADMIN_SUPPORT_EMAIL || 'support@fountainprep.com'

  if (!apiKey) return

  const fromAddress =
    process.env.RESEND_FROM_EMAIL ||
    'Fountain Prep Support <onboarding@resend.dev>'

  const adminUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://www.fountainprep.com'

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: adminEmail,
      reply_to: visitorEmail || undefined,
      subject: `New Fountain Prep Message (${ticketNumber}): ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241438;background:#faf7ff;padding:24px">
          <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #eadcff;border-radius:20px;padding:24px">
            <h2>New Fountain Prep Support Message</h2>

            <p><strong>Ticket:</strong> ${escapeHtml(ticketNumber || '-')}</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject || '-')}</p>
            <p><strong>Category:</strong> ${escapeHtml(category || '-')}</p>
            <p><strong>Role:</strong> ${escapeHtml(role || 'VISITOR')}</p>
            <p><strong>Name:</strong> ${escapeHtml(visitorName || '-')}</p>
            <p><strong>Email:</strong> ${escapeHtml(visitorEmail || '-')}</p>
            <p><strong>Phone:</strong> ${escapeHtml(visitorPhone || '-')}</p>

            <hr />

            <p><strong>Message:</strong></p>
            <div style="background:#fbf8ff;border:1px solid #eadcff;border-radius:14px;padding:16px">
              ${escapeHtml(message || '').replace(/\n/g, '<br />')}
            </div>

            <p style="margin-top:20px">
              <a href="${adminUrl}/admin/messages" style="display:inline-block;background:#6d28d9;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:999px">
                Open Admin Messages
              </a>
            </p>
          </div>
        </div>
      `,
    }),
  })
}

async function sendCustomerAcknowledgement({
  visitorName,
  visitorEmail,
  subject,
  ticketNumber,
}: {
  visitorName?: string
  visitorEmail?: string
  subject?: string
  ticketNumber?: string
}) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey || !visitorEmail) return

  const fromAddress =
    process.env.RESEND_FROM_EMAIL ||
    'Fountain Prep Support <onboarding@resend.dev>'

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: visitorEmail,
      subject: `Fountain Prep Support Request Received (${ticketNumber})`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#faf7ff;padding:24px;color:#241438">
          <div style="max-width:650px;margin:0 auto;background:#ffffff;border:1px solid #eadcff;border-radius:20px;padding:32px">
            <h2 style="margin-top:0;color:#241438">Thank you for contacting Fountain Prep</h2>

            <p>Hello ${escapeHtml(visitorName || 'there')},</p>

            <p>We have received your support request successfully.</p>

            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:16px;padding:20px;margin:24px 0;text-align:center">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#166534;font-weight:700">
                Reference Number
              </div>
              <div style="margin-top:8px;font-size:28px;font-weight:900;color:#166534">
                ${escapeHtml(ticketNumber || '-')}
              </div>
            </div>

            <p><strong>Subject:</strong> ${escapeHtml(subject || '-')}</p>

            <p>A member of our team will normally respond within <strong>24 hours</strong>.</p>

            <p>Please keep your reference number for future enquiries.</p>

            <hr style="border:none;border-top:1px solid #eadcff;margin:24px 0" />

            <p style="font-size:14px;color:#6f637e">
              Fountain Prep Support Team<br />
              support@fountainprep.com
            </p>
          </div>
        </div>
      `,
      text: `
Thank you for contacting Fountain Prep.

Reference Number:
${ticketNumber}

Subject:
${subject}

We have received your enquiry successfully.

A member of our team will normally respond within 24 hours.

Fountain Prep Support
support@fountainprep.com
      `,
    }),
  })
}

function makeTicketNumber() {
  const now = new Date()

  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')

  const randomPart = Math.floor(100 + Math.random() * 900)

  return `FP-${datePart}-${randomPart}`
}

function cleanText(value?: string | null) {
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}