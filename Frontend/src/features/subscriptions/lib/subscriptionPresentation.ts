import { SubscriptionStatus } from '@/models/subscription/SubscriptionStatus'

export function subscriptionStatusLabel(status: number) {
  if (status === SubscriptionStatus.Active) return 'Active'
  if (status === SubscriptionStatus.Expired) return 'Expired'
  if (status === SubscriptionStatus.Cancelled) return 'Cancelled'
  return 'Unavailable'
}

export function isActiveSubscription(status: number) {
  return status === SubscriptionStatus.Active
}
