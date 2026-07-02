import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../../../components/common/Button'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const RINGS = [
  { r: 22, opacity: 0.9, delay: 0 },
  { r: 36, opacity: 0.55, delay: 0.2 },
  { r: 50, opacity: 0.3, delay: 0.4 },
]

// Small "radar/lens" illustration — represents forward-looking vision. Rings
// pulse outward on a stagger; disabled to a static state when the user
// prefers reduced motion.
function VisionIllustration({ disableMotion }) {
  return (
    <svg viewBox="0 0 140 140" className="w-24 h-24" aria-hidden="true">
      <defs>
        <radialGradient id="visionGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB703" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {RINGS.map(({ r, opacity, delay }) => (
        <motion.circle
          key={r}
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="url(#visionGlow)"
          strokeWidth="1.5"
          initial={{ opacity }}
          animate={disableMotion ? { opacity } : { r: [r, r + 10, r], opacity: [opacity, opacity * 0.4, opacity] }}
          transition={disableMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay }}
        />
      ))}

      <motion.g
        animate={disableMotion ? undefined : { rotate: 360 }}
        transition={disableMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '70px 70px' }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1="70"
            y1="70"
            x2={70 + 64 * Math.cos((i * Math.PI) / 4)}
            y2={70 + 64 * Math.sin((i * Math.PI) / 4)}
            stroke="#D4AF37"
            strokeWidth="0.75"
            strokeLinecap="round"
            opacity="0.18"
          />
        ))}
      </motion.g>

      <circle cx="70" cy="70" r="8" fill="url(#visionGlow)" />
      <circle cx="70" cy="70" r="3.5" fill="#FFB703" />
    </svg>
  )
}

function VisionSlide({ data, disableMotion }) {
  return (
    <div className="relative h-auto sm:h-full w-full flex items-center justify-center px-6 sm:px-10 md:px-14 lg:px-16 py-12 sm:py-14 md:py-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-xl w-full mx-auto flex flex-col items-center text-center"
      >
        <motion.div variants={item} className="mb-4">
          <VisionIllustration disableMotion={disableMotion} />
        </motion.div>

        <motion.span variants={item} className="eyebrow">Looking Ahead</motion.span>
        <motion.h3 variants={item} className="mt-4 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold text-paper leading-[1.1]">
          {data.title}
        </motion.h3>
        <motion.span variants={item} className="mt-4 block h-[3px] w-14 rounded-full bg-gold-sweep" aria-hidden="true" />
        <motion.p variants={item} className="mt-6 text-[clamp(0.95rem,1.4vw,1.125rem)] text-mist leading-relaxed">
          {data.description}
        </motion.p>
        {data.cta && (
          <motion.div variants={item} className="mt-8">
            <Button as="a" href={data.cta.href} variant="ghost" icon={ArrowRight}>
              {data.cta.label}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default VisionSlide
