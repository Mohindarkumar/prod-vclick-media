import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/images/logos/Logo_transparennt.png'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import Button from '../common/Button'

function HamburgerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <line x1="3" y1="7"  x2="23" y2="7"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="13" x2="23" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="19" x2="23" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <line x1="5" y1="5"  x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="23" y1="5" x2="5"  y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
import { menusConfig } from '../../config/menus.config'
import { siteConfig } from '../../config/site.config'

const VISIBLE_NAV_LINKS = menusConfig
  .filter((m) => !m.isHidden && m.isActive)
  .sort((a, b) => a.displayOrder - b.displayOrder)
  .map((m) => ({ label: m.label, href: m.href, isRoute: m.isRoute }))

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Scroll-progress indicator — spring-smoothed
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const handleLinkClick = () => setIsMobileMenuOpen(false)
  const hasMobileMenu = VISIBLE_NAV_LINKS.length > 0

  /**
   * Resolve the effective href for a nav link depending on current route.
   * - Route links: returned as-is (handled by React Router Link).
   * - Anchor links on root: returned as-is (#section).
   * - Anchor links on sub-pages: prefixed with / so they navigate home first (/#section).
   * Normalises /home → / so legacy DB menu entries don't cause a 404.
   */
  const resolveHref = (link) => {
    if (link.isRoute) {
      if (link.href === '/home') return '/'
      return link.href
    }
    if (!link.href.startsWith('#')) return link.href
    if (pathname === '/') return link.href
    return `/${link.href}` // e.g. #about → /#about
  }

  /**
   * Determine the active visual state for a link.
   * Route links: active when pathname matches.
   * Anchor links: never "route-active" — they handle their own scroll-state.
   */
  const isRouteActive = (link) => link.isRoute && pathname === link.href

  // Shared link class
  const linkClass = (link) =>
    `text-sm font-medium whitespace-nowrap relative group transition-colors duration-300 ${
      isRouteActive(link) ? 'text-gold' : 'text-paper/88 hover:text-gold'
    }`

  const underlineClass = (link) =>
    `absolute -bottom-0.5 left-0 h-px bg-gold-sweep transition-all duration-300 ${
      isRouteActive(link) ? 'w-full' : 'w-0 group-hover:w-full'
    }`

  // Render a single nav link as either <Link> (route) or <a> (anchor)
  const renderLink = (link, extraClass = '', onClick = undefined) => {
    const href = resolveHref(link)
    const className = `${linkClass(link)} ${extraClass}`

    if (link.isRoute) {
      return (
        <Link to={href} className={className} onClick={onClick}>
          {link.label}
          <span className={underlineClass(link)} aria-hidden="true" />
        </Link>
      )
    }
    return (
      <a href={href} className={className} onClick={onClick}>
        {link.label}
        <span className={underlineClass(link)} aria-hidden="true" />
      </a>
    )
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-ink/85 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.08)]'
          : 'bg-transparent'
      }`}
    >
      {/* ── Scroll progress bar ──────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-sweep origin-left"
        style={{ scaleX }}
        aria-hidden="true"
      />

      <nav
        className="section-container flex items-center justify-between py-4 md:py-5"
        aria-label="Primary"
      >
        {/* Logo — always navigates to root */}
        <motion.div whileHover={{ opacity: 0.82 }} transition={{ duration: 0.2 }}>
          <Link
            to="/"
            className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
          >
            <img
              src={siteConfig.logoUrl || logo}
              alt={siteConfig.name}
              className="h-10 w-auto object-contain"
            />
          </Link>
        </motion.div>

        {/* Desktop nav links — visible at lg (1024px+) */}
        {VISIBLE_NAV_LINKS.length > 0 && (
          <ul className="hidden lg:flex items-center gap-5 xl:gap-7" role="list">
            {VISIBLE_NAV_LINKS.map((link) => (
              <li key={link.href}>
                {renderLink(link)}
              </li>
            ))}
          </ul>
        )}

        {/* Desktop CTA */}
        <div className="hidden lg:block flex-shrink-0">
          <Button as="a" href={pathname === '/' ? '#contact' : '/#contact'} variant="primary">
            Get a Consultation
          </Button>
        </div>

        {/* Mobile/tablet hamburger — hidden at lg+ */}
        {hasMobileMenu && (
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-paper p-2.5 -mr-1 touch-manipulation"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <HamburgerIcon />
          </button>
        )}
      </nav>

      {/* ── Mobile full-screen overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && hasMobileMenu && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-ink/96 backdrop-blur-xl lg:hidden overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex justify-end section-container py-4 md:py-5">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-paper p-2.5 hover:text-gold transition-colors duration-300 touch-manipulation"
                aria-label="Close navigation menu"
              >
                <CloseIcon />
              </button>
            </div>

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              className="flex flex-col items-center gap-5 sm:gap-7 mt-6 sm:mt-8 pb-8"
              role="list"
            >
              {VISIBLE_NAV_LINKS.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {renderLink(
                    link,
                    `!text-xl sm:!text-2xl !font-semibold ${isRouteActive(link) ? '!text-gold' : '!text-paper hover:!text-gold'}`,
                    handleLinkClick
                  )}
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="mt-4"
              >
                <Button
                  as="a"
                  href={pathname === '/' ? '#contact' : '/#contact'}
                  variant="primary"
                  onClick={handleLinkClick}
                >
                  Get a Consultation
                </Button>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
