/**
 * OttoTHON's DonorDrive event changes host/ID potentially every year
 * (events.dancemarathon.com/OttoTHON26 for 2026, etc.). Update these two
 * values each year rather than hunting through the codebase.
 *
 * Can also be overridden per-environment via a .env file:
 *   VITE_DONORDRIVE_API_BASE=https://events.dancemarathon.com/api
 *   VITE_DONORDRIVE_EVENT_ID=7327
 */
export const DONOR_DRIVE_API_BASE: string =
  import.meta.env.VITE_DONORDRIVE_API_BASE ?? 'https://events.dancemarathon.com/api'

export const DONOR_DRIVE_EVENT_ID: string = import.meta.env.VITE_DONORDRIVE_EVENT_ID ?? '7327'
