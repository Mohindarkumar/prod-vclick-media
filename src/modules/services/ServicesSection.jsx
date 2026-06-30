import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import ServiceCard from './ServiceCard'
import { services } from '../../data/services'
import { homeSectionContents } from '../../data/home_section_contents'

const { services: CONTENT } = homeSectionContents

const FEATURED_COUNT = 6

function ServicesSection({ section = null }) {
  const [showAll, setShowAll] = useState(false)

  const heading = section?.title    || CONTENT.heading
  const subtext = section?.subtitle || CONTENT.subtitle

  const featured = services.slice(0, FEATURED_COUNT)
  const rest     = services.slice(FEATURED_COUNT)

  return (
    <section id="services" className="section-padding bg-charcoal">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow>{CONTENT.eyebrow}</SectionEyebrow>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-5 text-3xl md:text-h2 font-extrabold text-paper"
          >
            {heading}
          </motion.h2>
          <p className="mt-4 text-body-lg text-mist">{subtext}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        <AnimatePresence>
          {showAll && rest.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {rest.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-amber transition-colors duration-300"
              aria-expanded={showAll}
            >
              {showAll ? CONTENT.showFewerLabel : CONTENT.showAllLabel(services.length)}
              <motion.span animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={18} />
              </motion.span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ServicesSection
