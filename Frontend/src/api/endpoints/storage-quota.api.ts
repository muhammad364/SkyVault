import { apiClient } from '@/api/client'
import type { StorageQuotaResponse } from '@/models/storage/StorageQuotaResponse'

const BASE = '/api/storage/quota'

export const storageQuotaApi = {
  getMyStorageQuota: (signal?: AbortSignal) =>
    apiClient.get<StorageQuotaResponse>(BASE, { signal }).then((response) => response.data),
}
