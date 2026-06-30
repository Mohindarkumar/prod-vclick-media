import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Video } from 'lucide-react'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import GoldDivider from '../../components/common/GoldDivider'

// ─── YouTube video config ──────────────────────────────────────────────────
// Replace YOUTUBE_VIDEO_ID with VClick's actual YouTube video ID
const YOUTUBE_VIDEO_ID = 'Ye9aM-6OIDo'

// ─── Showreel slide images ─────────────────────────────────────────────────
const SHOWREEL_SLIDES = [
  '/uploads/images/gallery/events-exhibitions/DSC07433.webp',
  '/uploads/images/gallery/fashion-lifestyle/SIB-1002.webp',
  '/uploads/images/gallery/events-exhibitions/DSC03817.webp',
  '/uploads/images/homepage/DSC00897.webp',
  '/uploads/images/gallery/events-exhibitions/DSC_4108.webp',
  '/uploads/images/gallery/fashion-lifestyle/DSC04817.webp',
  '/uploads/images/homepage/DSC05604.webp',
  '/uploads/images/gallery/events-exhibitions/DSC03148.webp',
  '/uploads/images/gallery/events-exhibitions/DSC06759.webp',
  '/uploads/images/homepage/DSC06454.webp',
  '/uploads/images/gallery/events-exhibitions/DSC_4230.webp',
  '/uploads/images/gallery/events-exhibitions/1000417901.webp',
]

const SHOWREEL_ITEM = {
  title: 'Recent Captures',
  description: 'A curated look at our finest photography — events, fashion, and unforgettable moments captured across the UAE.',
  category: 'Photography',
  stat_value: '450+',
  stat_label: 'Captures',
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

// ─── YouTubeCard ───────────────────────────────────────────────────────────
// aspect-video (16:9) ensures the full video is always visible at every width.
function YouTubeCard({ index }) {
  const src = [
    `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`,
    `?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`,
    `&controls=0&playsinline=1&modestbranding=1&rel=0`,
  ].join('')

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
      {/* 16:9 container — iframe fills it completely */}
      <div className="relative w-full aspect-video">
        <iframe
          src={src}
          title="Recent Video Showreel"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0"
          aria-label="VClick Media — Recent Video Showreel"
        />

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
          <Link
            to="/videos"
            className="inline-flex items-center gap-1.5 mt-3 text-gold/70 hover:text-gold text-xs font-semibold transition-colors duration-200 pointer-events-auto"
          >
            <Video size={12} />
            Watch Films
            <ArrowRight size={11} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// ─── ShowreelCard ──────────────────────────────────────────────────────────
// Full-height image slideshow — text + progress bar overlaid at bottom.
function ShowreelCard({ item, index }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const href = item.link_type === 'gallery'
    ? (item.category ? `/gallery?album=${encodeURIComponent(item.category)}` : '/gallery')
    : null

  useEffect(() => {
    const id = setInterval(() => setActiveSlide(i => (i + 1) % SHOWREEL_SLIDES.length), 4500)
    return () => clearInterval(id)
  }, [])

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
      <div className="relative w-full h-[420px] sm:h-[540px] md:h-[660px] xl:h-[700px]">

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
            className="absolute inset-0 w-full h-full object-cover object-center"
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
          <YouTubeCard index={0} />
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
