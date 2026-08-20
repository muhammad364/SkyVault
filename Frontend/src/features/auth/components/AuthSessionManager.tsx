import { useEffect } from 'react'
import { clearClientSession } from '@/features/auth/lib/clearClientSession'
import { isSessionActive } from '@/features/auth/lib/session'
import { useAuthStore } from '@/store/auth.store'

export function AuthSessionManager() {
  const session = useAuthStore((state) => state.session)

  useEffect(() => {
    if (!session) return
    if (!isSessionActive(session)) {
      void clearClientSession()
      return
    }

    const delay = Date.parse(session.expiresAt) - Date.now()
    const timer = window.setTimeout(() => void clearClientSession(), delay)
    return () => window.clearTimeout(timer)
  }, [session])

  return null
}
