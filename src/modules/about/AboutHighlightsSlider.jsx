import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { homeSectionContents } from '../../data/home_section_contents'
import MissionSlide from './slides/MissionSlide'
import VisionSlide from './slides/VisionSlide'
import ValuesSlide from './slides/ValuesSlide'

const { about } = homeSectionContents
const { mission, vision, values } = about.highlights

const SLIDES = [
  { key: 'mission', label: 'Mission' },
  { key: 'vision', label: 'Vision' },
  { key: 'values', label: 'Values' },
]

const AUTO_ADVANCE_MS = 3500
const RESUME_FAILSAFE_MS = 10000

// Pause-on-hover/click is desktop-only: touch devices already work correctly
// with plain autoplay, and taps would otherwise trip the same "click inside"
// pause logic meant for a mouse.
const isTouchDevice = typeof window !== 'undefined'
  ? window.matchMedia('(pointer: coarse)').matches
  : false

// Full-panel background wash per slide — rendered once at the engine level
// (behind both the slide content AND the pagination footer) so the colored
// wash spans edge-to-edge with no seam where the controls strip begins.
const WASHES = {
  mission: 'radial-gradient(circle at 20% 0%, rgba(212,175,55,0.55) 0%, transparent 68%), radial-gradient(circle at 100% 100%, rgba(255,183,3,0.22) 0%, transparent 60%), linear-gradient(160deg, #1C1C1C 0%, #0B0B0B 100%)',
  vision: 'linear-gradient(135deg, rgba(255,183,3,0.46) 0%, transparent 68%), radial-gradient(circle at 85% 90%, rgba(212,175,55,0.38) 0%, transparent 64%), linear-gradient(160deg, #1C1C1C 0%, #0B0B0B 100%)',
  values: 'radial-gradient(circle at 90% 0%, rgba(212,175,55,0.48) 0%, transparent 64%), radial-gradient(circle at 0% 100%, rgba(255,183,3,0.36) 0%, transparent 64%), linear-gradient(180deg, #1C1C1C 0%, #0B0B0B 100%)',
}

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 0.96, filter: 'blur(6px)' }),
  center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.96, filter: 'blur(6px)' }),
}

/**
 * Full-width, self-contained showcase for Mission / Vision / Values.
 * Supports drag (mouse + touch), keyboard, horizontal-wheel, autoplay, and a
 * segmented progress/pagination bar. No arrow buttons and no play/pause
 * button (mobile or desktop) — on desktop, hovering/clicking the slide
 * pauses it and moving/clicking outside resumes it (10s failsafe if
 * neither happens); on mobile it just auto-advances.
 */
function AboutHighlightsSlider() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { amount: 0.35 })

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const resumeTimerRef = useRef(null)

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }, [])

  // Desktop pause model: hovering in OR clicking inside pauses; hovering out
  // OR clicking outside resumes. If neither happens (mouse just rests inside
  // after a click), a 10s failsafe force-resumes so it never gets stuck.
  const pauseWithFailsafe = useCallback(() => {
    setIsPaused(true)
    clearResumeTimer()
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), RESUME_FAILSAFE_MS)
  }, [clearResumeTimer])

  const resume = useCallback(() => {
    setIsPaused(false)
    clearResumeTimer()
  }, [clearResumeTimer])

  useEffect(() => clearResumeTimer, [clearResumeTimer])

  // Resume as soon as a click lands outside the slider while it's paused.
  useEffect(() => {
    if (isTouchDevice || !isPaused) return
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) resume()
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isPaused, resume])

  const goTo = useCallback((newIndex, dir) => {
    setDirection(dir)
    setIndex((newIndex + SLIDES.length) % SLIDES.length)
  }, [])

  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index])

  const shouldAutoplay = inView && !isPaused && !isDragging && !prefersReducedMotion

  useEffect(() => {
    if (!shouldAutoplay) return
    const timer = setInterval(goNext, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [shouldAutoplay, goNext])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0, -1) }
    else if (e.key === 'End') { e.preventDefault(); goTo(SLIDES.length - 1, 1) }
  }

  // Horizontal trackpad/wheel gestures only — vertical wheel is left alone
  // so the section never hijacks normal page scrolling.
  const lastWheelRef = useRef(0)
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 24) return
    const now = Date.now()
    if (now - lastWheelRef.current < 700) return
    lastWheelRef.current = now
    if (e.deltaX > 0) goNext()
    else goPrev()
  }

  // Only treat it as a real drag (and pause autoplay) once the pointer has
  // actually moved a meaningful distance — `onDragStart` alone fires on the
  // few-pixel jitter of an ordinary mouse click, which was pausing/resetting
  // autoplay on every click anywhere inside the slide (buttons, cards, etc.)
  // on desktop. Touch taps don't have the same jitter, which is why this
  // only showed up with a mouse.
  const handleDrag = (_event, info) => {
    if (Math.abs(info.offset.x) > 10) setIsDragging(true)
  }

  const handleDragEnd = (_event, info) => {
    setIsDragging(false)
    if (info.offset.x < -80 || info.velocity.x < -400) goNext()
    else if (info.offset.x > 80 || info.velocity.x > 400) goPrev()
  }

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  const activeSlide = SLIDES[index]

  const renderActiveSlide = () => {
    switch (activeSlide.key) {
      case 'mission': return <MissionSlide data={mission} disableMotion={prefersReducedMotion} />
      case 'vision':  return <VisionSlide data={vision} disableMotion={prefersReducedMotion} />
      case 'values':  return <ValuesSlide title="Our Values" items={values} />
      default:        return null
    }
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our Mission, Vision and Values"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      onMouseEnter={!isTouchDevice ? pauseWithFailsafe : undefined}
      onMouseLeave={!isTouchDevice ? resume : undefined}
      onClick={!isTouchDevice ? pauseWithFailsafe : undefined}
      className="relative rounded-3xl border border-white/10 bg-charcoal/60 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <span className="sr-only" aria-live="polite">
        {`Showing ${index + 1} of ${SLIDES.length}: ${activeSlide.label}`}
      </span>

      {/* Full-panel background wash, crossfades per slide — spans the whole
          card including the controls strip below, so there's no seam. */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{ background: WASHES[activeSlide.key] }}
          />
        </AnimatePresence>
      </div>

      {/* Auto height on mobile — Mission/Vision are much shorter than the
          Values grid, so a fixed min-height there just left a big empty
          colored box. sm+ keeps a fixed min-height for a stable desktop
          rhythm across slides. */}
      <div className="relative z-10 sm:min-h-[540px] md:min-h-[500px]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={activeSlide.key}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            drag={prefersReducedMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${SLIDES.length}`}
            className={`h-auto sm:h-full ${prefersReducedMotion ? '' : 'cursor-grab active:cursor-grabbing'}`}
          >
            {renderActiveSlide()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls — pagination/progress only. No play-pause button anywhere
          (mobile or desktop) — desktop pausing is handled implicitly via
          hover/click on the slide itself (see pauseWithFailsafe/resume). */}
      <div className="relative z-10 flex items-center justify-center gap-4 px-6 py-5 sm:py-6">
        <div className="flex items-center gap-2">
          {SLIDES.map((slide, i) => {
            const isActive    = i === index
            const isCompleted = i < index
            return (
              <button
                key={slide.key}
                type="button"
                onClick={() => goTo(i, i > index ? 1 : -1)}
                aria-label={`Go to ${slide.label} slide`}
                aria-current={isActive}
                className="relative h-1.5 w-8 sm:w-10 rounded-full bg-white/12 overflow-hidden"
              >
                {isCompleted && (
                  <span className="absolute inset-y-0 left-0 w-full bg-gold-sweep rounded-full" aria-hidden="true" />
                )}
                {isActive && (
                  <motion.span
                    key={`${index}-${shouldAutoplay}`}
                    className="absolute inset-y-0 left-0 bg-gold-sweep rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: shouldAutoplay ? AUTO_ADVANCE_MS / 1000 : 0.3, ease: 'linear' }}
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AboutHighlightsSlider
