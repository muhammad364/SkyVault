import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/auth.store'

export async function clearClientSession() {
  await queryClient.cancelQueries()
  queryClient.removeQueries()
  useAuthStore.getState().clearSession()
}
