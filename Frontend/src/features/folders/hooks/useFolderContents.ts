import { useQuery } from '@tanstack/react-query'
import { foldersService } from '@/features/folders/services/folders.service'
import { queryKeys } from '@/lib/queryKeys'

export function useFolderContents(folderId: string | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.folders.contents(folderId),
    queryFn: ({ signal }) => foldersService.getContentsFor(folderId, signal),
    enabled,
  })
}

export function useFolderAncestry(folderId: string | null) {
  return useQuery({
    queryKey: queryKeys.folders.ancestry(folderId),
    queryFn: ({ signal }) => foldersService.getAncestry(folderId, signal),
    enabled: folderId !== null,
  })
}
