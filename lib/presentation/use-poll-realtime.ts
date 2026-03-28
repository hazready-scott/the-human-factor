'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface PollResults {
  // Multiple choice
  counts?: Record<string, number>
  // Word cloud
  words?: Record<string, number>
  // Rating
  average?: number
  distribution?: Record<number, number>
  // Open-ended
  responses?: string[]
  // Common
  total: number
}

interface UsePollRealtimeReturn {
  results: PollResults
  totalResponses: number
  isConnected: boolean
}

export function usePollRealtime(
  pollSessionId: string | undefined,
  pollType: string,
  slug: string
): UsePollRealtimeReturn {
  const [results, setResults] = useState<PollResults>({ total: 0 })
  const [isConnected, setIsConnected] = useState(false)
  const supabaseRef = useRef(createClient())

  // Fetch initial results
  const fetchResults = useCallback(async () => {
    if (!pollSessionId || !slug) return
    try {
      const res = await fetch(`/api/presentations/${slug}/polls/${pollSessionId}`)
      const data = await res.json()
      if (data.results) {
        setResults(data.results)
      }
    } catch (err) {
      console.error('Failed to fetch poll results:', err)
    }
  }, [pollSessionId, slug])

  useEffect(() => {
    if (!pollSessionId) return

    fetchResults()

    // Subscribe to realtime changes on poll_responses
    const channel = supabaseRef.current
      .channel(`poll-results-${pollSessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'poll_responses',
          filter: `session_id=eq.${pollSessionId}`,
        },
        () => {
          // Re-fetch aggregated results on any change
          fetchResults()
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabaseRef.current.removeChannel(channel)
    }
  }, [pollSessionId, fetchResults])

  return {
    results,
    totalResponses: results.total || 0,
    isConnected,
  }
}

// Hook to listen for active poll changes (for audience view)
export function usePollSessionRealtime(presentationId: string | undefined) {
  const [activePoll, setActivePoll] = useState<{
    id: string
    question: string
    poll_type: string
    options: string[]
    settings: Record<string, unknown>
    status: string
  } | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const supabaseRef = useRef(createClient())

  const fetchActivePoll = useCallback(async (presId: string) => {
    const { data } = await supabaseRef.current
      .from('poll_sessions')
      .select('*')
      .eq('presentation_id', presId)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    setActivePoll(data || null)
  }, [])

  useEffect(() => {
    if (!presentationId) return

    fetchActivePoll(presentationId)

    const channel = supabaseRef.current
      .channel(`poll-sessions-${presentationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'poll_sessions',
          filter: `presentation_id=eq.${presentationId}`,
        },
        () => {
          fetchActivePoll(presentationId)
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabaseRef.current.removeChannel(channel)
    }
  }, [presentationId, fetchActivePoll])

  return { activePoll, isConnected }
}
