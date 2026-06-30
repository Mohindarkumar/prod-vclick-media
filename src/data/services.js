// Service catalogue — consumed by ServicesSection and the HomePage schema.
// All text lives here. To update a service name, description, or image, edit this file.
import {
  Camera,
  Video,
  Building2,
  LayoutGrid,
  CalendarCheck,
  PartyPopper,
  Globe,
  Share2,
  Gift,
} from 'lucide-react'

export const services = [
  {
    id: 'professional-photography',
    icon: Camera,
    title: 'Professional Photography',
    description:
      'High-resolution photography for brands, products, events, and portraits — shot with precision and finished with a professional editorial eye.',
    image: '/uploads/images/services/photography.webp',
  },
  {
    id: 'professional-videography',
    icon: Video,
    title: 'Professional Videography',
    description:
      'Cinematic video production for campaigns, events, and brand stories — from single-camera shoots to full multi-crew productions.',
    image: '/uploads/images/services/video.webp',
    imagePosition: 'object-top',
  },
  {
    id: 'corporate-event-coverage',
    icon: Building2,
    title: 'Corporate Event Coverage',
    description:
      'Full media documentation of your conference, awards ceremony, or corporate milestone — stills and video delivered on a professional timeline.',
    image: '/uploads/images/gallery/events-exhibitions/DSC03602.webp',
  },
  {
    id: 'exhibition-coverage',
    icon: LayoutGrid,
    title: 'Exhibition Coverage',
    description:
      'Stand, booth, and visitor coverage across UAE trade shows and expos — every display, speaker, and interaction documented with precision.',
    image: '/uploads/images/services/exhibition.webp',
  },
  {
    id: 'event-planning-coverage',
    icon: CalendarCheck,
    title: 'Event Planning & Coverage',
    description:
      'Full-service event planning and logistics management — from concept to execution, with a crew that keeps everything running exactly to plan.',
    image: '/uploads/images/gallery/events-exhibitions/DSC03257.webp',
  },
  {
    id: 'entertainment-activities',
    icon: PartyPopper,
    title: 'Entertainment Activities',
    description:
      'Curated entertainment coverage and production for corporate events, gala dinners, and public activations that need to make an impact.',
    image: '/uploads/images/gallery/events-exhibitions/DSC09155-10122.webp',
  },
  {
    id: 'panoramic-360-photo-tour',
    icon: Globe,
    title: 'Panoramic 360° Photo Tour',
    description:
      'Immersive 360-degree virtual tours for hotels, venues, showrooms, and real estate — let clients explore your space from anywhere in the world.',
    image: '/uploads/images/services/360-photo.webp',
  },
  {
    id: 'special-occasions',
    icon: Gift,
    title: 'Special Occasions',
    description:
      'Beautifully crafted coverage for birthdays, anniversaries, baby showers, and life\'s most cherished milestones — every frame preserved with cinematic quality to relive the moment forever.',
    image: '/uploads/images/services/events.webp',
  },
  {
    id: 'social-media-content-creation',
    icon: Share2,
    title: 'Social Media Content Creation',
    description:
      'Scroll-stopping short-form and feed content engineered for digital engagement — made to perform on every platform, not just look good.',
    image: '/uploads/images/services/social-media-content.webp',
  },
]
