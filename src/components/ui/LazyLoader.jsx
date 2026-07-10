// This is the Suspense fallback shown while lazy route chunks load, so it
// renders before framer-motion's async chunk is guaranteed to be available —
// a plain CSS spin (Tailwind's built-in animate-spin) avoids that dependency
// entirely instead of racing it.

export function SkeletonBlock({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-800/50 rounded-lg ${className}`} />
  )
}

export function PageSpinner({ message = 'Loading…' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-yellow-400 animate-spin" />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}

export function AdminPageSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-yellow-400 animate-spin" />
    </div>
  )
}

export default PageSpinner
