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
import { homeSectionContents } from '../../data/home_section_contents'

const { whyChooseUs: CONTENT } = homeSectionContents

const REASON_ICONS = [Palette, Camera, Wand2, Zap, Wallet, Settings2, UserCog, Award, SmilePlus, Headset]

function WhyChooseUs({ section = null }) {
  const heading = section?.title || CONTENT.heading

  const cmsReasons = section?.content?.reasons
  const reasons    = cmsReasons?.length ? cmsReasons : CONTENT.reasons

  const cmsStats = section?.content?.stats
  const stats    = cmsStats?.length
    ? cmsStats.map((s) => ({ target: Number(s.target ?? s.value ?? 0), suffix: s.suffix ?? '+', label: s.label }))
    : CONTENT.stats

  return (
    <section id="why-choose-us" className="section-padding bg-ink">
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
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {reasons.map((reason, index) => {
            const Icon        = REASON_ICONS[index % REASON_ICONS.length]
            const label       = reason.label || reason.title
            const description = reason.description || reason.copy
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
                {description && (
                  <p className="text-xs text-mist/60 leading-relaxed hidden md:block">{description}</p>
                )}
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
