import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, useAuthStore } from '@/store/auth.store'

export function PublicRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const location = useLocation()
  const from = location.state as { from?: { pathname?: string } } | null
  const redirectTo = from?.from?.pathname ?? '/vault'

  if (isAuthenticated) return <Navigate to={redirectTo} replace />

  return children
}
