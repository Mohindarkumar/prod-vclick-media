/**
 * Embedded Google Map (build brief §6.13), centered on Ajman Free Zone.
 * TODO: replace this generic embed URL with the exact VClick office
 * coordinates/place ID once the client confirms their physical address.
 */
function MapEmbed() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 h-72 md:h-80">
      <iframe
        title="VClick Media & Events location — Ajman Free Zone, UAE"
        src="https://www.google.com/maps?q=Ajman+Free+Zone,+United+Arab+Emirates&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'grayscale(0.3) invert(0.92) contrast(0.9)' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}

export default MapEmbed
