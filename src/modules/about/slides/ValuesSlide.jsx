import { motion } from 'framer-motion'
import { ShieldCheck, Lightbulb, Gem, Handshake, Palette, HeartHandshake } from 'lucide-react'

const VALUE_ICONS = {
  Integrity: ShieldCheck,
  Innovation: Lightbulb,
  Quality: Gem,
  Trust: Handshake,
  Creativity: Palette,
  'Customer First': HeartHandshake,
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const card = {
  hidden: { opacity: 0, y: 22, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

function ValuesSlide({ title, items }) {
  return (
    <div className="relative h-auto sm:h-full w-full px-6 sm:px-10 md:px-14 lg:px-16 py-12 sm:py-14 md:py-16 flex flex-col">
      <div className="relative z-10 text-center mb-8 md:mb-10">
        <span className="eyebrow">What Drives Us</span>
        <h3 className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold text-paper leading-[1.1]">{title}</h3>
        <span className="mt-4 inline-block h-[3px] w-14 rounded-full bg-gold-sweep" aria-hidden="true" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full"
      >
        {items.map((value) => {
          const Icon = VALUE_ICONS[value.label] || ShieldCheck
          return (
            <motion.div
              key={value.label}
              variants={card}
              whileHover={{ y: -6, borderColor: 'rgba(212,175,55,0.5)' }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 text-center sm:text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto sm:mx-0">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h4 className="mt-4 text-base font-semibold text-paper">{value.label}</h4>
              <p className="mt-1.5 text-sm text-mist leading-relaxed">{value.copy}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default ValuesSlide
