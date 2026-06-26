export type EmailInput = {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(input: EmailInput) {
  const response = await fetch('/api/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    console.error('Email send failed:', error)
    return { ok: false, error }
  }

  return { ok: true }
}