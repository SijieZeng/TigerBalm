import { useState, useEffect } from 'react'

/**
 * Compute a box of a fixed aspect ratio that fits inside the *visible* viewport,
 * using window.innerWidth/innerHeight (works in every browser, including old
 * in-app webviews like WeChat/QQ X5 that lack aspect-ratio / dvh / min()).
 *
 * @param {number} ratio    box width / height (e.g. 393/852)
 * @param {number} reserveW px to subtract from width  (chrome/margins)
 * @param {number} reserveH px to subtract from height (chrome/margins)
 * @returns {{w:number,h:number}} pixel size to apply as inline width/height
 */
export function useFitSize(ratio, reserveW = 0, reserveH = 0) {
  const calc = () => {
    if (typeof window === 'undefined') return { w: 0, h: 0 }
    const availW = window.innerWidth - reserveW
    const availH = window.innerHeight - reserveH
    const w = Math.max(0, Math.min(availW, availH * ratio))
    return { w, h: w / ratio }
  }

  const [size, setSize] = useState(calc)

  useEffect(() => {
    const onResize = () => setSize(calc())
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    // re-measure shortly after load (mobile chrome bars settle async)
    const t = setTimeout(onResize, 300)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return size
}
