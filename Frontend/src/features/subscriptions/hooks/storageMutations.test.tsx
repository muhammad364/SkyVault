import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, renderHook } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { additionalStorageService } from '@/features/subscriptions/services/additionalStorage.service'
import { subscriptionsService } from '@/features/subscriptions/services/subscriptions.service'
import { useCancelSubscription } from '@/features/subscriptions/hooks/useCancelSubscription'
import { usePurchaseAdditionalStorage } from '@/features/subscriptions/hooks/usePurchaseAdditionalStorage'
import { useRenewSubscription } from '@/features/subscriptions/hooks/useRenewSubscription'
import { useSubscribe } from '@/features/subscriptions/hooks/useSubscribe'
import { queryKeys } from '@/lib/queryKeys'

vi.mock('@/features/subscriptions/services/subscriptions.service', () => ({
  subscriptionsService: {
    subscribe: vi.fn(),
    renew: vi.fn(),
    cancel: vi.fn(),
  },
}))
vi.mock('@/features/subscriptions/services/additionalStorage.service', () => ({
  additionalStorageService: {
    purchase: vi.fn(),
  },
}))

const payment = {
  cardHolderName: 'Ava Khan',
  cardNumber: '4242424242424242',
  expiryMonth: 12,
  expiryYear: 2099,
  cvv: '123',
}

const subscription = {
  subscriptionId: 'subscription-id',
  userId: 'user-id',
  storagePlanId: 'plan-id',
  storagePlanName: 'Studio Vault',
  storageSizeGb: 250,
  price: 2499,
  billingCycle: 1,
  startDate: '2026-08-01T00:00:00Z',
  endDate: '2026-09-01T00:00:00Z',
  status: 0,
  gracePeriodEndDate: null,
}

const purchase = {
  additionalStoragePurchaseId: 'purchase-id',
  storageAmountGb: 25,
  price: 1250,
  purchaseDate: '2026-08-21T00:00:00Z',
  status: 0,
}

function createHarness() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, invalidateQueries, wrapper }
}

function expectStorageInvalidations(invalidateQueries: unknown) {
  expect(invalidateQueries).toHaveBeenCalledTimes(3)
  expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: queryKeys.subscriptions.current() })
  expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: queryKeys.storageQuota.current() })
  expect(invalidateQueries).toHaveBeenCalledWith({
    queryKey: queryKeys.additionalStorage.purchases(),
  })
}

describe('storage mutation invalidation', () => {
  beforeEach(() => {
    vi.mocked(subscriptionsService.subscribe).mockResolvedValue(subscription)
    vi.mocked(subscriptionsService.renew).mockResolvedValue(subscription)
    vi.mocked(subscriptionsService.cancel).mockResolvedValue({ ...subscription, status: 2 })
    vi.mocked(additionalStorageService.purchase).mockResolvedValue(purchase)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('refreshes subscription, quota, and purchase data after subscribing', async () => {
    const harness = createHarness()
    const { result } = renderHook(() => useSubscribe(), { wrapper: harness.wrapper })

    await act(() =>
      result.current.mutateAsync({
        storagePlanId: 'plan-id',
        replaceExistingSubscription: false,
        payment,
      }),
    )

    expectStorageInvalidations(harness.invalidateQueries)
    expect(harness.queryClient.getQueryData(queryKeys.subscriptions.current())).toEqual(
      subscription,
    )
  })

  it('refreshes subscription, quota, and purchase data after renewal', async () => {
    const harness = createHarness()
    const { result } = renderHook(() => useRenewSubscription(), { wrapper: harness.wrapper })

    await act(() => result.current.mutateAsync({ payment }))

    expectStorageInvalidations(harness.invalidateQueries)
  })

  it('refreshes subscription, quota, and purchase data after cancellation', async () => {
    const harness = createHarness()
    const { result } = renderHook(() => useCancelSubscription(), { wrapper: harness.wrapper })

    await act(() => result.current.mutateAsync())

    expectStorageInvalidations(harness.invalidateQueries)
  })

  it('refreshes subscription, quota, and purchase data after an additional purchase', async () => {
    const harness = createHarness()
    const { result } = renderHook(() => usePurchaseAdditionalStorage(), {
      wrapper: harness.wrapper,
    })

    await act(() => result.current.mutateAsync({ storageAmountGb: 25, payment }))

    expectStorageInvalidations(harness.invalidateQueries)
  })
})
