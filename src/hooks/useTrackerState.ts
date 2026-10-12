import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_STATE, type TrackerState } from '../types'

const STORAGE_KEY = 'ottothon-tracker-state'
const CHANNEL_NAME = 'ottothon-tracker-sync'

function loadState(): TrackerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<TrackerState>
    return { ...DEFAULT_STATE, ...parsed }
  } catch {
    return DEFAULT_STATE
  }
}

/**
 * Shares tracker state across every tab/window open on this same browser
 * (e.g. a control tab on your phone/laptop and a display tab on the
 * projector laptop, as long as they're the same browser profile).
 *
 * This does NOT sync across separate devices — for that you'd want to
 * swap the storage layer here for something like Firebase Realtime
 * Database, the same way the Rootless project uses Firebase.
 */
export function useTrackerState() {
  const [state, setState] = useState<TrackerState>(loadState)
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = channel

    channel.onmessage = (event: MessageEvent<TrackerState>) => {
      setState(event.data)
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setState(loadState())
      }
    }
    window.addEventListener('storage', onStorage)

    return () => {
      channel.close()
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const updateState = useCallback((updater: (prev: TrackerState) => TrackerState) => {
    setState((prev) => {
      const next = updater(prev)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // storage can fail (quota, private browsing) — state still updates in-memory
      }
      channelRef.current?.postMessage(next)
      return next
    })
  }, [])

  return { state, updateState }
}
