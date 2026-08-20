import { apiClient } from '@/api/client'
import type { StoragePlanResponse } from '@/models/storagePlan/StoragePlanResponse'

const BASE = '/api/storage-plans'

export const storagePlansApi = {
  getAllPlans: (signal?: AbortSignal) =>
    apiClient.get<StoragePlanResponse[]>(BASE, { signal }).then((response) => response.data),
}
