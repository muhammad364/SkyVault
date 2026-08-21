import type { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'

export function invalidateStorageQueries(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.current() }),
    queryClient.invalidateQueries({ queryKey: queryKeys.storageQuota.current() }),
    queryClient.invalidateQueries({ queryKey: queryKeys.additionalStorage.purchases() }),
  ])
}
