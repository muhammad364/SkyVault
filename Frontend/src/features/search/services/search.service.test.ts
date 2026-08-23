import { describe, expect, it, vi } from 'vitest'
import { searchApi } from '@/api/endpoints/search.api'
import { searchService } from '@/features/search/services/search.service'

vi.mock('@/api/endpoints/search.api', () => ({ searchApi: { search: vi.fn() } }))

describe('searchService', () => {
  it('forwards the request and signal and returns untouched DTO data', async () => {
    const request = {
      query: null,
      fileType: 'image',
      fromDate: null,
      toDate: '2026-08-23',
    }
    const response = [{ fileId: 'ordered-first' }, { fileId: 'ordered-second' }]
    const controller = new AbortController()
    vi.mocked(searchApi.search).mockResolvedValue(response as never)

    const result = await searchService.search(request, controller.signal)

    expect(searchApi.search).toHaveBeenCalledWith(request, controller.signal)
    expect(result).toBe(response)
  })
})
