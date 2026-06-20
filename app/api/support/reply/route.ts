import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { threadId, adminUserId, reply } = await req.json()

    if (!threadId || !adminUserId || !reply?.trim()) {
      return NextResponse.json(
        { error: 'Thread ID, admin ID and reply are required.' },
        { status: 400 }
      )
    }

    const { data: thread, error: threadError } = await supabaseAdmin
      .from('support_threads')
      .select('*')
      .eq('id', threadId)
      .single()

    if (threadError || !thread) {
      return NextResponse.json(
        { error: threadError?.message || 'Thread not found.' },
        { status: 404 }
      )
    }

    const now = new Date().toISOString()

    const { error: messageError } = await supabaseAdmin
      .from('support_messages')
      .insert({
        thread_id: threadId,
        sender_id: adminUserId,
        sender_role: 'ADMIN',
        message: reply.trim(),
      })

    if (messageError) {
      return NextResponse.json({ error: messageError.message }, { status: 500 })
    }

    await supabaseAdmin
      .from('support_threads')
      .update({
        status: 'pending',
        updated_at: now,
        last_message_at: now,
        admin_read: true,
        admin_read_at: now,
      })
      .eq('id', threadId)

    if (thread.visitor_email) {
      await sendReplyEmail({
        to: thread.visitor_email,
        name: thread.visitor_name || thread.role || 'there',
        subject: thread.subject,
        reply: reply.trim(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Something went wrong.' },
      { status: 500 }
    )
  }
}

async function sendReplyEmail({
  to,
  name,
  subject,
  reply,
}: {
  to: string
  name: string
  subject: string
  reply: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

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
      to,
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241438;background:#faf7ff;padding:24px">
          <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #eadcff;border-radius:20px;padding:24px">
            <h2 style="margin:0 0 16px;color:#241438">Fountain Prep Support</h2>
            <p>Hello ${escapeHtml(name)},</p>
            <div style="background:#fbf8ff;border:1px solid #eadcff;border-radius:14px;padding:16px">
              ${escapeHtml(reply).replace(/\n/g, '<br />')}
            </div>
            <p style="margin-top:20px;color:#6f637e">
              Thank you,<br />
              Fountain Prep Support
            </p>
          </div>
        </div>
      `,
      text: `Hello ${name},

${reply}

Thank you,
Fountain Prep Support`,
    }),
  })
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}