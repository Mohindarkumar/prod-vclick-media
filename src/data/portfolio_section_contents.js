// Centralised static content for the Portfolio page.
// Edit all visible text for the portfolio page here — nowhere else.

export const portfolioSectionContents = {

  // ─── SEO ─────────────────────────────────────────────────────────────────
  seo: {
    title: 'Portfolio | VClick Media & Events — Wedding, Corporate & Fashion Photography UAE',
    description:
      "Explore VClick's creative portfolio — wedding photography, corporate films, fashion editorials and aerial drone coverage across all seven Emirates of the UAE.",
    schemaName: 'Portfolio — VClick Media & Events',
    schemaDescription:
      'Curated creative showcase featuring wedding photography, corporate films, fashion editorials and aerial drone coverage by VClick Media & Events across the UAE.',
  },

  // ─── Hero ────────────────────────────────────────────────────────────────
  hero: {
    eyebrow: 'Creative Showcase',
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Portfolio',
    headlinePre: 'Our',
    headlineHighlight: 'Portfolio',
    subtitle:
      'Every image and film here represents a real moment, a real client, and a real story we were trusted to tell — with craft, intention, and precision.',
    ctaGallery: 'Photo Gallery',
    ctaVideos: 'Video Gallery',
  },

  // ─── Stats bar ───────────────────────────────────────────────────────────
  stats: [
    { target: 500, suffix: '+', label: 'Events Covered' },
    { target: 200, suffix: '+', label: 'Weddings Shot' },
    { target: 50,  suffix: '+', label: 'Brand Clients' },
    { target: 5,   suffix: '+', label: 'Countries' },
  ],

  // ─── Specialties section ─────────────────────────────────────────────────
  specialties: {
    eyebrow: 'What We Do',
    headingBase: 'Specialties',
    headingConnector: '&',
    headingHighlight: 'Expertise',
    subtitle:
      'Each discipline represents years of craft — from intimate portraits to large-scale commercial productions across the UAE and beyond.',
    viewWorkLabel: 'View Work',
    categories: [
      {
        title: 'Wedding Photography',
        desc: 'Emotional, timeless, and beautifully detailed — our wedding photography captures every chapter of your day as it unfolds.',
        filter: 'Wedding',
        gradient: 'from-rose-500/20 to-pink-500/10',
      },
      {
        title: 'Corporate Films',
        desc: "From launch events to annual reports, we produce corporate films that communicate your brand's authority and vision with clarity.",
        filter: 'Corporate',
        gradient: 'from-blue-500/20 to-indigo-500/10',
      },
      {
        title: 'Fashion Editorials',
        desc: "Whether it's a campaign, lookbook, or runway, we build striking visual narratives that make your brand impossible to overlook.",
        filter: 'Fashion',
        gradient: 'from-purple-500/20 to-violet-500/10',
      },
      {
        title: 'Drone Coverage',
        desc: 'Licensed aerial photography and videography across the UAE — turning venues, events, and landscapes into sweeping cinematic vistas.',
        filter: 'Drone Shots',
        gradient: 'from-amber-500/20 to-orange-500/10',
      },
    ],
  },

  // ─── Portfolio grid section ───────────────────────────────────────────────
  grid: {
    eyebrow: 'Selected Work',
    headingBase: 'Browse by',
    headingHighlight: 'Category',
    emptyTitle: 'No work in this category yet.',
    emptySubtitle: 'Check back soon — more is on the way.',
    viewLabel: 'View',
  },

  // ─── CTA section ─────────────────────────────────────────────────────────
  cta: {
    eyebrow: 'Explore More',
    headingBase: 'The Full',
    headingHighlight: 'Experience',
    subtitle:
      'The portfolio is the highlight reel. Head to the gallery or video archive for the full story — every shoot, every event, every film.',
    gallery: {
      heading: 'Photo Gallery',
      description:
        'Browse the complete photography archive — hundreds of images organised by album and event type.',
      linkLabel: 'Open Gallery',
    },
    video: {
      heading: 'Video Showreel',
      description:
        'Watch our cinematic work — weddings, corporate films, fashion reels, and aerial footage all in one place.',
      linkLabel: 'Watch Films',
    },
    bottomPrompt: 'Ready to bring your vision to life?',
    bottomCta: 'Get a Free Consultation',
  },
}
