import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Sparkles, ChevronDown } from 'lucide-react'
import VideoCard from './VideoCard'
import { videoSectionContents } from '../../data/video_section_contents'

const { grid: GRID } = videoSectionContents

const ITEMS_PER_PAGE = 12
const SKELETON_COUNT = 6

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-charcoal border border-white/8">
      <div className="aspect-video gallery-skeleton" />
      <div className="p-4 md:p-5 space-y-3">
        <div className="h-5 w-20 gallery-skeleton rounded-full" />
        <div className="h-4 w-full gallery-skeleton rounded-md" />
        <div className="h-3 w-3/4 gallery-skeleton rounded-md" />
        <div className="h-3 w-1/2 gallery-skeleton rounded-md" />
      </div>
    </div>
  )
}

function VideoGrid({ videos, isLoading, isError, activeCategory, onPlay, featuredVideos = [] }) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [activeCategory])

  const handleLoadMore = useCallback(() => setVisibleCount((p) => p + ITEMS_PER_PAGE), [])

  const visibleVideos = useMemo(() => videos.slice(0, visibleCount), [videos, visibleCount])
  const hasMore = visibleCount < videos.length
  const progressPercent = videos.length > 0 ? (visibleVideos.length / videos.length) * 100 : 0

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-5 py-28 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/8 border border-red-500/20 flex items-center justify-center">
          <Video size={30} className="text-red-400/50" aria-hidden="true" />
        </div>
        <div>
          <p className="text-paper/70 font-semibold text-base">{GRID.errorTitle}</p>
          <p className="text-sm text-mist/45 mt-1.5">{GRID.errorSubtitle}</p>
        </div>
      </motion.div>
    )
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (videos.length === 0) {
    return (
      <motion.div
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
          <div
            className="absolute inset-0 rounded-full bg-gold/8 border border-gold/20 animate-ping"
            style={{ animationDuration: '2.5s' }}
            aria-hidden="true"
          />
          <div className="relative w-20 h-20 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center">
            <Video size={30} className="text-gold/60" aria-hidden="true" />
          </div>
        </motion.div>
        <div>
          <p className="text-paper/75 font-semibold text-base">{GRID.emptyTitle}</p>
          <p className="text-sm text-mist/45 mt-1.5">{GRID.emptySubtitle}</p>
        </div>
      </motion.div>
    )
  }

  const showFeaturedBand = activeCategory === 'All' && featuredVideos.length > 0
  const mainVideos = showFeaturedBand
    ? visibleVideos.filter((v) => !v.is_featured)
    : visibleVideos
  const hasMainVideos = videos.length > (showFeaturedBand ? featuredVideos.length : 0)

  return (
    <div>
      {/* ── Featured band ─────────────────────────────────────────────────── */}
      {showFeaturedBand && (
        <div className="mb-14">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-gold" aria-hidden="true" />
              <h2 className="text-sm font-bold gold-text-gradient uppercase tracking-[0.16em]">
                {GRID.featuredLabel}
              </h2>
            </div>
            <span className="flex-1 h-px bg-gold/15" aria-hidden="true" />
            <span className="text-[11px] text-mist/35 uppercase tracking-wider">
              {featuredVideos.length} {featuredVideos.length === 1 ? GRID.filmSingular : GRID.filmPlural}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {featuredVideos.map((video, index) => (
              <VideoCard key={video.video_id} video={video} onPlay={onPlay} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Divider between featured and main grid */}
      {showFeaturedBand && hasMainVideos && mainVideos.length > 0 && (
        <div className="mb-10 flex items-center gap-4">
          <span className="flex-1 h-px bg-white/6" aria-hidden="true" />
          <span className="text-xs text-mist/35 uppercase tracking-wider">{GRID.allVideosLabel}</span>
          <span className="flex-1 h-px bg-white/6" aria-hidden="true" />
        </div>
      )}

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      {mainVideos.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {mainVideos.map((video, index) => (
              <VideoCard key={video.video_id} video={video} onPlay={onPlay} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

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
              {visibleVideos.length} of {videos.length}
            </p>
          </div>

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
            {GRID.loadMoreBtn}
          </motion.button>
        </motion.div>
      )}

      {/* ── End of collection ──────────────────────────────────────────────── */}
      {!hasMore && videos.length > ITEMS_PER_PAGE && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 mt-14"
        >
          <div className="w-52 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gold-sweep rounded-full" />
          </div>
          <p className="text-xs text-mist/35 uppercase tracking-[0.18em]">
            {GRID.endLabel}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default VideoGrid
