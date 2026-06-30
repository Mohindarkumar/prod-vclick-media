import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Play, X } from 'lucide-react'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { homeSectionContents } from '../../data/home_section_contents'

const { showreel: CONTENT } = homeSectionContents

const STATIC_BG = '/uploads/images/gallery/events-exhibitions/DSC_4108.webp'

const isTouchDevice = typeof window !== 'undefined'
  ? window.matchMedia('(pointer: coarse)').matches
  : false

function isEmbedUrl(url) {
  return url && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com'))
}

function toEmbedUrl(url) {
  if (!url) return null
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
  const vmMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}?autoplay=1`
  return url
}

function VideoShowreel({ section = null }) {
  const sectionRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const disableParallax = prefersReducedMotion || isTouchDevice

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], disableParallax ? [0, 0] : [-40, 40])

  const bgImage  = section?.image_url || STATIC_BG
  const videoUrl = section?.video_url || null
  const heading  = section?.title     || CONTENT.heading
  const subtext  = section?.subtitle  || CONTENT.subtitle
  const embedUrl = toEmbedUrl(videoUrl)
  const useIframe = isEmbedUrl(videoUrl)

  return (
    <section id="showreel" ref={sectionRef} className="relative section-padding bg-ink overflow-hidden">
      <motion.div
        style={{ y: parallaxY }}
        className="absolute inset-0 bg-gradient-to-b from-charcoal via-ink to-ink"
        aria-hidden="true"
      >
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/70 to-ink" />

      <div className="relative z-10 section-container text-center">
        <SectionEyebrow>{CONTENT.eyebrow}</SectionEyebrow>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-5 text-3xl md:text-h2 font-extrabold text-paper"
        >
          {heading}
        </motion.h2>

        <motion.button
          type="button"
          onClick={() => videoUrl && setIsModalOpen(true)}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          whileHover={{ scale: videoUrl ? 1.06 : 1 }}
          aria-label="Play showreel video"
          disabled={!videoUrl}
          className={`group relative mx-auto mt-12 w-24 h-24 md:w-28 md:h-28 rounded-full bg-gold-sweep shadow-gold-lg flex items-center justify-center ${!videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="absolute inset-0 rounded-full bg-gold-sweep animate-ping opacity-20" aria-hidden="true" />
          <Play size={32} className="text-ink fill-ink ml-1" />
        </motion.button>

        <p className="mt-8 text-body-lg text-mist">{subtext}</p>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label="Showreel video player"
            onClick={() => setIsModalOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close video"
              className="absolute top-5 right-5 text-paper/80 hover:text-gold p-2"
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-charcoal"
              onClick={(e) => e.stopPropagation()}
            >
              {useIframe ? (
                <iframe
                  src={embedUrl}
                  title={heading}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                videoUrl ? (
                  <video
                    className="w-full h-full"
                    controls
                    autoPlay
                    playsInline
                    src={videoUrl}
                  >
                    Your browser does not support embedded video.
                  </video>
                ) : null
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default VideoShowreel
