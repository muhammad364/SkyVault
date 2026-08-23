import { useMutation } from '@tanstack/react-query'
import { createAuthSession } from '@/features/auth/lib/session'
import { authService } from '@/features/auth/services/auth.service'
import type { LoginRequest } from '@/models/auth/LoginRequest'
import { useAuthStore, type UserRole } from '@/store/auth.store'

export class LoginRoleMismatchError extends Error {
  constructor(readonly expectedRole: UserRole) {
    super('The authenticated account role does not match the selected sign-in type.')
    this.name = 'LoginRoleMismatchError'
  }
}

export function useLogin(expectedRole: UserRole = 'user') {
  const setSession = useAuthStore((state) => state.setSession)
  return useMutation({
    mutationFn: async (request: LoginRequest) => {
      const response = await authService.login(request)
      if (createAuthSession(response).role !== expectedRole) {
        throw new LoginRoleMismatchError(expectedRole)
      }
      return response
    },
    onSuccess: (response) => setSession(createAuthSession(response)),
  })
}
