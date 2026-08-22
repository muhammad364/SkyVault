import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/api/client'
import { filesApi } from '@/api/endpoints/files.api'
import { foldersApi } from '@/api/endpoints/folders.api'

vi.mock('@/api/client', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

describe('Phase 6 endpoint contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({ data: {} })
    vi.mocked(apiClient.post).mockResolvedValue({ data: {} })
    vi.mocked(apiClient.put).mockResolvedValue({ data: {} })
    vi.mocked(apiClient.delete).mockResolvedValue({ data: {} })
  })

  it('uses exact folder paths and forwards read cancellation', async () => {
    const controller = new AbortController()
    await foldersApi.getRoot(controller.signal)
    await foldersApi.getContents('folder-id', controller.signal)
    await foldersApi.create({ name: 'Design', parentFolderId: null })
    await foldersApi.rename('folder-id', { name: 'Brand' })
    await foldersApi.move('folder-id', { destinationFolderId: null })
    await foldersApi.delete('folder-id')

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/api/folders/root', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenNthCalledWith(2, '/api/folders/folder-id', {
      signal: controller.signal,
    })
    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/folders',
      { name: 'Design', parentFolderId: null },
      { signal: undefined, timeout: 0 },
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      1,
      '/api/folders/folder-id',
      { name: 'Brand' },
      { signal: undefined, timeout: 0 },
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      2,
      '/api/folders/folder-id/move',
      { destinationFolderId: null },
      { signal: undefined, timeout: 0 },
    )
    expect(apiClient.delete).toHaveBeenCalledWith('/api/folders/folder-id', {
      signal: undefined,
      timeout: 0,
    })
  })

  it('sends exact file JSON and multipart contracts with progress callbacks', async () => {
    const file = new File(['vault'], 'note.txt', { type: 'text/plain' })
    const onUploadProgress = vi.fn()
    const onDownloadProgress = vi.fn()
    const controller = new AbortController()

    await filesApi.upload(
      { file, folderId: 'folder-id' },
      { signal: controller.signal, onUploadProgress },
    )
    await filesApi.preview('file-id', { signal: controller.signal, onDownloadProgress })
    await filesApi.download('file-id', { signal: controller.signal, onDownloadProgress })
    await filesApi.rename('file-id', { fileName: 'renamed.txt' })
    await filesApi.move('file-id', { destinationFolderId: null })
    await filesApi.replace('file-id', { file }, { onUploadProgress })
    await filesApi.copy({ fileIds: ['file-id'], destinationFolderId: null })
    await filesApi.delete('file-id')

    const uploadBody = vi.mocked(apiClient.post).mock.calls[0][1] as FormData
    expect(uploadBody.get('file')).toBe(file)
    expect(uploadBody.get('folderId')).toBe('folder-id')
    expect(apiClient.post).toHaveBeenNthCalledWith(1, '/api/files', uploadBody, {
      signal: controller.signal,
      onUploadProgress,
      timeout: 0,
    })
    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/api/files/file-id/preview', {
      signal: controller.signal,
      onDownloadProgress,
      responseType: 'blob',
      timeout: 0,
    })
    expect(apiClient.get).toHaveBeenNthCalledWith(2, '/api/files/file-id/download', {
      signal: controller.signal,
      onDownloadProgress,
      responseType: 'blob',
      timeout: 0,
    })
    expect(apiClient.put).toHaveBeenCalledWith(
      '/api/files/file-id/rename',
      { fileName: 'renamed.txt' },
      { signal: undefined, timeout: 0 },
    )
    expect(apiClient.put).toHaveBeenCalledWith(
      '/api/files/file-id/move',
      { destinationFolderId: null },
      { signal: undefined, timeout: 0 },
    )
    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/files/copy',
      { fileIds: ['file-id'], destinationFolderId: null },
      { signal: undefined, timeout: 0 },
    )
    expect(apiClient.delete).toHaveBeenCalledWith('/api/files/file-id', {
      signal: undefined,
      timeout: 0,
    })
  })
})
