import { useQuery } from '@tanstack/react-query'
import { subscriptionsService } from '@/features/subscriptions/services/subscriptions.service'
import { queryKeys } from '@/lib/queryKeys'

export function useStoragePlans() {
  return useQuery({
    queryKey: queryKeys.storagePlans.public(),
    queryFn: ({ signal }) => subscriptionsService.listPlans(signal),
  })
}
