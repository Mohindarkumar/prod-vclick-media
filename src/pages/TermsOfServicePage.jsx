import { motion } from 'framer-motion'
import DOMPurify from 'dompurify'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SEOHead from '../components/common/SEOHead'
import { FileText } from 'lucide-react'
import { termsSectionContents } from '../data/terms_section_contents'

const { seo: SEO, hero: HERO, content: CONTENT } = termsSectionContents

const BREADCRUMBS = [
  { name: 'Home', url: 'https://www.vclickmedia.com' },
  { name: HERO.heading, url: SEO.url },
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <SEOHead
        title={SEO.title}
        description={SEO.description}
        url={SEO.url}
        canonical={SEO.url}
        noIndex={false}
        breadcrumbs={BREADCRUMBS}
      />
      <Navbar />

      <section className="pt-32 pb-14 bg-charcoal">
        <div className="section-container">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
              <FileText size={20} className="text-gold" />
            </div>
            <span className="text-xs text-gold uppercase tracking-widest font-semibold">{HERO.tagLabel}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-paper">{HERO.heading}</h1>
          <p className="mt-3 text-mist text-sm">{HERO.lastUpdated}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="section-container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(CONTENT) }}
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}
