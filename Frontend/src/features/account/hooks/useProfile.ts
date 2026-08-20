import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/features/account/services/account.service'
import { queryKeys } from '@/lib/queryKeys'

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: ({ signal }) => accountService.getProfile(signal),
  })
}
