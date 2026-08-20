import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services/auth.service'
import type { VerifyEmailRequest } from '@/models/auth/VerifyEmailRequest'

export function useVerifyEmail() {
  return useMutation({ mutationFn: (request: VerifyEmailRequest) => authService.verifyEmail(request) })
}
