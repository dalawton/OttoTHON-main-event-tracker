import { useState } from 'react'

interface ImageSlotProps {
  src: string
  label: string
  size: string
  className?: string
  alt?: string
}

function placeholderDataUri(label: string, size: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
    <rect width="100%" height="100%" fill="#FFF8E1"/>
    <rect x="6" y="6" width="388" height="288" fill="none" stroke="#1B3A6B" stroke-width="5" stroke-dasharray="12,9"/>
    <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#1B3A6B" font-family="sans-serif" font-size="22" font-weight="700">${label}</text>
    <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="#5B6B8A" font-family="sans-serif" font-size="15">${size}</text>
  </svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Drop your own image into /public using the filename given as `src`
 * (e.g. /public/logo-left.png) and it replaces this placeholder
 * automatically — no code changes needed.
 */
export default function ImageSlot({ src, label, size, className, alt = '' }: ImageSlotProps) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed ? placeholderDataUri(label, size) : src}
      alt={alt}
      className={`${className ?? ''} ${failed ? 'placeholder-img' : ''}`.trim()}
      onError={() => setFailed(true)}
    />
  )
}
