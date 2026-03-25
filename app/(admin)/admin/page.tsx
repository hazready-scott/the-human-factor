'use client'

import { useEffect, useState } from 'react'
import { Users, ClipboardCheck, FileText, TrendingUp } from 'lucide-react'

interface Stats {
  contacts: { total: number; new: number; thisWeek: number; bySource: Record<string, number> }
  assessments: { total: number; thisWeek: number }
  articles: { total: number; published: number; draft: number }
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-[#0f172a]">{value}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  if (!stats) {
    return <div className="text-slate-400 text-center py-20">Loading dashboard...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f172a] mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="Total Contacts" value={stats.contacts.total} icon={Users} color="bg-[#3b82f6]" />
        <StatCard label="New This Week" value={stats.contacts.thisWeek} icon={TrendingUp} color="bg-[#06b6d4]" />
        <StatCard label="Quiz Completions" value={stats.assessments.total} icon={ClipboardCheck} color="bg-[#8b5cf6]" />
        <StatCard label="Published Articles" value={stats.articles.published} icon={FileText} color="bg-[#16a34a]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Sources */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Contact Sources</h2>
          <div className="space-y-3">
            {Object.entries(stats.contacts.bySource).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 capitalize">{source.replace('_', ' ')}</span>
                <span className="text-sm font-semibold text-[#0f172a]">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Articles</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Published</span>
              <span className="text-sm font-semibold text-[#16a34a]">{stats.articles.published}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Drafts</span>
              <span className="text-sm font-semibold text-[#d97706]">{stats.articles.draft}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
