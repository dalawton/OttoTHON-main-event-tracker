import { useState } from 'react'
import type { TrackerState } from '../types'
import type { SyncStatus } from '../hooks/useDonorDriveSync'

interface ControlPanelProps {
  state: TrackerState
  updateState: (updater: (prev: TrackerState) => TrackerState) => void
  syncStatus: SyncStatus
  lastSynced: Date | null
}

export default function ControlPanel({ updateState, syncStatus, lastSynced }: ControlPanelProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')

  const [eventNow, setEventNow] = useState('')
  const [eventNext, setEventNext] = useState('')
  const [eventNote, setEventNote] = useState('')


  const flash = (msg: string) => {
    setStatus(msg)
    setTimeout(() => setStatus((s) => (s === msg ? '' : s)), 2200)
  }

  const updateEvent = () => {
    if (!eventNow.trim() && !eventNext.trim() && !eventNote.trim()) {
      flash('Enter at least one field to update.')
      return
    }
    updateState((prev) => ({
      ...prev,
      event: {
        now: eventNow.trim() || prev.event.now,
        next: eventNext.trim() || prev.event.next,
        note: eventNote.trim() || prev.event.note,
      },
    }))
    setEventNow('')
    setEventNext('')
    setEventNote('')
    flash('Event updated.')
  }

  return (
    <>
      <button className="control-toggle" onClick={() => setOpen((o) => !o)} title="Update tracker">
        ⚙
      </button>

      {open && (
        <div className="control-panel open">
          <div className="control-title">Update the tracker</div>

          <div className={`sync-status sync-${syncStatus}`}>
            {syncStatus === 'ok' &&
              `DonorDrive connected${lastSynced ? ` — last synced ${lastSynced.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}` : ''}`}
            {syncStatus === 'error' && 'DonorDrive sync failed — check the host/eventID in src/config.ts'}
            {syncStatus === 'idle' && 'Connecting to DonorDrive…'}
          </div>            

          <div>
            <label>Current activity</label>
            <input
              type="text"
              placeholder="e.g. Line Dance Hour"
              value={eventNow}
              onChange={(e) => setEventNow(e.target.value)}
            />
            <label>Up next</label>
            <input
              type="text"
              placeholder="e.g. Zumba — 4:00 PM"
              value={eventNext}
              onChange={(e) => setEventNext(e.target.value)}
            />
            <label>Note / reminder</label>
            <input
              type="text"
              placeholder="Short reminder for dancers"
              value={eventNote}
              onChange={(e) => setEventNote(e.target.value)}
            />
            <button className="action" onClick={updateEvent}>
              Update event
            </button>
          </div>

          <div className="control-status">{status}</div>
          
        </div>
      )}
    </>
  )
}
