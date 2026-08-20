import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services/auth.service'
import type { ResendVerificationRequest } from '@/models/auth/ResendVerificationRequest'

export function useResendVerification() {
  return useMutation({ mutationFn: (request: ResendVerificationRequest) => authService.resendVerification(request) })
}
