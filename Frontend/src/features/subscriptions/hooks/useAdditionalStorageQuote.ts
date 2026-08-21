import { useQuery } from '@tanstack/react-query'
import { additionalStorageService } from '@/features/subscriptions/services/additionalStorage.service'
import { queryKeys } from '@/lib/queryKeys'

export function useAdditionalStorageQuote(storageAmountGb: number | null) {
  return useQuery({
    queryKey: queryKeys.additionalStorage.quote(storageAmountGb ?? 0),
    queryFn: ({ signal }) =>
      additionalStorageService.quote({ storageAmountGb: storageAmountGb ?? 0 }, signal),
    enabled: storageAmountGb !== null,
  })
}
