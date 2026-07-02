export const siteConfig = {
  name: 'VClick Media & Events',
  tagline: 'Premium Photography, Videography & Event Management',
  logoUrl: '/uploads/images/logos/logo.png',
  contact: {
    email: 'vclickmediauae@gmail.com',
    phone: '+971 55 475 1644',
    whatsapp: '971554751644',
    address: 'UAE',
    hours: 'Sun – Thu, 9:00 AM – 7:00 PM',
  },
  social: {
    instagram: { url: 'https://www.instagram.com/vclickmediauae?igsh=MTI5NHl3YmFzbmg1OA==', visible: true },
    facebook:  { url: 'https://www.facebook.com/share/1EoJvp4fng/', visible: true },
    linkedin:  { url: 'https://www.linkedin.com/company/vclickmedia', visible: false },
    youtube:   { url: 'https://youtube.com/@vclickmediauae?si=ga2Yt-tvZwdviun2', visible: true },
    tiktok:    { url: '', visible: false },
  },
  stats: {
    events: '500+',
    years: '8+',
    clients: '200+',
    location: 'UAE',
  },
  theme: {
    primaryColor: '#D4AF37',
    secondaryColor: '#1a1a1a',
    accentColor: '#c9a227',
    backgroundColor: '#0a0a0a',
    fontFamily: 'Poppins',
  },
  /**
   * sections — per-section visibility flags
   *
   * about.pillars controls the "Our Vision & Our Values" card grid.
   *   website: 1 = show on desktop (lg+)   | 0 = hide on desktop
   *   mobile:  1 = show on mobile  (<lg)   | 0 = hide on mobile
   *   both 0 → hidden everywhere (default)
   *   both 1 → visible everywhere
   */
  sections: {
    about: {
      pillars: { website: 0, mobile: 0 },
    },
  },

  /**
   * customCursor: 1 = enable the custom animated cursor (desktop only)
   *               0 = disable — restores the default browser/system cursor
   */
  customCursor: 0,

  /**
   * customScrollbar: 1 = gold-branded scrollbar
   *                  0 = default browser scrollbar (no styling)
   */
  customScrollbar: 0,

  /**
   * pageLoader — controls the full-screen intro loader shown on first paint
   *   textLoader: 1 = show the wordmark loader (SVG mark + "VClick" text)
   *               0 = hide it
   *   logoLoader: 1 = show the site logo image instead of the wordmark
   *               0 = hide it
   *   logoLoader takes priority when both are enabled.
   */
  pageLoader: {
    textLoader: 0,
    logoLoader: 1,
  },

  whatsapp: {
    enabled: true,
    phone: '+971545656291',
    label: 'Catchup with us',
    message: "Hi! I'm interested in your media & events services. Can you tell me more?",
    position: 'bottom-right',
  },
}
