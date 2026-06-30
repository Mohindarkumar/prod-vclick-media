import { useState } from 'react'
import { motion } from 'framer-motion'
import { Expand, AlertCircle } from 'lucide-react'

const ASPECT = {
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
}

/**
 * Individual gallery card with:
 * - Native lazy loading via loading="lazy"
 * - Skeleton shimmer while image loads
 * - Blur-to-sharp reveal on load
 * - Permanent bottom vignette for depth
 * - Hover overlay with album tag + expand CTA
 * - Gold border glow on hover
 * - data-cursor="image" for custom cursor integration
 */
function GalleryCard({ item, onOpen }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const aspectClass = ASPECT[item.orientation] || ASPECT.landscape

  return (
    <motion.button
      type="button"
      onClick={() => !error && onOpen(item)}
      whileHover={error ? {} : { scale: 1.03 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      data-cursor="image"
      className={[
        'group relative w-full overflow-hidden rounded-2xl text-left block',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
        error ? 'cursor-default' : 'cursor-pointer',
        aspectClass,
      ].join(' ')}
      style={{
        boxShadow: '0 0 0 0 rgba(212,175,55,0)',
        transition: 'box-shadow 0.35s ease',
      }}
      onMouseEnter={(e) => {
        if (!error) {
          e.currentTarget.style.boxShadow =
            '0 0 0 1px rgba(212,175,55,0.28), 0 8px 32px rgba(212,175,55,0.14)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 0 rgba(212,175,55,0)'
      }}
      aria-label={item.title ? `View ${item.title}` : `View ${item.album} photo`}
    >
      {/* ── Skeleton shimmer ─────────────────────────────────────────────── */}
      {!loaded && !error && (
        <div className="absolute inset-0 gallery-skeleton rounded-2xl" aria-hidden="true" />
      )}

      {/* ── Error state ──────────────────────────────────────────────────── */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-charcoal rounded-2xl">
          <AlertCircle size={28} className="text-mist/30" aria-hidden="true" />
          <p className="text-xs text-mist/40">Image unavailable</p>
        </div>
      )}

      {/* ── Image — blur-to-sharp on load ────────────────────────────────── */}
      {!error && (
        <img
          src={item.image}
          alt={item.title || `VClick ${item.album} photography — ${item.orientation} shot`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06]"
          style={{
            opacity: loaded ? 1 : 0,
            filter: loaded ? 'blur(0px)' : 'blur(12px)',
            transition: 'opacity 0.4s ease, filter 0.7s ease, transform 0.55s ease-out',
          }}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true)
            setLoaded(true)
          }}
        />
      )}

      {/* ── Permanent bottom vignette (depth even before hover) ──────────── */}
      {!error && (
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Hover overlay ─────────────────────────────────────────────────── */}
      {!error && (
        <>
          {/* Darkening layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-[350ms]" />

          {/* Content panel */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 translate-y-2 group-hover:translate-y-0 group-focus-visible:translate-y-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-[350ms]">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                {/* Album tag */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="h-px w-4 bg-gold-sweep flex-shrink-0" aria-hidden="true" />
                  <span className="text-[10px] text-gold/80 uppercase tracking-wider font-semibold truncate">
                    {item.album}
                  </span>
                </div>
                {/* Title */}
                <p className="text-paper text-sm font-semibold leading-snug line-clamp-2">
                  {item.title}
                </p>
              </div>

              {/* Expand icon badge */}
              <motion.span
                className="flex-shrink-0 w-9 h-9 rounded-full bg-gold/20 border border-gold/45 flex items-center justify-center group-hover:bg-gold/30 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                aria-hidden="true"
              >
                <Expand size={14} className="text-gold" strokeWidth={2.25} />
              </motion.span>
            </div>
          </div>
        </>
      )}
    </motion.button>
  )
}

export default GalleryCard
