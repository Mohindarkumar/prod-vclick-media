import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Film, Video, Play } from 'lucide-react'
import GoldDivider from '../../components/common/GoldDivider'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { videoSectionContents } from '../../data/video_section_contents'

const { hero: CONTENT } = videoSectionContents

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const isTouchDevice = typeof window !== 'undefined'
  ? window.matchMedia('(pointer: coarse)').matches
  : false

function VideoGalleryHero({ totalCount }) {
  const heroRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const disableParallax = prefersReducedMotion || isTouchDevice

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    disableParallax ? ['0%', '0%'] : ['0%', '20%']
  )
  const iconY = useTransform(
    scrollYProgress,
    [0, 1],
    disableParallax ? ['0%', '0%'] : ['0%', '12%']
  )

  return (
    <section
      ref={heroRef}
      className="relative pt-24 pb-8 md:pt-32 md:pb-10 bg-ink overflow-hidden"
    >
      {/* ── Parallax background ──────────────────────────────────────────── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 will-change-transform pointer-events-none"
        aria-hidden="true"
      >
        {/* Primary warm orb — top-right */}
        <div
          className="absolute -top-40 -right-32 w-[620px] h-[620px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 65% 35%, rgba(255,183,3,0.15) 0%, rgba(212,175,55,0.07) 45%, transparent 72%)',
          }}
        />
        {/* Secondary orb — bottom-left */}
        <div
          className="absolute -bottom-28 -left-12 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 38% 65%, rgba(212,175,55,0.09) 0%, transparent 68%)',
          }}
        />
        {/* Radar pulse rings — cinematic radar effect */}
        <div className="absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-gold/10"
              style={{
                width: 180 + i * 120,
                height: 180 + i * 120,
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
              }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.06, 0, 0.06] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                delay: i * 1.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        {/* Subtle scan-line texture — evokes film stock */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.6) 3px, rgba(255,255,255,0.6) 4px)',
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
      </motion.div>

      {/* ── Film strip decoration — FIXED: opacity controlled via animate only ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2, delay: 0.4 }}
        className="absolute top-0 left-0 right-0 h-9 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="flex h-full">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-8 h-full border-r border-white/30 flex items-center justify-center"
            >
              <div className="w-2.5 h-5 bg-white rounded-[2px]" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Decorative film icon — left side ─────────────────────────────── */}
      <motion.div
        style={{ y: iconY }}
        className="absolute left-0 md:left-10 top-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[360px] md:h-[360px] pointer-events-none will-change-transform"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 0.04, scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <Film className="w-full h-full text-amber-400" strokeWidth={0.28} />
      </motion.div>

      {/* ── Play icon accent — top right corner ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2 }}
        className="absolute right-6 md:right-20 top-8 pointer-events-none"
        aria-hidden="true"
      >
        <Play className="w-40 h-40 md:w-64 md:h-64 text-gold" strokeWidth={0.4} fill="currentColor" />
      </motion.div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="section-container relative z-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Breadcrumb"
          className="mb-8"
        >
          <ol className="flex items-center gap-2 text-xs text-mist/50">
            <li>
              <Link to="/" className="hover:text-gold transition-colors duration-200">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={11} className="opacity-40" />
            </li>
            <li aria-current="page" className="text-gold font-semibold tracking-wider">
              Video Gallery
            </li>
          </ol>
        </motion.nav>

        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
            <motion.span
              className="block h-px bg-gold-sweep"
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            />
            <span className="eyebrow">{CONTENT.eyebrow}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[2.6rem] sm:text-h1 md:text-display-2 font-extrabold text-paper leading-[1.04] tracking-tight"
          >
            Video{' '}
            <span className="relative inline-block">
              <span className="gold-text-gradient">Gallery</span>
              <GoldDivider variant="underline" className="absolute -bottom-1.5 left-0 w-full" />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mt-5 text-lg text-mist/75 leading-relaxed max-w-xl"
          >
            {CONTENT.subtitle}
          </motion.p>

          {/* Count chip */}
          {totalCount > 0 && (
            <motion.div variants={fadeUp} className="mt-6">
              <div className="inline-flex items-center gap-2.5 border border-white/10 rounded-full px-4 py-2">
                <div
                  className="w-6 h-6 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <Video size={11} className="text-gold" />
                </div>
                <span className="text-sm text-mist/75">
                  <span className="text-gold font-bold mr-1">{totalCount}</span>
                  {CONTENT.countSuffix}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <GoldDivider className="mt-6 md:mt-8" />
    </section>
  )
}

export default VideoGalleryHero
