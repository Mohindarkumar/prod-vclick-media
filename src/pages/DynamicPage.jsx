import { useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SEOHead from '../components/common/SEOHead'

// Specialized section components — used when CMS section_type matches
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

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1'

async function fetchPageBySlug(slug) {
  const res = await fetch(`${API_URL}/pages/public/${slug}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load page')
  const json = await res.json()
  return json.data ?? null
}

// Generic fallback renderer for simple section types
function GenericSectionRenderer({ section }) {
  const { section_type, title, subtitle, content, image_url, video_url, cta_label, cta_href } = section

  switch (section_type) {
    case 'text':
    case 'rich_text':
      return (
        <div className="section-container py-16">
          {title && <h2 className="text-3xl font-bold text-paper mb-4">{title}</h2>}
          {subtitle && <p className="text-mist/70 mb-6">{subtitle}</p>}
          {content?.body && (
            <div className="prose prose-invert max-w-none text-mist/80" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.body) }} />
          )}
          {!content?.body && content?.text && (
            <p className="text-mist/80 leading-relaxed whitespace-pre-line">{content.text}</p>
          )}
        </div>
      )

    case 'image':
      return (
        <div className="section-container py-12">
          {title && <h2 className="text-2xl font-bold text-paper mb-6 text-center">{title}</h2>}
          {image_url && (
            <img src={image_url} alt={title ?? ''} className="w-full rounded-xl object-cover max-h-[500px]" />
          )}
          {subtitle && <p className="text-mist/60 text-sm mt-3 text-center">{subtitle}</p>}
        </div>
      )

    case 'video':
      return (
        <div className="section-container py-12">
          {title && <h2 className="text-2xl font-bold text-paper mb-6 text-center">{title}</h2>}
          {video_url && (
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-900">
              <iframe src={video_url} title={title ?? 'Video'} className="w-full h-full" allowFullScreen />
            </div>
          )}
        </div>
      )

    case 'cta':
      return (
        <div className="bg-gray-900 py-16">
          <div className="section-container text-center">
            {title && <h2 className="text-3xl font-bold text-paper mb-4">{title}</h2>}
            {subtitle && <p className="text-mist/70 mb-8 max-w-2xl mx-auto">{subtitle}</p>}
            {cta_label && cta_href && (
              <a href={cta_href} className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition-colors text-lg">
                {cta_label}
              </a>
            )}
          </div>
        </div>
      )

    case 'stats':
      return (
        <div className="section-container py-16">
          {title && <h2 className="text-3xl font-bold text-paper mb-10 text-center">{title}</h2>}
          {content?.items && (
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {content.items.map((stat, i) => (
                <div key={i} className="text-center">
                  <dd className="text-4xl font-extrabold text-gold">{stat.value}</dd>
                  <dt className="text-sm text-mist/60 mt-2 uppercase tracking-wider">{stat.label}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      )

    case 'custom':
      return (
        <div className="section-container py-12">
          {title && <h2 className="text-2xl font-bold text-paper mb-4">{title}</h2>}
          {subtitle && <p className="text-mist/70 mb-6">{subtitle}</p>}
          {content?.html && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.html) }} />}
        </div>
      )

    default:
      return null
  }
}

function SectionRenderer({ section }) {
  if (!section.is_visible) return null

  switch (section.section_type) {
    case 'hero':         return <Hero section={section} />
    case 'about':        return <AboutSection section={section} />
    case 'services':     return <ServicesSection section={section} />
    case 'why':          return <WhyChooseUs section={section} />
    case 'gallery':      return <PortfolioSection section={section} />
    case 'showreel':
    case 'video':        return <VideoShowreel section={section} />
    case 'process':      return <EventProcess section={section} />
    case 'testimonials': return <TestimonialsSection />
    case 'clients':      return <ClientsLogoStrip />
    case 'pricing':      return <PricingSection section={section} />
    case 'faq':          return <FAQSection section={section} />
    case 'contact':      return <ContactSection section={section} />
    default:             return <GenericSectionRenderer section={section} />
  }
}

export default function DynamicPage() {
  const { slug } = useParams()

  const { data: page, isLoading, isError } = useQuery({
    queryKey: ['public-page', slug],
    queryFn: () => fetchPageBySlug(slug),
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-ink flex items-center justify-center text-center px-4">
          <div>
            <p className="text-mist/50 text-sm mb-3">Unable to load this page. Please check your connection.</p>
            <a href="/" className="text-gold text-sm hover:underline">Return home</a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (page === null) {
    return <Navigate to="/" replace />
  }

  const seo = page.seo ?? {}
  const sortedSections = [...(page.sections ?? [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  )

  return (
    <>
      <SEOHead
        title={seo.meta_title || page.title}
        description={seo.meta_description || page.subtitle}
      />
      <Navbar />
      <main className="bg-ink text-paper min-h-screen pt-20">
        {sortedSections.length === 0 ? (
          <div className="section-container py-24 text-center">
            <h1 className="text-4xl font-bold text-paper mb-4">{page.title}</h1>
            {page.subtitle && <p className="text-mist/70 text-lg">{page.subtitle}</p>}
          </div>
        ) : (
          sortedSections.map((section) => (
            <SectionRenderer key={section.page_section_id} section={section} />
          ))
        )}
      </main>
      <Footer />
    </>
  )
}
