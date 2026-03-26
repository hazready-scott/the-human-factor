import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/send'
import { quizResultsEmail } from '@/lib/email/templates'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function supabasePost(table: string, data: Record<string, unknown>, returnData = false) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': returnData ? 'return=representation' : 'return=minimal',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errText = await res.text()
    console.error(`Supabase ${table} insert error:`, res.status, errText)
    return null
  }
  if (returnData) {
    const rows = await res.json()
    return rows[0] || null
  }
  return true
}

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

    // Determine readiness level
    const readiness_level =
      overall_score >= 78 ? 'Implementation Ready' :
      overall_score >= 56 ? 'Ready for Assessment' :
      overall_score >= 34 ? 'Getting Ready' :
      'Foundation Building'

    // Insert assessment
    const assessment = await supabasePost('aria_assessments', {
      name, email, org_name: org_name || null,
      industry, org_size: org_size || null, role: role || null,
      overall_score, dimension_scores, raw_intake, raw_answers,
      readiness_level,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      referrer: referrer || null,
    }, true)

    if (!assessment) {
      return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 })
    }

    // Upsert contact (try insert, ignore conflict on existing email)
    await supabasePost('contacts', {
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

    // Send results email to the person who completed the quiz
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
