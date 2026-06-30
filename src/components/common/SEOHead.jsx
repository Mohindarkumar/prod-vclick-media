import { Helmet } from 'react-helmet-async'

const SITE = 'https://www.vclickmedia.ae'
const DEFAULT_TITLE =
  'VClick Media & Events | Premium Photography, Videography & Event Management in Ajman, UAE'
const DEFAULT_DESCRIPTION =
  'VClick Media & Events delivers cinematic photography, videography and full-service event production for corporate clients, weddings, exhibitions and brand activations across the UAE. Based in Ajman Free Zone.'
const DEFAULT_OG_IMAGE = `${SITE}/og-image.jpg`

const SOCIAL_LINKS = [
  'https://www.instagram.com/vclickmedia',
  'https://www.facebook.com/vclickmedia',
  'https://www.linkedin.com/company/vclickmedia',
  'https://www.youtube.com/@vclickmedia',
]

// Stable Organisation node — referenced by @id from other schemas
const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'VClick Media & Events',
  url: SITE,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE}/uploads/images/logos/logo.png`,
    width: 300,
    height: 100,
  },
  image: DEFAULT_OG_IMAGE,
  description:
    'UAE-based creative media production house and event management company delivering cinematic photography, videography, drone coverage and full-service event production across all seven Emirates.',
  telephone: '+971-50-000-0000',
  email: 'hello@vclickmedia.ae',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ajman Free Zone',
    addressLocality: 'Ajman',
    addressRegion: 'Ajman',
    addressCountry: 'AE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.4052,
    longitude: 55.5136,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  areaServed: {
    '@type': 'Country',
    name: 'United Arab Emirates',
  },
  sameAs: SOCIAL_LINKS,
  foundingDate: '2016',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 10 },
  knowsAbout: [
    'Photography',
    'Videography',
    'Wedding Photography',
    'Corporate Event Coverage',
    'Drone Photography',
    'Event Management',
    'Brand Activations',
    'Fashion Photography',
  ],
}

// WebSite schema — enables sitelinks search and brand signals
const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  name: 'VClick Media & Events',
  alternateName: 'VClick',
  url: SITE,
  description: DEFAULT_DESCRIPTION,
  publisher: { '@id': `${SITE}/#organization` },
  inLanguage: 'en-AE',
}

// LocalBusiness — always emitted; enriched with business-specific fields
function buildLocalBusiness(phone, socialLinks) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${SITE}/#business`,
    name: 'VClick Media & Events',
    image: DEFAULT_OG_IMAGE,
    url: SITE,
    telephone: phone || '+971-50-000-0000',
    email: 'hello@vclickmedia.ae',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ajman Free Zone',
      addressLocality: 'Ajman',
      addressRegion: 'Ajman',
      postalCode: '',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.4052,
      longitude: 55.5136,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Dubai' },
      { '@type': 'City', name: 'Abu Dhabi' },
      { '@type': 'City', name: 'Sharjah' },
      { '@type': 'City', name: 'Ajman' },
      { '@type': 'City', name: 'Ras Al Khaimah' },
      { '@type': 'City', name: 'Umm Al Quwain' },
      { '@type': 'City', name: 'Fujairah' },
    ],
    priceRange: 'AED 1,500–10,000+',
    currenciesAccepted: 'AED',
    paymentAccepted: 'Cash, Bank Transfer',
    description:
      'UAE-based creative media production house delivering cinematic photography, videography, drone coverage and full-service event production across all seven Emirates. Based in Ajman Free Zone.',
    sameAs: socialLinks?.length ? socialLinks : SOCIAL_LINKS,
  }
}

// BreadcrumbList schema builder
function buildBreadcrumb(breadcrumbs) {
  if (!breadcrumbs?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

/**
 * SEOHead — per-route helmet with structured data.
 *
 * Props:
 *   title        string   Page <title>
 *   description  string   Meta description (also OG/Twitter)
 *   image        string   OG image URL (absolute)
 *   url          string   Canonical URL (also og:url)
 *   canonical    string   Explicit canonical override (defaults to url)
 *   breadcrumbs  Array    [{ name, url }] — emits BreadcrumbList JSON-LD
 *   schemas      Array    Additional JSON-LD objects to inject alongside defaults
 *   noIndex      bool     Emit noindex,nofollow robots meta
 *   phone        string   Telephone for LocalBusiness schema
 *   socialLinks  Array    sameAs URLs for LocalBusiness schema
 */
function SEOHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
  url = SITE,
  canonical,
  breadcrumbs,
  schemas,
  noIndex = false,
  phone,
  socialLinks,
}) {
  const canonicalUrl = canonical || url
  const localBusiness = buildLocalBusiness(phone, socialLinks)
  const breadcrumbSchema = buildBreadcrumb(breadcrumbs)

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      }
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph ─────────────────────────────────────────────────── */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="VClick Media & Events" />
      <meta property="og:locale" content="en_AE" />

      {/* Twitter Card ───────────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@vclickmedia" />

      {/* JSON-LD structured data ─────────────────────────────────────── */}
      <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
      <script type="application/ld+json">{JSON.stringify(ORG_SCHEMA)}</script>
      <script type="application/ld+json">{JSON.stringify(WEBSITE_SCHEMA)}</script>
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
      {schemas?.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  )
}

export default SEOHead
