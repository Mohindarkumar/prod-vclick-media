// Centralised static content for every homepage section.
// Components consume this as a fallback when no CMS section data is present.
// To edit any copy on the homepage, change it here — nowhere else.

export const homeSectionContents = {

  // ─── Hero ────────────────────────────────────────────────────────────────
  hero: {
    eyebrow: 'Premium Media & Events · UAE',
    headlineLine1: 'Create',
    headlineHighlight: 'Unforgettable',
    headlineLine2: 'Experiences',
    subtitle:
      'From intimate weddings to large-scale exhibitions, VClick brings cinematic quality and creative precision to every story worth telling across the UAE.',
    serviceTags: [
      { label: 'Photography' },
      { label: 'Videography' },
      { label: 'Luxury Events' },
      { label: 'Media Production' },
    ],
    ctaPrimary: 'Get a Consultation',
    ctaSecondary: 'Call Us Now',
  },

  // ─── About ───────────────────────────────────────────────────────────────
  about: {
    eyebrow: 'Who We Are',
    heading: 'Crafted for Every Milestone That Matters',
    body: 'VClick Media & Events is a UAE-based creative production house headquartered in Ajman Free Zone. We bring cinematic quality to everything we touch — from intimate weddings and high-profile conferences to brand activations and large-scale exhibitions across all seven Emirates. Every project we take on is a story we are proud to help tell.',
    pillars: [
      {
        label: 'Our Mission',
        copy: 'To capture every moment our clients entrust to us with the artistry and care it deserves — because some stories deserve more than just a photograph.',
      },
      {
        label: 'Our Vision',
        copy: 'To be the most trusted creative partner for clients across the UAE who refuse to settle for ordinary.',
      },
      {
        label: 'Years of Experience',
        copy: 'Eight years and hundreds of events later, we bring the calm confidence that only comes from having been in the room when it matters most.',
      },
      {
        label: 'Our Team',
        copy: 'A close-knit crew of photographers, videographers, editors, drone pilots, and event planners — all working in sync so nothing falls through the cracks.',
      },
    ],
  },

  // ─── Services ────────────────────────────────────────────────────────────
  services: {
    eyebrow: 'What We Do',
    heading: 'Our Services',
    subtitle:
      'From a single product shoot to a multi-day exhibition, our full catalogue covers every form of media and event production — built around what your project actually needs.',
    cardCta: 'Learn More',
    showAllLabel: (total) => `View All Services (${total})`,
    showFewerLabel: 'Show Fewer Services',
  },

  // ─── Why Choose Us ───────────────────────────────────────────────────────
  whyChooseUs: {
    eyebrow: 'Why VClick',
    heading: 'The Reasons Clients Keep Coming Back',
    reasons: [
      {
        label: 'Creative Team',
        description:
          'A multi-disciplinary crew of photographers, videographers, editors, and planners who genuinely love the craft.',
      },
      {
        label: 'Latest Equipment',
        description:
          'Professional cinema-grade cameras, lenses, stabilisers, and drones — maintained and ready for any environment.',
      },
      {
        label: 'Professional Editing',
        description:
          'Every image and frame is colour-graded and refined to a consistent, high standard before delivery.',
      },
      {
        label: 'Fast Delivery',
        description:
          'Standard turnaround of 7–10 business days, with expedited options available for time-sensitive projects.',
      },
      {
        label: 'Affordable Packages',
        description:
          'Transparent pricing with packages that suit every budget — no hidden fees, no surprises.',
      },
      {
        label: 'Customised Solutions',
        description:
          'Every brief is different. We tailor our approach, crew size, and scope to match exactly what you need.',
      },
      {
        label: 'Expert Event Managers',
        description:
          'Our event team has managed hundreds of events across the UAE — they know how to keep things running smoothly.',
      },
      {
        label: 'High Quality Output',
        description:
          'We hold our work to a cinema standard, whether the final deliverable is a web asset or a print-ready album.',
      },
      {
        label: 'Client Satisfaction',
        description:
          'We do not close the file until you are genuinely happy. Your satisfaction is the only metric we care about.',
      },
      {
        label: '24/7 Support',
        description:
          'Have a question the night before your shoot? We are reachable — reliable support from booking through to delivery.',
      },
    ],
    stats: [
      { target: 500, suffix: '+', label: 'Events Delivered' },
      { target: 200, suffix: '+', label: 'Happy Clients' },
      { target: 50,  suffix: '+', label: 'Corporate Partners' },
      { target: 8,   suffix: '+', label: 'Years Experience' },
    ],
  },

  // ─── Showreel ────────────────────────────────────────────────────────────
  showreel: {
    eyebrow: 'Our Reel',
    heading: 'Watch What We Do',
    subtitle:
      'Every project we deliver is a story told with light, motion, and meaning. Press play to see what that looks like in practice.',
  },

  // ─── Process ─────────────────────────────────────────────────────────────
  process: {
    eyebrow: 'How We Work',
    heading: 'From Brief to Delivery',
    steps: [
      {
        title: 'Consultation',
        description:
          'We start by understanding your vision, goals, and budget — then match the right crew and approach to your brief.',
      },
      {
        title: 'Planning',
        description:
          'Every detail gets mapped: crew schedules, logistics, equipment lists, and venue access — all locked in before the day.',
      },
      {
        title: 'Creative Concept',
        description:
          'A full shot list and visual direction built around your story — so nothing is left to chance when the cameras roll.',
      },
      {
        title: 'Production Prep',
        description:
          'Pre-production checks confirm everything is in place: permits, equipment, call sheets, and crew assignments.',
      },
      {
        title: 'Execution',
        description:
          'Our crew arrives early, moves with intention, and captures your event exactly as it unfolds — naturally and professionally.',
      },
      {
        title: 'Editing',
        description:
          'Every image and frame is colour-graded, retouched, and refined to the cinematic standard we hold ourselves to.',
      },
      {
        title: 'Delivery',
        description:
          'Final assets are delivered through your private gallery — ready to share, print, or broadcast, exactly as agreed.',
      },
    ],
  },

  // ─── Testimonials ────────────────────────────────────────────────────────
  testimonials: {
    eyebrow: 'What Our Clients Say',
    heading: 'Stories From the People We Worked With',
  },

  // ─── Clients ─────────────────────────────────────────────────────────────
  clients: {
    eyebrow: 'In Good Company',
    heading: 'Brands That Trust VClick',
  },

  // ─── Pricing ─────────────────────────────────────────────────────────────
  pricing: {
    eyebrow: 'Packages',
    heading: 'Simple, Transparent Pricing',
    subtitle:
      'Every project is unique — these packages are where we start the conversation. Final scope and investment are always confirmed with you before anything is locked in.',
    popularBadge: 'Most Popular',
    pricingNote: 'Starting price — final quote confirmed on booking',
  },

  // ─── FAQ ─────────────────────────────────────────────────────────────────
  faq: {
    eyebrow: 'Common Questions',
    heading: 'Everything You Need to Know',
  },

  // ─── Contact section ─────────────────────────────────────────────────────
  contact: {
    eyebrow: 'Start the Conversation',
    heading: 'Ready to Bring Your Vision to Life?',
    quickContacts: [
      { label: 'WhatsApp' },
      { label: 'Call Us' },
      { label: 'Email Us' },
    ],
  },

  // ─── Contact form ────────────────────────────────────────────────────────
  contactForm: {
    fields: [
      { name: 'name',  label: 'Full Name',      type: 'text',  placeholder: 'What should we call you?' },
      { name: 'email', label: 'Email Address',   type: 'email', placeholder: 'Where can we reach you?' },
      { name: 'phone', label: 'Phone Number',    type: 'tel',   placeholder: '+971 50 000 0000' },
    ],
    messageLabel: 'Tell Us About Your Event',
    messagePlaceholder:
      'Give us a sense of your vision — date, location, type of event, and anything else you would like us to know.',
    submitLabel: 'Send Message',
    sendingLabel: 'Sending…',
    successMessage:
      "Message sent — we'll be in touch within one business day.",
    errors: {
      name:               'Please enter your full name.',
      emailRequired:      'Please enter your email address.',
      emailInvalid:       'That does not look like a valid email address.',
      phone:              'Please enter your phone number so we can reach you.',
      message:            'Tell us a little about your event so we can help.',
      turnstile:          'Please complete the security check to continue.',
      serverFallback:     'Something went wrong. Please try again.',
      networkFallback:    'Network error. Please check your connection and try again.',
      serverParseFallback:'Server error. Please try again or reach us via WhatsApp.',
    },
  },
}
