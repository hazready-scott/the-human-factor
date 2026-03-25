'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

// Supabase client — anon key is safe for client-side (RLS enforced)
const supabase = createClient(
  'https://kicrsqbgjefqratvrqbv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpY3JzcWJnamVmcXJhdHZycWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDY1MTEsImV4cCI6MjA1ODQyMjUxMX0.PqFJMkYOxkSEWiPDcMDFLK1HdmBRfNNKXpfRBz0gDrM'
)

// ===== Quiz Data =====

interface Question {
  id: number
  dimension: string
  text: string
  options: { label: string; value: number }[]
}

const DIMENSIONS = [
  'Leadership & Vision',
  'Data Maturity',
  'Culture & Change Readiness',
  'Infrastructure & Technology',
  'Ethics & Governance',
  'Skills & Talent',
  'Strategy & Roadmap',
] as const

type Dimension = (typeof DIMENSIONS)[number]

const DIMENSION_COLORS: Record<Dimension, string> = {
  'Leadership & Vision': '#1a2744',
  'Data Maturity': '#e8956a',
  'Culture & Change Readiness': '#4c6d9a',
  'Infrastructure & Technology': '#d97740',
  'Ethics & Governance': '#7e96ba',
  'Skills & Talent': '#b85e2f',
  'Strategy & Roadmap': '#243354',
}

const questions: Question[] = [
  // Leadership & Vision (1-3)
  {
    id: 1,
    dimension: 'Leadership & Vision',
    text: 'How clearly has your leadership articulated a vision for AI adoption?',
    options: [
      { label: 'No vision or discussion of AI', value: 1 },
      { label: 'Informal discussions but no formal vision', value: 2 },
      { label: 'A general direction has been communicated', value: 3 },
      { label: 'Clear vision with executive sponsorship', value: 4 },
      { label: 'Comprehensive AI strategy endorsed at the highest level', value: 5 },
    ],
  },
  {
    id: 2,
    dimension: 'Leadership & Vision',
    text: 'Is there dedicated budget allocated for AI initiatives?',
    options: [
      { label: 'No budget allocated', value: 1 },
      { label: 'Ad-hoc funding for individual projects', value: 2 },
      { label: 'Some budget within existing IT spending', value: 3 },
      { label: 'Dedicated AI budget with annual planning', value: 4 },
      { label: 'Multi-year investment roadmap with protected funding', value: 5 },
    ],
  },
  {
    id: 3,
    dimension: 'Leadership & Vision',
    text: 'How involved is leadership in AI-related decision-making?',
    options: [
      { label: 'Leadership is not involved', value: 1 },
      { label: 'Delegated entirely to IT department', value: 2 },
      { label: 'Periodic check-ins with leadership', value: 3 },
      { label: 'Leadership actively participates in key decisions', value: 4 },
      { label: 'AI governance board with C-suite representation', value: 5 },
    ],
  },

  // Data Maturity (4-6)
  {
    id: 4,
    dimension: 'Data Maturity',
    text: 'How would you describe your organization\'s data quality?',
    options: [
      { label: 'Data is scattered, inconsistent, and unreliable', value: 1 },
      { label: 'Some structured data but significant quality issues', value: 2 },
      { label: 'Reasonably clean data in key systems', value: 3 },
      { label: 'Well-managed data with quality standards in place', value: 4 },
      { label: 'Comprehensive data governance with continuous monitoring', value: 5 },
    ],
  },
  {
    id: 5,
    dimension: 'Data Maturity',
    text: 'Can your teams easily access the data they need for decision-making?',
    options: [
      { label: 'Data is siloed and difficult to access', value: 1 },
      { label: 'Access requires manual requests and significant effort', value: 2 },
      { label: 'Some self-service access for common datasets', value: 3 },
      { label: 'Broad self-service access with a data catalog', value: 4 },
      { label: 'Unified data platform with real-time access across teams', value: 5 },
    ],
  },
  {
    id: 6,
    dimension: 'Data Maturity',
    text: 'Does your organization have documented data governance policies?',
    options: [
      { label: 'No formal data governance', value: 1 },
      { label: 'Informal practices vary by department', value: 2 },
      { label: 'Basic policies exist but inconsistently followed', value: 3 },
      { label: 'Formal governance framework actively enforced', value: 4 },
      { label: 'Mature governance with data stewards and regular audits', value: 5 },
    ],
  },

  // Culture & Change Readiness (7-9)
  {
    id: 7,
    dimension: 'Culture & Change Readiness',
    text: 'How do your employees generally feel about AI being introduced into their work?',
    options: [
      { label: 'Significant fear and resistance', value: 1 },
      { label: 'Skepticism and concern about job displacement', value: 2 },
      { label: 'Cautious openness with some reservations', value: 3 },
      { label: 'Generally positive with active interest', value: 4 },
      { label: 'Enthusiastic — teams are already experimenting', value: 5 },
    ],
  },
  {
    id: 8,
    dimension: 'Culture & Change Readiness',
    text: 'How does your organization typically handle major technology changes?',
    options: [
      { label: 'Changes are imposed top-down with little communication', value: 1 },
      { label: 'Basic announcements but limited support', value: 2 },
      { label: 'Some change management with training offered', value: 3 },
      { label: 'Structured change management with feedback loops', value: 4 },
      { label: 'Mature change culture — experimentation is encouraged', value: 5 },
    ],
  },
  {
    id: 9,
    dimension: 'Culture & Change Readiness',
    text: 'Is there a culture of continuous learning in your organization?',
    options: [
      { label: 'No formal learning programs', value: 1 },
      { label: 'Occasional training, mostly compliance-related', value: 2 },
      { label: 'Regular professional development opportunities', value: 3 },
      { label: 'Strong learning culture with dedicated time and budget', value: 4 },
      { label: 'Learning is core to the culture with innovation labs', value: 5 },
    ],
  },

  // Infrastructure & Technology (10-12)
  {
    id: 10,
    dimension: 'Infrastructure & Technology',
    text: 'How modern is your organization\'s technology infrastructure?',
    options: [
      { label: 'Mostly legacy systems with minimal integration', value: 1 },
      { label: 'Mix of legacy and modern with limited connectivity', value: 2 },
      { label: 'Modernization underway with cloud migration started', value: 3 },
      { label: 'Primarily cloud-based with good API integration', value: 4 },
      { label: 'Modern, scalable architecture ready for AI workloads', value: 5 },
    ],
  },
  {
    id: 11,
    dimension: 'Infrastructure & Technology',
    text: 'Does your organization have the computing resources needed for AI?',
    options: [
      { label: 'No awareness of AI compute requirements', value: 1 },
      { label: 'Basic computing — not suitable for AI workloads', value: 2 },
      { label: 'Some cloud computing available for experimentation', value: 3 },
      { label: 'Adequate cloud/GPU resources for most AI projects', value: 4 },
      { label: 'Enterprise-grade AI infrastructure with ML ops', value: 5 },
    ],
  },
  {
    id: 12,
    dimension: 'Infrastructure & Technology',
    text: 'How well are your systems integrated with each other?',
    options: [
      { label: 'Systems operate independently with manual data transfer', value: 1 },
      { label: 'Some point-to-point integrations', value: 2 },
      { label: 'Integration middleware connecting key systems', value: 3 },
      { label: 'API-first architecture with most systems connected', value: 4 },
      { label: 'Fully integrated ecosystem with real-time data flows', value: 5 },
    ],
  },

  // Ethics & Governance (13-15)
  {
    id: 13,
    dimension: 'Ethics & Governance',
    text: 'Does your organization have an AI ethics policy or framework?',
    options: [
      { label: 'No consideration of AI ethics', value: 1 },
      { label: 'Awareness but no formal policy', value: 2 },
      { label: 'Draft policy or principles under development', value: 3 },
      { label: 'Formal AI ethics framework in place', value: 4 },
      { label: 'Comprehensive ethics program with review board', value: 5 },
    ],
  },
  {
    id: 14,
    dimension: 'Ethics & Governance',
    text: 'How does your organization approach AI-related privacy and security?',
    options: [
      { label: 'No specific AI privacy considerations', value: 1 },
      { label: 'General privacy policies, not AI-specific', value: 2 },
      { label: 'Awareness of AI privacy risks with some guidelines', value: 3 },
      { label: 'AI-specific privacy impact assessments required', value: 4 },
      { label: 'Comprehensive AI security framework with regular audits', value: 5 },
    ],
  },
  {
    id: 15,
    dimension: 'Ethics & Governance',
    text: 'Is there a process for evaluating AI bias and fairness?',
    options: [
      { label: 'No awareness of AI bias issues', value: 1 },
      { label: 'Some awareness but no formal process', value: 2 },
      { label: 'Ad-hoc bias checks on specific projects', value: 3 },
      { label: 'Formal bias testing as part of AI development', value: 4 },
      { label: 'Ongoing fairness monitoring with remediation processes', value: 5 },
    ],
  },

  // Skills & Talent (16-18)
  {
    id: 16,
    dimension: 'Skills & Talent',
    text: 'Does your organization have staff with AI/ML technical skills?',
    options: [
      { label: 'No AI/ML skills in the organization', value: 1 },
      { label: 'A few individuals with basic AI awareness', value: 2 },
      { label: 'Small team with some data science capabilities', value: 3 },
      { label: 'Dedicated AI/ML team with relevant expertise', value: 4 },
      { label: 'Strong AI team with specialized roles and research capability', value: 5 },
    ],
  },
  {
    id: 17,
    dimension: 'Skills & Talent',
    text: 'How AI-literate are your non-technical staff?',
    options: [
      { label: 'No AI literacy — most don\'t understand what AI is', value: 1 },
      { label: 'Vague awareness from media coverage', value: 2 },
      { label: 'Basic understanding of AI concepts and use cases', value: 3 },
      { label: 'Good AI literacy with ability to identify opportunities', value: 4 },
      { label: 'High literacy — staff can evaluate and guide AI applications', value: 5 },
    ],
  },
  {
    id: 18,
    dimension: 'Skills & Talent',
    text: 'Is there a plan for developing AI-related skills across the organization?',
    options: [
      { label: 'No skill development plan', value: 1 },
      { label: 'Individual training left to personal initiative', value: 2 },
      { label: 'Some AI training programs available', value: 3 },
      { label: 'Structured AI upskilling program by role', value: 4 },
      { label: 'Comprehensive learning pathways with certifications', value: 5 },
    ],
  },

  // Strategy & Roadmap (19-21)
  {
    id: 19,
    dimension: 'Strategy & Roadmap',
    text: 'Does your organization have a formal AI strategy or roadmap?',
    options: [
      { label: 'No AI strategy', value: 1 },
      { label: 'Exploring possibilities without a plan', value: 2 },
      { label: 'Informal roadmap with some pilot projects identified', value: 3 },
      { label: 'Documented strategy with phased implementation plan', value: 4 },
      { label: 'Comprehensive multi-year roadmap aligned to business goals', value: 5 },
    ],
  },
  {
    id: 20,
    dimension: 'Strategy & Roadmap',
    text: 'How does your organization measure the success of technology initiatives?',
    options: [
      { label: 'No formal success measurement', value: 1 },
      { label: 'Basic completion tracking (on-time, on-budget)', value: 2 },
      { label: 'Some KPIs defined for major initiatives', value: 3 },
      { label: 'Clear success metrics tied to business outcomes', value: 4 },
      { label: 'Continuous measurement with iterative optimization', value: 5 },
    ],
  },
  {
    id: 21,
    dimension: 'Strategy & Roadmap',
    text: 'Are there identified use cases where AI could add immediate value?',
    options: [
      { label: 'No use cases identified', value: 1 },
      { label: 'Vague ideas but nothing concrete', value: 2 },
      { label: 'A few promising use cases identified', value: 3 },
      { label: 'Prioritized use cases with business cases developed', value: 4 },
      { label: 'Active pipeline of AI projects at various stages', value: 5 },
    ],
  },
]

// ===== Score Interpretation =====

interface DimensionScore {
  dimension: string
  score: number
  maxScore: number
  percentage: number
}

function getOverallLevel(percentage: number): {
  level: string
  color: string
  description: string
  recommendations: string[]
} {
  if (percentage < 25) {
    return {
      level: 'Beginning',
      color: '#ef4444',
      description:
        'Your organization is at the early stages of AI readiness. This is a common starting point — the key is building awareness and laying groundwork.',
      recommendations: [
        'Start with AI literacy training for leadership',
        'Conduct a data inventory to understand what you have',
        'Identify 1-2 low-risk pilot opportunities',
        'Establish an AI working group with cross-functional representation',
      ],
    }
  }
  if (percentage < 50) {
    return {
      level: 'Developing',
      color: '#f59e0b',
      description:
        'Your organization has begun its AI journey but has significant gaps to address. Focus on strengthening your foundation before scaling.',
      recommendations: [
        'Formalize your data governance framework',
        'Invest in change management for AI initiatives',
        'Develop an AI ethics policy with stakeholder input',
        'Create a skills development roadmap for key roles',
      ],
    }
  }
  if (percentage < 75) {
    return {
      level: 'Advancing',
      color: '#e8956a',
      description:
        'Your organization has solid foundations and is making real progress. Focus on scaling what works and closing remaining gaps.',
      recommendations: [
        'Scale successful pilot projects to production',
        'Build cross-functional AI teams',
        'Implement continuous monitoring for AI systems',
        'Develop advanced use cases that drive competitive advantage',
      ],
    }
  }
  return {
    level: 'Leading',
    color: '#22c55e',
    description:
      'Your organization is among the most AI-ready. Focus on innovation, optimization, and sharing best practices.',
    recommendations: [
      'Explore frontier AI capabilities (generative AI, autonomous systems)',
      'Establish an AI center of excellence',
      'Mentor partner organizations on AI adoption',
      'Continuously reassess and evolve your AI strategy',
    ],
  }
}

// ===== Component =====

export default function AIReadinessQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', org: '' })
  const [showContact, setShowContact] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const allAnswered = Object.keys(answers).length === questions.length

  function handleSelect(value: number) {
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    // Auto-advance after a short delay
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    }
  }

  function calculateResults(): DimensionScore[] {
    return DIMENSIONS.map((dim) => {
      const dimQuestions = questions.filter((q) => q.dimension === dim)
      const score = dimQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0)
      const maxScore = dimQuestions.length * 5
      return {
        dimension: dim,
        score,
        maxScore,
        percentage: Math.round((score / maxScore) * 100),
      }
    })
  }

  async function handleSubmit() {
    if (!contactInfo.email) return
    setSubmitting(true)

    const dimensionScores = calculateResults()
    const totalScore = dimensionScores.reduce((s, d) => s + d.score, 0)
    const maxTotal = dimensionScores.reduce((s, d) => s + d.maxScore, 0)

    try {
      await supabase.from('aria_assessments').insert({
        respondent_name: contactInfo.name || null,
        respondent_email: contactInfo.email,
        respondent_org: contactInfo.org || null,
        answers,
        dimension_scores: dimensionScores,
        total_score: totalScore,
        max_score: maxTotal,
        overall_percentage: Math.round((totalScore / maxTotal) * 100),
      })
    } catch (e) {
      console.error('Failed to save assessment:', e)
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  // ===== Results View =====
  if (showResults) {
    const dimensionScores = calculateResults()
    const totalScore = dimensionScores.reduce((s, d) => s + d.score, 0)
    const maxTotal = dimensionScores.reduce((s, d) => s + d.maxScore, 0)
    const overallPct = Math.round((totalScore / maxTotal) * 100)
    const level = getOverallLevel(overallPct)

    const radarData = dimensionScores.map((d) => ({
      dimension: d.dimension.split(' & ')[0],
      score: d.percentage,
      fullMark: 100,
    }))

    const barData = dimensionScores.map((d) => ({
      name: d.dimension.length > 15 ? d.dimension.split(' & ')[0] : d.dimension,
      score: d.percentage,
      dimension: d.dimension,
    }))

    return (
      <div className="animate-fade-in-up">
        {/* Overall Score */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-navy mb-2">Your Results</h2>
          <div className="inline-flex items-center gap-3 mt-4 mb-2">
            <span
              className="text-6xl font-bold"
              style={{ color: level.color }}
            >
              {overallPct}%
            </span>
          </div>
          <div
            className="text-xl font-semibold mb-3"
            style={{ color: level.color }}
          >
            {level.level}
          </div>
          <p className="text-gray-500 max-w-lg mx-auto">{level.description}</p>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Radar */}
          <div className="card">
            <h3 className="font-bold text-navy mb-4 text-center">
              Dimension Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e0db" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fontSize: 11, fill: '#6b6860' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  dataKey="score"
                  stroke="#e8956a"
                  fill="#e8956a"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div className="card">
            <h3 className="font-bold text-navy mb-4 text-center">
              Score by Dimension
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e0db" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Score']}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {barData.map((entry) => (
                    <Cell
                      key={entry.dimension}
                      fill={
                        DIMENSION_COLORS[entry.dimension as Dimension] ||
                        '#e8956a'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dimension Breakdown */}
        <div className="space-y-4 mb-12">
          <h3 className="font-bold text-navy text-lg">Dimension Breakdown</h3>
          {dimensionScores.map((d) => (
            <div key={d.dimension} className="card">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-navy">{d.dimension}</span>
                <span className="text-sm font-semibold" style={{ color: DIMENSION_COLORS[d.dimension as Dimension] }}>
                  {d.percentage}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${d.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="card mb-12">
          <h3 className="font-bold text-navy text-lg mb-4">
            Recommended Next Steps
          </h3>
          <ul className="space-y-3">
            {level.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warmth/10 text-warmth text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-gray-600">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Save Results */}
        {!submitted ? (
          <div className="card">
            <h3 className="font-bold text-navy text-lg mb-2">
              Save Your Results
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter your details to save this assessment. We&apos;ll send you a
              copy and may follow up with personalized recommendations.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={contactInfo.name}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-warmth"
              />
              <input
                type="email"
                placeholder="Email address *"
                required
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-warmth"
              />
              <input
                type="text"
                placeholder="Organization (optional)"
                value={contactInfo.org}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, org: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-warmth"
              />
              <button
                onClick={handleSubmit}
                disabled={!contactInfo.email || submitting}
                className="btn-primary w-full disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save My Results'}
              </button>
            </div>
          </div>
        ) : (
          <div className="card text-center">
            <div className="text-3xl mb-2">&#10003;</div>
            <h3 className="font-bold text-navy text-lg">Results Saved</h3>
            <p className="text-gray-500 text-sm mt-1">
              Thank you! We&apos;ll be in touch with personalized recommendations.
            </p>
          </div>
        )}
      </div>
    )
  }

  // ===== Contact Gate (before results) =====
  if (showContact) {
    return (
      <div className="animate-fade-in-up">
        <div className="card max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold text-navy mb-2">
            Almost there!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Enter your email to see your personalized results. We won&apos;t
            spam you.
          </p>
          <div className="space-y-3 text-left">
            <input
              type="text"
              placeholder="Your name"
              value={contactInfo.name}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-warmth"
            />
            <input
              type="email"
              placeholder="Email address *"
              required
              value={contactInfo.email}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-warmth"
            />
            <input
              type="text"
              placeholder="Organization (optional)"
              value={contactInfo.org}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, org: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-warmth"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowContact(false)}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={async () => {
                if (contactInfo.email) {
                  await handleSubmit()
                  setShowResults(true)
                }
              }}
              disabled={!contactInfo.email || submitting}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {submitting ? 'Loading...' : 'See My Results'}
            </button>
          </div>
          <button
            onClick={() => setShowResults(true)}
            className="text-xs text-gray-400 hover:text-gray-600 mt-4 underline"
          >
            Skip — show results without saving
          </button>
        </div>
      </div>
    )
  }

  // ===== Quiz View =====
  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-warmth">
            {question.dimension}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="animate-slide-in" key={question.id}>
        <h2 className="text-xl md:text-2xl font-bold text-navy mb-6">
          {question.text}
        </h2>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`quiz-option ${
                answers[question.id] === option.value ? 'selected' : ''
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                    answers[question.id] === option.value
                      ? 'border-warmth bg-warmth text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {answers[question.id] === option.value && '✓'}
                </span>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="text-sm text-gray-400 hover:text-navy disabled:opacity-30 transition-colors"
        >
          ← Previous
        </button>

        {currentQuestion === questions.length - 1 && allAnswered ? (
          <button
            onClick={() => setShowContact(true)}
            className="btn-primary"
          >
            See My Results
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentQuestion(
                Math.min(questions.length - 1, currentQuestion + 1)
              )
            }
            disabled={!answers[question.id]}
            className="text-sm text-warmth hover:text-warmth-dark disabled:opacity-30 font-medium transition-colors"
          >
            Next →
          </button>
        )}
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-8">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestion(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentQuestion
                ? 'bg-warmth scale-125'
                : answers[q.id]
                ? 'bg-warmth/40'
                : 'bg-gray-200'
            }`}
            aria-label={`Go to question ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
