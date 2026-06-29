import { motion } from 'framer-motion'
import SectionEyebrow from '../../components/common/SectionEyebrow'
import Accordion from '../../components/ui/Accordion'
import { faqItems as staticFaqItems } from '../../data/faq'

function FAQSection({ section = null }) {
  // CMS items from page_section content.items — normalize to Accordion format
  const cmsItems = section?.content?.items
  const items = cmsItems?.length
    ? cmsItems.map((item, i) => ({ id: item.id ?? i + 1, question: item.question, answer: item.answer }))
    : staticFaqItems

  const heading = section?.title || 'Frequently Asked Questions'

  return (
    <section id="faq" className="section-padding bg-charcoal">
      <div className="section-container max-w-3xl">
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow>Questions</SectionEyebrow>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-5 text-3xl md:text-h2 font-extrabold text-paper"
          >
            {heading}
          </motion.h2>
        </div>

        <div className="mt-14">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  )
}

export default FAQSection
