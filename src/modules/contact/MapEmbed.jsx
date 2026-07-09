import { useState } from 'react'
import { MapPin } from 'lucide-react'

/**
 * Embedded Google Map (build brief §6.13), showing a general UAE view.
 *
 * The embed iframe is Google's own hosted mini-app — it internally fires a
 * handful of maps.googleapis.com/places API calls as part of rendering the
 * interactive widget, regardless of the (already lightweight, no-API-key)
 * embed URL we point it at. Since this map only shows a generic "UAE" view
 * (no precise address is configured), it isn't worth loading by default —
 * mounting the iframe only on click means those requests never fire for the
 * majority of visitors who don't interact with it.
 */
function MapEmbed() {
  const [showMap, setShowMap] = useState(false)

  if (showMap) {
    return (
      <div className="rounded-2xl overflow-hidden border border-white/10 h-72 md:h-80">
        <iframe
          title="VClick Media & Events location — United Arab Emirates"
          src="https://www.google.com/maps?q=United+Arab+Emirates&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(0.3) invert(0.92) contrast(0.9)' }}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setShowMap(true)}
      aria-label="Load interactive map"
      className="relative w-full h-72 md:h-80 rounded-2xl overflow-hidden border border-white/10 bg-charcoal flex flex-col items-center justify-center gap-3 group hover:border-gold/35 transition-colors duration-300"
    >
      {/* Stylized decorative map — grid graticule + abstract Gulf coastline with
          city markers. Not cartographically precise; it just needs to read as
          "map" at a glance before the real interactive map loads on click. */}
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-40 group-hover:opacity-55 transition-opacity duration-300"
        aria-hidden="true"
      >
        <defs>
          <pattern id="mapGrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(212,175,55,0.14)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#mapGrid)" />
        {/* Abstract Gulf coastline */}
        <path
          d="M -10 70 C 60 55, 90 90, 130 78 C 160 68, 175 40, 205 45 C 230 49, 235 75, 260 85 C 300 100, 340 90, 410 105"
          fill="none"
          stroke="rgba(212,175,55,0.55)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M -10 70 C 60 55, 90 90, 130 78 C 160 68, 175 40, 205 45 C 230 49, 235 75, 260 85 C 300 100, 340 90, 410 105 L 410 -10 L -10 -10 Z"
          fill="rgba(212,175,55,0.05)"
        />
        {/* Faint road lines */}
        <path d="M 90 300 L 150 90" stroke="rgba(189,189,189,0.18)" strokeWidth="1.5" strokeDasharray="5 5" />
        <path d="M 220 300 L 195 60" stroke="rgba(189,189,189,0.18)" strokeWidth="1.5" strokeDasharray="5 5" />
        <path d="M 320 300 L 265 92" stroke="rgba(189,189,189,0.18)" strokeWidth="1.5" strokeDasharray="5 5" />
        {/* City markers along the coast */}
        <circle cx="150" cy="90" r="3.5" fill="#D4AF37" opacity="0.7" />
        <circle cx="195" cy="60" r="3.5" fill="#D4AF37" opacity="0.7" />
        <circle cx="265" cy="92" r="3.5" fill="#D4AF37" opacity="0.7" />
      </svg>

      <span className="relative w-14 h-14 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300">
        <span className="absolute inset-0 rounded-full border border-gold/30 animate-ping opacity-40" aria-hidden="true" />
        <MapPin size={22} className="relative text-gold" />
      </span>
      <span className="relative text-sm font-semibold text-paper">United Arab Emirates</span>
      <span className="relative text-xs text-mist/50">Tap to load interactive map</span>
    </button>
  )
}

export default MapEmbed
