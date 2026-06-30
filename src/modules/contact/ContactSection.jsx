import { motion } from 'framer-motion'
import { MessageCircle, PhoneCall, Mail, MapPin, Clock } from 'lucide-react'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import ContactForm from './ContactForm'
import MapEmbed from './MapEmbed'
import { siteConfig } from '../../config/site.config'
import { homeSectionContents } from '../../data/home_section_contents'

const { contact: CONTENT } = homeSectionContents

function ContactSection({ section = null }) {
  const { contact, whatsapp: wa } = siteConfig

  const quickContacts = [
    { label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/${wa.phone.replace(/[^0-9]/g, '')}` },
    { label: 'Call Us',  icon: PhoneCall,     href: `tel:${contact.phone.replace(/\s/g, '')}` },
    { label: 'Email',    icon: Mail,          href: `mailto:${contact.email}` },
  ]

  const heading = section?.title || CONTENT.heading

  return (
    <section id="contact" className="section-padding bg-ink">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow>{CONTENT.eyebrow}</SectionEyebrow>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-5"
          >
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-paper tracking-tight leading-tight">
              We Click.
            </p>
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-display-2 font-extrabold italic gold-text-gradient tracking-tight leading-tight mt-1">
              You Celebrate.
            </p>
            <span className="mt-3 block h-[3px] w-16 mx-auto rounded-full bg-gold-sweep" aria-hidden="true" />
          </motion.div>
        </div>

        <div className="mt-10 md:mt-16 grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-charcoal border border-white/10 rounded-3xl p-7 md:p-9"
          >
            <ContactForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <MapEmbed />

            <div className="bg-charcoal border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <p className="text-sm text-mist">{contact.address}</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <p className="text-sm text-mist">{contact.hours}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {quickContacts.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target={label === 'WhatsApp' ? '_blank' : undefined}
                  rel={label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                  className="bg-transparent border border-white/10 rounded-2xl flex flex-col items-center gap-2 py-5 text-paper hover:text-gold hover:border-gold/40 transition-colors duration-300"
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
