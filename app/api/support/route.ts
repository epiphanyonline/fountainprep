import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    })

    return NextResponse.json({ success: true, threadId: thread.id })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Something went wrong.' },
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
}: {
  visitorName?: string
  visitorEmail?: string
  visitorPhone?: string
  role?: string
  category?: string
  subject?: string
  message?: string
  threadId?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const adminEmail =
    process.env.ADMIN_SUPPORT_EMAIL || 'support@fountainprep.com'

  if (!apiKey) {
    console.warn('RESEND_API_KEY is missing. Support email alert was not sent.')
    return
  }

  const fromAddress =
    process.env.RESEND_FROM_EMAIL ||
    'Fountain Prep Support <onboarding@resend.dev>'

  const adminUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://www.fountainprep.com'

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: adminEmail,
      reply_to: visitorEmail || undefined,
      subject: `New Fountain Prep Message: ${subject || 'Support enquiry'}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241438;background:#faf7ff;padding:24px">
          <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #eadcff;border-radius:20px;padding:24px">
            <h2 style="margin:0 0 16px;color:#241438">New Fountain Prep Support Message</h2>

            <p><strong>Subject:</strong> ${escapeHtml(subject || '-')}</p>
            <p><strong>Category:</strong> ${escapeHtml(category || '-')}</p>
            <p><strong>Role:</strong> ${escapeHtml(role || 'VISITOR')}</p>
            <p><strong>Name:</strong> ${escapeHtml(visitorName || '-')}</p>
            <p><strong>Email:</strong> ${escapeHtml(visitorEmail || '-')}</p>
            <p><strong>Phone:</strong> ${escapeHtml(visitorPhone || '-')}</p>

            <hr style="border:none;border-top:1px solid #eadcff;margin:20px 0" />

            <p><strong>Message:</strong></p>
            <div style="background:#fbf8ff;border:1px solid #eadcff;border-radius:14px;padding:16px">
              ${escapeHtml(message || '').replace(/\n/g, '<br />')}
            </div>

            <hr style="border:none;border-top:1px solid #eadcff;margin:20px 0" />

            <p><strong>Thread ID:</strong> ${escapeHtml(threadId || '-')}</p>

            <p style="margin-top:20px">
              <a href="${adminUrl}/admin/messages" style="display:inline-block;background:#6d28d9;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:999px">
                Open Admin Messages
              </a>
            </p>
          </div>
        </div>
      `,
      text: `
New Fountain Prep Support Message

Subject: ${subject || '-'}
Category: ${category || '-'}
Role: ${role || 'VISITOR'}
Name: ${visitorName || '-'}
Email: ${visitorEmail || '-'}
Phone: ${visitorPhone || '-'}

Message:
${message || ''}

Thread ID: ${threadId || '-'}
Open Admin Messages: ${adminUrl}/admin/messages
      `,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Resend support notification failed:', errorText)
  }
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