import { useMutation } from '@tanstack/react-query'
import { accountService } from '@/features/account/services/account.service'
import type { ChangePasswordRequest } from '@/models/auth/ChangePasswordRequest'

export function useChangePassword() {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) => accountService.changePassword(request),
  })
}
