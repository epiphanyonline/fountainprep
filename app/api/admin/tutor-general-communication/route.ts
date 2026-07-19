import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!resendApiKey) {
  throw new Error('Missing RESEND_API_KEY')
}

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
}

const resend = new Resend(resendApiKey)

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey
)

type Recipient = {
  tutorId?: string
  tutorUserId?: string
  name?: string
  email?: string | null
}

type RequestBody = {
  subject?: string
  heading?: string
  message?: string
  buttonText?: string | null
  buttonUrl?: string | null
  recipients?: Recipient[]
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatParagraphs(value: string) {
  return value
    .replace(/\r\n/g, '\n')
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => {
      const content = escapeHtml(paragraph.trim()).replace(/\n/g, '<br />')

      return `
        <p style="
          margin:0 0 18px;
          color:#655873;
          font-size:16px;
          line-height:1.75;
        ">
          ${content}
        </p>
      `
    })
    .join('')
}

function buildEmailHtml({
  recipientName,
  heading,
  message,
  buttonText,
  buttonUrl,
}: {
  recipientName: string
  heading: string
  message: string
  buttonText?: string | null
  buttonUrl?: string | null
}) {
  const safeName = escapeHtml(recipientName)
  const safeHeading = escapeHtml(heading)
  const messageHtml = formatParagraphs(message)

  const safeButtonText = buttonText
    ? escapeHtml(buttonText)
    : null

  const safeButtonUrl = buttonUrl
    ? escapeHtml(buttonUrl)
    : null

  const buttonHtml =
    safeButtonText && safeButtonUrl
      ? `
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="margin-top:28px;"
        >
          <tr>
            <td align="center">
              <a
                href="${safeButtonUrl}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                  display:inline-block;
                  padding:16px 28px;
                  border-radius:14px;
                  background:#6d28d9;
                  color:#ffffff;
                  text-decoration:none;
                  font-size:16px;
                  font-weight:700;
                "
              >
                ${safeButtonText}
              </a>
            </td>
          </tr>
        </table>
      `
      : ''

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>${safeHeading}</title>
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f7f3ff;
          font-family:Arial,Helvetica,sans-serif;
          color:#261735;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
        >
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  max-width:640px;
                  background:#ffffff;
                  border-radius:24px;
                  overflow:hidden;
                  border:1px solid #eadffd;
                "
              >
                <tr>
                  <td
                    style="
                      padding:34px;
                      background:#6d28d9;
                      color:#ffffff;
                    "
                  >
                    <div
                      style="
                        font-size:15px;
                        font-weight:700;
                        margin-bottom:10px;
                      "
                    >
                      Fountain Prep
                    </div>

                    <div
                      style="
                        font-size:13px;
                        font-weight:700;
                        opacity:.88;
                        text-transform:uppercase;
                        letter-spacing:1.3px;
                      "
                    >
                      Tutor Communication
                    </div>

                    <h1
                      style="
                        margin:12px 0 0;
                        font-size:32px;
                        line-height:1.15;
                      "
                    >
                      ${safeHeading}
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:34px;">
                    <p
                      style="
                        margin:0 0 18px;
                        font-size:17px;
                        line-height:1.7;
                      "
                    >
                      Dear ${safeName},
                    </p>

                    <div>
                      ${messageHtml}
                    </div>

                    ${buttonHtml}

                    <div
                      style="
                        margin-top:30px;
                        padding:18px;
                        background:#faf7ff;
                        border:1px solid #eadffd;
                        border-radius:16px;
                      "
                    >
                      <p
                        style="
                          margin:0;
                          color:#655873;
                          font-size:14px;
                          line-height:1.7;
                        "
                      >
                        Need assistance? Email
                        <a
                          href="mailto:support@fountainprep.com"
                          style="color:#6d28d9;font-weight:700;"
                        >
                          support@fountainprep.com
                        </a>
                        or visit
                        <a
                          href="https://www.fountainprep.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          style="color:#6d28d9;font-weight:700;"
                        >
                          www.fountainprep.com
                        </a>.
                      </p>
                    </div>

                    <p
                      style="
                        margin:28px 0 0;
                        font-size:15px;
                        line-height:1.7;
                      "
                    >
                      Kind regards,<br />
                      <strong>Fountain Prep Team</strong>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:20px 34px;
                      background:#faf7ff;
                      color:#81758e;
                      font-size:12px;
                      line-height:1.6;
                      text-align:center;
                    "
                  >
                    This communication was sent to an approved Fountain Prep
                    tutor.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody

    const subject = body.subject?.trim()
    const heading = body.heading?.trim()
    const message = body.message?.trim()
    const buttonText = body.buttonText?.trim() || null
    const buttonUrl = body.buttonUrl?.trim() || null
    const recipients = body.recipients ?? []

    if (!subject) {
      return NextResponse.json(
        { error: 'Email subject is required.' },
        { status: 400 }
      )
    }

    if (!heading) {
      return NextResponse.json(
        { error: 'Email heading is required.' },
        { status: 400 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Email message is required.' },
        { status: 400 }
      )
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'Select at least one tutor.' },
        { status: 400 }
      )
    }

    if ((buttonText && !buttonUrl) || (!buttonText && buttonUrl)) {
      return NextResponse.json(
        {
          error:
            'Button text and button URL must be provided together.',
        },
        { status: 400 }
      )
    }

    if (buttonUrl) {
      try {
        new URL(buttonUrl)
      } catch {
        return NextResponse.json(
          { error: 'Enter a valid button URL.' },
          { status: 400 }
        )
      }
    }

    const validRecipients = recipients.filter((recipient) =>
      Boolean(recipient.email?.trim())
    )

    if (validRecipients.length === 0) {
      return NextResponse.json(
        {
          error:
            'The selected tutors do not have valid email addresses.',
        },
        { status: 400 }
      )
    }

    const results = await Promise.allSettled(
      validRecipients.map(async (recipient) => {
        const email = recipient.email?.trim()

        if (!email) {
          throw new Error('Tutor email is missing.')
        }

        const { data, error } = await resend.emails.send({
          from: 'Fountain Prep <support@fountainprep.com>',
          to: email,
          subject,
          html: buildEmailHtml({
            recipientName: recipient.name?.trim() || 'Tutor',
            heading,
            message,
            buttonText,
            buttonUrl,
          }),
        })

        if (error) {
          throw new Error(
            error.message || `Email failed for ${email}.`
          )
        }

        return {
          email,
          resendId: data?.id ?? null,
        }
      })
    )

    const sent = results.filter(
      (result) => result.status === 'fulfilled'
    ).length

    const failed = results.length - sent

    const communicationStatus =
      failed === 0
        ? 'SENT'
        : sent > 0
          ? 'PARTIAL'
          : 'FAILED'

    const { error: communicationError } = await supabaseAdmin
      .from('tutor_communications')
      .insert({
        communication_type: 'GENERAL',
        subject,
        heading,
        message,
        button_text: buttonText,
        button_url: buttonUrl,
        recipient_count: validRecipients.length,
        sent_count: sent,
        failed_count: failed,
        status: communicationStatus,
      })

    if (communicationError) {
      console.error(
        'Unable to save communication history:',
        communicationError.message
      )
    }

    return NextResponse.json({
      success: failed === 0,
      sent,
      failed,
      message:
        failed === 0
          ? `Communication sent successfully to ${sent} tutor${
              sent !== 1 ? 's' : ''
            }.`
          : `Communication sent to ${sent} tutor${
              sent !== 1 ? 's' : ''
            }. ${failed} email${failed !== 1 ? 's' : ''} failed.`,
    })
  } catch (error) {
    console.error('Tutor communication error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to send tutor communication.',
      },
      { status: 500 }
    )
  }
}