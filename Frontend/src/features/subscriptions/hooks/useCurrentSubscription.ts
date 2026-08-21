import { useQuery } from '@tanstack/react-query'
import { subscriptionsService } from '@/features/subscriptions/services/subscriptions.service'
import { queryKeys } from '@/lib/queryKeys'

export function useCurrentSubscription() {
  return useQuery({
    queryKey: queryKeys.subscriptions.current(),
    queryFn: ({ signal }) => subscriptionsService.getCurrent(signal),
  })
}
