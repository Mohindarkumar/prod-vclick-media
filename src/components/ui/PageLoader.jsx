import { useEffect, useState } from 'react'
import { siteConfig } from '../../config/site.config'
import logo from '../../assets/images/logos/Logo_transparennt.webp'

// Pure CSS animations (see src/styles/index.css) — PageLoader renders
// unconditionally on every single page load, before routing/Suspense even
// engages, so it must never depend on the framer-motion chunk. Pulling an
// animation library into this component would force it into the eager
// critical bundle regardless of the app's LazyMotion setup elsewhere.
export default function PageLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [fading, setFading] = useState(false)

  // logoLoader takes priority — when enabled, the text/wordmark loader is hidden.
  const showLogoLoader = siteConfig.pageLoader?.logoLoader === 1
  const showTextLoader = !showLogoLoader && siteConfig.pageLoader?.textLoader === 1

  // This overlay hides the whole app until onComplete fires, which gates
  // Largest Contentful Paint behind however long it runs — it was
  // previously a fixed 2.4s (1800ms hold + 600ms fade) added to every single
  // load regardless of connection speed. Trimmed to keep the same brand beat
  // without taxing mobile Core Web Vitals. Fade is 350ms, matching the
  // opacity transition below — onComplete fires once it's visually done.
  useEffect(() => {
    const steps = [
      { target: 45, delay: 0 },
      { target: 80, delay: 120 },
      { target: 100, delay: 280 },
    ]

    const timers = steps.map(({ target, delay }) =>
      setTimeout(() => setProgress(target), delay)
    )

    const hideTimer = setTimeout(() => {
      setFading(true)
      setTimeout(() => onComplete?.(), 350)
    }, 550)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(hideTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] transition-opacity duration-[350ms] ease-in-out ${fading ? 'opacity-0' : 'opacity-100'}`}
      aria-label="Loading VClick Media & Events"
      role="status"
    >
      {/* Logo mark */}
      {showLogoLoader ? (
        <div className="flex flex-col items-center gap-4 animate-page-loader-in opacity-0">
          <img
            src={siteConfig.logoUrl || logo}
            alt={siteConfig.name}
            width={1106}
            height={482}
            className="h-16 w-auto object-contain"
          />
        </div>
      ) : showTextLoader ? (
        <div className="flex flex-col items-center gap-4 animate-page-loader-in opacity-0">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <polygon
              points="32,4 58,18 58,46 32,60 6,46 6,18"
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="2"
            />
            <circle cx="32" cy="32" r="10" fill="url(#goldGrad)" opacity="0.9" />
            <defs>
              <linearGradient id="goldGrad" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f0c040" />
                <stop offset="1" stopColor="#c9a227" />
              </linearGradient>
            </defs>
          </svg>

          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight gold-text-gradient">
              VClick
            </h1>
            <p className="text-xs text-mist/50 mt-1 tracking-widest uppercase">
              Media &amp; Events
            </p>
          </div>
        </div>
      ) : null}

      {/* Pulsing dots */}
      <div className="flex items-center gap-2 mt-10 animate-page-loader-fade-in opacity-0">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gold animate-page-loader-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/8">
        <div
          className="h-full bg-gold-sweep transition-[width] duration-[400ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
