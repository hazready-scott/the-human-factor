'use client'

interface MultipleChoiceResults {
  counts: Record<string, number>
  total: number
}

interface WordCloudResults {
  words: Record<string, number>
  total: number
}

interface RatingResults {
  average: number
  distribution: Record<number, number>
  total: number
}

interface OpenEndedResults {
  responses: string[]
  total: number
}

type PollResults = MultipleChoiceResults | WordCloudResults | RatingResults | OpenEndedResults

// Loose shape accepted from the realtime hook (all fields optional except total)
export interface PollResultsInput {
  counts?: Record<string, number>
  words?: Record<string, number>
  average?: number
  distribution?: Record<number, number>
  responses?: string[]
  total: number
}

interface Props {
  pollType: string
  results: PollResults | PollResultsInput
  options?: string[]
  compact?: boolean
}

function MultipleChoiceResults({ results, options, compact }: { results: MultipleChoiceResults; options?: string[]; compact?: boolean }) {
  const counts = results.counts || {}
  const total = results.total || 0
  const items = (options || Object.keys(counts)).map(opt => ({
    label: opt,
    count: counts[opt] || 0,
    percent: total > 0 ? Math.round(((counts[opt] || 0) / total) * 100) : 0,
  }))

  const maxCount = Math.max(...items.map(i => i.count), 1)

  return (
    <div className={`w-full space-y-${compact ? '2' : '4'}`}>
      {items.map((item, i) => (
        <div key={item.label} className="w-full">
          <div className={`flex justify-between items-baseline mb-1 ${compact ? 'text-xs' : 'text-[1.1rem]'}`}>
            <span className="text-white font-medium">{item.label}</span>
            <span className="text-slate-400">{item.percent}% ({item.count})</span>
          </div>
          <div className={`w-full ${compact ? 'h-4' : 'h-8'} rounded-lg overflow-hidden`} style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full rounded-lg transition-all duration-700 ease-out"
              style={{
                width: `${total > 0 ? (item.count / maxCount) * 100 : 0}%`,
                background: `linear-gradient(90deg, rgba(6,182,212,0.8), rgba(6,182,212,0.4))`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function WordCloudDisplay({ results, compact }: { results: WordCloudResults; compact?: boolean }) {
  const words = results.words || {}
  const entries = Object.entries(words).sort((a, b) => b[1] - a[1]).slice(0, 30)
  const maxCount = Math.max(...entries.map(e => e[1]), 1)

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-4">
      {entries.map(([word, count], i) => {
        const size = compact
          ? 0.8 + (count / maxCount) * 1.2
          : 1.2 + (count / maxCount) * 2.5
        return (
          <span
            key={word}
            className="text-white font-semibold animate-fade-in-up"
            style={{
              fontSize: `${size}rem`,
              opacity: 0.5 + (count / maxCount) * 0.5,
              color: count === maxCount ? '#06b6d4' : undefined,
              animationDelay: `${i * 50}ms`,
            }}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}

function RatingDisplay({ results, compact }: { results: RatingResults; compact?: boolean }) {
  const avg = results.average || 0
  const dist = results.distribution || {}

  return (
    <div className="flex flex-col items-center gap-6">
      <div className={`${compact ? 'text-3xl' : 'text-[6rem]'} font-bold text-cyan-400 leading-none`}>
        {avg.toFixed(1)}
      </div>
      <div className={`text-slate-400 ${compact ? 'text-xs' : 'text-[1.2rem]'}`}>
        {results.total} responses
      </div>
      <div className="flex items-end gap-2 h-20">
        {[1, 2, 3, 4, 5].map(v => {
          const count = dist[v] || 0
          const max = Math.max(...Object.values(dist), 1)
          return (
            <div key={v} className="flex flex-col items-center gap-1">
              <div
                className="w-8 rounded-t transition-all duration-500"
                style={{
                  height: `${(count / max) * 60}px`,
                  minHeight: 2,
                  background: 'rgba(6,182,212,0.6)',
                }}
              />
              <span className="text-[10px] text-slate-500">{v}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OpenEndedDisplay({ results, compact }: { results: OpenEndedResults; compact?: boolean }) {
  const items = results.responses || []

  return (
    <div className={`space-y-2 max-h-[400px] overflow-y-auto ${compact ? 'text-xs' : 'text-[1rem]'}`}>
      {items.slice(-10).reverse().map((text, i) => (
        <div
          key={i}
          className="px-4 py-2 rounded-lg text-slate-300 animate-fade-in-up"
          style={{ background: 'rgba(255,255,255,0.05)', animationDelay: `${i * 100}ms` }}
        >
          {text}
        </div>
      ))}
    </div>
  )
}

export default function LiveResults({ pollType, results, options, compact }: Props) {
  switch (pollType) {
    case 'multiple_choice':
      return <MultipleChoiceResults results={results as MultipleChoiceResults} options={options} compact={compact} />
    case 'word_cloud':
      return <WordCloudDisplay results={results as WordCloudResults} compact={compact} />
    case 'rating':
      return <RatingDisplay results={results as RatingResults} compact={compact} />
    case 'open_ended':
      return <OpenEndedDisplay results={results as OpenEndedResults} compact={compact} />
    default:
      return null
  }
}
