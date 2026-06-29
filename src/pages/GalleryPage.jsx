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
        title="Gallery | VClick Media & Events — Premium Photography & Videography UAE"
        description="Browse VClick's gallery of cinematic photography, videography, and event production work — weddings, corporate events, fashion, drone shots and more across the UAE."
        url="https://www.vclickmedia.ae/gallery"
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
