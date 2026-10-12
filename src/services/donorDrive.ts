/**
 * Client for DonorDrive's public, read-only API (no API key required).
 *
 * This is the same platform events.dancemarathon.com runs on, and it's
 * what powers the embeddable donation-total/thermometer widgets you see
 * on DonorDrive fundraising pages — so this endpoint is open by design
 * and doesn't hit the 401 that the bulk participant-list endpoint gave
 * previously.
 *
 * Docs are informal/community-maintained (DonorDrive doesn't publish an
 * official spec), but the shape below matches the long-stable schema used
 * by Extra Life, Dance Marathon Network, and similar DonorDrive events.
 *
 * IMPORTANT — verify before relying on this for the live event:
 * Open https://events.dancemarathon.com/api/events/7327/donations directly
 * in a browser. If it 404s, the host or eventID is wrong for this year's
 * event — check the current OttoTHON DonorDrive link and update the
 * values in `src/config.ts`. If the JSON keys differ from what's typed
 * below, adjust `DonorDriveDonation` to match.
 *
 * Note: this app no longer shows a grand total or fundraising goal, so
 * the event-summary endpoint (which has those fields) isn't used here.
 * If you want them back later, add a fetchEventSummary() the same way as
 * fetchRecentDonations() below, against `${DONOR_DRIVE_API_BASE}/events/${DONOR_DRIVE_EVENT_ID}`.
 */

import { DONOR_DRIVE_API_BASE, DONOR_DRIVE_EVENT_ID } from '../config'

export interface DonorDriveDonation {
  donationID: string
  displayName: string
  amount: number
  message?: string
  createdDateUTC: string
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`DonorDrive API error ${res.status} for ${url}`)
  }
  return res.json() as Promise<T>
}

/**
 * Most recent donations for the whole event, newest first.
 * `limit` caps how many come back (DonorDrive defaults to a small page size).
 */
export function fetchRecentDonations(limit = 50): Promise<DonorDriveDonation[]> {
  return fetchJson<DonorDriveDonation[]>(
    `${DONOR_DRIVE_API_BASE}/events/${DONOR_DRIVE_EVENT_ID}/donations?limit=${limit}`,
  )
}
