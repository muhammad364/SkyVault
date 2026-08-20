import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@/features/account/services/account.service'
import { queryKeys } from '@/lib/queryKeys'
import type { UpdateUserProfileRequest } from '@/models/auth/UpdateUserProfileRequest'

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: UpdateUserProfileRequest) => accountService.updateProfile(request),
    onSuccess: (profile) => queryClient.setQueryData(queryKeys.auth.profile(), profile),
  })
}
