import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Fullscreen lightbox for the Gallery page.
 *
 * Features:
 * - Keyboard navigation (← → Esc)
 * - Glassmorphic nav buttons
 * - Image counter "4 / 24"
 * - Album badge below image
 * - Closes on backdrop click
 * - Progress strip (dot or line based on collection size)
 */
function Lightbox({ items, activeIndex, onClose, onNavigate }) {
  const isOpen = activeIndex !== null
  const item = isOpen ? items[activeIndex] : null

  const goNext = useCallback(() => {
    onNavigate((activeIndex + 1) % items.length)
  }, [activeIndex, items.length, onNavigate])

  const goPrev = useCallback(() => {
    onNavigate((activeIndex - 1 + items.length) % items.length)
  }, [activeIndex, items.length, onNavigate])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') goNext()
      if (event.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, goNext, goPrev])

  const showDots = items.length > 0 && items.length <= 12

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          role="dialog"
          aria-modal="true"
          aria-label={item?.title}
          onClick={onClose}
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 backdrop-blur-sm" aria-hidden="true" />

          {/* ── Top bar ─────────────────────────────────────────────────── */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4">
            {/* Counter */}
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs font-semibold text-mist/50 tabular-nums tracking-wider"
              aria-live="polite"
            >
              {activeIndex + 1} / {items.length}
            </motion.span>

            {/* Keyboard hint */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[11px] text-mist/25 tracking-wider hidden md:block select-none"
              aria-hidden="true"
            >
              ← → to navigate · Esc to close
            </motion.span>

            {/* Close button */}
            <motion.button
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 rounded-full glass-surface flex items-center justify-center text-paper/70 hover:text-gold hover:border-gold/45 transition-colors duration-200"
            >
              <X size={17} />
            </motion.button>
          </div>

          {/* ── Navigation buttons ───────────────────────────────────────── */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            aria-label="Previous image"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full glass-surface flex items-center justify-center text-paper/70 hover:text-gold hover:border-gold/40 hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            aria-label="Next image"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full glass-surface flex items-center justify-center text-paper/70 hover:text-gold hover:border-gold/40 hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <ChevronRight size={22} />
          </button>

          {/* ── Image ───────────────────────────────────────────────────── */}
          <motion.div
            key={item?.id}
            initial={{ opacity: 0, scale: 0.88, filter: 'blur(16px)', y: 20 }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, scale: 0.88, filter: 'blur(16px)', y: 20 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl w-full z-10 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item?.image}
              alt={item?.title}
              className="w-full max-h-[72vh] object-contain rounded-2xl"
            />

            {/* Caption + album row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.28, ease: 'easeOut' }}
              className="mt-4 flex items-center justify-between gap-4 w-full px-1"
            >
              <p className="text-paper/90 text-sm md:text-base font-semibold leading-snug">
                {item?.title}
              </p>
              {item?.album && item.album !== 'All' && (
                <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-[10px] text-gold/75 uppercase tracking-wider font-semibold bg-gold/8 border border-gold/20 rounded-full px-3 py-1">
                  {item.album}
                </span>
              )}
            </motion.div>
          </motion.div>

          {/* ── Progress indicator — bottom ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
            aria-hidden="true"
          >
            {showDots ? (
              /* Dot strip for small collections */
              <div className="flex items-center gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onNavigate(i)
                    }}
                    aria-label={`Go to image ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-5 h-1.5 bg-gold'
                        : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/45'
                    }`}
                  />
                ))}
              </div>
            ) : (
              /* Progress line for large collections */
              <div className="w-40 h-[2px] bg-white/12 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gold-sweep rounded-full"
                  animate={{
                    width: `${((activeIndex + 1) / items.length) * 100}%`,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Lightbox
