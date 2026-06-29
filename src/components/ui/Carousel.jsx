import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

/**
 * Generic carousel: auto-advances, supports manual prev/next and touch
 * swipe, crossfades/slides between slides. Used by Testimonials (build
 * brief §6.9) but kept generic per the §4 folder spec (components/ui).
 */
function Carousel({ items, renderItem, autoAdvanceMs = 6000 }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const prefersReducedMotion = usePrefersReducedMotion()

  const goTo = useCallback(
    (newIndex, dir) => {
      setDirection(dir)
      setIndex((newIndex + items.length) % items.length)
    },
    [items.length]
  )

  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index])

  useEffect(() => {
    if (prefersReducedMotion) return
    const timer = setInterval(goNext, autoAdvanceMs)
    return () => clearInterval(timer)
  }, [goNext, autoAdvanceMs, prefersReducedMotion])

  // Touch swipe support
  const [touchStartX, setTouchStartX] = useState(null)
  const handleTouchStart = (event) => setTouchStartX(event.touches[0].clientX)
  const handleTouchEnd = (event) => {
    if (touchStartX === null) return
    const deltaX = event.changedTouches[0].clientX - touchStartX
    if (deltaX > 50) goPrev()
    else if (deltaX < -50) goNext()
    setTouchStartX(null)
  }

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  }

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: 'easeInOut' }}
          >
            {renderItem(items[index], index)}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous testimonial"
          className="w-10 h-10 rounded-full glass-surface flex items-center justify-center text-paper hover:text-gold hover:border-gold/50 transition-colors duration-300"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i, i > index ? 1 : -1)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-gold-sweep' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next testimonial"
          className="w-10 h-10 rounded-full glass-surface flex items-center justify-center text-paper hover:text-gold hover:border-gold/50 transition-colors duration-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default Carousel
