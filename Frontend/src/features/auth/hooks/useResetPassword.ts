import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services/auth.service'
import type { ResetPasswordRequest } from '@/models/auth/ResetPasswordRequest'

export function useResetPassword() {
  return useMutation({ mutationFn: (request: ResetPasswordRequest) => authService.resetPassword(request) })
}
