import { useEffect, useState } from 'react'

/**
 * Tracks the user's `prefers-reduced-motion` OS/browser setting.
 * Used to gate parallax, cursor-glow, autoplay-heavy motion, and
 * marquee animations per the build brief's accessibility requirements.
 */
export default function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mediaQuery.matches)

    const handleChange = (event) => setPrefersReduced(event.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReduced
}
