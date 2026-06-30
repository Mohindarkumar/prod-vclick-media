import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Phone, Camera, Video, Sparkles, Award } from 'lucide-react'
import Button from '../../components/common/Button'
import GoldDivider from '../../components/common/GoldDivider'
import ScrollIndicator from './ScrollIndicator'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { siteConfig } from '../../config/site.config'
import { homeSectionContents } from '../../data/home_section_contents'

const { hero: CONTENT } = homeSectionContents

const TAG_ICONS = { Photography: Camera, Videography: Video, 'Luxury Events': Sparkles, 'Media Production': Award }

const STATS = [
  { value: siteConfig.stats.events,   label: 'Events Delivered' },
  { value: siteConfig.stats.years,    label: 'Years Experience' },
  { value: siteConfig.stats.clients,  label: 'Happy Clients' },
  { value: siteConfig.stats.location, label: 'Based in Ajman' },
]

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
}

const maskReveal = {
  hidden: { y: '108%' },
  visible: { y: '0%', transition: { duration: 0.92, ease: [0.76, 0, 0.24, 1] } },
}

const blurIn = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 8 },
  visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
}

function renderHeroHeadline(title, GoldDividerComponent, maskReveal) {
  const words = title.split(' ')
  const underlineIdx = words.findIndex((w) => /unforgettable/i.test(w))

  const cls =
    'text-4xl sm:text-5xl md:text-6xl lg:text-display-1 font-extrabold text-paper leading-[1.06] tracking-tight'

  if (underlineIdx !== -1) {
    const before = words.slice(0, underlineIdx).join(' ')
    const word   = words[underlineIdx]
    const after  = words.slice(underlineIdx + 1).join(' ')
    return (
      <motion.div variants={{ hidden: {}, visible: {} }} className="overflow-hidden pb-2 mb-1">
        <motion.h1 variants={maskReveal} className={cls}>
          {before && <>{before} </>}
          <span className="relative inline-block whitespace-nowrap">
            {word}
            <GoldDividerComponent variant="underline" className="absolute -bottom-1 left-0 w-full" delay={0.85} />
          </span>
          {after && <> {after}</>}
        </motion.h1>
      </motion.div>
    )
  }

  return (
    <motion.div variants={{ hidden: {}, visible: {} }} className="overflow-hidden pb-2 mb-1">
      <motion.h1 variants={maskReveal} className={cls}>{title}</motion.h1>
    </motion.div>
  )
}

const isTouchDevice = typeof window !== 'undefined'
  ? window.matchMedia('(pointer: coarse)').matches
  : false

function Hero({ section = null }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef(null)
  const [glowPosition, setGlowPosition]           = useState({ x: 50, y: 50 })
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)

  const cmsTitle    = section?.title    || null
  const cmsSubtitle = section?.subtitle || null

  const disableParallax = prefersReducedMotion || isTouchDevice

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })

  const bgParallaxY      = useTransform(scrollYProgress, [0, 1], disableParallax ? [0, 0] : [0, 140])
  const contentParallaxY = useTransform(scrollYProgress, [0, 1], disableParallax ? [0, 0] : [0, 55])
  const overlayOpacity   = useTransform(scrollYProgress, [0, 0.65], disableParallax ? [0.55, 0.55] : [0.55, 0.88])

  useEffect(() => {
    const handleScroll = () => setShowScrollIndicator(window.scrollY < 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseMove = (event) => {
    if (disableParallax || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    setGlowPosition({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top)  / rect.height) * 100,
    })
  }

  const showGlow = !disableParallax

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative h-svh min-h-[700px] sm:min-h-[760px] w-full overflow-hidden flex flex-col pt-20 md:pt-24"
    >
      {/* Background image with parallax */}
      <motion.div
        style={{ y: bgParallaxY }}
        className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform"
      >
        <img
          src="/uploads/images/gallery/events-exhibitions/DSC07433.webp"
          alt="VClick event production — luxury venue with Burj Khalifa view"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </motion.div>

      {/* Cinematic gradient overlays */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-black will-change-opacity"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(100deg, rgba(11,11,11,0.85) 0%, rgba(11,11,11,0.55) 45%, rgba(11,11,11,0.2) 100%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(11,11,11,0.82) 0%, rgba(11,11,11,0.38) 22%, transparent 48%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{ background: 'linear-gradient(to bottom, rgba(11,11,11,0.45), transparent)' }}
        aria-hidden="true"
      />

      {/* Ambient gold cursor glow */}
      {showGlow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(500px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(212,175,55,0.14), rgba(255,183,3,0.06) 48%, transparent 72%)`,
            transition: 'background 0.4s ease',
          }}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <motion.div
        style={{ y: contentParallaxY }}
        className="relative z-10 section-container w-full will-change-transform flex-1 flex items-center"
      >
        <motion.div
          className="max-w-3xl"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div variants={{ hidden: {}, visible: {} }} className="overflow-hidden mb-7">
            <motion.div variants={maskReveal} className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold-sweep" aria-hidden="true" />
              <span className="eyebrow">{CONTENT.eyebrow}</span>
            </motion.div>
          </motion.div>

          {/* Headline */}
          {cmsTitle ? (
            renderHeroHeadline(cmsTitle, GoldDivider, maskReveal)
          ) : (
            <>
              <motion.div variants={{ hidden: {}, visible: {} }} className="overflow-hidden pb-1">
                <motion.h1
                  variants={maskReveal}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-display-1 font-extrabold text-paper leading-[1.06] tracking-tight"
                >
                  {CONTENT.headlineLine1}{' '}
                  <span className="relative inline-block whitespace-nowrap">
                    {CONTENT.headlineHighlight}
                    <GoldDivider variant="underline" className="absolute -bottom-1 left-0 w-full" delay={0.85} />
                  </span>
                </motion.h1>
              </motion.div>
              <motion.div variants={{ hidden: {}, visible: {} }} className="overflow-hidden pb-2 mb-1">
                <motion.h1
                  variants={maskReveal}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-display-1 font-extrabold text-paper leading-[1.06] tracking-tight"
                >
                  {CONTENT.headlineLine2}
                </motion.h1>
              </motion.div>
            </>
          )}

          {/* Subtitle */}
          <motion.p
            variants={blurIn}
            className="mt-5 md:mt-7 text-body-lg text-mist/90 max-w-xl leading-relaxed"
          >
            {cmsSubtitle || CONTENT.subtitle}
          </motion.p>

          {/* Service tag chips */}
          <motion.div variants={blurIn} className="mt-4 md:mt-6 flex flex-wrap gap-2">
            {CONTENT.serviceTags.map(({ label }) => {
              const Icon = TAG_ICONS[label] || Sparkles
              return (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gold border border-gold/35 backdrop-blur-sm select-none"
                  style={{ backgroundColor: 'rgba(212,175,55,0.08)' }}
                >
                  <Icon size={13} strokeWidth={2.25} aria-hidden="true" />
                  {label}
                </span>
              )
            })}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            variants={blurIn}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4"
          >
            <Button as="a" href="#contact" variant="primary" icon={ArrowRight} className="justify-center">
              {CONTENT.ctaPrimary}
            </Button>
            <Button
              as="a"
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
              variant="ghost"
              icon={Phone}
              iconPosition="left"
              className="justify-center sm:w-auto"
            >
              {CONTENT.ctaSecondary}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full"
        aria-label="Key statistics"
      >
        <div
          className="section-container pt-8 pb-8 sm:pt-9 sm:pb-10 md:pt-10 md:pb-12 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.12)' }}
        >
          <dl className="grid grid-cols-4">
            {STATS.map(({ value, label }, i) => {
              const pad =
                i === 0
                  ? 'pr-3 sm:pr-8 md:pr-10'
                  : i === STATS.length - 1
                  ? 'pl-3 sm:pl-8 md:pl-10'
                  : 'px-3 sm:px-8 md:px-10'

              return (
                <div key={label} className={`relative flex flex-col ${pad}`}>
                  {i > 0 && (
                    <span
                      className="absolute left-0 top-1 bottom-1"
                      style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.14)' }}
                      aria-hidden="true"
                    />
                  )}
                  <dd className="text-[1.1rem] sm:text-[2rem] md:text-[2.5rem] font-extrabold gold-text-gradient leading-none tabular-nums">
                    {value}
                  </dd>
                  <dt className="text-[10px] sm:text-[11px] md:text-[12px] text-mist/60 mt-1.5 sm:mt-2 md:mt-2.5 uppercase tracking-[0.05em] sm:tracking-[0.10em] leading-snug">
                    {label}
                  </dt>
                </div>
              )
            })}
          </dl>
        </div>
      </motion.div>

      <ScrollIndicator visible={showScrollIndicator} />
    </section>
  )
}

export default Hero
