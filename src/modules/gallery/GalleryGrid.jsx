import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, ChevronDown } from 'lucide-react'
import GalleryCard from './GalleryCard'

const ITEMS_PER_PAGE = 12

/**
 * Gallery masonry grid.
 *
 * Layout: CSS `columns` for true masonry flow.
 * AnimatePresence keyed on activeAlbum — entire grid cross-fades on filter
 * change, avoiding layout-thrash from per-item re-ordering.
 *
 * Load More: reveals ITEMS_PER_PAGE additional items and shows a progress bar.
 */
function GalleryGrid({ items, activeAlbum, onOpenLightbox }) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [activeAlbum])

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }, [])

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount])
  const hasMore = visibleCount < items.length
  const progressPercent = items.length > 0 ? (visibleItems.length / items.length) * 100 : 0

  // ── Empty state ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <motion.div
        key="empty"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6 py-28 text-center"
      >
        <motion.div
          className="relative w-20 h-20"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-full bg-gold/8 border border-gold/20 animate-ping" style={{ animationDuration: '2.5s' }} aria-hidden="true" />
          <div className="relative w-20 h-20 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center">
            <Camera size={30} className="text-gold/60" aria-hidden="true" />
          </div>
        </motion.div>
        <div>
          <p className="text-paper/75 font-semibold text-base">No images in this album yet.</p>
          <p className="text-sm text-mist/45 mt-1.5">Check back soon — more work is on the way.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Grid — key on activeAlbum triggers cross-fade on filter change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAlbum}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="columns-2 sm:columns-2 md:columns-3 xl:columns-4 gap-3 md:gap-4"
        >
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.55,
                delay: Math.min(index * 0.04, 0.44),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="break-inside-avoid mb-3 md:mb-4"
            >
              <GalleryCard item={item} onOpen={onOpenLightbox} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Load more ──────────────────────────────────────────────────────── */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="flex flex-col items-center gap-4 mt-14"
        >
          {/* Progress bar */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-52 h-[3px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gold-sweep rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="text-xs text-mist/45 tabular-nums">
              {visibleItems.length} of {items.length}
            </p>
          </div>

          {/* Load more button */}
          <motion.button
            type="button"
            onClick={handleLoadMore}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold
              bg-transparent border border-white/12 text-paper hover:border-gold/40 hover:text-gold
              transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ChevronDown size={16} strokeWidth={2.25} aria-hidden="true" />
            Load More
          </motion.button>
        </motion.div>
      )}

      {/* ── End of results ──────────────────────────────────────────────────── */}
      {!hasMore && items.length > ITEMS_PER_PAGE && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 mt-14"
        >
          {/* Full progress bar */}
          <div className="w-52 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gold-sweep rounded-full" />
          </div>
          <p className="text-xs text-mist/35 uppercase tracking-[0.18em]">
            — End of Gallery —
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default GalleryGrid
