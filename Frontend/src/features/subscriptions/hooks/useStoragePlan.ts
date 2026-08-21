import { useQuery } from '@tanstack/react-query'
import { subscriptionsService } from '@/features/subscriptions/services/subscriptions.service'
import { queryKeys } from '@/lib/queryKeys'

export function useStoragePlan(storagePlanId: string) {
  return useQuery({
    queryKey: queryKeys.storagePlans.detail(storagePlanId),
    queryFn: ({ signal }) => subscriptionsService.getPlan(storagePlanId, signal),
    enabled: storagePlanId.length > 0,
  })
}
