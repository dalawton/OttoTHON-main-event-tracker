export interface Donation {
  id: string
  name: string
  amount: number
  ts: number
  /** Optional donor message, shown under the name in the feed when present. */
  message?: string
}

export interface EventInfo {
  now: string
  next: string
  note: string
}

export interface TrackerState {
  /** Manually-added entries (e.g. cash collected at the door) shown in the feed. */
  donations: Donation[]
  /** Most recent donations pulled from DonorDrive, shown in the feed. */
  liveDonations: Donation[]
  event: EventInfo
}

export const DEFAULT_STATE: TrackerState = {
  donations: [],
  liveDonations: [],
  event: {
    now: "We're halfway there!",
    next: 'Line Dance Hour — 3:00 PM',
    note: 'Thanks to all of our amazing donors — every donation helps us bring hope, healing, and brighter tomorrows to the kids at Upstate Golisano.',
  },
}
