import { apiClient } from '@/api/client'
import type { AdditionalStorageQuoteRequest } from '@/models/additionalStorage/AdditionalStorageQuoteRequest'
import type { AdditionalStorageQuoteResponse } from '@/models/additionalStorage/AdditionalStorageQuoteResponse'
import type { PurchaseAdditionalStorageRequest } from '@/models/additionalStorage/PurchaseAdditionalStorageRequest'
import type { PurchaseAdditionalStorageResponse } from '@/models/additionalStorage/PurchaseAdditionalStorageResponse'

const BASE = '/api/additional-storage'

export const additionalStorageApi = {
  getQuote: (request: AdditionalStorageQuoteRequest, signal?: AbortSignal) =>
    apiClient
      .post<AdditionalStorageQuoteResponse>(`${BASE}/quote`, request, { signal })
      .then((response) => response.data),
  purchase: (request: PurchaseAdditionalStorageRequest, signal?: AbortSignal) =>
    apiClient
      .post<PurchaseAdditionalStorageResponse>(BASE, request, { signal })
      .then((response) => response.data),
  getMyPurchases: (signal?: AbortSignal) =>
    apiClient
      .get<PurchaseAdditionalStorageResponse[]>(`${BASE}/me`, { signal })
      .then((response) => response.data),
}
