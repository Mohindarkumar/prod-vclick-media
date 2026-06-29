import { useEffect } from 'react'
import { motion } from 'framer-motion'
import DOMPurify from 'dompurify'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { FileText } from 'lucide-react'

const STATIC_CONTENT = `
<h2>1. Acceptance of Terms</h2>
<p>By accessing or using the VClick Media &amp; Events website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.</p>

<h2>2. Services</h2>
<p>VClick Media &amp; Events provides photography, videography, and event production services. The specific scope, deliverables, timelines, and fees for any project are defined in a separate written agreement or proposal signed by both parties.</p>

<h2>3. Intellectual Property</h2>
<p>All content on this website, including images, videos, text, and branding, is the property of VClick Media &amp; Events and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use our content without explicit written permission.</p>

<h2>4. User Content</h2>
<p>If you submit content to us (such as via contact forms), you grant us a limited, non-exclusive license to use that content solely to respond to your enquiry and provide our services.</p>

<h2>5. Limitation of Liability</h2>
<p>VClick Media &amp; Events shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services, to the maximum extent permitted by applicable law.</p>

<h2>6. Booking &amp; Cancellation</h2>
<p>Booking confirmation requires a signed contract and deposit as specified in your proposal. Cancellation terms are detailed in the individual service agreement. Late cancellations may result in forfeiture of deposits as outlined in your contract.</p>

<h2>7. Delivery of Work</h2>
<p>Delivery timelines are estimates provided in good faith. We are not liable for delays caused by circumstances beyond our reasonable control. Final deliverables are provided upon receipt of full payment.</p>

<h2>8. Third-Party Services</h2>
<p>Our website may integrate with or link to third-party services. We are not responsible for the content, privacy practices, or reliability of those services.</p>

<h2>9. Governing Law</h2>
<p>These Terms of Service are governed by the laws of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the courts of the UAE.</p>

<h2>10. Changes to Terms</h2>
<p>We reserve the right to modify these Terms of Service at any time. Continued use of our website after changes constitutes your acceptance of the updated terms.</p>

<h2>11. Contact</h2>
<p>For questions about these terms, please contact us at <a href="mailto:hello@vclickmedia.ae">hello@vclickmedia.ae</a>.</p>
`

export default function TermsOfServicePage() {
  useEffect(() => {
    document.title = 'Terms of Service — VClick Media & Events'
  }, [])

  return (
    <div className="min-h-screen bg-ink text-paper">
      <Navbar />

      <section className="pt-32 pb-14 bg-charcoal">
        <div className="section-container">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
              <FileText size={20} className="text-gold" />
            </div>
            <span className="text-xs text-gold uppercase tracking-widest font-semibold">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-paper">Terms of Service</h1>
          <p className="mt-3 text-mist text-sm">Last updated: June 2025</p>
        </div>
      </section>

      <section className="py-16">
        <div className="section-container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(STATIC_CONTENT) }}
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}
