import { motion } from 'framer-motion'
import { Building } from 'lucide-react'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { clientLogos as staticClients } from '../../data/clients'

function ClientLogo({ client }) {
  const inner = (
    <div className="flex items-center gap-2.5 px-6 py-4 rounded-xl grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:text-gold transition-all duration-300 text-mist whitespace-nowrap">
      {client.logo_url ? (
        <img
          src={client.logo_url}
          alt={client.name}
          className="h-8 max-w-[120px] object-contain"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}
      <span className={`text-sm font-medium flex items-center gap-1.5 ${client.logo_url ? 'hidden' : ''}`}>
        <Building size={20} strokeWidth={2} />
        {client.name}
      </span>
    </div>
  )

  if (client.website) {
    return (
      <a href={client.website} target="_blank" rel="noopener noreferrer" aria-label={client.name}>
        {inner}
      </a>
    )
  }
  return <div aria-label={client.name}>{inner}</div>
}

function ClientsLogoStrip() {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (!staticClients?.length) return null

  const sourceClients = staticClients

  // Duplicate for seamless marquee loop
  const loopedClients = [...sourceClients, ...sourceClients]

  return (
    <section id="clients" className="section-padding bg-charcoal">
      <div className="section-container text-center">
        <SectionEyebrow>Trusted By</SectionEyebrow>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-5 text-3xl md:text-h2 font-extrabold text-paper"
        >
          Our Clients
        </motion.h2>
      </div>

      <div className="mt-14 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-charcoal to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-charcoal to-transparent z-10" />

        <div
          className={`flex items-center gap-12 w-max ${prefersReducedMotion ? '' : 'animate-marquee'}`}
        >
          {loopedClients.map((client, index) => (
            <ClientLogo key={`${client.id}-${index}`} client={client} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ClientsLogoStrip
