// Portfolio items — masonry grid + lightbox (build brief §6.6).
// All images use VClick's own photography from /uploads/images/gallery/.
// When adding new items, point image to /uploads/images/gallery/<album>/<filename>.webp
// and keep categories aligned with portfolioCategories below.
export const portfolioCategories = [
  'All',
  'Wedding',
  'Corporate',
  'Conference',
  'Product Launch',
  'Fashion',
  'Commercial',
  'Photography',
  'Videography',
  'Drone Shots',
]

export const portfolioItems = [
  {
    id: 1,
    title: 'Wedding Photography',
    categories: ['Wedding', 'Photography'],
    image: '/uploads/images/gallery/fashion-lifestyle/SIB-1000.webp',
    span: 'row-span-2',
  },
  {
    id: 2,
    title: 'Product Launch Coverage',
    categories: ['Product Launch', 'Corporate'],
    image: '/uploads/images/gallery/events-exhibitions/DSC03148.webp',
    span: 'row-span-1',
  },
  {
    id: 3,
    title: 'Corporate Event Coverage',
    categories: ['Conference', 'Corporate'],
    image: '/uploads/images/gallery/events-exhibitions/DSC03257.webp',
    span: 'row-span-1',
  },
  {
    id: 4,
    title: 'Fashion & Lifestyle Editorial',
    categories: ['Fashion', 'Photography'],
    image: '/uploads/images/gallery/fashion-lifestyle/DSC04817.webp',
    span: 'row-span-2',
  },
  {
    id: 5,
    title: 'Desert Photography',
    categories: ['Drone Shots', 'Commercial'],
    image: '/uploads/images/gallery/desert/SIB-3349.webp',
    span: 'row-span-1',
  },
  {
    id: 6,
    title: 'Events & Exhibition Coverage',
    categories: ['Wedding', 'Videography'],
    image: '/uploads/images/gallery/events-exhibitions/DSC03602.webp',
    span: 'row-span-2',
  },
  {
    id: 7,
    title: 'Exhibition & Expo Coverage',
    categories: ['Corporate', 'Commercial'],
    image: '/uploads/images/gallery/events-exhibitions/DSC03817.webp',
    span: 'row-span-1',
  },
  {
    id: 8,
    title: 'Commercial Photography',
    categories: ['Commercial', 'Videography'],
    image: '/uploads/images/gallery/events-exhibitions/DSC04073.webp',
    span: 'row-span-1',
  },
  {
    id: 9,
    title: 'Fashion Lifestyle Photography',
    categories: ['Drone Shots', 'Fashion'],
    image: '/uploads/images/gallery/fashion-lifestyle/SIB-1004.webp',
    span: 'row-span-2',
  },
  {
    id: 10,
    title: 'Conference & Summit Coverage',
    categories: ['Conference', 'Photography'],
    image: '/uploads/images/gallery/events-exhibitions/DSC_3010.webp',
    span: 'row-span-1',
  },
  {
    id: 11,
    title: 'Portrait Photography',
    categories: ['Wedding', 'Photography'],
    image: '/uploads/images/gallery/fashion-lifestyle/DSC05192.webp',
    span: 'row-span-1',
  },
  {
    id: 12,
    title: 'Live Event Production',
    categories: ['Product Launch', 'Videography'],
    image: '/uploads/images/gallery/events-exhibitions/DSC_3093.webp',
    span: 'row-span-2',
  },
]
