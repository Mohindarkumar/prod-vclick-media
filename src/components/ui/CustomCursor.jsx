import { useEffect, useRef, useState } from 'react'

/**
 * Premium custom cursor — monochrome adaptive edition.
 *
 * Design:
 *  • Small white dot (6 px) follows mouse instantly (synchronous DOM mutation,
 *    zero React state changes on mousemove — no re-renders).
 *  • Smooth outer ring follows with spring physics via a velocity-based rAF loop:
 *    each frame accumulates velocity toward the cursor, then damps it, producing
 *    natural overshoot and settle without Framer Motion overhead.
 *  • Ring auto-adapts: white with a black outer halo so it stays visible on both
 *    dark and light backgrounds.
 *  • Soft glow via box-shadow on the ring.
 *  • Variant-based states (detected from DOM, no manual wiring needed):
 *      default → 6 px dot + 36 px ring
 *      hover   → dot hidden, 52 px ring, faint fill (links / buttons)
 *      image   → dot hidden, 64 px ring + "VIEW" label
 *      video   → dot hidden, 64 px ring + "PLAY" label (add data-cursor="video")
 *      click   → ring compresses to 22 px for 220 ms then restores
 *  • Magnetic button effect lives in Button.jsx — the cursor just shows `hover`.
 *  • Disabled automatically on touch / pointer-coarse devices (synchronous check).
 */

const SPRING  = 0.10   // spring force toward target (higher = tighter)
const DAMPING = 0.80   // velocity damping per frame (lower = more overshoot)

const RING_SIZE = {
  default: 36,
  hover:   40,   // barely grows — magnetic spring on the button is the visual cue
  image:   64,
  video:   64,
  click:   22,
}

const RING_BG = {
  default: 'rgba(255,255,255,0)',
  hover:   'rgba(255,255,255,0)',
  image:   'rgba(255,255,255,0.05)',
  video:   'rgba(255,255,255,0.05)',
  click:   'rgba(255,255,255,0.12)',
}

// The dark outer halo (0 0 0 1px) keeps the ring legible on light backgrounds.
const RING_SHADOW = {
  default: '0 0 0 1px rgba(0,0,0,0.15), 0 0 16px 2px rgba(255,255,255,0.09)',
  hover:   '0 0 0 1px rgba(0,0,0,0.10), 0 0 10px 1px rgba(255,255,255,0.04)',
  image:   '0 0 0 1px rgba(0,0,0,0.18), 0 0 30px 4px rgba(255,255,255,0.16)',
  video:   '0 0 0 1px rgba(0,0,0,0.18), 0 0 30px 4px rgba(255,255,255,0.16)',
  click:   '0 0 0 1px rgba(0,0,0,0.20), 0 0 10px 2px rgba(255,255,255,0.20)',
}

const RING_BORDER = {
  default: '1px solid rgba(255,255,255,0.70)',
  hover:   '1px solid rgba(255,255,255,0.28)',   // very faint — magnetic pull is the cue
  image:   '1.5px solid rgba(255,255,255,0.85)',
  video:   '1.5px solid rgba(255,255,255,0.85)',
  click:   '2px solid rgba(255,255,255,0.95)',
}

function CursorInner() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const rafRef  = useRef(null)

  // Mutable pos + velocity refs — never trigger React re-renders
  const pos = useRef({ mx: -200, my: -200, rx: -200, ry: -200, vx: 0, vy: 0 })
  const prevVariant = useRef('default')

  const [variant, setVariant] = useState('default')
  const [visible, setVisible]  = useState(false)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // ── Spring-physics rAF loop ───────────────────────────────────────────
    const tick = () => {
      const p  = pos.current
      const dx = p.mx - p.rx
      const dy = p.my - p.ry
      p.vx = p.vx * DAMPING + dx * SPRING
      p.vy = p.vy * DAMPING + dy * SPRING
      p.rx += p.vx
      p.ry += p.vy
      ring.style.transform = `translate3d(${p.rx}px, ${p.ry}px, 0) translate(-50%, -50%)`
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    // ── Dot follows mouse synchronously — zero rAF latency ────────────────
    const onMove = (e) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      if (!visible) setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    // ── Variant detection ─────────────────────────────────────────────────
    const onOver = (e) => {
      const dataEl   = e.target.closest('[data-cursor]')
      const interEl  = e.target.closest('a, button, [role="button"], input, textarea, select, label')

      if (dataEl) {
        const v = dataEl.dataset.cursor || 'hover'
        prevVariant.current = v
        setVariant(v)
      } else if (interEl) {
        prevVariant.current = 'hover'
        setVariant('hover')
      } else {
        prevVariant.current = 'default'
        setVariant('default')
      }
    }

    // ── Click compression ─────────────────────────────────────────────────
    const onDown = () => {
      setVariant('click')
      setTimeout(() => setVariant(prevVariant.current), 220)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mousedown', onDown)

    document.documentElement.classList.add('no-cursor')

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mousedown', onDown)
      document.documentElement.classList.remove('no-cursor')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const isDotHidden = variant !== 'default'
  const opacity     = visible ? 1 : 0
  const size        = RING_SIZE[variant] ?? RING_SIZE.default
  const label       = variant === 'image' ? 'VIEW' : variant === 'video' ? 'PLAY' : null

  return (
    <>
      {/* ── Dot — instant follower ─────────────────────────────────────── */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full will-change-transform"
        style={{
          width: 6,
          height: 6,
          backgroundColor: 'rgba(255,255,255,0.95)',
          boxShadow: '0 0 6px 1px rgba(255,255,255,0.55)',
          opacity: isDotHidden ? 0 : opacity,
          transition: 'opacity 0.18s ease',
        }}
      />

      {/* ── Ring — spring follower ─────────────────────────────────────── */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full will-change-transform flex items-center justify-center"
        style={{
          width: size,
          height: size,
          border: RING_BORDER[variant] ?? RING_BORDER.default,
          backgroundColor: RING_BG[variant] ?? 'transparent',
          boxShadow: RING_SHADOW[variant] ?? RING_SHADOW.default,
          opacity,
          transition: [
            'width 0.38s cubic-bezier(0.34,1.56,0.64,1)',
            'height 0.38s cubic-bezier(0.34,1.56,0.64,1)',
            'background-color 0.28s ease',
            'border 0.28s ease',
            'box-shadow 0.28s ease',
            'opacity 0.38s ease',
          ].join(', '),
        }}
      >
        {label && (
          <span
            className="font-bold uppercase select-none"
            style={{
              color: 'rgba(255,255,255,0.92)',
              fontSize: 9,
              letterSpacing: '0.18em',
              lineHeight: 1,
            }}
          >
            {label}
          </span>
        )}
      </div>
    </>
  )
}

/**
 * Outer wrapper — gates on pointer-fine devices synchronously.
 * Returns null on touch screens with zero flicker.
 */
export default function CustomCursor() {
  if (typeof window === 'undefined') return null
  if (!window.matchMedia('(pointer: fine)').matches) return null
  return <CursorInner />
}
