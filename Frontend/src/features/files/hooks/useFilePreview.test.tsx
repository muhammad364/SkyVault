import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import type { AxiosProgressEvent } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RequestCancelledError } from '@/api/errors'
import { useFilePreview } from '@/features/files/hooks/useFilePreview'
import { filesService } from '@/features/files/services/files.service'

vi.mock('@/features/files/services/files.service', () => ({
  filesService: { preview: vi.fn() },
}))

describe('useFilePreview', () => {
  beforeEach(() => {
    vi.mocked(filesService.preview).mockReset()
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: vi.fn(() => 'blob:preview'),
    })
    Object.defineProperty(URL, 'revokeObjectURL', { writable: true, value: vi.fn() })
  })

  afterEach(cleanup)

  it('reports real response progress and prepares safe text content', async () => {
    vi.mocked(filesService.preview).mockImplementation(async (_fileId, options) => {
      options?.onDownloadProgress?.({
        loaded: 5,
        total: 10,
        bytes: 5,
        lengthComputable: true,
      } as AxiosProgressEvent)
      return {
        type: 'text/plain',
        text: vi.fn().mockResolvedValue('hello vault'),
      } as unknown as Blob
    })

    const { result } = renderHook(() => useFilePreview('file-id'))
    await waitFor(() => expect(result.current.status).toBe('success'))

    expect(filesService.preview).toHaveBeenCalledWith(
      'file-id',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(result.current.progress).toBe(100)
    expect(result.current.text).toBe('hello vault')
  })

  it('turns an explicit abort into a neutral cancelled state', async () => {
    vi.mocked(filesService.preview).mockImplementation(
      (_fileId, options) =>
        new Promise<Blob>((_resolve, reject) => {
          options?.signal?.addEventListener('abort', () => reject(new RequestCancelledError()))
        }),
    )

    const { result } = renderHook(() => useFilePreview('file-id'))
    await waitFor(() => expect(filesService.preview).toHaveBeenCalled())
    act(() => result.current.cancel())
    await waitFor(() => expect(result.current.status).toBe('cancelled'))

    expect(result.current.error).toBe('')
  })

  it('revokes an object URL when the viewer unmounts', async () => {
    vi.mocked(filesService.preview).mockResolvedValue(new Blob(['image'], { type: 'image/png' }))
    const view = renderHook(() => useFilePreview('file-id'))
    await waitFor(() => expect(view.result.current.status).toBe('success'))
    view.unmount()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview')
  })
})
