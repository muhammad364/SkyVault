import type { SearchRequest } from '@/models/search/SearchRequest'

const parameterNames = ['query', 'fileType', 'fromDate', 'toDate'] as const

export function searchRequestFromParams(params: URLSearchParams): SearchRequest {
  const value = (name: (typeof parameterNames)[number]) => params.get(name)?.trim() || null
  return {
    query: value('query'),
    fileType: value('fileType'),
    fromDate: value('fromDate'),
    toDate: value('toDate'),
  }
}

export function searchRequestParams(request: SearchRequest) {
  const params = new URLSearchParams()
  parameterNames.forEach((name) => {
    const value = request[name]?.trim()
    if (value) params.set(name, value)
  })
  return params
}
