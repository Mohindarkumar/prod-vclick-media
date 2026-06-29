import { motion } from 'framer-motion'

/**
 * Glassmorphic card surface reused for service cards, pricing cards,
 * testimonial cards, etc. (build brief §3.3). Optional hover lift +
 * gold border-glow, gated so it's not applied to every element on the page.
 */
function GlassCard({ children, hoverable = true, className = '', as = 'div', ...props }) {
  const Component = motion[as] || motion.div

  return (
    <Component
      className={`glass-surface rounded-2xl ${className}`}
      whileHover={
        hoverable
          ? { scale: 1.03, boxShadow: '0 0 0 1px rgba(212,175,55,0.5), 0 20px 60px -15px rgba(212,175,55,0.45)' }
          : undefined
      }
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </Component>
  )
}

export default GlassCard
