import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/api/client'
import { searchApi } from '@/api/endpoints/search.api'
import type { SearchResult } from '@/models/search/SearchResult'

vi.mock('@/api/client', () => ({ apiClient: { get: vi.fn() } }))

describe('search endpoint contract', () => {
  beforeEach(() => vi.clearAllMocks())

  it('forwards the exact four query fields and cancellation signal without changing results', async () => {
    const request = {
      query: 'quarterly report',
      fileType: 'pdf',
      fromDate: '2026-01-01',
      toDate: null,
    }
    const response: SearchResult[] = [
      {
        fileId: 'file-1',
        fileName: 'Quarterly report',
        fileExtension: 'pdf',
        mimeType: 'application/pdf',
        fileSizeBytes: 1024,
        folderId: null,
        folderName: null,
        uploadedAt: '2026-01-02T00:00:00Z',
        lastModifiedAt: '2026-01-03T00:00:00Z',
      },
    ]
    const controller = new AbortController()
    vi.mocked(apiClient.get).mockResolvedValue({ data: response })

    const result = await searchApi.search(request, controller.signal)

    expect(apiClient.get).toHaveBeenCalledWith('/api/search', {
      params: request,
      signal: controller.signal,
    })
    expect(result).toBe(response)
  })
})
