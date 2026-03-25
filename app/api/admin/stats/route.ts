import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [contacts, assessments, articles] = await Promise.all([
    supabase.from('contacts').select('id, status, source, created_at'),
    supabase.from('aria_assessments').select('id, created_at'),
    supabase.from('articles').select('id, status'),
  ])

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const contactList = contacts.data || []
  const assessmentList = assessments.data || []
  const articleList = articles.data || []

  return NextResponse.json({
    contacts: {
      total: contactList.length,
      new: contactList.filter(c => c.status === 'new').length,
      thisWeek: contactList.filter(c => new Date(c.created_at) > weekAgo).length,
      byStatus: {
        new: contactList.filter(c => c.status === 'new').length,
        contacted: contactList.filter(c => c.status === 'contacted').length,
        qualified: contactList.filter(c => c.status === 'qualified').length,
        proposal: contactList.filter(c => c.status === 'proposal').length,
        client: contactList.filter(c => c.status === 'client').length,
        archived: contactList.filter(c => c.status === 'archived').length,
      },
      bySource: {
        contact_form: contactList.filter(c => c.source === 'contact_form').length,
        quiz_submission: contactList.filter(c => c.source === 'quiz_submission').length,
        manual: contactList.filter(c => c.source === 'manual').length,
      },
    },
    assessments: {
      total: assessmentList.length,
      thisWeek: assessmentList.filter(a => new Date(a.created_at) > weekAgo).length,
    },
    articles: {
      total: articleList.length,
      published: articleList.filter(a => a.status === 'published').length,
      draft: articleList.filter(a => a.status === 'draft').length,
    },
  })
}
