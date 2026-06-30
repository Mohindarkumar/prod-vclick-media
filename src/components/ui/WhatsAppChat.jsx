import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { siteConfig } from '../../config/site.config'

const { whatsapp: waConfig, theme } = siteConfig

function WhatsAppIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function WhatsAppChat() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messageInit, setMessageInit] = useState(false)

  if (!waConfig.enabled) return null

  const phone    = waConfig.phone.replace(/[^0-9+]/g, '')
  const preset   = waConfig.message
  const label    = waConfig.label
  const position = waConfig.position
  const color    = theme.primaryColor

  const isRight    = position !== 'bottom-left'
  const sideClass  = isRight ? 'right-5 sm:right-6' : 'left-5 sm:left-6'
  const panelAlign = isRight ? 'right-0' : 'left-0'

  const handleOpen = () => {
    if (!messageInit) { setMessage(preset); setMessageInit(true) }
    setOpen(true)
  }

  const handleSend = () => {
    if (!phone || !message.trim()) return
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className={`fixed ${sideClass} z-50`}
      style={{ bottom: 'max(24px, calc(env(safe-area-inset-bottom, 0px) + 20px))' }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute bottom-[72px] ${panelAlign} w-[min(320px,calc(100vw-40px))] bg-white rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: color }}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white">
                <WhatsAppIcon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">{label}</p>
                <p className="text-xs text-white/75 mt-0.5">Typically replies instantly</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Close chat"
              >
                <X size={17} />
              </button>
            </div>

            {/* Chat bubble */}
            <div className="px-4 pt-4 pb-3 bg-[#ECE5DD]">
              <div className="bg-white rounded-xl rounded-tl-none px-3 py-2.5 shadow-sm max-w-[85%]">
                <p className="text-sm text-gray-700 leading-snug">👋 Hi there! Send us a message and we'll get back to you on WhatsApp.</p>
                <p className="text-[10px] text-gray-400 mt-1 text-right">Now</p>
              </div>
            </div>

            {/* Compose */}
            <div className="px-4 pb-4 bg-[#ECE5DD] space-y-2">
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || !phone}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-40"
                style={{ backgroundColor: color }}
              >
                <Send size={15} />
                Send Message
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={open ? () => setOpen(false) : handleOpen}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ backgroundColor: color, boxShadow: `0 4px 20px ${color}55` }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open WhatsApp chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="wa"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <WhatsAppIcon size={26} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
