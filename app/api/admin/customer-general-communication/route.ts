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
  userId?: string
  parentProfileId?: string
  name?: string
  email?: string | null
  accountType?: 'PARENT' | 'ADULT_LEARNER' | string
}

type RequestBody = {
  subject?: string
  heading?: string
  message?: string
  buttonText?: string | null
  buttonUrl?: string | null
  audienceType?: string
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
      const content = escapeHtml(
        paragraph.trim()
      ).replace(/\n/g, '<br />')

      return `
        <p
          style="
            margin:0 0 18px;
            color:#655873;
            font-size:16px;
            line-height:1.75;
          "
        >
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
            <td
              align="center"
              style="padding:32px 16px;"
            >
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
                      background:
                        linear-gradient(
                          135deg,
                          #5b21b6,
                          #7c3aed
                        );
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
                      Learning & Family Update
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
                        Need help? Email
                        <a
                          href="mailto:support@fountainprep.com"
                          style="
                            color:#6d28d9;
                            font-weight:700;
                          "
                        >
                          support@fountainprep.com
                        </a>
                        or visit
                        <a
                          href="https://www.fountainprep.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          style="
                            color:#6d28d9;
                            font-weight:700;
                          "
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
                      <strong>
                        Fountain Prep Team
                      </strong>
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
                    You are receiving this message
                    because you have a Fountain Prep
                    account.
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

export async function POST(
  request: Request
) {
  try {
    const authHeader =
      request.headers.get('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      )
    }

    const accessToken =
      authHeader.slice('Bearer '.length)

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(
      accessToken
    )

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      )
    }

    const { data: adminProfile } =
      await supabaseAdmin
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

    if (adminProfile?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required.' },
        { status: 403 }
      )
    }

    const body =
      (await request.json()) as RequestBody

    const subject = body.subject?.trim()
    const heading = body.heading?.trim()
    const message = body.message?.trim()

    const buttonText =
      body.buttonText?.trim() || null

    const buttonUrl =
      body.buttonUrl?.trim() || null

    const audienceType =
      body.audienceType?.trim() || 'MIXED'

    const recipients =
      body.recipients ?? []

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
        {
          error:
            'Select at least one parent or adult learner.',
        },
        { status: 400 }
      )
    }

    if (
      (buttonText && !buttonUrl) ||
      (!buttonText && buttonUrl)
    ) {
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
          {
            error:
              'Enter a valid button URL.',
          },
          { status: 400 }
        )
      }
    }

    const recipientMap =
      new Map<string, Recipient>()

    for (const recipient of recipients) {
      const email =
        recipient.email
          ?.trim()
          .toLowerCase()

      if (!email) continue

      recipientMap.set(email, {
        ...recipient,
        email,
      })
    }

    const validRecipients =
      Array.from(recipientMap.values())

    if (validRecipients.length === 0) {
      return NextResponse.json(
        {
          error:
            'The selected accounts do not have valid email addresses.',
        },
        { status: 400 }
      )
    }

    const {
  data: communication,
  error: communicationInsertError,
} = await supabaseAdmin
  .from('customer_communications')
  .insert({
    communication_type: 'GENERAL',
    audience_type: audienceType,
    subject,
    heading,
    message,
    button_text: buttonText,
    button_url: buttonUrl,
    recipient_count: validRecipients.length,
    sent_count: 0,
    failed_count: 0,
    status: 'PENDING',
    created_by: user.id,
  })
  .select('id')
  .single()

if (
  communicationInsertError ||
  !communication
) {
  throw new Error(
    communicationInsertError?.message ||
      'Unable to create communication record.'
  )
}

const communicationId =
  communication.id

const results =
  await Promise.allSettled(
    validRecipients.map(
      async (recipient) => {
        const email =
          recipient.email?.trim()

        if (!email) {
          throw new Error(
            'Recipient email is missing.'
          )
        }

        const recipientName =
          recipient.name?.trim() ||
          'Fountain Prep Learner'

        const sentAt =
          new Date().toISOString()

        try {
          const {
            data,
            error,
          } =
            await resend.emails.send({
              from:
                'Fountain Prep <support@fountainprep.com>',
              to: email,
              subject,
              html: buildEmailHtml({
                recipientName,
                heading,
                message,
                buttonText,
                buttonUrl,
              }),
            })

          if (error) {
            throw new Error(
              error.message ||
                `Email failed for ${email}.`
            )
          }

          const {
            error: deliveryError,
          } = await supabaseAdmin
            .from(
              'customer_communication_deliveries'
            )
            .insert({
              communication_id:
                communicationId,

              user_id:
                recipient.userId || null,

              recipient_name:
                recipientName,

              recipient_email:
                email,

              account_type:
                recipient.accountType ||
                null,

              delivery_status:
                'SENT',

              resend_id:
                data?.id ?? null,

              error_message:
                null,

              sent_at:
                sentAt,
            })

          if (deliveryError) {
            console.error(
              'Unable to save sent delivery:',
              deliveryError.message
            )
          }

          return {
            email,
            resendId:
              data?.id ?? null,
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : `Email failed for ${email}.`

          const {
            error: deliveryError,
          } = await supabaseAdmin
            .from(
              'customer_communication_deliveries'
            )
            .insert({
              communication_id:
                communicationId,

              user_id:
                recipient.userId || null,

              recipient_name:
                recipientName,

              recipient_email:
                email,

              account_type:
                recipient.accountType ||
                null,

              delivery_status:
                'FAILED',

              resend_id:
                null,

              error_message:
                errorMessage,

              sent_at:
                null,
            })

          if (deliveryError) {
            console.error(
              'Unable to save failed delivery:',
              deliveryError.message
            )
          }

          throw error
        }
      }
    )
  )

const sent =
  results.filter(
    (result) =>
      result.status === 'fulfilled'
  ).length

const failed =
  results.length - sent

const communicationStatus =
  failed === 0
    ? 'SENT'
    : sent > 0
      ? 'PARTIAL'
      : 'FAILED'

const {
  error: communicationUpdateError,
} = await supabaseAdmin
  .from('customer_communications')
  .update({
    sent_count: sent,
    failed_count: failed,
    status:
      communicationStatus,
    updated_at:
      new Date().toISOString(),
  })
  .eq('id', communicationId)

if (communicationUpdateError) {
  console.error(
    'Unable to update communication totals:',
    communicationUpdateError.message
  )
}

    return NextResponse.json({
      success:
        failed === 0,

      sent,
      failed,

      message:
        failed === 0
          ? `Communication sent successfully to ${sent} account${
              sent !== 1 ? 's' : ''
            }.`
          : `Communication sent to ${sent} account${
              sent !== 1 ? 's' : ''
            }. ${failed} email${
              failed !== 1 ? 's' : ''
            } failed.`,
    })
  } catch (error) {
    console.error(
      'Customer communication error:',
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to send customer communication.',
      },
      { status: 500 }
    )
  }
}