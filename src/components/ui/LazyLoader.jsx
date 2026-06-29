import { motion } from 'framer-motion'

export function SkeletonBlock({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-800/50 rounded-lg ${className}`} />
  )
}

export function PageSpinner({ message = 'Loading…' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <motion.div
        className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-yellow-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}

export function AdminPageSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-yellow-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export default PageSpinner
