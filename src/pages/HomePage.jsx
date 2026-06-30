import SEOHead from '../components/common/SEOHead'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../modules/hero/Hero'
import AboutSection from '../modules/about/AboutSection'
import ServicesSection from '../modules/services/ServicesSection'
import WhyChooseUs from '../modules/why-choose-us/WhyChooseUs'
import PortfolioSection from '../modules/portfolio/PortfolioSection'
import VideoShowreel from '../modules/showreel/VideoShowreel'
import EventProcess from '../modules/process/EventProcess'
import TestimonialsSection from '../modules/testimonials/TestimonialsSection'
import ClientsLogoStrip from '../modules/clients/ClientsLogoStrip'
import PricingSection from '../modules/pricing/PricingSection'
import FAQSection from '../modules/faq/FAQSection'
import ContactSection from '../modules/contact/ContactSection'
import { homePage } from '../data/pages'
import { siteConfig } from '../config/site.config'
import { services } from '../data/services'

const SITE = 'https://www.vclickmedia.ae'

// Service ItemList — helps AI engines and search understand what we offer
const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'VClick Media & Events — Services',
  description:
    'Creative media production and event management services offered by VClick across the UAE.',
  itemListElement: services.map((svc, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      '@id': `${SITE}/#service-${svc.id}`,
      name: svc.title,
      description: svc.description,
      provider: { '@id': `${SITE}/#organization` },
      areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
    },
  })),
}

const VISIBLE = Object.fromEntries(
  homePage.sections
    .filter((s) => s.isVisible)
    .map((s) => [s.type, true])
)

function HomePage() {
  return (
    <>
      <SEOHead
        title={`${siteConfig.name} — ${siteConfig.tagline}`}
        description="Premium photography, videography and full-service event production across the UAE. Weddings, corporate events, exhibitions and brand activations."
        url={SITE}
        canonical={`${SITE}/`}
        phone={siteConfig.contact.phone}
        socialLinks={Object.values(siteConfig.social).filter((s) => s.visible && s.url).map((s) => s.url)}
        schemas={[servicesSchema]}
      />
      <Navbar />

      <main className="bg-ink text-paper">
        <Hero />
        {VISIBLE.about        && <AboutSection />}
        {VISIBLE.services     && <ServicesSection />}
        {VISIBLE.why          && <WhyChooseUs />}
        {VISIBLE.gallery      && <PortfolioSection />}
        {VISIBLE.showreel     && <VideoShowreel />}
        {VISIBLE.process      && <EventProcess />}
        {VISIBLE.testimonials && <TestimonialsSection />}
        {VISIBLE.clients      && <ClientsLogoStrip />}
        {VISIBLE.pricing      && <PricingSection />}
        {VISIBLE.faq          && <FAQSection />}
        {VISIBLE.contact      && <ContactSection />}
      </main>

      <Footer />
    </>
  )
}

export default HomePage
