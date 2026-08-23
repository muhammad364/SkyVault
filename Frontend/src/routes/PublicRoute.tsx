import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAdmin, selectIsAuthenticated, useAuthStore } from '@/store/auth.store'

export function PublicRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isAdmin = useAuthStore(selectIsAdmin)
  const location = useLocation()
  const from = location.state as { from?: { pathname?: string } } | null
  const requestedPath = from?.from?.pathname
  const redirectTo = isAdmin
    ? requestedPath?.startsWith('/admin')
      ? requestedPath
      : '/admin'
    : requestedPath?.startsWith('/vault')
      ? requestedPath
      : '/vault'

  if (isAuthenticated) return <Navigate to={redirectTo} replace />

  return children
}
