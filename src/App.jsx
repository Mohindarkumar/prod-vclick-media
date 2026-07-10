import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LazyMotion } from 'framer-motion'
import ScrollToTop from './components/layout/ScrollToTop'
import CustomCursor from './components/ui/CustomCursor'
import PageLoader from './components/ui/PageLoader'
import ChunkErrorBoundary from './components/ui/ChunkErrorBoundary'
import { siteConfig } from './config/site.config'
import { PageSpinner } from './components/ui/LazyLoader'
import useContentProtection from './hooks/useContentProtection'

// Lazy — not needed for first paint, and its framer-motion usage would
// otherwise force that chunk into the eager critical bundle (it's the only
// other always-mounted component that imports AnimatePresence directly,
// alongside PageLoader which no longer does — see PageLoader.jsx).
const WhatsAppChat = lazy(() => import('./components/ui/WhatsAppChat'))

// Every animated component uses `m` (not `motion`) so Framer Motion's engine
// loads as its own async chunk instead of shipping synchronously in the
// critical bundle — this is the single largest dependency in the app.
const loadFramerFeatures = () => import('./lib/framerFeatures').then((mod) => mod.default)

const HomePage = lazy(() => import('./pages/HomePage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const VideoGalleryPage = lazy(() => import('./pages/VideoGalleryPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'))

const SuspenseFallback = () => <PageSpinner />

function App() {
  const [appReady, setAppReady] = useState(false)

  useContentProtection(siteConfig.contentProtection === 1)

  useEffect(() => {
    if (!appReady) return
    const hash = window.location.hash
    if (!hash) return
    const id = hash.slice(1)
    const el = document.getElementById(id)
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }, [appReady])

  return (
    <LazyMotion features={loadFramerFeatures}>
      {!appReady && <PageLoader onComplete={() => setAppReady(true)} />}
      {/* Real content mounts and paints immediately — PageLoader's opaque,
          fixed, z-[9999] overlay is what visually covers it, not this
          wrapper. Using visibility:hidden here would skip painting the
          hero content entirely until appReady flips, artificially pushing
          back Largest Contentful Paint by however long the loader runs.
          `inert` keeps it non-interactive and out of the accessibility
          tree while still letting the browser paint (and register LCP)
          underneath the loader — same visual result, better metrics. */}
      <div inert={!appReady}>
        <BrowserRouter>
          {siteConfig.customCursor === 1 && <CustomCursor />}
          <ScrollToTop />
          <ChunkErrorBoundary>
            <Suspense fallback={<SuspenseFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/videos" element={<VideoGalleryPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ChunkErrorBoundary>
          <Suspense fallback={null}>
            <WhatsAppChat />
          </Suspense>
        </BrowserRouter>
      </div>
    </LazyMotion>
  )
}

export default App
