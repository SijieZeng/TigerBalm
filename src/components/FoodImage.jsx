import { useState } from 'react'

/**
 * Renders a real image from /public/images when present, otherwise falls back
 * to a tasteful emoji-on-gradient tile. Drop a real photo at `src` later and it
 * swaps in automatically — no code change.
 */
export default function FoodImage({ src, emoji, alt = '', className = '', rounded = 'rounded-2xl', emojiClass = 'text-5xl' }) {
  const [failed, setFailed] = useState(!src)

  if (src && !failed) {
    return <img src={src} alt={alt} onError={() => setFailed(true)} className={`object-cover ${rounded} ${className}`} />
  }
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 ${rounded} ${className}`}
      role="img"
      aria-label={alt || 'food'}
    >
      <span className={emojiClass}>{emoji}</span>
    </div>
  )
}
