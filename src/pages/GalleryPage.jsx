import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Lightbox from '../components/ui/Lightbox'
import GalleryHero from '../modules/gallery/GalleryHero'
import GalleryFilter from '../modules/gallery/GalleryFilter'
import GalleryGrid from '../modules/gallery/GalleryGrid'
import { galleryAlbums, galleryItems } from '../data/gallery'

const SITE = 'https://www.vclickmedia.com'

const GALLERY_PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE}/gallery`,
  name: 'Photo Gallery — VClick Media & Events',
  description:
    'Photography portfolio featuring Desert, Events & Exhibitions, and Fashion & Lifestyle albums captured by VClick Media & Events across the UAE.',
  url: `${SITE}/gallery`,
  isPartOf: { '@id': `${SITE}/#website` },
  about: { '@id': `${SITE}/#organization` },
  inLanguage: 'en-AE',
}

const GALLERY_BREADCRUMBS = [
  { name: 'Home', url: SITE },
  { name: 'Photo Gallery', url: `${SITE}/gallery` },
]

function GalleryPage() {
  const [searchParams] = useSearchParams()
  const [activeAlbum, setActiveAlbum] = useState(searchParams.get('album') || 'All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const filteredItems = useMemo(() => {
    if (activeAlbum === 'All') return galleryItems
    return galleryItems.filter((item) => item.album === activeAlbum)
  }, [activeAlbum])

  const albumCounts = useMemo(() => {
    const counts = { All: galleryItems.length }
    galleryAlbums.slice(1).forEach((album) => {
      counts[album] = galleryItems.filter((item) => item.album === album).length
    })
    return counts
  }, [])

  const openLightbox = (item) => {
    const index = filteredItems.findIndex((current) => current.id === item.id)
    setLightboxIndex(index)
  }

  const handleAlbumChange = (album) => {
    setActiveAlbum(album)
    setLightboxIndex(null)
  }

  return (
    <>
      <SEOHead
        title="Photo Gallery | VClick Media & Events — Desert, Events & Fashion Photography UAE"
        description="Browse VClick's curated photography portfolio — Desert shoots, Events & Exhibitions, and Fashion & Lifestyle sessions captured across the UAE. 100+ professional images."
        url={`${SITE}/gallery`}
        canonical={`${SITE}/gallery`}
        breadcrumbs={GALLERY_BREADCRUMBS}
        schemas={[GALLERY_PAGE_SCHEMA]}
      />
      <Navbar />

      <main className="bg-ink text-paper min-h-screen">
        <GalleryHero totalCount={galleryItems.length} />

        <section className="section-container py-6 md:py-8">
          <div className="mb-7">
            <GalleryFilter
              albums={galleryAlbums}
              counts={albumCounts}
              activeAlbum={activeAlbum}
              onChange={handleAlbumChange}
            />
          </div>

          <GalleryGrid
            items={filteredItems}
            activeAlbum={activeAlbum}
            onOpenLightbox={openLightbox}
          />
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

export default GalleryPage
