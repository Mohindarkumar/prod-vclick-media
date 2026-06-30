import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SEOHead from '../components/common/SEOHead'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import VideoGalleryHero from '../modules/video-gallery/VideoGalleryHero'
import VideoGrid from '../modules/video-gallery/VideoGrid'
import VideoModal from '../modules/video-gallery/VideoModal'
import GalleryFilter from '../modules/gallery/GalleryFilter'
import { videos as allVideos, videoCategories } from '../data/videos'
import { videoSectionContents } from '../data/video_section_contents'

const { search: SEARCH, seo: SEO_CONTENT } = videoSectionContents

const SITE = 'https://www.vclickmedia.com'

// VideoObject schemas for each static video
const videoSchemas = allVideos.map((v) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: v.title,
  description: v.description,
  thumbnailUrl: v.thumbnail_url ? `${SITE}${v.thumbnail_url}` : undefined,
  contentUrl: v.video_url ? `${SITE}${v.video_url}` : undefined,
  uploadDate: '2025-01-01',
  publisher: { '@id': `${SITE}/#organization` },
  inLanguage: 'en-AE',
}))

const VIDEO_PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE}/videos`,
  name: 'Video Gallery — VClick Media & Events',
  description:
    'Cinematic videography collection including wedding films, corporate event videos, and fashion reels captured by VClick Media & Events across the UAE.',
  url: `${SITE}/videos`,
  isPartOf: { '@id': `${SITE}/#website` },
  about: { '@id': `${SITE}/#organization` },
  inLanguage: 'en-AE',
}

const VIDEO_BREADCRUMBS = [
  { name: 'Home', url: SITE },
  { name: 'Video Gallery', url: `${SITE}/videos` },
]

function VideoGalleryPage() {
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeVideo, setActiveVideo] = useState(null)

  const categories = videoCategories

  const categoryCounts = useMemo(() => {
    const counts = { All: allVideos.length }
    categories.slice(1).forEach((cat) => {
      counts[cat] = allVideos.filter((v) => v.category === cat).length
    })
    return counts
  }, [categories])

  const filteredVideos = useMemo(() => {
    let result = allVideos
    if (activeCategory !== 'All') {
      result = result.filter((v) => v.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          (v.description && v.description.toLowerCase().includes(q)) ||
          (v.category && v.category.toLowerCase().includes(q))
      )
    }
    return result
  }, [activeCategory, searchQuery])

  const featuredVideos = useMemo(
    () => filteredVideos.filter((v) => v.is_featured),
    [filteredVideos]
  )

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setSearchQuery('')
    setActiveVideo(null)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setActiveCategory('All')
  }

  const clearSearch = () => setSearchQuery('')

  return (
    <>
      <SEOHead
        title={SEO_CONTENT.title}
        description={SEO_CONTENT.description}
        url={`${SITE}/videos`}
        canonical={`${SITE}/videos`}
        breadcrumbs={VIDEO_BREADCRUMBS}
        schemas={[VIDEO_PAGE_SCHEMA, ...videoSchemas]}
      />
      <Navbar />

      <main className="bg-ink text-paper min-h-screen">
        <VideoGalleryHero totalCount={allVideos.length} />

        <section className="section-container py-6 md:py-8">
          {/* ── Search bar ─────────────────────────────────────────────── */}
          <div className="mb-8 max-w-md relative group">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-mist/40 group-focus-within:text-gold pointer-events-none transition-colors duration-300"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={SEARCH.placeholder}
              aria-label={SEARCH.ariaLabel}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-11 py-3 text-sm text-paper placeholder-mist/35
                focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/40
                transition-all duration-300"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  type="button"
                  onClick={clearSearch}
                  aria-label={SEARCH.clearAriaLabel}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                    bg-white/10 hover:bg-gold/20 flex items-center justify-center
                    text-mist/55 hover:text-gold transition-colors duration-200"
                >
                  <X size={12} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ── Category filter — hidden while searching ──────────────── */}
          <AnimatePresence>
            {!searchQuery && categories.length > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-10 overflow-hidden"
              >
                <GalleryFilter
                  albums={categories}
                  counts={categoryCounts}
                  activeAlbum={activeCategory}
                  onChange={handleCategoryChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Search result label ───────────────────────────────────── */}
          <AnimatePresence>
            {searchQuery && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="mb-8 text-sm text-mist/55"
              >
                {filteredVideos.length === 0 ? (
                  <span>{SEARCH.noResults}</span>
                ) : (
                  <span>
                    <span className="text-gold font-semibold">{filteredVideos.length}</span>
                    {` ${filteredVideos.length === 1 ? SEARCH.resultSingular : SEARCH.resultPlural} `}
                    <span className="text-paper/70">&ldquo;{searchQuery}&rdquo;</span>
                  </span>
                )}
              </motion.p>
            )}
          </AnimatePresence>

          <VideoGrid
            videos={filteredVideos}
            isLoading={false}
            isError={false}
            activeCategory={searchQuery ? `search:${searchQuery}` : activeCategory}
            onPlay={setActiveVideo}
            featuredVideos={!searchQuery && activeCategory === 'All' ? featuredVideos : []}
          />
        </section>
      </main>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />

      <Footer />
    </>
  )
}

export default VideoGalleryPage
