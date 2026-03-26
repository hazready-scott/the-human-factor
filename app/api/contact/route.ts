import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/send'
import { contactConfirmationEmail, contactNotificationEmail } from '@/lib/email/templates'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, organization, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    // Insert contact using REST API with anon key (anon INSERT policy enabled)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        name,
        email,
        organization: organization || null,
        message,
        source: 'contact_form',
        status: 'new',
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error('Contact insert error:', res.status, errBody)
      return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 })
    }

    // Send confirmation email to the person who submitted
    await sendEmail({
      to: email,
      subject: 'Thank you for reaching out — The Human Factor',
      html: contactConfirmationEmail(name),
    })

    // Send notification email to admin
    await sendEmail({
      to: 'info@thehumanfactor.ca',
      subject: `New contact: ${name}`,
      html: contactNotificationEmail({ name, email, organization, message }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
