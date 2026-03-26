import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/send'
import { contactConfirmationEmail, contactNotificationEmail } from '@/lib/email/templates'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, organization, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    let supabase
    try {
      supabase = createAdminClient()
    } catch (err) {
      console.error('Admin client creation failed:', err)
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { data, error } = await supabase.from('contacts').insert({
      name,
      email,
      organization: organization || null,
      message,
      source: 'contact_form',
      status: 'new',
    }).select('id').single()

    if (error) {
      console.error('Contact insert FULL error:', error.message, error.code, error.details, error.hint)
      console.error('Service role key starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20))
      return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 })
    }

    // Send confirmation email to submitter
    await sendEmail({
      to: email,
      subject: 'Thank you for reaching out — The Human Factor',
      html: contactConfirmationEmail(name),
    })

    // Send notification to admin
    await sendEmail({
      to: 'info@thehumanfactor.ca',
      subject: `New contact: ${name}`,
      html: contactNotificationEmail({ name, email, organization, message }),
    })

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
