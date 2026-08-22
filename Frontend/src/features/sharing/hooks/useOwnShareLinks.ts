import { useQuery } from '@tanstack/react-query'
import { sharingService } from '@/features/sharing/services/sharing.service'
import { queryKeys } from '@/lib/queryKeys'

export function useOwnShareLinks() {
  return useQuery({
    queryKey: queryKeys.sharing.own(),
    queryFn: ({ signal }) => sharingService.getOwnShareLinks(signal),
  })
}
