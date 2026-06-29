import { motion } from 'framer-motion'

/**
 * Small uppercase tag rendered above every section headline
 * (e.g. "OUR SERVICES", "WHY VCLICK"). Centralized here so the
 * eyebrow treatment stays identical across all 12+ sections.
 */
function SectionEyebrow({ children, align = 'center', className = '' }) {
  const alignment = {
    center: 'justify-center text-center',
    left: 'justify-start text-left',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex items-center gap-3 ${alignment[align]} ${className}`}
    >
      <span className="h-px w-6 bg-gold-sweep" aria-hidden="true" />
      <span className="eyebrow">{children}</span>
      {align === 'center' && <span className="h-px w-6 bg-gold-sweep" aria-hidden="true" />}
    </motion.div>
  )
}

export default SectionEyebrow
