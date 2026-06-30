import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { homeSectionContents } from '../../data/home_section_contents'

const { services: CONTENT } = homeSectionContents

function ServiceCard({ service, index }) {
  const Icon = service.icon ?? Sparkles

  return (
    <motion.a
      href="#contact"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="group relative block rounded-2xl overflow-hidden border border-transparent hover:border-gold/50 hover:shadow-gold transition-[border-color,box-shadow] duration-300"
    >
      {service.image ? (
        /* ── Full-height image card ───────────────────────────── */
        <div className="relative h-[280px] sm:h-[320px] md:h-[360px] lg:h-[380px] overflow-hidden bg-charcoal">
          {/* Full-size image */}
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className={`w-full h-full object-cover ${service.imagePosition ?? 'object-center'} group-hover:scale-110 transition-transform duration-500`}
          />

          {/* Gradient overlay — dark at bottom for text legibility */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10"
            aria-hidden="true"
          />

          {/* Icon badge — top left */}
          <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-xl bg-ink/70 backdrop-blur-md border border-gold/30 flex items-center justify-center text-gold">
            <Icon size={18} strokeWidth={2} aria-hidden="true" />
          </div>

          {/* Text overlay — bottom */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">
            <h3 className="text-base font-semibold text-paper leading-snug group-hover:text-gold/90 transition-colors duration-200">
              {service.title}
            </h3>
            <p className="mt-1.5 text-xs text-white/60 leading-relaxed line-clamp-2">
              {service.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-gold group-hover:text-amber transition-colors duration-300">
              {CONTENT.cardCta}
              <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </div>
        </div>
      ) : (
        /* ── No-image fallback ────────────────────────────────── */
        <div className="glass-surface h-[280px] sm:h-[320px] md:h-[360px] lg:h-[380px] flex flex-col p-5">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
            <Icon size={18} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="mt-auto">
            <h3 className="text-base font-semibold text-paper leading-snug">{service.title}</h3>
            <p className="mt-2 text-sm text-mist leading-relaxed line-clamp-3">{service.description}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold group-hover:text-amber transition-colors duration-300">
              {CONTENT.cardCta}
              <ArrowUpRight size={15} aria-hidden="true" />
            </span>
          </div>
        </div>
      )}
    </motion.a>
  )
}

export default ServiceCard
