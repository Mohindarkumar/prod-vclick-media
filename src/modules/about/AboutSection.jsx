import { motion } from 'framer-motion'
import { Target, Eye, Clock, Users } from 'lucide-react'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import GoldDivider from '../../components/common/GoldDivider'
import { homeSectionContents } from '../../data/home_section_contents'
import { siteConfig } from '../../config/site.config'

const { about: CONTENT } = homeSectionContents

const PILLAR_ICONS = [Target, Eye, Clock, Users]

const COLLAGE_IMAGES = [
  {
    src: '/uploads/images/homepage/DSC00897.webp',
    alt: 'VClick Media & Events — professional event photography in the UAE',
  },
  {
    src: '/uploads/images/homepage/DSC05604.webp',
    alt: 'VClick Media & Events — cinematic videography and event coverage',
  },
  {
    src: '/uploads/images/homepage/DSC00589.webp',
    alt: 'VClick Media & Events — creative media production across the UAE',
  },
]

// Resolve pillar visibility → Tailwind class
// Breakpoint: mobile = <lg, website = lg+
function pillarsVisibilityClass(website, mobile) {
  if (website && mobile)   return 'grid'          // both visible
  if (website && !mobile)  return 'hidden lg:grid' // desktop only
  if (!website && mobile)  return 'grid lg:hidden'  // mobile only
  return 'hidden'                                   // both 0 → hidden
}

function AboutSection({ section = null }) {
  const heading       = section?.title    || CONTENT.heading
  const bodyText      = section?.subtitle || CONTENT.body
  const cmsPillars    = section?.content?.items
  const pillars       = cmsPillars?.length ? cmsPillars : CONTENT.pillars
  const cmsImages     = section?.content?.images
  const collageImages = cmsImages?.length ? cmsImages : COLLAGE_IMAGES

  const { website: pweb = 0, mobile: pmob = 0 } = siteConfig.sections?.about?.pillars ?? {}
  const pillarsClass = pillarsVisibilityClass(pweb, pmob)

  return (
    <section id="about" className="pt-6 md:pt-8 pb-14 md:pb-20 bg-ink overflow-hidden">
      <GoldDivider className="mb-8 md:mb-12" />
      <div className="section-container grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <SectionEyebrow align="left">{CONTENT.eyebrow}</SectionEyebrow>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-5"
          >
            <h2 className="text-3xl md:text-4xl lg:text-h2 font-extrabold leading-tight tracking-tight">
              <span className="block text-paper">We Click.</span>
              <span className="block italic gold-text-gradient">You Celebrate.</span>
            </h2>
            <span className="mt-4 block h-[3px] w-14 rounded-full bg-gold-sweep" aria-hidden="true" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-body-lg text-mist max-w-xl lg:max-w-none"
          >
            {bodyText}
          </motion.p>

          <div className={`mt-8 md:mt-12 ${pillarsClass} grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8`}>
            {pillars.map((pillar, index) => {
              const Icon  = PILLAR_ICONS[index % PILLAR_ICONS.length]
              const label = pillar.label || pillar.title
              const copy  = pillar.copy  || pillar.description
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-paper">{label}</h3>
                    <p className="mt-1 text-sm text-mist leading-relaxed">{copy}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Desktop-only: themed 3-image grid (hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative hidden lg:grid grid-cols-[3fr_2fr] gap-3 h-[520px] 2xl:h-[580px] w-full"
        >
          {/* Gold corner brackets */}
          <span className="absolute -top-px -left-px w-10 h-10 border-t-2 border-l-2 border-gold/55 rounded-tl-2xl pointer-events-none z-10" aria-hidden="true" />
          <span className="absolute -bottom-px -right-px w-10 h-10 border-b-2 border-r-2 border-gold/55 rounded-br-2xl pointer-events-none z-10" aria-hidden="true" />

          {/* Left — main tall image */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-charcoal group">
            <img
              src={collageImages[0]?.src}
              alt={collageImages[0]?.alt || ''}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.opacity = '0' }}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-sweep pointer-events-none" aria-hidden="true" />
          </div>

          {/* Right — two stacked images */}
          <div className="flex flex-col gap-3">
            {/* Top-right */}
            <div className="flex-1 relative overflow-hidden rounded-2xl border border-white/10 bg-charcoal group">
              <img
                src={collageImages[1]?.src}
                alt={collageImages[1]?.alt || ''}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.opacity = '0' }}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" aria-hidden="true" />
            </div>

            {/* Bottom-right — gold accent border */}
            <div className="flex-1 relative overflow-hidden rounded-2xl border border-gold/35 bg-charcoal group">
              <img
                src={collageImages[2]?.src}
                alt={collageImages[2]?.alt || ''}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.opacity = '0' }}
                className="w-full h-full object-cover object-bottom transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" aria-hidden="true" />
              {/* Stat badge */}
              <div className="absolute top-3 right-3 bg-black/55 backdrop-blur-sm border border-gold/30 rounded-xl px-3 py-1.5 text-center">
                <p className="text-gold font-extrabold text-sm leading-none tabular-nums">{siteConfig.stats.events}</p>
                <p className="text-white/55 text-[9px] uppercase tracking-wide leading-none mt-0.5">Events</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
