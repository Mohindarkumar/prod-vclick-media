import { motion } from 'framer-motion'
import { Target, ArrowRight } from 'lucide-react'
import Button from '../../../components/common/Button'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

function MissionSlide({ data, disableMotion }) {
  return (
    <div className="relative h-auto sm:h-full w-full flex items-center justify-center px-6 sm:px-10 md:px-14 lg:px-16 py-12 sm:py-14 md:py-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-xl w-full mx-auto flex flex-col items-center text-center"
      >
        {/* Icon mark — floats gently unless reduced motion */}
        <motion.div variants={item} className="relative w-20 h-20 flex items-center justify-center mb-6" aria-hidden="true">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.28) 0%, transparent 70%)' }}
            animate={disableMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={disableMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="relative w-16 h-16 rounded-2xl glass-surface flex items-center justify-center text-gold shadow-gold-ghost"
            animate={disableMotion ? undefined : { y: [0, -8, 0] }}
            transition={disableMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Target size={30} strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        <motion.span variants={item} className="eyebrow">Who We Are</motion.span>
        <motion.h3 variants={item} className="mt-4 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold text-paper leading-[1.1]">
          {data.title}
        </motion.h3>
        <motion.span variants={item} className="mt-4 block h-[3px] w-14 rounded-full bg-gold-sweep" aria-hidden="true" />
        <motion.p variants={item} className="mt-6 text-[clamp(0.95rem,1.4vw,1.125rem)] text-mist leading-relaxed">
          {data.description}
        </motion.p>
        {data.cta && (
          <motion.div variants={item} className="mt-8">
            <Button as="a" href={data.cta.href} variant="primary" icon={ArrowRight}>
              {data.cta.label}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default MissionSlide
