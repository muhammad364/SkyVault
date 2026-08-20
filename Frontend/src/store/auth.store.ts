import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isSessionActive } from '@/features/auth/lib/session'

export type UserRole = 'user' | 'admin'

export interface AuthSession {
  accessToken: string
  expiresAt: string
  role?: UserRole
}

interface AuthState {
  session: AuthSession | null
  setSession: (session: AuthSession) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    { name: 'skyvault-auth-session' },
  ),
)

export function selectIsAuthenticated(state: AuthState) {
  return isSessionActive(state.session)
}

export function selectIsAdmin(state: AuthState) {
  return state.session?.role === 'admin'
}
