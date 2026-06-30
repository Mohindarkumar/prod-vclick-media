import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Video, Play } from 'lucide-react'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import GoldDivider from '../../components/common/GoldDivider'

const SHOWREEL_SLIDES = [
  '/uploads/images/gallery/events-exhibitions/DSC07433.webp',
  '/uploads/images/gallery/fashion-lifestyle/SIB-1002.webp',
  '/uploads/images/gallery/events-exhibitions/DSC03817.webp',
  '/uploads/images/homepage/DSC00897.webp',
  '/uploads/images/gallery/events-exhibitions/DSC_4108.webp',
  '/uploads/images/gallery/fashion-lifestyle/DSC04817.webp',
  '/uploads/images/homepage/DSC05604.webp',
  '/uploads/images/gallery/events-exhibitions/DSC03148.webp',
  '/uploads/images/gallery/events-exhibitions/DSC06759.webp',
  '/uploads/images/homepage/DSC06454.webp',
  '/uploads/images/gallery/events-exhibitions/DSC_4230.webp',
  '/uploads/images/gallery/events-exhibitions/1000417901.webp',
]

function ShowreelCard({ item, index }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const href = buildLink(item.link_type, item.category)

  useEffect(() => {
    const id = setInterval(() => setActiveSlide(i => (i + 1) % SHOWREEL_SLIDES.length), 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-charcoal hover:border-gold/35 transition-all duration-[400ms] flex flex-col h-[420px] sm:h-[500px] md:h-[560px] w-full"
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 40px rgba(212,175,55,0.13)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '' }}
    >
      {/* ── 70 % — animated showreel ───────────────────── */}
      <div className="relative overflow-hidden" style={{ flex: '0 0 70%' }}>
        <AnimatePresence mode="sync">
          <motion.img
            key={activeSlide}
            src={SHOWREEL_SLIDES[activeSlide]}
            alt="VClick showreel"
            loading="lazy"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* cinematic vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-black/10 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent h-1/3" />

        {/* top-left SHOWREEL badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gold bg-black/50 backdrop-blur-sm border border-gold/40 rounded-full px-3 py-1">
            <Play size={9} fill="currentColor" />
            Showreel
          </span>
        </div>

        {/* progress bar */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-1">
          {SHOWREEL_SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActiveSlide(i)}
              className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${i === activeSlide ? 'bg-gold' : 'bg-white/30'}`}
            />
          ))}
        </div>

        {/* stat pill */}
        {item.stat_value && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-black/50 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1 text-center">
              <p className="text-gold font-extrabold text-sm leading-none">{item.stat_value}</p>
              {item.stat_label && (
                <p className="text-white/55 text-[9px] uppercase tracking-wide leading-none mt-0.5">{item.stat_label}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── 30 % — text ───────────────────────────────── */}
      <div className="p-5 flex flex-col justify-center" style={{ flex: '0 0 30%' }}>
        {item.category && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gold mb-1">
            {item.category}
          </span>
        )}
        <h3 className="text-lg md:text-xl font-bold text-paper leading-snug group-hover:text-gold/90 transition-colors duration-200">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-mist/55 text-sm mt-2 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
        {href && (
          <Link
            to={href}
            className="inline-flex items-center gap-1.5 mt-4 text-gold/60 group-hover:text-gold text-xs font-semibold transition-colors duration-200"
          >
            <Camera size={12} /> View Photos
            <ArrowRight size={11} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}

const STATIC_WORKS = [
  {
    featured_work_id: 1,
    title: 'Photography',
    subtitle: 'Professional Photography · UAE',
    description: 'Every frame tells a story. From brand shoots and product launches to portraits and live events, we capture the moments that matter most — beautifully lit, thoughtfully composed, and delivered with the detail your audience deserves.',
    category: 'Photography',
    cover_image_url: '/uploads/images/gallery/fashion-lifestyle/SIB-1002.webp',
    image_position: 'object-top',
    stat_label: 'Photos',
    stat_value: '450+',
    link_type: 'gallery',
  },
  {
    featured_work_id: 2,
    title: 'Videography',
    subtitle: 'Cinematic Videography · UAE',
    description: 'Cinematic video production for campaigns, events, and brand stories — from single-camera shoots to full multi-crew productions.',
    category: 'Videography',
    cover_image_url: '/uploads/images/gallery/events-exhibitions/DSC03817.webp',
    stat_label: 'Films',
    stat_value: '200+',
    link_type: 'video',
  },
  {
    featured_work_id: 3,
    title: 'Events',
    subtitle: 'Full-Service Events · UAE',
    description: 'Complete event planning and coverage — from corporate conferences and exhibitions to brand activations and private celebrations.',
    category: 'Corporate',
    cover_image_url: '/uploads/images/gallery/events-exhibitions/DSC03148.webp',
    stat_label: 'Events',
    stat_value: '500+',
    link_type: 'video',
  },
]

function buildLink(linkType, category) {
  if (linkType === 'gallery') return category ? `/gallery?album=${encodeURIComponent(category)}` : '/gallery'
  if (linkType === 'video')   return category ? `/videos?category=${encodeURIComponent(category)}` : '/videos'
  return null
}

const CATEGORY_COLORS = {
  Wedding:   'from-rose-500/30 to-pink-600/20',
  Corporate: 'from-blue-500/30 to-indigo-600/20',
  Fashion:   'from-purple-500/30 to-violet-600/20',
  Drone:     'from-amber-500/30 to-orange-600/20',
  Product:   'from-emerald-500/30 to-teal-600/20',
  Concert:   'from-red-500/30 to-rose-600/20',
  Sports:    'from-cyan-500/30 to-sky-600/20',
  Portrait:  'from-yellow-500/30 to-amber-600/20',
}

const cardVariants = {
  hidden:  { opacity: 0, y: 32, filter: 'blur(4px)' },
  visible: (i) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

function WorkCard({ item, index, isFeatured = false }) {
  const href = buildLink(item.link_type, item.category)
  const gradClass = CATEGORY_COLORS[item.category] ?? 'from-gold/20 to-amber-600/10'

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-charcoal
        hover:border-gold/35 transition-all duration-[400ms]
        ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}
      `}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 40px rgba(212,175,55,0.13)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '' }}
    >
      {/* Cover image */}
      <div className={`relative overflow-hidden ${isFeatured ? 'h-52 md:h-80' : 'h-40 md:h-48'}`}>
        <img
          src={item.cover_image_url}
          alt={item.title}
          loading="lazy"
          className={`w-full h-full object-cover ${item.image_position ?? 'object-center'} group-hover:scale-[1.04] transition-transform duration-700 ease-out`}
        />
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${gradClass} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent" />

        {/* Category badge */}
        {item.category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gold bg-black/40 backdrop-blur-sm border border-gold/30 rounded-full px-3 py-1">
              {item.category}
            </span>
          </div>
        )}

        {/* Stat pill */}
        {item.stat_value && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-black/50 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1 text-center">
              <p className="text-gold font-extrabold text-sm leading-none">{item.stat_value}</p>
              {item.stat_label && (
                <p className="text-white/55 text-[9px] uppercase tracking-wide leading-none mt-0.5">{item.stat_label}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="p-5">
        <p className="text-mist/55 text-xs mb-1">{item.subtitle}</p>
        <h3 className={`text-paper font-bold leading-snug group-hover:text-gold/90 transition-colors duration-200 ${isFeatured ? 'text-lg md:text-xl' : 'text-base'}`}>
          {item.title}
        </h3>
        {item.description && (
          <p className={`text-mist/55 text-sm mt-2 leading-relaxed line-clamp-2 ${!isFeatured && 'hidden md:block'}`}>
            {item.description}
          </p>
        )}

        {/* CTA link */}
        {href && (
          <Link
            to={href}
            className="inline-flex items-center gap-1.5 mt-4 text-gold/60 group-hover:text-gold text-xs font-semibold transition-colors duration-200"
          >
            {item.link_type === 'video' ? (
              <><Video size={12} /> View Film</>
            ) : (
              <><Camera size={12} /> View Photos</>
            )}
            <ArrowRight size={11} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}

function PortfolioSection({ section = null }) {
  const items = STATIC_WORKS
  const [featured, ...rest] = items

  const heading = section?.title || 'Recent Works'

  return (
    <section id="portfolio" className="py-14 md:py-20 bg-charcoal overflow-hidden">
      <div className="section-container">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div>
            <SectionEyebrow align="left">Our Work</SectionEyebrow>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-4 text-h3 md:text-h2 font-extrabold text-paper leading-tight"
            >
              <span className="relative inline-block">
                {heading}
                <GoldDivider variant="underline" className="absolute -bottom-1 left-0 w-full" />
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-4 text-mist/65 text-sm md:text-base max-w-md"
            >
              Hand-picked projects — each one a story of craft, light, and memorable moments.
            </motion.p>
          </div>

          {/* View all links */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="flex items-center gap-4 flex-shrink-0"
          >
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 text-sm text-mist/65 hover:text-gold transition-colors duration-200 font-medium"
            >
              <Camera size={14} />
              All Photos
              <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
            <Link
              to="/videos"
              className="inline-flex items-center gap-1.5 text-sm text-mist/65 hover:text-gold transition-colors duration-200 font-medium"
            >
              <Video size={14} />
              All Videos
              <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
          </motion.div>
        </div>

        {/* Portfolio layout — full-width showreel, then cards below */}
        <div className="flex flex-col gap-4 md:gap-5">
          <AnimatePresence>
            {/* Full-width showreel */}
            {featured && (
              <ShowreelCard key={featured.featured_work_id} item={featured} index={0} />
            )}
          </AnimatePresence>

          {/* Cards row below */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <AnimatePresence>
              {rest.slice(0, 4).map((item, i) => (
                <WorkCard key={item.featured_work_id} item={item} index={i + 1} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-paper border border-white/15 hover:border-gold/50 rounded-full px-6 py-3 transition-all duration-300 hover:text-gold"
          >
            <Camera size={15} />
            Browse Full Gallery
            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <Link
            to="/videos"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-paper border border-white/15 hover:border-gold/50 rounded-full px-6 py-3 transition-all duration-300 hover:text-gold"
          >
            <Video size={15} />
            Watch Our Films
            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default PortfolioSection
