import { motion } from 'framer-motion'
import {
  MessageCircle,
  ClipboardList,
  Lightbulb,
  Clapperboard,
  Camera,
  Edit3,
  PackageCheck,
} from 'lucide-react'
import SectionEyebrow from '../../components/common/SectionEyebrow'

const STATIC_ICONS = [MessageCircle, ClipboardList, Lightbulb, Clapperboard, Camera, Edit3, PackageCheck]

const STATIC_STEPS = [
  { title: 'Consultation',     description: 'We learn your vision, goals and budget for the event.' },
  { title: 'Planning',         description: 'Timelines, crew and logistics are mapped out in detail.' },
  { title: 'Creative Concept', description: 'A shot list and visual direction are built around your story.' },
  { title: 'Production',       description: 'Pre-production checks confirm every detail is locked in.' },
  { title: 'Execution',        description: 'Our crew captures the event live, on the day.' },
  { title: 'Editing',          description: 'Footage and photos are color-graded and refined.' },
  { title: 'Delivery',         description: 'Final assets are delivered through your private gallery.' },
]

function EventProcess({ section = null }) {
  const heading = section?.title || 'Our Event Process'
  const cmsSteps = section?.content?.items
  const steps = cmsSteps?.length ? cmsSteps : STATIC_STEPS

  return (
    <section id="process" className="section-padding bg-charcoal">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow>How We Work</SectionEyebrow>
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

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block mt-20 relative">
          <div className="absolute top-7 left-0 right-0 h-px bg-white/10">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              style={{ transformOrigin: 'left' }}
              className="h-px bg-gold-sweep-soft w-full"
            />
          </div>
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
            {steps.map((step, index) => {
              const Icon = STATIC_ICONS[index % STATIC_ICONS.length]
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative w-14 h-14 rounded-full bg-gold-sweep shadow-gold flex items-center justify-center text-ink font-bold text-sm z-10">
                    {index + 1}
                  </div>
                  <Icon size={20} className="mt-4 text-gold" strokeWidth={2} />
                  <h3 className="mt-3 text-sm font-semibold text-paper">{step.title}</h3>
                  <p className="mt-1.5 text-xs text-mist leading-relaxed">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mobile/tablet: vertical stacked timeline */}
        <div className="lg:hidden mt-10 md:mt-14 relative pl-8">
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-white/10" aria-hidden="true">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top' }}
              className="w-px bg-gold-sweep-soft h-full"
            />
          </div>
          <div className="space-y-10">
            {steps.map((step, index) => {
              const Icon = STATIC_ICONS[index % STATIC_ICONS.length]
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative flex gap-5"
                >
                  <div className="relative -left-8 w-14 h-14 flex-shrink-0 rounded-full bg-gold-sweep shadow-gold flex items-center justify-center text-ink font-bold text-sm z-10">
                    {index + 1}
                  </div>
                  <div className="-ml-6 pt-1">
                    <div className="flex items-center gap-2">
                      <Icon size={18} className="text-gold" strokeWidth={2} />
                      <h3 className="text-base font-semibold text-paper">{step.title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm text-mist leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventProcess
