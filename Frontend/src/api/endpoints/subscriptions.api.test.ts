import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/api/client'
import { additionalStorageApi } from '@/api/endpoints/additional-storage.api'
import { storagePlansApi } from '@/api/endpoints/storage-plans.api'
import { storageQuotaApi } from '@/api/endpoints/storage-quota.api'
import { subscriptionsApi } from '@/api/endpoints/subscriptions.api'

vi.mock('@/api/client', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

const payment = {
  cardHolderName: 'Ava Khan',
  cardNumber: '4242 4242 4242 4242',
  expiryMonth: 12,
  expiryYear: 2030,
  cvv: '123',
}

describe('Phase 4 endpoint contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({ data: {} })
    vi.mocked(apiClient.post).mockResolvedValue({ data: {} })
  })

  it('forwards AbortSignal through every Phase 4 read and quote', async () => {
    const controller = new AbortController()

    await storagePlansApi.getPlanById('plan-id', controller.signal)
    await subscriptionsApi.getCurrentSubscription(controller.signal)
    await additionalStorageApi.getQuote({ storageAmountGb: 5 }, controller.signal)
    await additionalStorageApi.getMyPurchases(controller.signal)
    await storageQuotaApi.getMyStorageQuota(controller.signal)

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/api/storage-plans/plan-id', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenNthCalledWith(2, '/api/subscriptions/me', {
      signal: controller.signal,
    })
    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/additional-storage/quote',
      { storageAmountGb: 5 },
      { signal: controller.signal },
    )
    expect(apiClient.get).toHaveBeenNthCalledWith(3, '/api/additional-storage/me', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenNthCalledWith(4, '/api/storage/quota', {
      signal: controller.signal,
    })
  })

  it('posts exact payment DTOs without a client-controlled amount', async () => {
    const subscribeRequest = {
      storagePlanId: 'plan-id',
      replaceExistingSubscription: false,
      payment,
    }
    const purchaseRequest = { storageAmountGb: 10, payment }

    await subscriptionsApi.subscribe(subscribeRequest)
    await subscriptionsApi.renew({ payment })
    await subscriptionsApi.cancel()
    await additionalStorageApi.purchase(purchaseRequest)

    expect(apiClient.post).toHaveBeenNthCalledWith(1, '/api/subscriptions', subscribeRequest, {
      signal: undefined,
    })
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      '/api/subscriptions/renew',
      { payment },
      { signal: undefined },
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(3, '/api/subscriptions/cancel', undefined, {
      signal: undefined,
    })
    expect(apiClient.post).toHaveBeenNthCalledWith(4, '/api/additional-storage', purchaseRequest, {
      signal: undefined,
    })
    expect(JSON.stringify(vi.mocked(apiClient.post).mock.calls)).not.toContain('amount')
  })
})
