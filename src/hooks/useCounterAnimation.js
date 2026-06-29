import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

// Cubic ease-out — fast start, gentle settle. Feels more "counted up" than linear.
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Animates a numeric counter from 0 to `target` once the element scrolls
 * into view, using requestAnimationFrame (not setInterval) for smooth,
 * frame-accurate easing. Fires exactly once per mount via IntersectionObserver.
 * Jumps straight to the final value for prefers-reduced-motion users.
 *
 * @param {number} target - final value to count up to
 * @param {number} duration - animation duration in ms
 * @returns {[React.RefObject, number]} ref to attach to the trigger element, current displayed value
 */
export default function useCounterAnimation(target, duration = 1800) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const hasAnimated = useRef(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true

            if (prefersReducedMotion) {
              setValue(target)
              observer.unobserve(node)
              return
            }

            const startTime = performance.now()

            const tick = (now) => {
              const elapsed = now - startTime
              const progress = Math.min(elapsed / duration, 1)
              const eased = easeOutCubic(progress)
              setValue(Math.round(eased * target))

              if (progress < 1) {
                requestAnimationFrame(tick)
              } else {
                setValue(target)
              }
            }

            requestAnimationFrame(tick)
            observer.unobserve(node)
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [target, duration, prefersReducedMotion])

  return [ref, value]
}
