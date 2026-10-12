import { useEffect, useRef, useState } from 'react'
import { fetchRecentDonations } from '../services/donorDrive'
import type { TrackerState } from '../types'

const POLL_INTERVAL_MS = 15000
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
  const inFlight = useRef(false)

  useEffect(() => {
    let cancelled = false

    const poll = async () => {
      if (inFlight.current) return
      inFlight.current = true
      try {
        const donations = await fetchRecentDonations(FEED_LIMIT)
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
        inFlight.current = false
      }
    }

    poll()
    const id = setInterval(poll, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { status, lastSynced }
}
