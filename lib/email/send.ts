import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Use verified domain or Resend's default sender
// Once thehumanfactor.ca is verified in Resend, change back to: 'The Human Factor <info@thehumanfactor.ca>'
const FROM_ADDRESS = 'The Human Factor <onboarding@resend.dev>'

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
    console.log('[Email] Resend not configured (no RESEND_API_KEY), skipping email to:', to)
    return false
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('[Email] Resend error:', JSON.stringify(error))
      return false
    }

    console.log('[Email] Sent successfully to:', to, 'id:', data?.id)
    return true
  } catch (err) {
    console.error('[Email] Failed to send:', err)
    return false
  }
}
