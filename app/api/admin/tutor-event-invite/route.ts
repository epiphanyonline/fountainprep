import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const resendApiKey = process.env.RESEND_API_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
}

if (!resendApiKey) {
  throw new Error('Missing RESEND_API_KEY')
}

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey
)

const resend = new Resend(resendApiKey)

type RequestBody = {
  eventId?: string
  subject?: string
  buttonText?: string
}

type TutorEvent = {
  id: string
  event_type: string
  title: string
  description: string | null
  event_date: string
  start_time: string
  end_time: string | null
  timezone: string
  meeting_link: string
  status: string
}

type TutorEventInvite = {
  id: string
  tutor_id: string
  tutor_user_id: string | null
  tutor_name: string
  tutor_email: string
  email_status: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatEmailParagraphs(value: string) {
  const cleanValue = value
    .replace(/\r\n/g, '\n')
    .trim()

  if (!cleanValue) {
    return ''
  }

  return cleanValue
    .split(/\n\s*\n/)
    .map((paragraph) => {
      const formattedParagraph = escapeHtml(
        paragraph.trim()
      ).replace(/\n/g, '<br />')

      return `
        <p style="
          margin:0 0 18px;
          color:#655873;
          font-size:16px;
          line-height:1.75;
        ">
          ${formattedParagraph}
        </p>
      `
    })
    .join('')
}

function formatEventType(value: string) {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    )
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${value}T12:00:00`))
  } catch {
    return value
  }
}

function formatTime(value: string | null) {
  if (!value) return null
  return value.slice(0, 5)
}

function buildEmailHtml(
  invite: TutorEventInvite,
  event: TutorEvent,
  buttonText: string
) {
  const tutorName = escapeHtml(invite.tutor_name)
  const title = escapeHtml(event.title)
  const eventType = escapeHtml(
    formatEventType(event.event_type)
  )

  const eventDate = escapeHtml(
    formatDate(event.event_date)
  )

  const startTime = escapeHtml(
    formatTime(event.start_time) || ''
  )

  const endTime = event.end_time
    ? escapeHtml(formatTime(event.end_time) || '')
    : null

  const timezone = escapeHtml(event.timezone)
  const meetingLink = escapeHtml(event.meeting_link)
  const safeButtonText = escapeHtml(buttonText)

  const descriptionHtml = formatEmailParagraphs(
    event.description ||
      'You are invited to attend an important Fountain Prep tutor session.'
  )

  const timeDisplay = endTime
    ? `${startTime} – ${endTime}`
    : startTime

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>${title}</title>
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
                      padding:34px 34px 28px;
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
                      ${eventType}
                    </div>

                    <h1
                      style="
                        margin:12px 0 0;
                        font-size:32px;
                        line-height:1.15;
                      "
                    >
                      ${title}
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
                      Dear ${tutorName},
                    </p>

                    <div style="margin:0 0 24px;">
                      ${descriptionHtml}
                    </div>

                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        background:#faf7ff;
                        border:1px solid #eadffd;
                        border-radius:18px;
                      "
                    >
                      <tr>
                        <td style="padding:20px;">
                          <div style="margin-bottom:14px;">
                            <div
                              style="
                                font-size:12px;
                                font-weight:700;
                                color:#7c3aed;
                                text-transform:uppercase;
                              "
                            >
                              Date
                            </div>

                            <div
                              style="
                                margin-top:5px;
                                font-size:16px;
                                font-weight:700;
                              "
                            >
                              ${eventDate}
                            </div>
                          </div>

                          <div style="margin-bottom:14px;">
                            <div
                              style="
                                font-size:12px;
                                font-weight:700;
                                color:#7c3aed;
                                text-transform:uppercase;
                              "
                            >
                              Time
                            </div>

                            <div
                              style="
                                margin-top:5px;
                                font-size:16px;
                                font-weight:700;
                              "
                            >
                              ${timeDisplay}
                            </div>
                          </div>

                          <div>
                            <div
                              style="
                                font-size:12px;
                                font-weight:700;
                                color:#7c3aed;
                                text-transform:uppercase;
                              "
                            >
                              Timezone
                            </div>

                            <div
                              style="
                                margin-top:5px;
                                font-size:16px;
                                font-weight:700;
                              "
                            >
                              ${timezone}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>

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
                            href="${meetingLink}"
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

                    <p
                      style="
                        margin:28px 0 0;
                        font-size:14px;
                        line-height:1.7;
                        color:#756981;
                      "
                    >
                      Please join at least five minutes before the
                      scheduled start time.
                    </p>

                    <div
                      style="
                        margin-top:26px;
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
                        margin:24px 0 0;
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
                    This invitation was sent to approved Fountain Prep
                    tutors.
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

    const eventId = body.eventId?.trim()
    const customSubject = body.subject?.trim()
    const buttonText =
      body.buttonText?.trim() || 'Join Session'

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing eventId.' },
        { status: 400 }
      )
    }

    const { data: event, error: eventError } =
      await supabaseAdmin
        .from('tutor_events')
        .select(`
          id,
          event_type,
          title,
          description,
          event_date,
          start_time,
          end_time,
          timezone,
          meeting_link,
          status
        `)
        .eq('id', eventId)
        .single()

    if (eventError || !event) {
      return NextResponse.json(
        {
          error:
            eventError?.message ||
            'Tutor event was not found.',
        },
        { status: 404 }
      )
    }

    if (!event.meeting_link) {
      return NextResponse.json(
        { error: 'The event does not have a meeting link.' },
        { status: 400 }
      )
    }

    const { data: invites, error: inviteError } =
      await supabaseAdmin
        .from('tutor_event_invites')
        .select(`
          id,
          tutor_id,
          tutor_user_id,
          tutor_name,
          tutor_email,
          email_status
        `)
        .eq('event_id', eventId)

    if (inviteError) {
      return NextResponse.json(
        { error: inviteError.message },
        { status: 500 }
      )
    }

    const validInvites = (
      (invites ?? []) as TutorEventInvite[]
    ).filter((invite) => Boolean(invite.tutor_email?.trim()))

    if (validInvites.length === 0) {
      return NextResponse.json(
        {
          error:
            'No tutor email addresses were found for this event.',
        },
        { status: 400 }
      )
    }

    const eventRecord = event as TutorEvent

    const emailSubject =
      customSubject ||
      `${formatEventType(eventRecord.event_type)}: ${
        eventRecord.title
      }`

    const results = await Promise.allSettled(
      validInvites.map(async (invite) => {
        const { data, error } = await resend.emails.send({
          from: 'Fountain Prep <support@fountainprep.com>',
          to: invite.tutor_email,
          subject: emailSubject,
          html: buildEmailHtml(
            invite,
            eventRecord,
            buttonText
          ),
        })

        if (error) {
          await supabaseAdmin
            .from('tutor_event_invites')
            .update({
              email_status: 'FAILED',
            })
            .eq('id', invite.id)

          throw new Error(
            error.message ||
              `Email failed for ${invite.tutor_email}.`
          )
        }

        await supabaseAdmin
          .from('tutor_event_invites')
          .update({
            email_status: 'SENT',
            sent_at: new Date().toISOString(),
          })
          .eq('id', invite.id)

        return {
          email: invite.tutor_email,
          resendId: data?.id ?? null,
        }
      })
    )

    const sent = results.filter(
      (result) => result.status === 'fulfilled'
    ).length

    const failed = results.length - sent

    return NextResponse.json({
      success: failed === 0,
      sent,
      failed,
      message:
        failed === 0
          ? `Invitation sent successfully to ${sent} tutor${
              sent !== 1 ? 's' : ''
            }.`
          : `Invitation sent to ${sent} tutor${
              sent !== 1 ? 's' : ''
            }. ${failed} email${failed !== 1 ? 's' : ''} failed.`,
    })
  } catch (error) {
    console.error('Tutor event invitation error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to send tutor event invitations.',
      },
      { status: 500 }
    )
  }
}