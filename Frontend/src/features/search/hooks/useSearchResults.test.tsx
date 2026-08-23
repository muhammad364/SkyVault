import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSearchResults } from '@/features/search/hooks/useSearchResults'
import { searchService } from '@/features/search/services/search.service'
import { queryKeys } from '@/lib/queryKeys'
import type { SearchRequest } from '@/models/search/SearchRequest'

vi.mock('@/features/search/services/search.service', () => ({
  searchService: { search: vi.fn() },
}))

const request: SearchRequest = {
  query: 'vault',
  fileType: null,
  fromDate: null,
  toDate: null,
}

describe('useSearchResults', () => {
  let queryClient: QueryClient
  let wrapper: ({ children }: PropsWithChildren) => JSX.Element

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    vi.clearAllMocks()
  })

  afterEach(() => queryClient.clear())

  it('uses a parameterized stable key and forwards React Query cancellation', async () => {
    vi.mocked(searchService.search).mockResolvedValue([])
    const search = renderHook(() => useSearchResults(request), { wrapper })

    await waitFor(() => expect(search.result.current.isSuccess).toBe(true))

    expect(searchService.search).toHaveBeenCalledWith(request, expect.any(AbortSignal))
    expect(queryClient.getQueryData(queryKeys.search.results(request))).toEqual([])
  })

  it('does not fetch an empty collection and aborts a stale active search', async () => {
    const signals: AbortSignal[] = []
    vi.mocked(searchService.search).mockImplementation((_request, nextSignal) => {
      if (nextSignal) signals.push(nextSignal)
      return new Promise(() => undefined)
    })
    const empty: SearchRequest = {
      query: null,
      fileType: null,
      fromDate: null,
      toDate: null,
    }
    const search = renderHook(({ value }) => useSearchResults(value), {
      wrapper,
      initialProps: { value: empty },
    })
    expect(searchService.search).not.toHaveBeenCalled()

    search.rerender({ value: request })
    await waitFor(() => expect(searchService.search).toHaveBeenCalledOnce())
    search.rerender({ value: { ...request, query: 'new words' } })
    await waitFor(() => expect(signals[0]?.aborted).toBe(true))
  })
})
