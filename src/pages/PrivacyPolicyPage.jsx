import { useEffect } from 'react'
import { motion } from 'framer-motion'
import DOMPurify from 'dompurify'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Shield } from 'lucide-react'

const STATIC_CONTENT = `
<h2>1. Information We Collect</h2>
<p>When you use our website or contact us, we may collect information such as your name, email address, phone number, and details about your event enquiry. We collect this information only when you voluntarily provide it to us through our contact form or other communications.</p>

<h2>2. How We Use Your Information</h2>
<p>We use the information you provide to:</p>
<ul>
  <li>Respond to your enquiries and provide our services</li>
  <li>Send you relevant communications about your project</li>
  <li>Improve our website and services</li>
  <li>Comply with our legal obligations</li>
</ul>

<h2>3. Information Sharing</h2>
<p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or as necessary to provide our services (e.g., email service providers).</p>

<h2>4. Data Security</h2>
<p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>

<h2>5. Cookies</h2>
<p>Our website may use cookies to enhance your experience. You can choose to disable cookies through your browser settings, though this may affect some website functionality.</p>

<h2>6. Third-Party Links</h2>
<p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.</p>

<h2>7. Your Rights</h2>
<p>You have the right to access, correct, or delete any personal information we hold about you. To exercise these rights, please contact us at the email below.</p>

<h2>8. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date.</p>

<h2>9. Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@vclickmedia.ae">hello@vclickmedia.ae</a>.</p>
`

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy — VClick Media & Events'
  }, [])

  return (
    <div className="min-h-screen bg-ink text-paper">
      <Navbar />

      <section className="pt-32 pb-14 bg-charcoal">
        <div className="section-container">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
              <Shield size={20} className="text-gold" />
            </div>
            <span className="text-xs text-gold uppercase tracking-widest font-semibold">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-paper">Privacy Policy</h1>
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
