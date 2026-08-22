import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/auth.store'
import { clearFileOperations } from '@/features/files/store/fileOperations.store'

export async function clearClientSession() {
  clearFileOperations()
  await queryClient.cancelQueries()
  queryClient.removeQueries()
  useAuthStore.getState().clearSession()
}
