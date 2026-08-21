import type { ProcessPaymentRequest } from '@/models/payment/ProcessPaymentRequest'

export interface PurchaseAdditionalStorageRequest {
  storageAmountGb: number
  payment: ProcessPaymentRequest
}
