import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Horizontally-scrollable album filter bar.
 *
 * Active album uses a shared `layoutId` background span so switching tabs
 * produces a smooth spring-driven morph instead of a hard color swap.
 * Inactive pills have a glassmorphic ghost style with hover scale.
 * Gradient edge masks hint that the bar scrolls horizontally.
 *
 * The wheel handler uses a native DOM listener (passive: false) so it can call
 * preventDefault() and convert vertical wheel delta to horizontal scroll.
 * React's synthetic onWheel is passive by default since React 17 — calling
 * preventDefault() on it throws a browser warning and has no effect.
 */
function GalleryFilter({ albums, counts, activeAlbum, onChange }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleWheel = (event) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      event.preventDefault()
      el.scrollLeft += event.deltaY
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div className="relative">
      {/* Left gradient fade */}
      <div
        className="absolute left-0 top-0 bottom-2 w-6 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #0B0B0B, transparent)' }}
        aria-hidden="true"
      />
      {/* Right gradient fade */}
      <div
        className="absolute right-0 top-0 bottom-2 w-6 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #0B0B0B, transparent)' }}
        aria-hidden="true"
      />

      <div
        ref={scrollRef}
        className="flex items-center gap-2.5 overflow-x-auto pb-2 px-1 scrollbar-hide"
        role="group"
        aria-label="Filter gallery by album"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {albums.map((album) => {
          const isActive = album === activeAlbum
          const count = counts[album] ?? 0

          return (
            <motion.button
              key={album}
              type="button"
              onClick={() => onChange(album)}
              whileTap={{ scale: 0.94 }}
              whileHover={isActive ? {} : { scale: 1.04 }}
              aria-pressed={isActive}
              className={`
                relative flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
                ${isActive
                  ? 'text-ink'
                  : 'bg-transparent border border-white/12 text-mist hover:text-paper hover:border-gold/40'
                }
              `}
            >
              {/* Shared layoutId background — morphs smoothly between active pills */}
              {isActive && (
                <motion.span
                  layoutId="gallery-filter-indicator"
                  className="absolute inset-0 rounded-full bg-gold-sweep"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  aria-hidden="true"
                />
              )}

              <span className="relative z-10">{album}</span>

              {count > 0 && (
                <span
                  className={`
                    relative z-10 text-[11px] font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-none
                    ${isActive ? 'bg-black/20 text-ink/70' : 'bg-white/10 text-mist/70'}
                  `}
                >
                  {count}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default GalleryFilter
