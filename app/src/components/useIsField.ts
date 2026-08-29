// Below 640px the pro surfaces render their field projections (P0-9, brief
// §10.1): the calendar drops its team grid, the work ledger becomes the Today
// list, and the bottom tab bar appears. One hook, so every surface flips at
// the same width.
import { useEffect, useState } from 'react'

const FIELD_QUERY = '(max-width: 640px)'

export function useIsField() {
  const [isField, setIsField] = useState(() => window.matchMedia(FIELD_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(FIELD_QUERY)
    const onChange = () => setIsField(mq.matches)
    mq.addEventListener('change', onChange)
    // Some embedded/emulated viewports resize without a media-query change
    // event; re-reading on resize is idempotent and keeps the two views honest.
    window.addEventListener('resize', onChange)
    return () => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener('resize', onChange)
    }
  }, [])
  return isField
}
