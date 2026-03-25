import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (!resend) {
    console.log('[Email] Resend not configured, skipping email to:', to)
    return false
  }

  try {
    await resend.emails.send({
      from: 'The Human Factor <info@thehumanfactor.ca>',
      to,
      subject,
      html,
    })
    return true
  } catch (err) {
    console.error('[Email] Failed to send:', err)
    return false
  }
}
