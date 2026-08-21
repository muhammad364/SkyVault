import { useQuery } from '@tanstack/react-query'
import { storageQuotaService } from '@/features/subscriptions/services/storageQuota.service'
import { queryKeys } from '@/lib/queryKeys'

export function useStorageQuota() {
  return useQuery({
    queryKey: queryKeys.storageQuota.current(),
    queryFn: ({ signal }) => storageQuotaService.getCurrent(signal),
  })
}
