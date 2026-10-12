import { useEffect, useState } from 'react'

export default function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="clock-wrap">
      <div className="clock-label">Current Time</div>
      <div className="clock">
        {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      </div>
    </div>
  )
}
