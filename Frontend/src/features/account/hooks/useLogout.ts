import { useMutation } from '@tanstack/react-query'
import { clearClientSession } from '@/features/auth/lib/clearClientSession'
import { accountService } from '@/features/account/services/account.service'

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      try {
        return await accountService.logout()
      } finally {
        await clearClientSession()
      }
    },
  })
}
