import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/api/client'
import { filesApi } from '@/api/endpoints/files.api'
import { recycleBinApi } from '@/api/endpoints/recycle-bin.api'
import { sharingApi } from '@/api/endpoints/sharing.api'

vi.mock('@/api/client', () => ({
  apiClient: { get: vi.fn() },
}))

describe('Phase 5 read endpoint contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
  })

  it('uses only the documented list endpoints and forwards AbortSignal', async () => {
    const controller = new AbortController()

    await filesApi.getUserFiles(controller.signal)
    await sharingApi.getOwnShareLinks(controller.signal)
    await recycleBinApi.getItems(controller.signal)

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/api/files', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenNthCalledWith(2, '/api/share-links', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenNthCalledWith(3, '/api/recycle-bin', {
      signal: controller.signal,
    })
  })
})
