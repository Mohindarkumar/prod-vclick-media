import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Clock } from 'lucide-react'

function getYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  return match ? match[1] : null
}

function getVimeoId(url) {
  if (!url) return null
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

function buildEmbedUrl(video) {
  if (!video) return null
  const { video_type, video_url, video_id_ext } = video

  if (video_type === 'youtube') {
    const id = getYouTubeId(video_url) || video_id_ext
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` : null
  }
  if (video_type === 'vimeo') {
    const id = getVimeoId(video_url) || video_id_ext
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1&color=D4AF37` : null
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

const PLATFORM_LABELS = { youtube: 'YouTube', vimeo: 'Vimeo' }

function VideoModal({ video, onClose }) {
  const isOpen = !!video

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const embedUrl = video ? buildEmbedUrl(video) : null
  const usesEmbed = video && (video.video_type === 'youtube' || video.video_type === 'vimeo')
  const platformLabel = video ? PLATFORM_LABELS[video.video_type] : null
  const duration = video ? formatDuration(video.duration) : null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          style={{ background: 'rgba(0,0,0,0.94)' }}
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
          onClick={onClose}
        >
          {/* Subtle backdrop blur */}
          <div className="absolute inset-0 backdrop-blur-sm" aria-hidden="true" />

          {/* Close button */}
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Close video player"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-paper/70 hover:text-gold hover:border-gold/45 transition-colors duration-200"
          >
            <X size={17} />
          </motion.button>

          {/* Keyboard hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 text-[11px] text-mist/30 tracking-wider hidden md:block pointer-events-none select-none"
            aria-hidden="true"
          >
            Press Esc to close
          </motion.p>

          {/* Player card */}
          <motion.div
            key={video.video_id}
            initial={{ scale: 0.92, opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ scale: 0.92, opacity: 0, y: 24, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video player */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-charcoal shadow-gold-lg">
              {usesEmbed && embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={video.video_url}
                  className="w-full h-full"
                  controls
                  autoPlay
                  playsInline
                />
              )}
            </div>

            {/* Metadata panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="mt-4 bg-charcoal border border-white/10 rounded-2xl px-5 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {/* Category + duration row */}
                  <div className="flex items-center gap-3 mb-2.5 flex-wrap">
                    {video.category && (
                      <span className="inline-flex items-center text-[10px] text-gold/85 uppercase tracking-wider font-semibold bg-gold/10 border border-gold/22 rounded-full px-3 py-1">
                        {video.category}
                      </span>
                    )}
                    {duration && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-mist/50">
                        <Clock size={11} aria-hidden="true" />
                        {duration}
                      </span>
                    )}
                  </div>

                  <h2 className="text-paper font-bold text-lg md:text-xl leading-snug">
                    {video.title}
                  </h2>

                  {video.description && (
                    <p className="mt-2 text-sm text-mist/60 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>

                {/* External platform link */}
                {platformLabel && (
                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs text-mist/40 hover:text-gold transition-colors duration-200 mt-1 px-3 py-1.5 rounded-full bg-transparent border border-white/10 hover:border-gold/30"
                    aria-label={`Open on ${platformLabel}`}
                  >
                    <ExternalLink size={12} aria-hidden="true" />
                    <span className="hidden sm:inline">{platformLabel}</span>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VideoModal
