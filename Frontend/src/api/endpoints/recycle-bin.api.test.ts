import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/api/client'
import { recycleBinApi } from '@/api/endpoints/recycle-bin.api'

vi.mock('@/api/client', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}))

describe('Recycle Bin endpoint contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
    vi.mocked(apiClient.post).mockResolvedValue({ data: { message: 'Restored.' } })
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { message: 'Deleted.' } })
  })

  it('uses the exact read and file/folder mutation routes', async () => {
    const controller = new AbortController()
    await recycleBinApi.getItems(controller.signal)
    await recycleBinApi.restoreFile('file-id', controller.signal)
    await recycleBinApi.restoreFolder('folder-id', controller.signal)
    await recycleBinApi.permanentlyDeleteFile('file-id', controller.signal)
    await recycleBinApi.permanentlyDeleteFolder('folder-id', controller.signal)

    expect(apiClient.get).toHaveBeenCalledWith('/api/recycle-bin', {
      signal: controller.signal,
    })
    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      '/api/recycle-bin/files/file-id/restore',
      undefined,
      { signal: controller.signal, timeout: 0 },
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      '/api/recycle-bin/folders/folder-id/restore',
      undefined,
      { signal: controller.signal, timeout: 0 },
    )
    expect(apiClient.delete).toHaveBeenNthCalledWith(1, '/api/recycle-bin/files/file-id', {
      signal: controller.signal,
      timeout: 0,
    })
    expect(apiClient.delete).toHaveBeenNthCalledWith(2, '/api/recycle-bin/folders/folder-id', {
      signal: controller.signal,
      timeout: 0,
    })
  })
})
