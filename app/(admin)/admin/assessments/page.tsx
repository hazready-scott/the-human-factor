'use client'

import { useEffect, useState } from 'react'
import { ClipboardCheck, Search, ChevronDown, ChevronUp, X } from 'lucide-react'

interface DimensionScores {
  leadership?: number
  process?: number
  data?: number
  technical?: number
  people?: number
  governance?: number
  [key: string]: number | undefined
}

interface Assessment {
  id: string
  name: string
  email: string
  org_name: string | null
  industry: string | null
  org_size: string | null
  role: string | null
  overall_score: number
  readiness_level: string
  dimension_scores: DimensionScores | null
  raw_intake: Record<string, unknown> | null
  raw_answers: Record<string, unknown> | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referrer: string | null
  created_at: string
}

const READINESS_COLORS: Record<string, string> = {
  'Implementation Ready': 'bg-green-500/20 text-green-300',
  'Ready for Assessment': 'bg-purple-500/20 text-purple-300',
  'Getting Ready': 'bg-amber-500/20 text-amber-300',
  'Foundation Building': 'bg-red-500/20 text-red-300',
}

const READINESS_LEVELS = [
  'Implementation Ready',
  'Ready for Assessment',
  'Getting Ready',
  'Foundation Building',
]

const INDUSTRY_LABELS: Record<string, string> = {
  emergency_services: 'Emergency Services',
  fire_rescue: 'Fire & Rescue',
  law_enforcement: 'Law Enforcement',
  ems: 'EMS',
  emergency_management: 'Emergency Management',
  public_safety: 'Public Safety',
  government: 'Government',
  healthcare: 'Healthcare',
  utilities: 'Utilities',
  transportation: 'Transportation',
  education: 'Education',
  nonprofit: 'Nonprofit',
  consulting: 'Consulting',
  technology: 'Technology',
  other: 'Other',
}

const DIMENSION_LABELS: Record<string, string> = {
  leadership: 'Leadership & Vision',
  process: 'Process Readiness',
  data: 'Data Infrastructure',
  technical: 'Technical Capability',
  people: 'People & Culture',
  governance: 'Governance & Ethics',
}

function scoreColor(score: number): string {
  if (score >= 78) return 'text-green-400'
  if (score >= 56) return 'text-amber-400'
  if (score >= 34) return 'text-orange-400'
  return 'text-red-400'
}

function scoreBgColor(score: number): string {
  if (score >= 78) return 'bg-green-500'
  if (score >= 56) return 'bg-amber-500'
  if (score >= 34) return 'bg-orange-500'
  return 'bg-red-500'
}

function formatIndustry(industry: string | null): string {
  if (!industry) return '—'
  return INDUSTRY_LABELS[industry] || industry.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [search, setSearch] = useState('')
  const [readinessFilter, setReadinessFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchAssessments = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (readinessFilter) params.set('readiness_level', readinessFilter)
    if (industryFilter) params.set('industry', industryFilter)
    const res = await fetch(`/api/admin/assessments?${params}`)
    const data = await res.json()
    setAssessments(data.assessments || [])
    setLoading(false)
  }

  useEffect(() => { fetchAssessments() }, [readinessFilter, industryFilter])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchAssessments() }

  // Collect unique industries from loaded data for the filter dropdown
  const industries = Array.from(new Set(assessments.map(a => a.industry).filter(Boolean))) as string[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={28} className="text-[#c9944a]" />
          <h1 className="text-2xl font-bold text-white">AI Readiness Assessments</h1>
        </div>
        <span className="text-sm text-slate-400">{assessments.length} result{assessments.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, org..."
              className="admin-input pl-10 w-64"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Search
          </button>
        </form>
        <select
          value={readinessFilter}
          onChange={e => setReadinessFilter(e.target.value)}
          className="admin-input w-auto"
        >
          <option value="">All Readiness Levels</option>
          {READINESS_LEVELS.map(level => (
            <option key={level} value={level} className="bg-[#111827]">{level}</option>
          ))}
        </select>
        <select
          value={industryFilter}
          onChange={e => setIndustryFilter(e.target.value)}
          className="admin-input w-auto"
        >
          <option value="">All Industries</option>
          {Object.entries(INDUSTRY_LABELS).map(([k, v]) => (
            <option key={k} value={k} className="bg-[#111827]">{v}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Organization</th>
              <th>Industry</th>
              <th>Score</th>
              <th>Readiness Level</th>
              <th>Date</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : assessments.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">No assessments found</td></tr>
            ) : assessments.map(a => (
              <>
                <tr
                  key={a.id}
                  onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                  className="cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-slate-200">{a.name}</td>
                  <td className="px-4 py-3 text-slate-400">{a.email}</td>
                  <td className="px-4 py-3 text-slate-400">{a.org_name || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{formatIndustry(a.industry)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold tabular-nums ${scoreColor(a.overall_score)}`}>
                      {a.overall_score}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${READINESS_COLORS[a.readiness_level] || ''}`}>
                      {a.readiness_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {expandedId === a.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </td>
                </tr>

                {/* Expanded Detail Row */}
                {expandedId === a.id && (
                  <tr key={`${a.id}-detail`}>
                    <td colSpan={8} className="p-0">
                      <DetailPanel assessment={a} onClose={() => setExpandedId(null)} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DetailPanel({ assessment, onClose }: { assessment: Assessment; onClose: () => void }) {
  const a = assessment
  const dimensions = a.dimension_scores || {}

  return (
    <div className="bg-slate-800/50 border-t border-slate-700/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{a.name} — Detail View</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dimension Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Dimension Breakdown</h4>
          {Object.entries(DIMENSION_LABELS).map(([key, label]) => {
            const value = dimensions[key]
            if (value === undefined) return null
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">{label}</span>
                  <span className={`text-sm font-semibold tabular-nums ${scoreColor(value)}`}>{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${scoreBgColor(value)}`}
                    style={{ width: `${Math.min(value, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          {/* Org Details */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Organization Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Organization:</span>
                <span className="text-slate-300 ml-2">{a.org_name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500">Industry:</span>
                <span className="text-slate-300 ml-2">{formatIndustry(a.industry)}</span>
              </div>
              <div>
                <span className="text-slate-500">Size:</span>
                <span className="text-slate-300 ml-2">{a.org_size || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500">Role:</span>
                <span className="text-slate-300 ml-2">{a.role || '—'}</span>
              </div>
            </div>
          </div>

          {/* UTM Tracking */}
          {(a.utm_source || a.utm_medium || a.utm_campaign || a.referrer) && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">UTM Tracking</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {a.utm_source && (
                  <div>
                    <span className="text-slate-500">Source:</span>
                    <span className="text-slate-300 ml-2">{a.utm_source}</span>
                  </div>
                )}
                {a.utm_medium && (
                  <div>
                    <span className="text-slate-500">Medium:</span>
                    <span className="text-slate-300 ml-2">{a.utm_medium}</span>
                  </div>
                )}
                {a.utm_campaign && (
                  <div>
                    <span className="text-slate-500">Campaign:</span>
                    <span className="text-slate-300 ml-2">{a.utm_campaign}</span>
                  </div>
                )}
                {a.referrer && (
                  <div className="col-span-2">
                    <span className="text-slate-500">Referrer:</span>
                    <span className="text-slate-300 ml-2 break-all">{a.referrer}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Raw Intake Answers */}
      {a.raw_intake && Object.keys(a.raw_intake).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Intake Answers</h4>
          <div className="rounded-lg p-4 text-sm space-y-1 max-h-48 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.25)' }}>
            {Object.entries(a.raw_intake).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="text-slate-500 min-w-[140px] shrink-0">{key.replace(/_/g, ' ')}:</span>
                <span className="text-slate-300">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Quiz Answers */}
      {a.raw_answers && Object.keys(a.raw_answers).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Quiz Answers</h4>
          <div className="rounded-lg p-4 text-sm space-y-1 max-h-48 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.25)' }}>
            {Object.entries(a.raw_answers).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="text-slate-500 min-w-[140px] shrink-0">{key.replace(/_/g, ' ')}:</span>
                <span className="text-slate-300">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
