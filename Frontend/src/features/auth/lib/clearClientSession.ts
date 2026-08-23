import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/auth.store'
import { clearFileOperations } from '@/features/files/store/fileOperations.store'
import { clearSearchHistory } from '@/features/search/store/searchHistory.store'

export async function clearClientSession() {
  clearFileOperations()
  clearSearchHistory()
  await queryClient.cancelQueries()
  queryClient.removeQueries()
  useAuthStore.getState().clearSession()
}
