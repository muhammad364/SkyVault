import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { publicPlansService } from '@/features/marketing/services/publicPlans.service'

export function usePublicStoragePlans() {
  return useQuery({
    queryKey: queryKeys.storagePlans.public(),
    queryFn: ({ signal }) => publicPlansService.list(signal),
  })
}
