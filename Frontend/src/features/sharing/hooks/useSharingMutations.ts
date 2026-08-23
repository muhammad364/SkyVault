import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sharingService } from '@/features/sharing/services/sharing.service'
import { queryKeys } from '@/lib/queryKeys'
import type { GenerateShareLinkRequest } from '@/models/sharing/GenerateShareLinkRequest'

async function invalidateSharing(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.invalidateQueries({ queryKey: queryKeys.sharing.own() })
}

export function useGenerateShareLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: GenerateShareLinkRequest) => sharingService.generateShareLink(request),
    onSuccess: () => invalidateSharing(queryClient),
  })
}

export function useRevokeShareLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (shareLinkId: string) => sharingService.revokeShareLink(shareLinkId),
    onSuccess: () => invalidateSharing(queryClient),
  })
}
