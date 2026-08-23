import { useQuery } from '@tanstack/react-query'
import { searchService } from '@/features/search/services/search.service'
import { queryKeys } from '@/lib/queryKeys'
import type { SearchRequest } from '@/models/search/SearchRequest'

export function hasSearchCriteria(request: SearchRequest) {
  return Boolean(request.query || request.fileType || request.fromDate || request.toDate)
}

export function useSearchResults(request: SearchRequest, enabled = hasSearchCriteria(request)) {
  return useQuery({
    queryKey: queryKeys.search.results(request),
    queryFn: ({ signal }) => searchService.search(request, signal),
    enabled,
  })
}
