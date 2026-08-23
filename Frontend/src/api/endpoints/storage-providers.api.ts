import { apiClient } from '@/api/client'
import type {
  CreateStorageProviderRequest,
  StorageProviderResponse,
  UpdateStorageProviderRequest,
} from '@/models/storageProvider/StorageProvider'

const BASE = '/api/storage-providers'

export const storageProvidersApi = {
  getAll: (signal?: AbortSignal) =>
    apiClient.get<StorageProviderResponse[]>(BASE, { signal }).then((response) => response.data),
  getById: (providerId: string, signal?: AbortSignal) =>
    apiClient
      .get<StorageProviderResponse>(`${BASE}/${providerId}`, { signal })
      .then((response) => response.data),
  create: (request: CreateStorageProviderRequest, signal?: AbortSignal) =>
    apiClient
      .post<StorageProviderResponse>(BASE, request, { signal, timeout: 0 })
      .then((response) => response.data),
  update: (providerId: string, request: UpdateStorageProviderRequest, signal?: AbortSignal) =>
    apiClient
      .put<StorageProviderResponse>(`${BASE}/${providerId}`, request, { signal, timeout: 0 })
      .then((response) => response.data),
  activate: (providerId: string, signal?: AbortSignal) =>
    apiClient
      .patch<StorageProviderResponse>(`${BASE}/${providerId}/activate`, undefined, {
        signal,
        timeout: 0,
      })
      .then((response) => response.data),
  deactivate: (providerId: string, signal?: AbortSignal) =>
    apiClient
      .patch<StorageProviderResponse>(`${BASE}/${providerId}/deactivate`, undefined, {
        signal,
        timeout: 0,
      })
      .then((response) => response.data),
}
