import { motion } from 'framer-motion'
import {
  Palette,
  Camera,
  Wand2,
  Zap,
  Wallet,
  Settings2,
  UserCog,
  Award,
  SmilePlus,
  Headset,
} from 'lucide-react'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import StatBlock from './StatBlock'

const STATIC_ICONS = [Palette, Camera, Wand2, Zap, Wallet, Settings2, UserCog, Award, SmilePlus, Headset]

const STATIC_REASONS = [
  { label: 'Creative Team' },
  { label: 'Latest Equipment' },
  { label: 'Professional Editing' },
  { label: 'Fast Delivery' },
  { label: 'Affordable Packages' },
  { label: 'Customized Solutions' },
  { label: 'Experienced Event Managers' },
  { label: 'High Quality Output' },
  { label: 'Customer Satisfaction' },
  { label: '24/7 Support' },
]

const STATIC_STATS = [
  { target: 500, suffix: '+', label: 'Events Delivered' },
  { target: 200, suffix: '+', label: 'Happy Clients' },
  { target: 50,  suffix: '+', label: 'Corporate Partners' },
  { target: 8,   suffix: '+', label: 'Years Experience' },
]

function WhyChooseUs({ section = null }) {
  const heading = section?.title || 'Why Choose Us'

  const cmsReasons = section?.content?.reasons
  const reasons = cmsReasons?.length ? cmsReasons : STATIC_REASONS

  const cmsStats = section?.content?.stats
  const stats = cmsStats?.length
    ? cmsStats.map((s) => ({ target: Number(s.target ?? s.value ?? 0), suffix: s.suffix ?? '+', label: s.label }))
    : STATIC_STATS

  return (
    <section id="why-choose-us" className="section-padding bg-ink">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow>Why VClick</SectionEyebrow>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-5 text-3xl md:text-h2 font-extrabold text-paper"
          >
            {heading}
          </motion.h2>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {reasons.map((reason, index) => {
            const Icon  = STATIC_ICONS[index % STATIC_ICONS.length]
            const label = reason.label || reason.title
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: (index % 5) * 0.07 }}
                className="flex flex-col items-center text-center gap-2.5 p-3 md:p-5 rounded-2xl hover:bg-white/5 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <p className="text-sm font-medium text-paper">{label}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-8 md:mt-12 bg-charcoal border border-white/8 rounded-3xl py-8 px-5 md:py-10 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {stats.map((stat) => (
            <StatBlock key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
