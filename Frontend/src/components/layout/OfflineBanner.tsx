import { WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== 'undefined' && !navigator.onLine,
  )

  useEffect(() => {
    const updateOnline = () => setIsOffline(false)
    const updateOffline = () => setIsOffline(true)

    window.addEventListener('online', updateOnline)
    window.addEventListener('offline', updateOffline)
    return () => {
      window.removeEventListener('online', updateOnline)
      window.removeEventListener('offline', updateOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <aside
      className="fixed inset-x-3 bottom-20 z-50 rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground shadow-float md:bottom-5 md:left-auto md:right-5 md:max-w-md"
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-3">
        <WifiOff aria-hidden="true" size={18} className="text-warning" />
        You're offline. We'll reconnect to your vault automatically.
      </span>
    </aside>
  )
}
