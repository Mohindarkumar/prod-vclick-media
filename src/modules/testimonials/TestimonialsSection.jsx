import { motion } from 'framer-motion'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import Carousel from '../../components/ui/Carousel'
import TestimonialCard from './TestimonialCard'
import { testimonials } from '../../data/testimonials'

function TestimonialsSection() {
  const items = testimonials

  return (
    <section id="testimonials" className="section-padding bg-ink">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow>Client Love</SectionEyebrow>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-5 text-3xl md:text-h2 font-extrabold text-paper"
          >
            Testimonials
          </motion.h2>
        </div>

        <div className="mt-14">
          <Carousel
            items={items}
            renderItem={(testimonial) => <TestimonialCard testimonial={testimonial} />}
          />
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
