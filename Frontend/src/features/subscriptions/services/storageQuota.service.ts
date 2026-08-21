import { storageQuotaApi } from '@/api/endpoints/storage-quota.api'

export const storageQuotaService = {
  getCurrent: (signal?: AbortSignal) => storageQuotaApi.getMyStorageQuota(signal),
}
