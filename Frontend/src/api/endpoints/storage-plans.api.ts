import { apiClient } from '@/api/client'
import type { StoragePlanResponse } from '@/models/storagePlan/StoragePlanResponse'
import type {
  CreateStoragePlanRequest,
  UpdateStoragePlanRequest,
} from '@/models/storagePlan/StoragePlanRequests'

const BASE = '/api/storage-plans'

export const storagePlansApi = {
  getAllPlans: (signal?: AbortSignal) =>
    apiClient.get<StoragePlanResponse[]>(BASE, { signal }).then((response) => response.data),
  getPlanById: (storagePlanId: string, signal?: AbortSignal) =>
    apiClient
      .get<StoragePlanResponse>(`${BASE}/${storagePlanId}`, { signal })
      .then((response) => response.data),
  create: (request: CreateStoragePlanRequest, signal?: AbortSignal) =>
    apiClient
      .post<StoragePlanResponse>(BASE, request, { signal, timeout: 0 })
      .then((response) => response.data),
  update: (storagePlanId: string, request: UpdateStoragePlanRequest, signal?: AbortSignal) =>
    apiClient
      .put<StoragePlanResponse>(`${BASE}/${storagePlanId}`, request, { signal, timeout: 0 })
      .then((response) => response.data),
  activate: (storagePlanId: string, signal?: AbortSignal) =>
    apiClient
      .patch<StoragePlanResponse>(`${BASE}/${storagePlanId}/activate`, undefined, {
        signal,
        timeout: 0,
      })
      .then((response) => response.data),
  deactivate: (storagePlanId: string, signal?: AbortSignal) =>
    apiClient
      .patch<StoragePlanResponse>(`${BASE}/${storagePlanId}/deactivate`, undefined, {
        signal,
        timeout: 0,
      })
      .then((response) => response.data),
}
