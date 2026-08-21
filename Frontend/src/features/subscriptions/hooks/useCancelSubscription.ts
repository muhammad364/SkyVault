import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateStorageQueries } from '@/features/subscriptions/hooks/storageQueryInvalidation'
import { subscriptionsService } from '@/features/subscriptions/services/subscriptions.service'
import { queryKeys } from '@/lib/queryKeys'

export function useCancelSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => subscriptionsService.cancel(),
    onSuccess: async (subscription) => {
      queryClient.setQueryData(queryKeys.subscriptions.current(), subscription)
      await invalidateStorageQueries(queryClient)
    },
  })
}
