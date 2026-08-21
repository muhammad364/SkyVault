import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateStorageQueries } from '@/features/subscriptions/hooks/storageQueryInvalidation'
import { subscriptionsService } from '@/features/subscriptions/services/subscriptions.service'
import { queryKeys } from '@/lib/queryKeys'
import type { RenewSubscriptionRequest } from '@/models/subscription/RenewSubscriptionRequest'

export function useRenewSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: RenewSubscriptionRequest) => subscriptionsService.renew(request),
    onSuccess: async (subscription) => {
      queryClient.setQueryData(queryKeys.subscriptions.current(), subscription)
      await invalidateStorageQueries(queryClient)
    },
  })
}
