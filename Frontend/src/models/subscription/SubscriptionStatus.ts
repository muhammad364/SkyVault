export const SubscriptionStatus = {
  Active: 0,
  Expired: 1,
  Cancelled: 2,
} as const

export type SubscriptionStatusValue = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]
