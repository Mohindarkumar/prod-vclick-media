import { motion } from 'framer-motion'

/**
 * Filter bar for the Portfolio masonry grid (build brief §6.6).
 * Active filter gets a gold gradient fill; inactive filters are ghost pills.
 */
function PortfolioFilter({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Filter portfolio by category">
      {categories.map((category) => {
        const isActive = category === activeCategory
        return (
          <motion.button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            whileTap={{ scale: 0.96 }}
            aria-pressed={isActive}
            className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              isActive
                ? 'bg-gold-sweep text-ink'
                : 'bg-transparent border border-white/12 text-mist hover:text-paper hover:border-gold/40'
            }`}
          >
            {category}
          </motion.button>
        )
      })}
    </div>
  )
}

export default PortfolioFilter
