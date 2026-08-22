import { useQuery } from '@tanstack/react-query'
import { filesService } from '@/features/files/services/files.service'
import { queryKeys } from '@/lib/queryKeys'

export function useUserFiles() {
  return useQuery({
    queryKey: queryKeys.files.all(),
    queryFn: ({ signal }) => filesService.getUserFiles(signal),
  })
}
