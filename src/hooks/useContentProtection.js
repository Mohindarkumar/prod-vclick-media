import { useEffect } from 'react'

const BLOCKED_KEY_COMBOS = [
  { key: 'F12' },
  { key: 'I', ctrl: true, shift: true },
  { key: 'J', ctrl: true, shift: true },
  { key: 'C', ctrl: true, shift: true },
  { key: 'U', ctrl: true },
]

function isBlockedCombo(event) {
  const key = event.key?.toUpperCase()
  return BLOCKED_KEY_COMBOS.some((combo) => {
    if (combo.key !== key) return false
    if (combo.ctrl && !(event.ctrlKey || event.metaKey)) return false
    if (combo.shift && !event.shiftKey) return false
    return true
  })
}

/**
 * Best-effort deterrent against right-click, devtools shortcuts, and image
 * drag/save. This is a UX-level deterrent only — it cannot stop a determined
 * user (view-source, browser devtools protocol, disabling JS, etc.) and must
 * not be relied on as an actual security control.
 */
export default function useContentProtection(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleContextMenu = (event) => event.preventDefault()
    const handleDragStart = (event) => {
      if (event.target?.tagName === 'IMG') event.preventDefault()
    }
    const handleKeyDown = (event) => {
      if (isBlockedCombo(event)) event.preventDefault()
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled])
}
