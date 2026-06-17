import { useEffect, useState } from 'react'
import { publicApi } from '@/lib/api'
import { normalizeLiveData, type NormalizedLive } from '@/lib/live'

export function useLiveStatus(pollMs = 30000) {
  const [live, setLive] = useState<NormalizedLive | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchLive = async () => {
      try {
        const response = await publicApi.getLive()
        if (!cancelled && response.success) {
          setLive(normalizeLiveData(response.data as Record<string, unknown>))
        }
      } catch (error) {
        console.error('Error fetching live status:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchLive()
    const interval = setInterval(fetchLive, pollMs)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [pollMs])

  return { live, loading }
}
