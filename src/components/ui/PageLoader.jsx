import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '../../config/site.config'
import logo from '../../assets/images/logos/Logo_transparennt.png'

export default function PageLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  // logoLoader takes priority — when enabled, the text/wordmark loader is hidden.
  const showLogoLoader = siteConfig.pageLoader?.logoLoader === 1
  const showTextLoader = !showLogoLoader && siteConfig.pageLoader?.textLoader === 1

  useEffect(() => {
    const steps = [
      { target: 30, delay: 0 },
      { target: 65, delay: 300 },
      { target: 85, delay: 700 },
      { target: 100, delay: 1200 },
    ]

    const timers = steps.map(({ target, delay }) =>
      setTimeout(() => setProgress(target), delay)
    )

    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onComplete?.(), 600)
    }, 1800)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(hideTimer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
          aria-label="Loading VClick Media & Events"
          role="status"
        >
          {/* Logo mark */}
          {showLogoLoader ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-4"
            >
              <img
                src={siteConfig.logoUrl || logo}
                alt={siteConfig.name}
                className="h-16 w-auto object-contain"
              />
            </motion.div>
          ) : showTextLoader ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-4"
            >
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
            </motion.div>
          ) : null}

          {/* Pulsing dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mt-10"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gold"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/8">
            <motion.div
              className="h-full bg-gold-sweep"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
