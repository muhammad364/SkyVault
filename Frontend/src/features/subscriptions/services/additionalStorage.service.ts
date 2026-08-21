import { additionalStorageApi } from '@/api/endpoints/additional-storage.api'
import type { AdditionalStorageQuoteRequest } from '@/models/additionalStorage/AdditionalStorageQuoteRequest'
import type { PurchaseAdditionalStorageRequest } from '@/models/additionalStorage/PurchaseAdditionalStorageRequest'

export const additionalStorageService = {
  quote: (request: AdditionalStorageQuoteRequest, signal?: AbortSignal) =>
    additionalStorageApi.getQuote(request, signal),
  purchase: (request: PurchaseAdditionalStorageRequest) => additionalStorageApi.purchase(request),
  listPurchases: (signal?: AbortSignal) => additionalStorageApi.getMyPurchases(signal),
}
