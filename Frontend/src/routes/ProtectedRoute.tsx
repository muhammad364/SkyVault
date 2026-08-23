import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAdmin, selectIsAuthenticated, useAuthStore } from '@/store/auth.store'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isAdmin = useAuthStore(selectIsAdmin)
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/auth/login" replace state={{ from: location }} />
  if (isAdmin) return <Navigate to="/admin" replace />

  return children
}
