import { apiClient } from '@/api/client'
import type { SearchRequest } from '@/models/search/SearchRequest'
import type { SearchResult } from '@/models/search/SearchResult'

const BASE = '/api/search'

export const searchApi = {
  search: (request: SearchRequest, signal?: AbortSignal) =>
    apiClient
      .get<SearchResult[]>(BASE, {
        params: request,
        signal,
      })
      .then((response) => response.data),
}
