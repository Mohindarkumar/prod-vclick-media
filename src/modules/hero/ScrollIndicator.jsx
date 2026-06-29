import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

/**
 * Animated scroll-down indicator pinned to the bottom-center of the hero.
 * Features a pulsing gold ring on desktop/motion-enabled devices.
 * Fades + slides out once the user scrolls past the fold.
 */
function ScrollIndicator({ visible }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.a
      href="#contact"
      aria-label="Scroll down"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2.5 text-paper/55 hover:text-gold transition-colors duration-300 group"
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.22em]">Scroll</span>

      <div className="relative flex items-center justify-center">
        {/* Pulsing ring — motion-enabled, non-touch only */}
        {!prefersReducedMotion && (
          <motion.span
            className="absolute rounded-full border border-gold/40"
            style={{ width: 32, height: 32 }}
            animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.2 }}
            aria-hidden="true"
          />
        )}

        {/* Bouncing chevron in a rounded container */}
        <motion.div
          className="w-8 h-8 rounded-full border border-white/25 group-hover:border-gold/60 flex items-center justify-center transition-colors duration-300"
          animate={prefersReducedMotion ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} strokeWidth={2} />
        </motion.div>
      </div>
    </motion.a>
  )
}

export default ScrollIndicator
