# OTTOTHON Live Event Tracker

A live donation feed and event-update display for OttoTHON's main event, built with React + Vite +
TypeScript, styled to match the carnival dashboard mockup.

## Running it

```bash
npm install
npm run dev
```

## The header

`src/assets/MainHeader.png` is your drawn header art — it fills the entire top banner, shown at its
natural size (no cropping). The logo sits in a small cream/gold badge in the top-left corner (drop
a file at `/public/logo-left.png`), and the live clock sits in a matching badge in the top-right
corner, both overlaid directly on the photo.

To swap the header photo later, replace `src/assets/MainHeader.png` with a new file of the same
name (or update the import in `src/components/Hero.tsx`).

## Cards

- **Live Donation Feed** — a scrollable list of donations (manual + live DonorDrive ones merged
  together), each with an alternating ❤️/⭐ icon, the donor's name and amount, an optional message
  (shown only when DonorDrive provides one), and a relative timestamp.
- **Latest Update** — shows the current headline (`event.now`), an optional "up next" line, a
  longer note, and a **Donate Now** button linking to OttoTHON's DonorDrive page. Update the
  `DONATE_URL` constant in `src/components/EventCard.tsx` each year if the link changes.

Both use a shared `.panel-card` / `.panel-ribbon` style in `App.css` — a white rounded card with a
colored pill-shaped ribbon banner across the top (red for donations, blue for updates).

There's no grand-total or fundraising-goal display in this version — that functionality still
exists in the code history if you want it back later, but the current design only shows the live
feed and the update card, per the mockup.

## Your own graphics

- **Logo** (`ImageSlot` component) — drop `/public/logo-left.png` in and it replaces the dashed
  placeholder badge automatically.
- **Decorations** (`Decoration` component, in `src/components/Decoration.tsx`) — your drawings are
  scattered around the page using this component. Each one hides itself automatically if its file
  isn't in `/public` (no placeholder box), so removing one is as simple as deleting the file.

  Currently placed (see the matching `.decoration-*` rules in `App.css` for exact position/size):

  | File | Where |
  |---|---|
  | `balloons.png` | peeking above the hero's top-left corner |
  | `ticket-admit-one.png` | peeking above the hero's top-right corner |
  | `elephant.png` | bottom-left corner of the page |
  | `ticket-booth.png` | bottom-right corner of the page |
  | `goose.png` | left edge, vertically centered beside the cards |
  | `shark.png` | right edge, vertically centered beside the cards |
  | `rabbit-hat.png` | pinned to the Live Donations card's bottom-right corner |
  | `popcorn.png` | pinned to the Latest Update card's bottom-left corner |

  The six page-edge ones hide below 1100px wide (they need the margin outside the 1200px-wide
  board to have somewhere to sit), and the two card-corner ones hide below 760px (mobile). Nudge
  any of them by editing their `top`/`left`/`right`/`bottom`/`width`/`transform: rotate(...)` values
  in `App.css` — nothing else needs to change.

## Live DonorDrive data

The live donation feed pulls straight from DonorDrive's public API — no API key required, since
it's the same endpoint that powers DonorDrive's embeddable widgets.

- Config lives in `src/config.ts`: the API host and event ID (currently
  `https://events.dancemarathon.com/api`, eventID `7327` — OttoTHON26). Update this each year, or
  override via `.env` (see `.env.example`).
- `src/services/donorDrive.ts` is the API client.
- `src/hooks/useDonorDriveSync.ts` polls every 15 seconds and merges results into shared state.

**Before the event**, open `https://events.dancemarathon.com/api/events/7327/donations` directly in
a browser to confirm it still resolves and check the JSON field names match what's in
`donorDrive.ts`. If next year's event uses a different host/ID, update `src/config.ts`.

If the sync fails (shown in the control panel), the donation feed just shows manually-added entries
instead — check the browser console for the actual fetch error.

## Manual entries

The gear icon (bottom-right) opens a control panel for updating the "Latest Update" card's
headline, "up next" line, and note. These sync instantly across every tab open in the same browser
via `BroadcastChannel` + `localStorage` (see `src/hooks/useTrackerState.ts`) — not across separate
devices. For true cross-device sync, swap the storage layer for something like Firebase Realtime
Database.
