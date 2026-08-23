import { apiClient } from '@/api/client'
import type {
  CreateStorageAccountRequest,
  StorageAccountResponse,
  UpdateStorageAccountRequest,
} from '@/models/storageAccount/StorageAccount'

const BASE = '/api/storage-accounts'

export const storageAccountsApi = {
  getAll: (isActive: boolean | null, signal?: AbortSignal) =>
    apiClient
      .get<StorageAccountResponse[]>(BASE, {
        signal,
        params: { isActive: isActive ?? undefined },
      })
      .then((response) => response.data),
  getById: (storageAccountId: string, signal?: AbortSignal) =>
    apiClient
      .get<StorageAccountResponse>(`${BASE}/${storageAccountId}`, { signal })
      .then((response) => response.data),
  create: (request: CreateStorageAccountRequest, signal?: AbortSignal) =>
    apiClient
      .post<StorageAccountResponse>(BASE, request, { signal, timeout: 0 })
      .then((response) => response.data),
  update: (storageAccountId: string, request: UpdateStorageAccountRequest, signal?: AbortSignal) =>
    apiClient
      .put<StorageAccountResponse>(`${BASE}/${storageAccountId}`, request, {
        signal,
        timeout: 0,
      })
      .then((response) => response.data),
  activate: (storageAccountId: string, signal?: AbortSignal) =>
    apiClient
      .patch<StorageAccountResponse>(`${BASE}/${storageAccountId}/activate`, undefined, {
        signal,
        timeout: 0,
      })
      .then((response) => response.data),
  deactivate: (storageAccountId: string, signal?: AbortSignal) =>
    apiClient
      .patch<StorageAccountResponse>(`${BASE}/${storageAccountId}/deactivate`, undefined, {
        signal,
        timeout: 0,
      })
      .then((response) => response.data),
}
