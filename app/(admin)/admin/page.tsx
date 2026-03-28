'use client'

import { useEffect, useState } from 'react'
import { Users, ClipboardCheck, FileText, TrendingUp, Presentation } from 'lucide-react'

interface Stats {
  contacts: { total: number; new: number; thisWeek: number; bySource: Record<string, number> }
  assessments: { total: number; thisWeek: number }
  articles: { total: number; published: number; draft: number }
  presentations: { total: number; published: number; draft: number; private: number; shareable: number }
}

function StatCard({ label, value, icon: Icon, gradient }: { label: string; value: number; icon: React.ElementType; gradient: string }) {
  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${gradient}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
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
    return <div className="text-slate-500 text-center py-20">Loading dashboard...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <StatCard label="Total Contacts" value={stats.contacts.total} icon={Users} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatCard label="New This Week" value={stats.contacts.thisWeek} icon={TrendingUp} gradient="bg-gradient-to-br from-cyan-500 to-cyan-600" />
        <StatCard label="Quiz Completions" value={stats.assessments.total} icon={ClipboardCheck} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
        <StatCard label="Published Articles" value={stats.articles.published} icon={FileText} gradient="bg-gradient-to-br from-green-500 to-green-600" />
        <StatCard label="Presentations" value={stats.presentations?.total || 0} icon={Presentation} gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <h2 className="text-lg font-semibold text-white mb-4">Contact Sources</h2>
          <div className="space-y-3">
            {Object.entries(stats.contacts.bySource).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-sm text-slate-400 capitalize">{source.replace('_', ' ')}</span>
                <span className="text-sm font-semibold text-slate-200">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="text-lg font-semibold text-white mb-4">Articles</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Published</span>
              <span className="text-sm font-semibold text-green-400">{stats.articles.published}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Drafts</span>
              <span className="text-sm font-semibold text-yellow-400">{stats.articles.draft}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
