import './App.css'
import Hero from './components/Hero'
import DonationFeed from './components/DonationFeed'
import EventCard from './components/EventCard'
import ControlPanel from './components/ControlPanel'
import Decoration from './components/Decoration'
import { useTrackerState } from './hooks/useTrackerState'
import { useDonorDriveSync } from './hooks/useDonorDriveSync'

function App() {
  const { state, updateState } = useTrackerState()
  const { status: syncStatus, lastSynced } = useDonorDriveSync(updateState)

  return (
    <div className="board">
      {/* Scattered drawings — see App.css .decoration-* rules for positions.
          Each one hides itself automatically if the file isn't in /public. */}
      <Decoration src="public/balloons.png" className="decoration-balloons" />
      <Decoration src="public/ticket-admit-one.png" className="decoration-ticket-admit" />
      <Decoration src="public/elephant.png" className="decoration-elephant" />
      <Decoration src="public/ticket-booth.png" className="decoration-ticket-booth" />
      <Decoration src="public/goose.png" className="decoration-goose" />
      <Decoration src="public/shark.png" className="decoration-shark" />

      <Hero />

      <div className="blocks">
        <DonationFeed donations={state.donations} liveDonations={state.liveDonations} />
        <EventCard event={state.event} />
      </div>

      <ControlPanel state={state} updateState={updateState} syncStatus={syncStatus} lastSynced={lastSynced} />
    </div>
  )
}

export default App
