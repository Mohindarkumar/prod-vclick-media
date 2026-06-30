import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Camera,
  Video,
  Aperture,
  ArrowRight,
  Award,
  Globe,
  Users,
  Clapperboard,
  Images,
} from 'lucide-react'
import SEOHead from '../components/common/SEOHead'
import { portfolioSectionContents } from '../data/portfolio_section_contents'

const SITE = 'https://www.vclickmedia.ae'
const PC   = portfolioSectionContents

const PORTFOLIO_PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE}/portfolio`,
  name: PC.seo.schemaName,
  description: PC.seo.schemaDescription,
  url: `${SITE}/portfolio`,
  isPartOf: { '@id': `${SITE}/#website` },
  about: { '@id': `${SITE}/#organization` },
  inLanguage: 'en-AE',
}

const PORTFOLIO_BREADCRUMBS = [
  { name: 'Home', url: SITE },
  { name: PC.hero.breadcrumbCurrent, url: `${SITE}/portfolio` },
]
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import GoldDivider from '../components/common/GoldDivider'
import Button from '../components/common/Button'
import AnimatedCounter from '../components/common/AnimatedCounter'
import PortfolioGrid from '../modules/portfolio/PortfolioGrid'
import PortfolioFilter from '../modules/portfolio/PortfolioFilter'
import Lightbox from '../components/ui/Lightbox'
import {
  portfolioCategories as staticCategories,
  portfolioItems as staticItems,
} from '../data/portfolio'

const SPAN_MAP = { portrait: 'row-span-2', landscape: 'row-span-1', square: 'row-span-1' }
const FALLBACK_SPANS = ['row-span-2', 'row-span-1', 'row-span-1', 'row-span-2', 'row-span-1', 'row-span-2']

const STAT_ICONS = [Award, Camera, Users, Globe]
const STATS = PC.stats.map((s, i) => ({ ...s, icon: STAT_ICONS[i] ?? Award }))

const CATEGORY_ICONS = [Camera, Clapperboard, Aperture, Globe]
const SERVICE_CATEGORIES = PC.specialties.categories.map((cat, i) => ({
  ...cat,
  icon: CATEGORY_ICONS[i] ?? Camera,
}))

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const categories = staticCategories

  const portfolioItems = staticItems

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return portfolioItems
    return portfolioItems.filter((item) => item.categories.includes(activeCategory))
  }, [portfolioItems, activeCategory])

  const openLightbox = (item) => {
    const index = filteredItems.findIndex((current) => current.id === item.id)
    setLightboxIndex(index)
  }

  return (
    <>
      <SEOHead
        title={PC.seo.title}
        description={PC.seo.description}
        url={`${SITE}/portfolio`}
        canonical={`${SITE}/portfolio`}
        breadcrumbs={PORTFOLIO_BREADCRUMBS}
        schemas={[PORTFOLIO_PAGE_SCHEMA]}
      />
      <Navbar />

      <main className="bg-ink text-paper min-h-screen">
        {/* ══════════════════════════════════════════════════════════════
            HERO — Editorial style with animated background
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative pt-24 pb-8 md:pt-32 md:pb-10 bg-ink overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.06]"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,175,55,1) 0%, rgba(255,183,3,0.5) 40%, transparent 70%)',
              }}
            />
            {/* Diagonal grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 0px, transparent 50%)',
                backgroundSize: '36px 36px',
              }}
            />
          </div>

          <div className="section-container relative z-10">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              aria-label="Breadcrumb"
              className="mb-5"
            >
              <ol className="flex items-center gap-2 text-xs text-mist/50">
                <li>
                  <Link to="/" className="hover:text-gold transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={11} className="opacity-40" />
                </li>
                <li aria-current="page" className="text-gold font-semibold tracking-wider">
                  Portfolio
                </li>
              </ol>
            </motion.nav>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
                <motion.span
                  className="block h-px bg-gold-sweep"
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  aria-hidden="true"
                />
                <span className="eyebrow">{PC.hero.eyebrow}</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-h1 md:text-display-2 font-extrabold text-paper leading-[1.04] tracking-tight"
              >
                Our{' '}
                <span className="relative inline-block">
                  <span className="gold-text-gradient">Portfolio</span>
                  <GoldDivider variant="underline" className="absolute -bottom-1.5 left-0 w-full" />
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-5 text-lg text-mist/75 leading-relaxed max-w-xl">
                {PC.hero.subtitle}
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 flex items-center gap-4 flex-wrap">
                <Button as={Link} to="/gallery" variant="ghost" icon={Images} iconPosition="left">
                  {PC.hero.ctaGallery}
                </Button>
                <Button as={Link} to="/videos" variant="ghost" icon={Video} iconPosition="left">
                  {PC.hero.ctaVideos}
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <GoldDivider className="mt-8 md:mt-10" />
        </section>

        {/* ══════════════════════════════════════════════════════════════
            STATS — Animated counters
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-8 md:py-12 bg-charcoal border-y border-white/5" aria-label="Key statistics">
          <div className="section-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
              {STATS.map(({ target, suffix, label, icon: Icon }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center">
                    <Icon size={18} className="text-gold" aria-hidden="true" />
                  </div>
                  <AnimatedCounter target={target} suffix={suffix} label={label} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SERVICES GRID — What we do, visually
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-10 md:py-14 bg-ink" aria-labelledby="services-heading">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-xl mx-auto mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-6 bg-gold-sweep" aria-hidden="true" />
                <span className="eyebrow">{PC.specialties.eyebrow}</span>
                <span className="h-px w-6 bg-gold-sweep" aria-hidden="true" />
              </div>
              <h2 id="services-heading" className="text-h3 md:text-h2 font-extrabold text-paper leading-tight">
                {PC.specialties.headingBase} {PC.specialties.headingConnector}{' '}
                <span className="gold-text-gradient">{PC.specialties.headingHighlight}</span>
              </h2>
              <p className="mt-4 text-mist/65 leading-relaxed">
                {PC.specialties.subtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {SERVICE_CATEGORIES.map(({ title, desc, icon: Icon, filter, gradient }, i) => (
                <motion.button
                  key={title}
                  type="button"
                  onClick={() => {
                    setActiveCategory(filter)
                    document.getElementById('portfolio-grid')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group text-left p-6 rounded-2xl border border-white/8 bg-charcoal hover:border-gold/35 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  style={{ transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,175,55,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} border border-white/8 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={20} className="text-gold" aria-hidden="true" />
                  </div>
                  <h3 className="text-paper font-bold text-sm md:text-base mb-2 group-hover:text-gold/90 transition-colors duration-200">
                    {title}
                  </h3>
                  <p className="text-mist/55 text-xs md:text-sm leading-relaxed">
                    {desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-gold/50 group-hover:text-gold text-xs font-medium transition-colors duration-200">
                    <span>{PC.specialties.viewWorkLabel}</span>
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            PORTFOLIO GRID — Filterable masonry
        ══════════════════════════════════════════════════════════════ */}
        <section
          id="portfolio-grid"
          className="py-8 md:py-12 bg-charcoal border-t border-white/5"
          aria-labelledby="grid-heading"
        >
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="text-center max-w-xl mx-auto mb-10"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-6 bg-gold-sweep" aria-hidden="true" />
                <span className="eyebrow">{PC.grid.eyebrow}</span>
                <span className="h-px w-6 bg-gold-sweep" aria-hidden="true" />
              </div>
              <h2 id="grid-heading" className="text-h3 md:text-h2 font-extrabold text-paper leading-tight">
                {PC.grid.headingBase}{' '}
                <span className="gold-text-gradient">{PC.grid.headingHighlight}</span>
              </h2>
            </motion.div>

            <div className="mb-8">
              <PortfolioFilter
                categories={categories}
                activeCategory={activeCategory}
                onChange={(cat) => {
                  setActiveCategory(cat)
                  setLightboxIndex(null)
                }}
              />
            </div>

            <PortfolioGrid items={filteredItems} onItemClick={openLightbox} />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            CTA — Cross-page links to Gallery and Videos
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-12 md:py-16 bg-ink" aria-labelledby="cta-heading">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-6 bg-gold-sweep" aria-hidden="true" />
                <span className="eyebrow">{PC.cta.eyebrow}</span>
                <span className="h-px w-6 bg-gold-sweep" aria-hidden="true" />
              </div>
              <h2 id="cta-heading" className="text-h3 md:text-h2 font-extrabold text-paper">
                {PC.cta.headingBase}{' '}
                <span className="gold-text-gradient">{PC.cta.headingHighlight}</span>
              </h2>
              <p className="mt-4 text-mist/65 leading-relaxed">
                {PC.cta.subtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {/* Photo Gallery CTA */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Link
                  to="/gallery"
                  className="group flex flex-col gap-5 p-7 rounded-2xl border border-white/10 bg-charcoal hover:border-gold/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  style={{ transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 40px rgba(212,175,55,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Camera size={24} className="text-gold" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-paper font-bold text-lg group-hover:text-gold transition-colors duration-200 mb-1.5">
                      {PC.cta.gallery.heading}
                    </h3>
                    <p className="text-mist/55 text-sm leading-relaxed">
                      {PC.cta.gallery.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gold/60 group-hover:text-gold text-sm font-semibold transition-colors duration-200 mt-auto">
                    <span>{PC.cta.gallery.linkLabel}</span>
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </div>
                </Link>
              </motion.div>

              {/* Video Gallery CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.18 }}
              >
                <Link
                  to="/videos"
                  className="group flex flex-col gap-5 p-7 rounded-2xl border border-white/10 bg-charcoal hover:border-gold/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  style={{ transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 40px rgba(212,175,55,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Video size={24} className="text-gold" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-paper font-bold text-lg group-hover:text-gold transition-colors duration-200 mb-1.5">
                      {PC.cta.video.heading}
                    </h3>
                    <p className="text-mist/55 text-sm leading-relaxed">
                      {PC.cta.video.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gold/60 group-hover:text-gold text-sm font-semibold transition-colors duration-200 mt-auto">
                    <span>{PC.cta.video.linkLabel}</span>
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="text-center mt-8"
            >
              <p className="text-mist/50 text-sm mb-5">
                {PC.cta.bottomPrompt}
              </p>
              <Button as="a" href="/#contact" variant="primary" icon={ArrowRight}>
                {PC.cta.bottomCta}
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Lightbox
        items={filteredItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      <Footer />
    </>
  )
}

export default PortfolioPage
