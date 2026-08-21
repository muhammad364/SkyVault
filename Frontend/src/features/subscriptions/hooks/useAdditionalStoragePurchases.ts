import { useQuery } from '@tanstack/react-query'
import { additionalStorageService } from '@/features/subscriptions/services/additionalStorage.service'
import { queryKeys } from '@/lib/queryKeys'

export function useAdditionalStoragePurchases() {
  return useQuery({
    queryKey: queryKeys.additionalStorage.purchases(),
    queryFn: ({ signal }) => additionalStorageService.listPurchases(signal),
  })
}
