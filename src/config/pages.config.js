export const pagesConfig = {
  home: {
    slug: 'home',
    title: 'Home',
    template: 'home',
    sections: {
      hero:         { displayOrder: 10,  isVisible: true  },
      cards:        { displayOrder: 2,   isVisible: true  },
      about:        { displayOrder: 20,  isVisible: true  },
      services:     { displayOrder: 30,  isVisible: true  },
      why:          { displayOrder: 40,  isVisible: false },
      gallery:      { displayOrder: 50,  isVisible: true  },
      showreel:     { displayOrder: 60,  isVisible: false },
      process:      { displayOrder: 70,  isVisible: false },
      stats:        { displayOrder: 75,  isVisible: true  },
      testimonials: { displayOrder: 80,  isVisible: false },
      clients:      { displayOrder: 90,  isVisible: false },
      pricing:      { displayOrder: 100, isVisible: false },
      faq:          { displayOrder: 110, isVisible: false },
      contact:      { displayOrder: 120, isVisible: true  },
    },
  },
  gallery: {
    slug: 'gallery',
    title: 'Our Visual Portfolio',
    subtitle: 'Cinematic photography and videography across events, brands, and productions.',
  },
  videos: {
    slug: 'videos',
    title: 'Video Gallery',
    subtitle: 'Watch our cinematic productions across events, weddings, and commercial projects.',
  },
  about: {
    slug: 'about',
    title: 'About VClick Media & Events',
    subtitle: 'A UAE-based creative studio specialising in cinematic visuals and full-service event production.',
  },
  services: {
    slug: 'services',
    title: 'End-to-End Creative Production',
    subtitle: 'From photography to full-scale event management — we do it all under one roof.',
  },
  contact: {
    slug: 'contact',
    title: "Let's Create Together",
    subtitle: "Tell us about your project and we'll get back to you within 24 hours.",
  },
}
