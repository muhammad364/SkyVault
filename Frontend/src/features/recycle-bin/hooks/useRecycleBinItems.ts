import { useQuery } from '@tanstack/react-query'
import { recycleBinService } from '@/features/recycle-bin/services/recycleBin.service'
import { queryKeys } from '@/lib/queryKeys'

export function useRecycleBinItems() {
  return useQuery({
    queryKey: queryKeys.recycleBin.items(),
    queryFn: ({ signal }) => recycleBinService.getItems(signal),
  })
}
