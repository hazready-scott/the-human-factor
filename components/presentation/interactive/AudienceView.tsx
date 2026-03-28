'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePollSessionRealtime, usePollRealtime } from '@/lib/presentation/use-poll-realtime'
import LiveResults from './LiveResults'

interface PresentationInfo {
  id: string
  title: string
  slug: string
  author_name: string
}

interface Props {
  presentation: PresentationInfo
}

function getRespondentId(): string {
  const key = 'thf-respondent-id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

function MultipleChoiceVoter({
  options,
  allowMultiple,
  onVote,
  voted,
}: {
  options: string[]
  allowMultiple?: boolean
  onVote: (choice: string) => void
  voted: string | null
}) {
  return (
    <div className="space-y-3 w-full">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onVote(opt)}
          disabled={!!voted && !allowMultiple}
          className={`w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all ${
            voted === opt
              ? 'bg-cyan-500 text-white ring-2 ring-cyan-400'
              : voted
              ? 'bg-white/5 text-slate-500 opacity-60'
              : 'bg-white/5 text-white hover:bg-white/10 active:scale-[0.98]'
          }`}
        >
          <span className="font-bold text-cyan-400 mr-3">{String.fromCharCode(65 + i)}.</span>
          {opt}
        </button>
      ))}
    </div>
  )
}

function WordCloudVoter({ onVote, voted }: { onVote: (text: string) => void; voted: boolean }) {
  const [text, setText] = useState('')

  return (
    <div className="w-full">
      {voted ? (
        <div className="text-center py-8 text-slate-400">
          <p className="text-lg mb-2">Submitted!</p>
          <p className="text-sm">Your response has been recorded.</p>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && text.trim() && onVote(text.trim())}
            placeholder="Type your answer..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-cyan-500 focus:outline-none text-base"
            autoFocus
          />
          <button
            onClick={() => text.trim() && onVote(text.trim())}
            disabled={!text.trim()}
            className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      )}
    </div>
  )
}

function RatingVoter({ onVote, voted, min, max }: { onVote: (value: number) => void; voted: number | null; min?: number; max?: number }) {
  const lo = min ?? 1
  const hi = max ?? 5
  const range = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)

  return (
    <div className="flex gap-3 justify-center">
      {range.map(v => (
        <button
          key={v}
          onClick={() => onVote(v)}
          disabled={voted !== null}
          className={`w-14 h-14 rounded-xl text-lg font-bold transition-all ${
            voted === v
              ? 'bg-cyan-500 text-white scale-110'
              : voted !== null
              ? 'bg-white/5 text-slate-600'
              : 'bg-white/5 text-white hover:bg-white/10 active:scale-95'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  )
}

function OpenEndedVoter({ onVote, voted }: { onVote: (text: string) => void; voted: boolean }) {
  const [text, setText] = useState('')

  return (
    <div className="w-full">
      {voted ? (
        <div className="text-center py-8 text-slate-400">
          <p className="text-lg mb-2">Submitted!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-cyan-500 focus:outline-none text-base resize-none"
            rows={3}
            autoFocus
          />
          <button
            onClick={() => text.trim() && onVote(text.trim())}
            disabled={!text.trim()}
            className="w-full px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 disabled:opacity-50 transition-colors"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  )
}

export default function AudienceView({ presentation }: Props) {
  const { activePoll } = usePollSessionRealtime(presentation.id)
  const { results, totalResponses } = usePollRealtime(
    activePoll?.id,
    activePoll?.poll_type || '',
    presentation.slug
  )
  const [voted, setVoted] = useState<string | number | boolean | null>(null)
  const [lastPollId, setLastPollId] = useState<string | null>(null)

  // Reset voted state when poll changes
  useEffect(() => {
    if (activePoll?.id && activePoll.id !== lastPollId) {
      setVoted(null)
      setLastPollId(activePoll.id)
    }
  }, [activePoll?.id, lastPollId])

  const submitVote = useCallback(async (response: Record<string, unknown>) => {
    if (!activePoll) return
    try {
      const respondentId = getRespondentId()
      await fetch(`/api/presentations/${presentation.slug}/polls/${activePoll.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respondent_id: respondentId, response }),
      })
    } catch (err) {
      console.error('Vote submission error:', err)
    }
  }, [activePoll, presentation.slug])

  const handleMultipleChoice = useCallback((choice: string) => {
    setVoted(choice)
    submitVote({ choice })
  }, [submitVote])

  const handleWordCloud = useCallback((text: string) => {
    setVoted(true)
    submitVote({ text })
  }, [submitVote])

  const handleRating = useCallback((value: number) => {
    setVoted(value)
    submitVote({ value })
  }, [submitVote])

  const handleOpenEnded = useCallback((text: string) => {
    setVoted(true)
    submitVote({ text })
  }, [submitVote])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0e1a' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <h1 className="text-sm font-semibold text-white truncate">{presentation.title}</h1>
          <p className="text-[10px] text-slate-600">{presentation.author_name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Connected</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {activePoll && activePoll.status === 'active' ? (
          <div className="w-full max-w-md space-y-6">
            {/* Question */}
            <div className="text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
                Live Poll
              </span>
              <h2 className="text-xl font-bold text-white mt-4 mb-2">
                {activePoll.question}
              </h2>
              {totalResponses > 0 && (
                <p className="text-xs text-slate-500">{totalResponses} response{totalResponses !== 1 ? 's' : ''}</p>
              )}
            </div>

            {/* Voting UI */}
            {activePoll.poll_type === 'multiple_choice' && (
              <MultipleChoiceVoter
                options={(activePoll.options as string[]) || []}
                allowMultiple={(activePoll.settings as Record<string, boolean>)?.allowMultiple}
                onVote={handleMultipleChoice}
                voted={voted as string | null}
              />
            )}
            {activePoll.poll_type === 'word_cloud' && (
              <WordCloudVoter onVote={handleWordCloud} voted={!!voted} />
            )}
            {activePoll.poll_type === 'rating' && (
              <RatingVoter
                onVote={handleRating}
                voted={voted as number | null}
                min={(activePoll.settings as Record<string, number>)?.ratingMin}
                max={(activePoll.settings as Record<string, number>)?.ratingMax}
              />
            )}
            {activePoll.poll_type === 'open_ended' && (
              <OpenEndedVoter onVote={handleOpenEnded} voted={!!voted} />
            )}

            {/* Show results after voting */}
            {voted && totalResponses > 0 && (
              <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs text-slate-500 mb-3 text-center">Results</p>
                <LiveResults
                  pollType={activePoll.poll_type}
                  results={results}
                  options={(activePoll.options as string[]) || []}
                  compact
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
            </div>
            <h2 className="text-lg font-semibold text-white">Waiting for a poll...</h2>
            <p className="text-sm text-slate-500 max-w-xs">
              The presenter will activate a poll shortly. This page will update automatically.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[10px] text-slate-700">Powered by The Human Factor</p>
      </div>
    </div>
  )
}
