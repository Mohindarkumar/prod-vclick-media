import { motion, AnimatePresence } from 'framer-motion'
import { Expand, FolderOpen } from 'lucide-react'

/**
 * Masonry grid (CSS grid + varying row-spans) of portfolio images,
 * filtered by active category. Filtering animates with AnimatePresence
 * (fade + slight scale) rather than a jarring re-layout (build brief §6.6).
 */
function PortfolioGrid({ items, onItemClick }) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-4 py-24 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
          <FolderOpen size={24} className="text-gold/50" aria-hidden="true" />
        </div>
        <div>
          <p className="text-paper/70 font-semibold text-sm">No work in this category yet.</p>
          <p className="text-xs text-mist/40 mt-1">Check back soon — more is on the way.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[150px] sm:auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-5">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => onItemClick(item)}
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.35 }}
            whileHover={{ scale: 1.02 }}
            className={`group relative overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal ${item.span}`}
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <span className="inline-flex items-center gap-1.5 text-gold text-xs font-semibold opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-all duration-300">
                <Expand size={14} /> View
              </span>
              <p className="text-paper text-sm font-medium mt-1">{item.title}</p>
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default PortfolioGrid
