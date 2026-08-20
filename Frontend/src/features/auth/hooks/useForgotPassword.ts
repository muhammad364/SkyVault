import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services/auth.service'
import type { ForgotPasswordRequest } from '@/models/auth/ForgotPasswordRequest'

export function useForgotPassword() {
  return useMutation({ mutationFn: (request: ForgotPasswordRequest) => authService.forgotPassword(request) })
}
