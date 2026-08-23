import { sharingApi } from '@/api/endpoints/sharing.api'
import type { SharedFileTransferOptions } from '@/api/endpoints/sharing.api'
import type { GenerateShareLinkRequest } from '@/models/sharing/GenerateShareLinkRequest'

export const sharingService = {
  getOwnShareLinks: (signal?: AbortSignal) => sharingApi.getOwnShareLinks(signal),
  generateShareLink: (request: GenerateShareLinkRequest, signal?: AbortSignal) =>
    sharingApi.generateShareLink(request, signal),
  revokeShareLink: (shareLinkId: string, signal?: AbortSignal) =>
    sharingApi.revokeShareLink(shareLinkId, signal),
  previewSharedFile: (shareToken: string, options?: SharedFileTransferOptions) =>
    sharingApi.previewSharedFile(shareToken, options),
  downloadSharedFile: (shareToken: string, options?: SharedFileTransferOptions) =>
    sharingApi.downloadSharedFile(shareToken, options),
}
