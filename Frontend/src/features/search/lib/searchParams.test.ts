import { describe, expect, it } from 'vitest'
import { searchRequestFromParams, searchRequestParams } from '@/features/search/lib/searchParams'

describe('search URL parameters', () => {
  it('hydrates and serializes only the real search contract', () => {
    const request = searchRequestFromParams(
      new URLSearchParams(
        'query=annual+report&fileType=pdf&fromDate=2026-01-01&toDate=2026-06-30&size=large',
      ),
    )

    expect(request).toEqual({
      query: 'annual report',
      fileType: 'pdf',
      fromDate: '2026-01-01',
      toDate: '2026-06-30',
    })
    expect(searchRequestParams(request).toString()).toBe(
      'query=annual+report&fileType=pdf&fromDate=2026-01-01&toDate=2026-06-30',
    )
  })
})
