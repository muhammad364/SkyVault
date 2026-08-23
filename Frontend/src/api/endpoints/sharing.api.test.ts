import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/api/client'
import { sharingApi } from '@/api/endpoints/sharing.api'

vi.mock('@/api/client', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}))

describe('sharing endpoint contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({ data: new Blob(), headers: {} })
    vi.mocked(apiClient.post).mockResolvedValue({ data: {} })
    vi.mocked(apiClient.patch).mockResolvedValue({ data: { message: 'Revoked.' } })
  })

  it('uses exact owner routes and DTO bodies without automatic write timeouts', async () => {
    const controller = new AbortController()
    const request = { fileId: 'file-id', expiresAt: null }
    await sharingApi.getOwnShareLinks(controller.signal)
    await sharingApi.generateShareLink(request, controller.signal)
    await sharingApi.revokeShareLink('link-id', controller.signal)

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/api/share-links', {
      signal: controller.signal,
    })
    expect(apiClient.post).toHaveBeenCalledWith('/api/share-links', request, {
      signal: controller.signal,
      timeout: 0,
    })
    expect(apiClient.patch).toHaveBeenCalledWith('/api/share-links/link-id/revoke', undefined, {
      signal: controller.signal,
      timeout: 0,
    })
  })

  it('uses exact anonymous Blob routes with progress and cancellation', async () => {
    const controller = new AbortController()
    const onDownloadProgress = vi.fn()
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce({ data: new Blob(['preview']), headers: {} })
      .mockResolvedValueOnce({
        data: new Blob(['download']),
        headers: { 'content-disposition': 'attachment; filename="note.txt"' },
      })

    await sharingApi.previewSharedFile('token/value', {
      signal: controller.signal,
      onDownloadProgress,
    })
    const download = await sharingApi.downloadSharedFile('token/value', {
      signal: controller.signal,
      onDownloadProgress,
    })

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/api/share/token%2Fvalue', {
      signal: controller.signal,
      onDownloadProgress,
      responseType: 'blob',
      timeout: 0,
    })
    expect(apiClient.get).toHaveBeenNthCalledWith(2, '/api/share/token%2Fvalue/download', {
      signal: controller.signal,
      onDownloadProgress,
      responseType: 'blob',
      timeout: 0,
    })
    expect(download.fileName).toBe('note.txt')
  })
})
