import headerPhoto from '../assets/MainHeader.png'
import Clock from './Clock'

export default function Hero() {
  return (
    <div className="hero">
      <img src={headerPhoto} alt="OttoTHON — Carnival for a Cause" className="hero-photo" />

      <div className="hero-corner hero-corner-right">
        <Clock />
      </div>
    </div>
  )
}
