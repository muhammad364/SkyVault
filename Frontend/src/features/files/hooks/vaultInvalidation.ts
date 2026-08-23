import type { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'

export async function invalidateVaultReads(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.folders.all() }),
    queryClient.invalidateQueries({ queryKey: queryKeys.files.all() }),
    queryClient.invalidateQueries({ queryKey: queryKeys.storageQuota.current() }),
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() }),
    queryClient.invalidateQueries({ queryKey: queryKeys.recycleBin.items() }),
    queryClient.invalidateQueries({ queryKey: queryKeys.sharing.own() }),
    queryClient.invalidateQueries({ queryKey: queryKeys.search.all() }),
  ])
}
