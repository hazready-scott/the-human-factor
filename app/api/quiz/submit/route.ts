import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/send'
import { quizResultsEmail } from '@/lib/email/templates'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name, email, org_name, industry, org_size, role,
      overall_score, dimension_scores, raw_intake, raw_answers,
      utm_source, utm_medium, utm_campaign, referrer,
    } = body

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    let supabase
    try {
      supabase = createAdminClient()
    } catch (err) {
      console.error('Admin client creation failed:', err)
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const readiness_level =
      overall_score >= 78 ? 'Implementation Ready' :
      overall_score >= 56 ? 'Ready for Assessment' :
      overall_score >= 34 ? 'Getting Ready' :
      'Foundation Building'

    // Insert assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('aria_assessments')
      .insert({
        name, email, org_name: org_name || null,
        industry, org_size: org_size || null, role: role || null,
        overall_score, dimension_scores, raw_intake, raw_answers,
        readiness_level,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        referrer: referrer || null,
      })
      .select('id')
      .single()

    if (assessmentError) {
      console.error('Assessment insert error:', JSON.stringify(assessmentError))
      return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 })
    }

    // Upsert contact
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', email)
      .single()

    if (existingContact) {
      await supabase.from('contacts').update({
        assessment_id: assessment.id,
        name,
        organization: org_name || null,
      }).eq('id', existingContact.id)
    } else {
      await supabase.from('contacts').insert({
        name,
        email,
        organization: org_name || null,
        source: 'quiz_submission',
        status: 'new',
        assessment_id: assessment.id,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
      })
    }

    // Send results email
    await sendEmail({
      to: email,
      subject: 'Your AI Readiness Results — The Human Factor',
      html: quizResultsEmail(name, overall_score, dimension_scores),
    })

    return NextResponse.json({ success: true, assessmentId: assessment.id })
  } catch (err) {
    console.error('Quiz submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
