import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/api/errors'
import { subscriptionsApi } from '@/api/endpoints/subscriptions.api'
import { subscriptionsService } from '@/features/subscriptions/services/subscriptions.service'

vi.mock('@/api/endpoints/subscriptions.api', () => ({
  subscriptionsApi: { getCurrentSubscription: vi.fn() },
}))

describe('subscriptionsService', () => {
  it('turns the documented current-subscription 404 into an empty state', async () => {
    vi.mocked(subscriptionsApi.getCurrentSubscription).mockRejectedValue(
      new ApiError(404, 'Not found'),
    )
    await expect(subscriptionsService.getCurrent()).resolves.toBeNull()
  })

  it('preserves non-empty-state failures', async () => {
    const error = new ApiError(503, 'Unavailable')
    vi.mocked(subscriptionsApi.getCurrentSubscription).mockRejectedValue(error)
    await expect(subscriptionsService.getCurrent()).rejects.toBe(error)
  })
})
