export interface SubscriptionResponse {
  subscriptionId: string
  userId: string
  storagePlanId: string
  storagePlanName: string
  storageSizeGb: number
  price: number
  billingCycle: number
  startDate: string
  endDate: string
  status: number
  gracePeriodEndDate: string | null
}
