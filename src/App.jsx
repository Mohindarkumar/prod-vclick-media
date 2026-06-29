import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/layout/ScrollToTop'
import CustomCursor from './components/ui/CustomCursor'
import PageLoader from './components/ui/PageLoader'
import { PageSpinner } from './components/ui/LazyLoader'
import WhatsAppChat from './components/ui/WhatsAppChat'
const HomePage = lazy(() => import('./pages/HomePage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const VideoGalleryPage = lazy(() => import('./pages/VideoGalleryPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'))

const SuspenseFallback = () => <PageSpinner />

function App() {
  const [appReady, setAppReady] = useState(false)

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
    <>
      {!appReady && <PageLoader onComplete={() => setAppReady(true)} />}
      <div style={{ visibility: appReady ? 'visible' : 'hidden' }}>
        <BrowserRouter>
          <CustomCursor />
          <ScrollToTop />
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
          <WhatsAppChat />
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
