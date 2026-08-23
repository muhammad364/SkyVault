import { apiClient } from '@/api/client'
import type { RenewSubscriptionRequest } from '@/models/subscription/RenewSubscriptionRequest'
import type { SubscribeRequest } from '@/models/subscription/SubscribeRequest'
import type { SubscriptionResponse } from '@/models/subscription/SubscriptionResponse'

const BASE = '/api/subscriptions'

export const subscriptionsApi = {
  subscribe: (request: SubscribeRequest, signal?: AbortSignal) =>
    apiClient
      .post<SubscriptionResponse>(BASE, request, { signal })
      .then((response) => response.data),
  getCurrentSubscription: (signal?: AbortSignal) =>
    apiClient.get<SubscriptionResponse>(`${BASE}/me`, { signal }).then((response) => response.data),
  renew: (request: RenewSubscriptionRequest, signal?: AbortSignal) =>
    apiClient
      .post<SubscriptionResponse>(`${BASE}/renew`, request, { signal })
      .then((response) => response.data),
  cancel: (signal?: AbortSignal) =>
    apiClient
      .post<SubscriptionResponse>(`${BASE}/cancel`, undefined, { signal })
      .then((response) => response.data),
  getAll: (signal?: AbortSignal) =>
    apiClient.get<SubscriptionResponse[]>(BASE, { signal }).then((response) => response.data),
  getById: (subscriptionId: string, signal?: AbortSignal) =>
    apiClient
      .get<SubscriptionResponse>(`${BASE}/${subscriptionId}`, { signal })
      .then((response) => response.data),
  getByUserId: (userId: string, signal?: AbortSignal) =>
    apiClient
      .get<SubscriptionResponse[]>(`${BASE}/user/${userId}`, { signal })
      .then((response) => response.data),
}
