export const videoCategories = ['All', 'Music', 'Events', 'Desert']

export const videos = [
  // ─── Music ───────────────────────────────────────────────────────────────
  {
    id: 'music-1',
    title: 'Music Film — Vol. 1',
    description:
      'Feel the rhythm come alive. This short film blends visual storytelling with the pulse of live music — a reminder that every note has a story, and every story deserves to be seen.',
    category: 'Music',
    video_type: 'youtube',
    video_url: 'https://youtu.be/TVLdE1wdSaQ?si=lNiZ7gpp2Ih3Rdfz',
    thumbnail_url: '/uploads/videos/gallery/musics/music_thumb1.webp',
    is_featured: true,
    duration: 56,
  },
  {
    id: 'music-2',
    title: 'Music Film — Vol. 2',
    description:
      'Some moments are best felt, not just seen. Watch how we translate raw emotion and artistry into a cinematic experience that stays with you long after the last frame.',
    category: 'Music',
    video_type: 'youtube',
    video_url: 'https://youtu.be/we_nKJE3Ego?si=s9imwTDIQfmLAv9J',
    thumbnail_url: '/uploads/videos/gallery/musics/music_thumb2.webp',
    is_featured: false,
    duration: 67,
  },

  // ─── Events ──────────────────────────────────────────────────────────────
  {
    id: 'event-2',
    title: 'Events in Motion',
    description:
      'Real moments. Real energy. Watch how we capture every handshake, every cheer, and every emotion that makes your event truly come alive — turning a single occasion into a cinematic story worth reliving.',
    category: 'Events',
    video_type: 'youtube',
    video_url: 'https://youtu.be/cHWgMzJ72PU?si=5VDvCSQQdNZrzU9k',
    thumbnail_url: '/uploads/videos/gallery/events/event_thumb2.webp',
    is_featured: true,
    duration: 162,
  },
  {
    id: 'event-1',
    title: 'Live Event Coverage',
    description:
      'From the first handshake to the final applause, every great event is a collection of moments worth remembering. Watch how our team captures the energy, emotion, and detail that make your event truly unforgettable.',
    category: 'Events',
    video_type: 'youtube',
    video_url: 'https://youtu.be/Ye9aM-6OIDo?si=hJmqtgHnc-mCQgWz',
    thumbnail_url: '/uploads/videos/gallery/events/event_thumb1.webp',
    is_featured: true,
    duration: 202,
  },

  // ─── Desert ──────────────────────────────────────────────────────────────
  {
    id: 'desert-1',
    title: 'Desert Cinematic — UAE',
    description:
      "The UAE's golden landscape holds a quiet magic that words rarely capture. Light, sand, and silence come together in this cinematic journey — shot entirely on location across the Emirates.",
    category: 'Desert',
    video_type: 'self_hosted',
    video_url: '/uploads/videos/gallery/deserts/desert1.mp4',
    thumbnail_url: '/uploads/videos/gallery/deserts/desert_thumb1.webp',
    is_featured: true,
    duration: 118,
  },
]
