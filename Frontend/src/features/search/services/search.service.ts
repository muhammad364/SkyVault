import { searchApi } from '@/api/endpoints/search.api'
import type { SearchRequest } from '@/models/search/SearchRequest'

export const searchService = {
  search: (request: SearchRequest, signal?: AbortSignal) => searchApi.search(request, signal),
}
