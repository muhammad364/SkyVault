import { useMutation, useQueryClient } from '@tanstack/react-query'
import { additionalStorageService } from '@/features/subscriptions/services/additionalStorage.service'
import { invalidateStorageQueries } from '@/features/subscriptions/hooks/storageQueryInvalidation'
import type { PurchaseAdditionalStorageRequest } from '@/models/additionalStorage/PurchaseAdditionalStorageRequest'

export function usePurchaseAdditionalStorage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: PurchaseAdditionalStorageRequest) =>
      additionalStorageService.purchase(request),
    onSuccess: async () => invalidateStorageQueries(queryClient),
  })
}
