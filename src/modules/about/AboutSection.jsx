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
    className: 'absolute top-0 left-0 w-3/5 rotate-[-3deg] z-20',
  },
  {
    src: '/uploads/images/homepage/DSC05604.webp',
    alt: 'VClick Media & Events — cinematic videography and event coverage',
    className: 'absolute top-16 right-0 w-1/2 rotate-[4deg] z-10',
  },
  {
    src: '/uploads/images/homepage/DSC06454.webp',
    alt: 'VClick Media & Events — creative media production across the UAE',
    className: 'absolute bottom-0 left-10 w-2/3 rotate-[2deg] z-0',
  },
]

const COLLAGE_CLASSES = [
  'absolute top-0 left-0 w-3/5 rotate-[-3deg] z-20',
  'absolute top-16 right-0 w-1/2 rotate-[4deg] z-10',
  'absolute bottom-0 left-10 w-2/3 rotate-[2deg] z-0',
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
            className="mt-6 text-body-lg text-mist max-w-xl"
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

        {/* Desktop-only: asymmetric overlapping collage (hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative h-[520px] w-full hidden lg:block"
        >
          {collageImages.slice(0, 3).map((img, i) => {
            const cls = img.className || COLLAGE_CLASSES[i % COLLAGE_CLASSES.length]
            return (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt || ''}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.opacity = '0' }}
                className={`${cls} rounded-3xl shadow-2xl shadow-black/60 border border-white/10 object-cover aspect-[4/3] bg-charcoal`}
              />
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
