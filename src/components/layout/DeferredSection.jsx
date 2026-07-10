import { useEffect, useRef, useState } from 'react'

// `content-visibility: auto` was tried here first — it only defers the
// browser's own layout/paint pipeline, not React's component execution, so
// it left the actual bottleneck (1,500+ main-thread tasks from every
// section's whileInView/IntersectionObserver setup firing synchronously on
// mount) completely untouched. This instead defers the React mount itself:
// each section renders a height-reserving placeholder (no CLS) until the
// main thread has gone idle at least once after first paint, so Hero's
// content gets a clear run at LCP before the other ~10 sections' animation
// setup work starts competing for main-thread time.
const requestIdle =
  typeof window !== 'undefined' && window.requestIdleCallback
    ? window.requestIdleCallback
    : (cb) => setTimeout(cb, 1)

const cancelIdle =
  typeof window !== 'undefined' && window.cancelIdleCallback
    ? window.cancelIdleCallback
    : clearTimeout

// `stagger` spreads each section's mount across its own idle callback instead
// of letting all ~10 fire in the same burst the moment the thread first goes
// idle — an unstaggered version measurably improved LCP (Hero gets priority)
// but made total main-thread time and TBT worse (all that deferred work just
// landed in one dense clump right after). Staggering by section order lets
// the browser interleave paint/input opportunities between each section's
// setup instead of running all of them back-to-back.
function DeferredSection({ children, minHeight = 800, stagger = 0 }) {
  const [ready, setReady] = useState(false)
  const idRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      idRef.current = requestIdle(() => setReady(true), { timeout: 300 })
    }, stagger)
    return () => {
      clearTimeout(timerRef.current)
      cancelIdle(idRef.current)
    }
  }, [stagger])

  if (!ready) {
    return <div style={{ minHeight }} aria-hidden="true" />
  }

  return children
}

export default DeferredSection
