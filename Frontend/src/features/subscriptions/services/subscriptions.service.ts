import { ApiError } from '@/api/errors'
import { subscriptionsApi } from '@/api/endpoints/subscriptions.api'
import { storagePlansApi } from '@/api/endpoints/storage-plans.api'
import type { RenewSubscriptionRequest } from '@/models/subscription/RenewSubscriptionRequest'
import type { SubscribeRequest } from '@/models/subscription/SubscribeRequest'

export const subscriptionsService = {
  listPlans: (signal?: AbortSignal) => storagePlansApi.getAllPlans(signal),
  getPlan: (storagePlanId: string, signal?: AbortSignal) =>
    storagePlansApi.getPlanById(storagePlanId, signal),
  getCurrent: async (signal?: AbortSignal) => {
    try {
      return await subscriptionsApi.getCurrentSubscription(signal)
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null
      throw error
    }
  },
  subscribe: (request: SubscribeRequest) => subscriptionsApi.subscribe(request),
  renew: (request: RenewSubscriptionRequest) => subscriptionsApi.renew(request),
  cancel: () => subscriptionsApi.cancel(),
}
