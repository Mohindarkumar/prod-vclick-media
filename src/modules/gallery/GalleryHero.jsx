import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Aperture, Image } from 'lucide-react'
import GoldDivider from '../../components/common/GoldDivider'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { galleryItems } from '../../data/gallery'

// Pick a few varied images for the animated background collage
const BG_IMAGES = galleryItems
  .filter((i) => i.orientation === 'landscape')
  .slice(0, 4)
  .map((i) => i.image)

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

function GalleryHero({ totalCount }) {
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
    disableParallax ? ['0%', '0%'] : ['0%', '22%']
  )
  const iconRotate = useTransform(
    scrollYProgress,
    [0, 1],
    disableParallax ? [0, 0] : [0, 22]
  )

  return (
    <section
      ref={heroRef}
      className="relative pt-24 pb-8 md:pt-32 md:pb-10 bg-ink overflow-hidden"
    >
      {/* ── Parallax background layer ──────────────────────────────────── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 will-change-transform pointer-events-none"
        aria-hidden="true"
      >
        {/* Primary gold orb — top-left */}
        <div
          className="absolute -top-48 -left-48 w-[650px] h-[650px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 38% 38%, rgba(212,175,55,0.14) 0%, rgba(255,183,3,0.07) 45%, transparent 72%)',
          }}
        />
        {/* Secondary orb — bottom-right */}
        <div
          className="absolute -bottom-32 -right-16 w-[520px] h-[520px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 62% 62%, rgba(255,183,3,0.09) 0%, transparent 68%)',
          }}
        />
        {/* Dot grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
      </motion.div>

      {/* ── Animated image collage — right panel ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.3 }}
        className="absolute right-0 top-0 bottom-0 w-[42%] md:w-[40%] overflow-hidden pointer-events-none hidden sm:block"
        aria-hidden="true"
      >
        <div className="grid grid-cols-2 h-full gap-0.5">
          {BG_IMAGES.map((src, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{
                duration: 6 + i * 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 1.1,
              }}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                fetchPriority="low"
                className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
              />
            </motion.div>
          ))}
        </div>
        {/* Gradient fade — text side */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, #0B0B0B 5%, rgba(11,11,11,0.88) 40%, rgba(11,11,11,0.5) 100%)',
          }}
        />
        {/* Overall dark overlay — keeps images subtle */}
        <div className="absolute inset-0 bg-ink/78" />
      </motion.div>

      {/* ── Rotating aperture icon ────────────────────────────────────── */}
      <motion.div
        style={{ rotate: iconRotate }}
        className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[340px] md:h-[340px] pointer-events-none will-change-transform hidden sm:block"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <Aperture className="w-full h-full text-gold" strokeWidth={0.28} />
      </motion.div>

      {/* ── Content ─────────────────────────────────────────────────── */}
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
              Gallery
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
            <span className="eyebrow">VClick Portfolio</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-h1 md:text-display-2 font-extrabold text-paper leading-[1.04] tracking-tight"
          >
            Our{' '}
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
            A curated collection of our finest work — spanning weddings, corporate events,
            fashion editorials, drone photography, and more.
          </motion.p>

          {/* Count chip — clean borderless style */}
          {totalCount > 0 && (
            <motion.div variants={fadeUp} className="mt-6">
              <div className="inline-flex items-center gap-2.5 border border-white/10 rounded-full px-4 py-2">
                <div
                  className="w-6 h-6 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <Image size={11} className="text-gold" />
                </div>
                <span className="text-sm text-mist/75">
                  <span className="text-gold font-bold mr-1">{totalCount}</span>
                  images in collection
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

export default GalleryHero
