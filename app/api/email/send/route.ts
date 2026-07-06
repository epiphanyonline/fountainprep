import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { to, subject, html, text, replyTo } = await req.json()

    const { error } = await resend.emails.send({
      from: 'Fountain Prep <noreply@fountainprep.com>',
      to,
      subject,
      html,
      text,
      replyTo: replyTo || 'support@fountainprep.com',
    })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: String(err),
      },
      { status: 500 }
    )
  }
}