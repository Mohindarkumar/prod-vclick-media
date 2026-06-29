import { motion } from 'framer-motion'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

/**
 * THE signature element of the site (build brief §3.4): a thin gold gradient
 * line that animates across on scroll-into-view. Used in two modes:
 *
 *  - variant="divider": a horizontal rule between/within sections
 *  - variant="underline": sits beneath a single headline word to call it out
 *
 * Implemented once and reused everywhere rather than inventing a new
 * sweep animation per section, per the brief's explicit instruction.
 */
function GoldDivider({ variant = 'divider', className = '', delay = 0.15 }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const widthTarget = '100%'

  if (variant === 'underline') {
    return (
      <motion.span
        className={`block h-[3px] md:h-1 rounded-full bg-gold-sweep ${className}`}
        initial={{ width: prefersReducedMotion ? widthTarget : '0%', opacity: 0 }}
        whileInView={{ width: widthTarget, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1], delay: prefersReducedMotion ? 0 : delay }}
        aria-hidden="true"
      />
    )
  }

  return (
    <motion.div
      className={`relative h-px w-full overflow-hidden bg-white/10 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      aria-hidden="true"
    >
      <motion.span
        className="absolute inset-y-0 left-0 w-1/3 bg-gold-sweep-soft"
        initial={{ x: prefersReducedMotion ? '0%' : '-120%' }}
        whileInView={{ x: prefersReducedMotion ? '0%' : '320%' }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 1.8, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

export default GoldDivider
