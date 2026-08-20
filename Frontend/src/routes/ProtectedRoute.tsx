import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, useAuthStore } from '@/store/auth.store'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/auth/login" replace state={{ from: location }} />

  return children
}
