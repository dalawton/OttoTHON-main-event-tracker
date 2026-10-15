import { useEffect, useState } from 'react'
import { fetchRecentDonations } from '../services/donorDrive'
import type { TrackerState } from '../types'

const POLL_INTERVAL_MS = 5000
// If a request hasn't finished by then, give up on it and try again, so one
// stalled request (spotty venue wifi) can never freeze the feed.
const REQUEST_TIMEOUT_MS = 8000
const FEED_LIMIT = 10

export type SyncStatus = 'idle' | 'ok' | 'error'

/**
 * Only the tab/device that actually has internet to DonorDrive needs this
 * running — its results flow into the same shared TrackerState as manual
 * control-panel edits, so every other tab/display picks them up via
 * useTrackerState's cross-tab sync.
 */
export function useDonorDriveSync(updateState: (updater: (prev: TrackerState) => TrackerState) => void) {
  const [status, setStatus] = useState<SyncStatus>('idle')
  const [lastSynced, setLastSynced] = useState<Date | null>(null)

  useEffect(() => {
    let cancelled = false
    let inFlight = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let controller: AbortController | undefined

    // Schedule the next poll only after the current one finishes (success,
    // error, or timeout), so requests never pile up or get skipped.
    const schedule = () => {
      clearTimeout(timer)
      if (!cancelled) timer = setTimeout(poll, POLL_INTERVAL_MS)
    }

    const poll = async () => {
      if (inFlight) return
      inFlight = true
      controller = new AbortController()
      const timeout = setTimeout(() => controller?.abort(), REQUEST_TIMEOUT_MS)
      try {
        const donations = await fetchRecentDonations(FEED_LIMIT, controller.signal)
        if (cancelled) return

        updateState((prev) => ({
          ...prev,
          liveDonations: donations.map((d) => ({
            id: `dd-${d.donationID}`,
            name: d.displayName || 'Anonymous',
            amount: d.amount,
            ts: new Date(d.createdDateUTC).getTime(),
            message: d.message,
          })),
        }))
        setStatus('ok')
        setLastSynced(new Date())
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          console.error('DonorDrive sync failed:', err)
        }
      } finally {
        clearTimeout(timeout)
        inFlight = false
        schedule()
      }
    }

    // Browsers throttle timers in hidden tabs and pause them while a laptop
    // sleeps. Poll immediately when the tab comes back or the network returns.
    const wake = () => {
      if (document.visibilityState !== 'visible') return
      clearTimeout(timer)
      poll()
    }
    document.addEventListener('visibilitychange', wake)
    window.addEventListener('online', wake)

    poll()
    return () => {
      cancelled = true
      clearTimeout(timer)
      controller?.abort()
      document.removeEventListener('visibilitychange', wake)
      window.removeEventListener('online', wake)
    }
  }, [updateState])

  return { status, lastSynced }
}
