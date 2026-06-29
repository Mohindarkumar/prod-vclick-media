import { useEffect, useRef, useState } from 'react'

/**
 * Animation variant presets for Framer Motion whileInView / animate.
 * Import and spread into motion elements for consistent, site-wide motion.
 *
 * Usage:
 *   import { animationVariants } from '../../hooks/useScrollReveal'
 *   <motion.div variants={animationVariants.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
 */
export const animationVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 44 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -44 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -56 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 56 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.65, ease: 'easeOut' } },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.82 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  },
  zoomOut: {
    hidden: { opacity: 0, scale: 1.18 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.65 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] } },
  },
  slideUpFade: {
    hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  },
  // Mask / curtain reveal — text slides up from behind overflow:hidden parent.
  // Wrap the element you want to mask inside: <div className="overflow-hidden">
  maskReveal: {
    hidden: { y: '105%' },
    visible: { y: '0%', transition: { duration: 0.88, ease: [0.76, 0, 0.24, 1] } },
  },
  // Full-section wipe reveal using clip-path (use on section wrappers)
  wipeReveal: {
    hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
    visible: { clipPath: 'inset(0 0 0% 0)', opacity: 1, transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] } },
  },
  // Blur-to-sharp entrance — great for images and cards
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(14px)', y: 10 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  },
  staggerContainer: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
  },
  staggerContainerFast: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  },
}

/**
 * Lightweight IntersectionObserver wrapper for scroll-reveal animations.
 * Returns a ref to attach to the target element and a boolean that flips
 * to true once the element enters the viewport (fires once by default).
 *
 * Framer Motion's whileInView covers most cases directly in JSX via
 * animationVariants above. This hook exists for imperative use-cases
 * (AnimatedCounter, canvas/SVG-driven effects) that need the "is visible" event.
 */
export default function useScrollReveal({ threshold = 0.2, once = true, rootMargin = '0px' } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) observer.unobserve(node)
          } else if (!once) {
            setIsVisible(false)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, once, rootMargin])

  return [ref, isVisible]
}
