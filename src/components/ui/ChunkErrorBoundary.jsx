import { Component } from 'react'

const RELOAD_FLAG = 'vclick-chunk-reload'

// Catches failed lazy-route chunk loads (e.g. a visitor on a stale index.html
// after a redeploy replaces hashed asset filenames) and self-heals with a
// single automatic reload instead of leaving the Suspense fallback spinning forever.
export default class ChunkErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidMount() {
    // Give the reload flag a few seconds to clear once this render is stable,
    // so a later, unrelated chunk failure (e.g. after navigating) still gets
    // its own automatic reload attempt instead of going straight to the button.
    this._clearTimer = setTimeout(() => sessionStorage.removeItem(RELOAD_FLAG), 5000)
  }

  componentWillUnmount() {
    clearTimeout(this._clearTimer)
  }

  componentDidCatch() {
    if (!sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1')
      window.location.reload()
    }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
          <p className="text-sm text-mist">
            This page failed to load. Please refresh to try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-full border border-gold text-gold text-sm hover:bg-gold hover:text-ink transition-colors"
          >
            Refresh
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
