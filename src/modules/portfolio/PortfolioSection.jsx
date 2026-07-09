import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Video, Play, Volume2, VolumeX } from 'lucide-react'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import GoldDivider from '../../components/common/GoldDivider'
import { galleryItems } from '../../data/gallery'

// ─── Video config ───────────────────────────────────────────────────────────
// P1: a locally-hosted file autoplays inline — no external embed, no network
// round-trip to YouTube, so it's the reliable/fast path.
// P2: if no local file is set, we fall back to the YouTube embed below.
const LOCAL_VIDEO_SRC = '/uploads/video/showreel.mp4'
const YOUTUBE_VIDEO_ID = 'cHWgMzJ72PU'

// ─── Showreel slide images ─────────────────────────────────────────────────
const SHOWREEL_SLIDES = [
  '/uploads/images/gallery/exhibitions/DSC_4136.webp',
  '/uploads/images/gallery/fashion-lifestyle/SIB-1002.webp',
  '/uploads/images/gallery/events/DSC03817.webp',
  '/uploads/images/homepage/DSC00897.webp',
  '/uploads/images/gallery/events/DSC_4108.webp',
  '/uploads/images/gallery/fashion-lifestyle/DSC04817.webp',
  '/uploads/images/homepage/DSC05604.webp',
  '/uploads/images/gallery/events/DSC03148.webp',
  '/uploads/images/gallery/exhibitions/DSC06759.webp',
  '/uploads/images/homepage/DSC06454.webp',
  '/uploads/images/gallery/exhibitions/DSC_4231.webp',
  '/uploads/images/gallery/events/1000417901.webp',
]

const SHOWREEL_ITEM = {
  title: 'Recent Captures',
  description: 'A curated look at our finest photography — events, fashion, and unforgettable moments captured across the UAE.',
  category: '',
  stat_value: `${galleryItems.length}`,
  stat_label: 'Photos',
  link_type: 'gallery',
}

// ─── Shared utilities ──────────────────────────────────────────────────────
const cardVariants = {
  hidden:  { opacity: 0, y: 32, filter: 'blur(4px)' },
  visible: (i) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

const GOLD_SHADOW  = '0 8px 40px rgba(212,175,55,0.13)'
const onHoverStart = (e) => { e.currentTarget.style.boxShadow = GOLD_SHADOW }
const onHoverEnd   = (e) => { e.currentTarget.style.boxShadow = '' }

const CARD_BASE = [
  'group relative w-full overflow-hidden rounded-2xl',
  'border border-white/8 bg-charcoal',
  'hover:border-gold/35 transition-all duration-[400ms]',
].join(' ')

// Shared viewport-visibility hook — a single IntersectionObserver per card
// (not per scroll event), so play/pause decisions are cheap and don't thrash.
function useInView(threshold = 0.35) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

// Pause playback whenever the browser tab itself is backgrounded — no point
// decoding/streaming a video nobody can see.
function usePageVisible() {
  const [visible, setVisible] = useState(
    typeof document === 'undefined' || document.visibilityState !== 'hidden'
  )

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return visible
}

// ─── RecentVideoCard ────────────────────────────────────────────────────────
// aspect-video (16:9) ensures the full video is always visible at every width.
//
// P1 — local file: a plain <video> element that autoplays (muted, so every
// browser allows it without a click) driven purely by play()/pause() calls.
// The element itself is mounted once and never torn down, so entering/leaving
// the viewport is just a play()/pause() call — no re-fetching, no reload
// storm, regardless of how many times the observer fires.
//
// P2 — YouTube fallback (only used when LOCAL_VIDEO_SRC is unset): the iframe
// is lazily mounted the first time it comes into view and then, critically,
// left mounted. Visibility changes after that are relayed to the already-
// loaded embed via postMessage (YouTube's IFrame Player API) instead of
// remounting the iframe — remounting on every intersection toggle is what
// previously caused the embed to reload dozens of times per scroll and hang
// the page.
function RecentVideoCard({ index }) {
  const [containerRef, isInView] = useInView(0.35)
  const pageVisible = usePageVisible()
  const shouldPlay = isInView && pageVisible

  const hasLocalVideo = Boolean(LOCAL_VIDEO_SRC)
  const videoRef = useRef(null)
  const iframeRef = useRef(null)
  const [youtubeLoaded, setYoutubeLoaded] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  // P1 — local video: play/pause the existing element, never remount it.
  useEffect(() => {
    if (!hasLocalVideo) return
    const video = videoRef.current
    if (!video) return
    if (shouldPlay) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [shouldPlay, hasLocalVideo])

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  // P2 — YouTube: mount once on first appearance, then only ever postMessage.
  useEffect(() => {
    if (hasLocalVideo) return
    if (isInView && !youtubeLoaded) setYoutubeLoaded(true)
  }, [isInView, youtubeLoaded, hasLocalVideo])

  useEffect(() => {
    if (hasLocalVideo || !youtubeLoaded) return
    const win = iframeRef.current?.contentWindow
    if (!win) return
    const func = shouldPlay ? 'playVideo' : 'pauseVideo'
    win.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*')
  }, [shouldPlay, youtubeLoaded, hasLocalVideo])

  const youtubeSrc = [
    `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`,
    `?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`,
    `&controls=1&playsinline=1&modestbranding=1&rel=0&enablejsapi=1`,
    `&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`,
  ].join('')

  const posterUrl = `https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={CARD_BASE}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* 16:9 container — local video, YouTube embed, or preview image */}
      <div ref={containerRef} className="relative w-full aspect-video bg-black">
        {hasLocalVideo ? (
          <>
            <video
              ref={videoRef}
              src={LOCAL_VIDEO_SRC}
              poster={posterUrl}
              muted
              loop
              playsInline
              preload="metadata"
              onClick={() => videoRef.current?.play().catch(() => {})}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            />
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/55 border border-white/20 flex items-center justify-center hover:bg-gold/80 hover:border-gold transition-colors duration-200"
            >
              {isMuted ? (
                <VolumeX size={16} className="text-white" />
              ) : (
                <Volume2 size={16} className="text-white" />
              )}
            </button>
          </>
        ) : youtubeLoaded ? (
          <iframe
            ref={iframeRef}
            src={youtubeSrc}
            title="Recent Video Showreel"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
            aria-label="VClick Media — Recent Video Showreel"
          />
        ) : (
          <>
            <img
              src={posterUrl}
              alt="Recent Video Showreel preview"
              loading="lazy"
              width={1280}
              height={720}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              onClick={() => setYoutubeLoaded(true)}
            />
            <button
              type="button"
              onClick={() => setYoutubeLoaded(true)}
              aria-label="Play video"
              className="absolute inset-0 flex items-center justify-center z-10 bg-black/10 hover:bg-black/30 transition-colors duration-300"
            >
              <span className="w-16 h-16 rounded-full bg-black/60 border border-white/30 flex items-center justify-center hover:bg-gold/80 hover:border-gold transition-colors duration-200">
                <Play size={22} className="text-white ml-0.5" fill="currentColor" />
              </span>
            </button>
          </>
        )}

        {/* Gradient overlay — pointer-events-none so iframe stays interactive */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Text overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-7 pointer-events-none">
          <h3 className="text-lg md:text-2xl font-bold text-paper leading-snug group-hover:text-gold/90 transition-colors duration-200">
            Recent Video Showreel
          </h3>
          <p className="text-white/55 text-sm mt-1 line-clamp-1 hidden sm:block">
            A cinematic showcase of our recent events, brand stories, and productions across the UAE.
          </p>
          <div className="flex gap-4 mt-3">
            <Link
              to="/videos"
              className="inline-flex items-center gap-1.5 text-gold/70 hover:text-gold text-xs font-semibold transition-colors duration-200 pointer-events-auto"
            >
              <Video size={12} />
              Watch Films
              <ArrowRight size={11} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
            <a
              href="https://youtube.com/@vclickmediauae?si=ga2Yt-tvZwdviun2"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-gold text-xs font-semibold transition-colors duration-200 pointer-events-auto"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube Channel
              <ArrowRight size={11} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

// ─── ShowreelCard ──────────────────────────────────────────────────────────
// Full-height image slideshow — text + progress bar overlaid at bottom.
function ShowreelCard({ item, index }) {
  const [containerRef, isInView] = useInView(0.15)
  const [activeSlide, setActiveSlide] = useState(0)
  const href = item.link_type === 'gallery'
    ? (item.category ? `/gallery?album=${encodeURIComponent(item.category)}` : '/gallery')
    : null

  // Only cycle slides while the card is actually visible — no point
  // re-rendering an off-screen slideshow every 4.5s for the whole session.
  useEffect(() => {
    if (!isInView) return
    const id = setInterval(() => setActiveSlide(i => (i + 1) % SHOWREEL_SLIDES.length), 4500)
    return () => clearInterval(id)
  }, [isInView])

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={CARD_BASE}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* Full-height image container */}
      <div ref={containerRef} className="relative w-full h-[420px] sm:h-[540px] md:h-[660px] xl:h-[900px] 2xl:h-[1080px]">

        {/* Animated slides — fills entire container */}
        <AnimatePresence mode="sync">
          <motion.img
            key={activeSlide}
            src={SHOWREEL_SLIDES[activeSlide]}
            alt="VClick recent captures"
            loading="lazy"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover object-top xl:object-contain xl:object-center"
          />
        </AnimatePresence>

        {/* Cinematic vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25 pointer-events-none" aria-hidden="true" />

        {/* Stat pill — top right */}
        {item.stat_value && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-black/50 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1 text-center">
              <p className="text-gold font-extrabold text-sm leading-none">{item.stat_value}</p>
              {item.stat_label && (
                <p className="text-white/55 text-[9px] uppercase tracking-wide leading-none mt-0.5">{item.stat_label}</p>
              )}
            </div>
          </div>
        )}

        {/* Bottom overlay — text + progress bar */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pt-8 pb-5 md:px-7 md:pb-6">
          {item.category && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gold block mb-1">
              {item.category}
            </span>
          )}
          <h3 className="text-lg md:text-2xl font-bold text-paper leading-snug group-hover:text-gold/90 transition-colors duration-200">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-white/55 text-sm mt-1 line-clamp-1 hidden sm:block">
              {item.description}
            </p>
          )}
          {href && (
            <Link
              to={href}
              className="inline-flex items-center gap-1.5 mt-3 text-gold/70 hover:text-gold text-xs font-semibold transition-colors duration-200"
            >
              <Camera size={12} />
              View Photos
              <ArrowRight size={11} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          )}

          {/* Slide progress bar */}
          <div
            className="flex gap-1 mt-4"
            role="tablist"
            aria-label="Slideshow navigation"
          >
            {SHOWREEL_SLIDES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeSlide}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActiveSlide(i)}
                className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${
                  i === activeSlide ? 'bg-gold' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

// ─── PortfolioSection ──────────────────────────────────────────────────────
function PortfolioSection({ section = null }) {
  const heading = section?.title || 'Recent Works'

  return (
    <section id="portfolio" className="py-14 md:py-20 bg-charcoal overflow-hidden">
      <div className="section-container">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div>
            <SectionEyebrow align="left">Our Work</SectionEyebrow>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-4 text-h3 md:text-h2 font-extrabold text-paper leading-tight"
            >
              <span className="relative inline-block">
                {heading}
                <GoldDivider variant="underline" className="absolute -bottom-1 left-0 w-full" />
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-4 text-mist/65 text-sm md:text-base max-w-md"
            >
              Hand-picked projects — each one a story of craft, light, and memorable moments.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="flex items-center gap-4 flex-shrink-0"
          >
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 text-sm text-mist/65 hover:text-gold transition-colors duration-200 font-medium"
            >
              <Camera size={14} /> All Photos <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
            <Link
              to="/videos"
              className="inline-flex items-center gap-1.5 text-sm text-mist/65 hover:text-gold transition-colors duration-200 font-medium"
            >
              <Video size={14} /> All Videos <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
          </motion.div>
        </div>

        {/* Two full-width showcase cards */}
        <div className="flex flex-col gap-4 md:gap-6">
          <RecentVideoCard index={0} />
          <ShowreelCard item={SHOWREEL_ITEM} index={1} />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-paper border border-white/15 hover:border-gold/50 rounded-full px-6 py-3 transition-all duration-300 hover:text-gold"
          >
            <Camera size={15} />
            Browse Full Gallery
            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <Link
            to="/videos"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-paper border border-white/15 hover:border-gold/50 rounded-full px-6 py-3 transition-all duration-300 hover:text-gold"
          >
            <Video size={15} />
            Watch Our Films
            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}

export default PortfolioSection
