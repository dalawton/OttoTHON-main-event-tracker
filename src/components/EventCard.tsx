import type { EventInfo } from '../types'
import Decoration from './Decoration'

interface EventCardProps {
  event: EventInfo
}

// Update this each year if OttoTHON's DonorDrive link changes (see src/config.ts).
const DONATE_URL = 'https://events.dancemarathon.com/OttoTHON26'

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="panel-card">
      <Decoration src="public/popcorn.png" className="decoration-popcorn" />
      <div className="panel-ribbon ribbon-blue">★ LATEST UPDATE ★</div>

      <div className="update-body">
        <div className="update-heading">{event.now}</div>
        {event.next && <div className="update-next">Up next: {event.next}</div>}
        <p className="update-note">{event.note}</p>

        <a className="donate-button" href={DONATE_URL} target="_blank" rel="noopener noreferrer">
          ♥ DONATE NOW ♥
        </a>
      </div>
    </div>
  )
}
