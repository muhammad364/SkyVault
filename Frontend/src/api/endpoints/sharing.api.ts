import { apiClient } from '@/api/client'
import type { GenerateShareLinkResponse } from '@/models/sharing/GenerateShareLinkResponse'

const BASE = '/api/share-links'

export const sharingApi = {
  getOwnShareLinks: (signal?: AbortSignal) =>
    apiClient.get<GenerateShareLinkResponse[]>(BASE, { signal }).then((response) => response.data),
}
