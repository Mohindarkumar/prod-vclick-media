import { motion } from 'framer-motion'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import GoldDivider from '../../components/common/GoldDivider'
import PricingCard from './PricingCard'
import { pricingPackages as staticPackages } from '../../data/pricing'
import { homeSectionContents } from '../../data/home_section_contents'

const { pricing: CONTENT } = homeSectionContents

function PricingSection({ section = null }) {
  const heading = section?.title    || CONTENT.heading
  const subtext = section?.subtitle || CONTENT.subtitle

  const cmsPackages = section?.content?.items
  const packages = cmsPackages?.length
    ? cmsPackages.map((pkg, i) => ({
        id: pkg.id ?? `pkg-${i}`,
        name: pkg.name || pkg.title,
        price: pkg.price,
        popular: pkg.popular ?? false,
        features: Array.isArray(pkg.features) ? pkg.features : [],
        cta: pkg.cta || 'Get Started',
      }))
    : staticPackages

  return (
    <section id="pricing" className="section-padding bg-ink">
      <div className="section-container">
        <GoldDivider className="mb-10 md:mb-14" />
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow>{CONTENT.eyebrow}</SectionEyebrow>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-5 text-2xl sm:text-3xl md:text-h2 font-extrabold text-paper"
          >
            {heading}
          </motion.h2>
          <p className="mt-4 text-body-lg text-mist">{subtext}</p>
        </div>

        <div className={`mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-5 items-stretch ${
          packages.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-3'
        }`}>
          {packages.map((pkg, index) => (
            <PricingCard key={pkg.id} pkg={pkg} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
