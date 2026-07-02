const RAYS = [
  { x: 389, y: 101 },
  { x: 411, y: 130 },
  { x: 425, y: 164 },
  { x: 430, y: 200 },
  { x: 425, y: 236 },
  { x: 411, y: 270 },
  { x: 389, y: 299 },
]

/**
 * Original illustrated art mark — reimagines the VClick monogram (the V
 * chevron, the C swoosh, the play-button) as gold line-art radiating light,
 * rather than a literal logo lockup. Used as decorative negative-space fill,
 * never a photo or the real logo, so it stays "art" while still reading as
 * the brand.
 */
function BrandArtMark({ className = '' }) {
  return (
    <svg viewBox="0 0 450 400" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="brandArtGold" x1="0" y1="0" x2="450" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFB703" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      {/* Halo rings, faint — echo of a lens / spotlight */}
      <circle cx="240" cy="200" r="190" fill="none" stroke="url(#brandArtGold)" strokeWidth="0.75" opacity="0.28" />
      <circle cx="240" cy="200" r="130" fill="none" stroke="url(#brandArtGold)" strokeWidth="0.75" opacity="0.35" />

      {/* Light rays projecting from the play-button, like a spotlight/beam */}
      {RAYS.map(({ x, y }) => (
        <line
          key={`${x}-${y}`}
          x1="290" y1="200" x2={x} y2={y}
          stroke="url(#brandArtGold)"
          strokeWidth={x === 430 ? 2 : 1}
          strokeLinecap="round"
          opacity={x === 430 ? 0.9 : 0.5}
        />
      ))}

      {/* C swoosh — open ring around the play-button */}
      <path
        d="M 293.6 245 A 70 70 0 1 1 293.6 155"
        fill="none"
        stroke="url(#brandArtGold)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Play-button triangle */}
      <path d="M 210 172 L 210 228 L 292 200 Z" fill="url(#brandArtGold)" opacity="0.9" />

      {/* V chevron — the brand's primary mark */}
      <path
        d="M 40 50 L 115 265 L 165 150"
        fill="none"
        stroke="url(#brandArtGold)"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  )
}

export default BrandArtMark
