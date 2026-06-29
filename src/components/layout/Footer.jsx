import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { InstagramIcon, FacebookIcon, LinkedinIcon, YoutubeIcon, TikTokIcon } from '../common/BrandIcons'
import GoldDivider from '../common/GoldDivider'
import { MapPin, Mail, Phone } from 'lucide-react'
import { animationVariants } from '../../hooks/useScrollReveal'
import { siteConfig } from '../../config/site.config'

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook:  FacebookIcon,
  linkedin:  LinkedinIcon,
  youtube:   YoutubeIcon,
  tiktok:    TikTokIcon,
}

const contactItems = [
  { icon: MapPin, text: siteConfig.contact.address,  href: null },
  { icon: Mail,   text: siteConfig.contact.email,    href: `mailto:${siteConfig.contact.email}` },
  { icon: Phone,  text: siteConfig.contact.phone,    href: `tel:${siteConfig.contact.phone.replace(/\s/g, '')}` },
]

const socialLinks = Object.entries(siteConfig.social)
  .filter(([, s]) => s.visible && s.url)
  .map(([key, s]) => ({ label: key.charAt(0).toUpperCase() + key.slice(1), href: s.url, icon: SOCIAL_ICONS[key] }))

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="bg-charcoal pt-10 md:pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

          {/* Brand column */}
          <motion.div
            variants={animationVariants.fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <Link to="/" className="inline-block">
              {siteConfig.logoUrl ? (
                <img
                  src={siteConfig.logoUrl}
                  alt={siteConfig.name}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl font-extrabold gold-text-gradient tracking-tight">
                  VClick
                </span>
              )}
            </Link>
            <p className="mt-4 text-sm text-mist leading-relaxed max-w-xs">
              {siteConfig.tagline}
            </p>

            <div className="flex items-center gap-3 mt-7 flex-wrap">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full glass-surface flex items-center justify-center text-paper hover:text-gold hover:border-gold/50 transition-colors duration-300"
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact column */}
          <motion.div
            variants={animationVariants.fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <h3 className="text-sm font-semibold text-paper uppercase tracking-wide mb-5">
              Get In Touch
            </h3>
            <ul className="space-y-4 text-sm text-mist">
              {contactItems.map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon size={15} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                  {href ? (
                    <a href={href} className="hover:text-gold transition-colors duration-300 leading-snug">
                      {text}
                    </a>
                  ) : (
                    <span className="leading-snug">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <GoldDivider className="my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-mist">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-gold transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-gold transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
