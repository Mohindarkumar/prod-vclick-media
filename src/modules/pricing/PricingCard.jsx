import { motion } from 'framer-motion'
import { Check, Crown } from 'lucide-react'
import Button from '../../components/common/Button'

/**
 * Single pricing package card (build brief §6.11). The "popular" package
 * gets a gold border, slight scale/elevation, and a "Most Popular" badge.
 */
function PricingCard({ pkg, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className={`relative glass-surface rounded-3xl p-5 md:p-8 flex flex-col h-full transition-shadow duration-300 ${
        pkg.popular
          ? 'border-gold/60 shadow-gold-lg lg:scale-105 z-10'
          : 'hover:border-gold/40 hover:shadow-gold'
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-gold-sweep text-ink text-xs font-bold px-4 py-1.5 rounded-full shadow-gold">
          <Crown size={13} /> Most Popular
        </span>
      )}

      <h3 className="text-lg font-semibold text-paper mt-2">{pkg.name}</h3>
      <p className="mt-3 text-2xl font-extrabold gold-text-gradient">{pkg.price}</p>
      {/* TODO: flagged for client — replace placeholder "Starting from" pricing with real figures */}
      <p className="text-xs text-mist mt-1">Placeholder pricing — pending final client input</p>

      <ul className="mt-7 space-y-3 flex-1">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-mist">
            <Check size={16} className="text-gold mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        as="a"
        href="#contact"
        variant={pkg.popular ? 'primary' : 'ghost'}
        className="mt-8 w-full"
      >
        {pkg.cta}
      </Button>
    </motion.div>
  )
}

export default PricingCard
