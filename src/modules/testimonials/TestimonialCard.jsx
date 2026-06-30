import { Star } from 'lucide-react'

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

function TestimonialCard({ testimonial }) {
  const initials = getInitials(testimonial.name)

  return (
    <div className="glass-surface rounded-3xl p-5 sm:p-8 md:p-10 max-w-2xl mx-auto text-center">
      <div className="flex justify-center gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={18}
            className={index < testimonial.rating ? 'text-gold fill-gold' : 'text-mist'}
          />
        ))}
      </div>

      <p className="mt-6 text-body-lg text-paper leading-relaxed text-balance">
        "{testimonial.quote}"
      </p>

      <div className="mt-7 flex items-center justify-center gap-3">
        {testimonial.photo ? (
          <img
            src={testimonial.photo}
            alt={testimonial.name}
            loading="lazy"
            className="w-12 h-12 rounded-full object-cover border-2 border-gold/40 flex-shrink-0"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full bg-gold/15 border-2 border-gold/40 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-gold text-sm font-bold leading-none">{initials}</span>
          </div>
        )}
        <div className="text-left">
          <p className="text-sm font-semibold text-paper">{testimonial.name}</p>
          <p className="text-xs text-mist">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
