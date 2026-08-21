import type { ProcessPaymentRequest } from '@/models/payment/ProcessPaymentRequest'

export interface RenewSubscriptionRequest {
  payment: ProcessPaymentRequest
}
