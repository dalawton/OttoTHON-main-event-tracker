import { useState } from 'react'
import { publicAsset } from '../lib/publicAsset'

interface DecorationProps {
  src: string
  className?: string
}

/**
 * For your own drawn doodles/graphics scattered around the page. Unlike
 * ImageSlot, this one just disappears if the file isn't there yet instead
 * of showing a placeholder box — so you can drop in new art over time
 * without empty boxes cluttering the page in the meantime.
 *
 * To use: drop a PNG in /public, then render <Decoration src="/your-file.png" />
 * wherever you want it (see the .decoration-* position classes in App.css
 * for ready-made spots, or write your own).
 */
export default function Decoration({ src, className }: DecorationProps) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <img
      src={publicAsset(src)}
      alt=""
      aria-hidden="true"
      className={`decoration ${className ?? ''}`.trim()}
      onError={() => setFailed(true)}
    />
  )
}
