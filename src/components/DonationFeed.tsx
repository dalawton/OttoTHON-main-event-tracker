import type { Donation } from '../types'
import Decoration from './Decoration'

interface DonationFeedProps {
  donations: Donation[]
  liveDonations: Donation[]
}

function formatMoney(n: number): string {
  return `$${Math.round(n).toLocaleString()}`
}

function timeAgo(ts: number): string {
  const minutes = Math.max(0, Math.round((Date.now() - ts) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  return `${hours}h ago`
}

export default function DonationFeed({ donations, liveDonations }: DonationFeedProps) {
  const sorted = [...donations, ...liveDonations].sort((a, b) => b.ts - a.ts)

  return (
    <div className="panel-card">
      <Decoration src="/rabbit-hat.png" className="decoration-rabbit-hat" />
      <div className="panel-ribbon ribbon-red">★ LIVE DONATION FEED ★</div>

      <div className="donation-list">
        {sorted.length === 0 ? (
          <div className="stream-empty">Donations will appear here as they come in.</div>
        ) : (
          sorted.map((d, i) => (
            <div className="donation-row" key={`${d.id}-${i}`}>
              <div className="donation-icon">{i % 2 === 0 ? '❤️' : '⭐'}</div>
              <div className="donation-body">
                <div className="donation-line">
                  <span className="donor-name">{d.name}</span> donated {formatMoney(d.amount)}
                </div>
                {d.message && <div className="donor-message">{d.message}</div>}
              </div>
              <div className="donation-time">{timeAgo(d.ts)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
