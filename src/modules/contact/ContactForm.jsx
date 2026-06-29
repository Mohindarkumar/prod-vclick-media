import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, User, Mail, Phone, MessageSquare } from 'lucide-react'
import Button from '../../components/common/Button'

const INITIAL_VALUES = { name: '', email: '', phone: '', message: '', _hp: '' }
const EMAIL_PATTERN  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ContactForm() {
  const [values,      setValues]      = useState(INITIAL_VALUES)
  const [errors,      setErrors]      = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting,  setSubmitting]  = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!values.name.trim())    nextErrors.name    = 'Please enter your name.'
    if (!values.email.trim()) {
      nextErrors.email = 'Please enter your email.'
    } else if (!EMAIL_PATTERN.test(values.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }
    if (!values.phone.trim())   nextErrors.phone   = 'Please enter your phone number.'
    if (!values.message.trim()) nextErrors.message = 'Tell us a little about your event.'
    return nextErrors
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (values._hp) return

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setErrors((prev) => ({ ...prev, _form: undefined }))

    const formData = new FormData()
    formData.append('name',    values.name)
    formData.append('email',   values.email)
    formData.append('phone',   values.phone)
    formData.append('message', values.message)
    formData.append('_hp',     values._hp)

    try {
      const res  = await fetch('/contact.php', { method: 'POST', body: formData })
      const text = await res.text()

      let json
      try {
        json = JSON.parse(text)
      } catch {
        throw new Error('Server error. Please try again or reach us via WhatsApp.')
      }

      if (json.success) {
        setShowSuccess(true)
        setValues(INITIAL_VALUES)
        setTimeout(() => setShowSuccess(false), 6000)
      } else {
        setErrors((prev) => ({ ...prev, _form: json.message || 'Something went wrong. Please try again.' }))
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, _form: err.message || 'Network error. Please check your connection and try again.' }))
    } finally {
      setSubmitting(false)
    }
  }

  const fields = [
    { name: 'name',  label: 'Name',  type: 'text',  icon: User,  placeholder: 'Your full name' },
    { name: 'email', label: 'Email', type: 'email', icon: Mail,  placeholder: 'you@example.com' },
    { name: 'phone', label: 'Phone', type: 'tel',   icon: Phone, placeholder: '+971 50 000 0000' },
  ]

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — hidden from real users, traps bots */}
      <input
        type="text"
        name="_hp"
        value={values._hp}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
      />

      {fields.map((field) => {
        const Icon  = field.icon
        const error = errors[field.name]
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-paper mb-2">
              {field.label}
            </label>
            <div className="relative">
              <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" />
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={values[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${field.name}-error` : undefined}
                className={`w-full bg-white/5 border rounded-xl pl-11 pr-4 py-3 text-sm text-paper placeholder:text-mist/60 focus:outline-none focus:ring-2 focus:ring-gold transition-colors duration-200 ${
                  error ? 'border-red-500/60' : 'border-white/10 focus:border-gold/50'
                }`}
              />
            </div>
            {error && (
              <p id={`${field.name}-error`} className="mt-1.5 text-xs text-red-400">{error}</p>
            )}
          </div>
        )
      })}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-paper mb-2">
          Message
        </label>
        <div className="relative">
          <MessageSquare size={17} className="absolute left-4 top-4 text-mist" />
          <textarea
            id="message"
            name="message"
            rows={4}
            value={values.message}
            onChange={handleChange}
            placeholder="Tell us about your event — date, location, and what you have in mind."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={`w-full bg-white/5 border rounded-xl pl-11 pr-4 py-3 text-sm text-paper placeholder:text-mist/60 focus:outline-none focus:ring-2 focus:ring-gold resize-none transition-colors duration-200 ${
              errors.message ? 'border-red-500/60' : 'border-white/10 focus:border-gold/50'
            }`}
          />
        </div>
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-red-400">{errors.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" icon={Send} className="w-full" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send Message'}
      </Button>

      {errors._form && (
        <p className="text-sm text-red-400 text-center">{errors._form}</p>
      )}

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="status"
            className="flex items-center gap-2.5 bg-gold/10 border border-gold/30 text-gold text-sm rounded-xl px-4 py-3"
          >
            <CheckCircle2 size={18} />
            Thanks! Your message has been sent — we&apos;ll be in touch shortly.
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}

export default ContactForm
