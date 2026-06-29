import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Star, Clock } from 'lucide-react'

function getYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  return match ? match[1] : null
}

function getAutoThumb(video) {
  if (video.thumbnail_url) return video.thumbnail_url
  if (video.video_type === 'youtube') {
    const id = getYouTubeId(video.video_url) || video.video_id_ext
    if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
  }
  return null
}

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return null
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

const TYPE_LABELS = { youtube: 'YouTube', vimeo: 'Vimeo', self_hosted: 'Video' }

function VideoCard({ video, onPlay, index = 0 }) {
  const [thumbLoaded, setThumbLoaded] = useState(false)
  const [thumbError, setThumbError] = useState(false)

  const thumb = getAutoThumb(video)
  const duration = formatDuration(video.duration)
  const typeLabel = TYPE_LABELS[video.video_type] ?? 'Video'

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.5), ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl overflow-hidden bg-charcoal border border-white/8 hover:border-gold/35 transition-all duration-[350ms]"
      style={{
        transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 40px rgba(212,175,55,0.12), 0 0 0 1px rgba(212,175,55,0.18)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Thumbnail + play button */}
      <button
        type="button"
        onClick={() => onPlay(video)}
        data-cursor="play"
        aria-label={`Play ${video.title}`}
        className="block w-full relative aspect-video overflow-hidden bg-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        {/* Skeleton shimmer */}
        {!thumbLoaded && !thumbError && (
          <div className="absolute inset-0 gallery-skeleton" aria-hidden="true" />
        )}

        {/* Placeholder when no thumbnail */}
        {(!thumb || thumbError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal">
            <Play size={40} className="text-gold/20" aria-hidden="true" />
          </div>
        )}

        {/* Thumbnail image */}
        {thumb && !thumbError && (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06]"
            style={{
              opacity: thumbLoaded ? 1 : 0,
              filter: thumbLoaded ? 'blur(0px)' : 'blur(10px)',
              transition: 'opacity 0.4s ease, filter 0.7s ease, transform 0.55s ease-out',
            }}
            onLoad={() => setThumbLoaded(true)}
            onError={() => {
              setThumbError(true)
              setThumbLoaded(true)
            }}
          />
        )}

        {/* Permanent bottom vignette */}
        <div
          className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Darkening overlay on hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-[350ms]" aria-hidden="true" />

        {/* ── Premium play button ─────────────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Ambient pulse ring — always visible, subtle */}
            <span
              className="absolute inset-0 -m-4 rounded-full border border-gold/15 animate-play-pulse"
              aria-hidden="true"
            />
            {/* Hover ring — appears on hover */}
            <span
              className="absolute inset-0 -m-2 rounded-full border border-gold/0 group-hover:border-gold/35 transition-all duration-300 group-hover:scale-110"
              aria-hidden="true"
            />
            {/* Inner button */}
            <div className="relative w-14 h-14 md:w-[60px] md:h-[60px] rounded-full bg-gold-sweep shadow-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play size={20} className="text-ink fill-ink ml-0.5" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Duration badge — bottom right */}
        {duration && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/75 backdrop-blur-sm text-paper text-[11px] font-semibold px-2.5 py-1 rounded-lg">
            <Clock size={10} aria-hidden="true" />
            {duration}
          </div>
        )}

        {/* Type badge — top left */}
        <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-sm text-mist/80 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg">
          {typeLabel}
        </div>

        {/* Featured star — top right */}
        {video.is_featured && (
          <div
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-gold/20 border border-gold/55 flex items-center justify-center"
            aria-label="Featured video"
          >
            <Star size={12} className="text-gold" fill="currentColor" aria-hidden="true" />
          </div>
        )}
      </button>

      {/* Card body */}
      <div className="p-4 md:p-5">
        {video.category && (
          <div className="mb-2.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-gold/80 uppercase tracking-wider font-semibold bg-gold/8 border border-gold/20 rounded-full px-3 py-1">
              {video.category}
            </span>
          </div>
        )}
        <h3 className="text-paper font-semibold text-sm md:text-[0.9375rem] leading-snug line-clamp-2 group-hover:text-gold/90 transition-colors duration-200">
          {video.title}
        </h3>
        {video.description && (
          <p className="mt-2 text-xs text-mist/50 leading-relaxed line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </motion.article>
  )
}

export default VideoCard
