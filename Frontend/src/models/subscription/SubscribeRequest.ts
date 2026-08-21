import type { ProcessPaymentRequest } from '@/models/payment/ProcessPaymentRequest'

export interface SubscribeRequest {
  storagePlanId: string
  replaceExistingSubscription: boolean
  payment: ProcessPaymentRequest
}
