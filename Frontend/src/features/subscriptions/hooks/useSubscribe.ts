import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionsService } from '@/features/subscriptions/services/subscriptions.service'
import { invalidateStorageQueries } from '@/features/subscriptions/hooks/storageQueryInvalidation'
import { queryKeys } from '@/lib/queryKeys'
import type { SubscribeRequest } from '@/models/subscription/SubscribeRequest'

export function useSubscribe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: SubscribeRequest) => subscriptionsService.subscribe(request),
    onSuccess: async (subscription) => {
      queryClient.setQueryData(queryKeys.subscriptions.current(), subscription)
      await invalidateStorageQueries(queryClient)
    },
  })
}
