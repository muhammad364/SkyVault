import { QueryClient } from '@tanstack/react-query'
import { ApiError, RequestCancelledError } from '@/api/errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 300_000,
      retry: (failureCount, error) => {
        if (error instanceof RequestCancelledError) return false
        if (error instanceof ApiError && error.status < 500 && error.status !== 429) return false
        return failureCount < 1
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
