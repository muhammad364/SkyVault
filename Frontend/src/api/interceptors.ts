import type { AxiosInstance } from 'axios'
import { appConfig, ApiConfigurationError } from '@/app/config'
import { normalizeApiError } from '@/api/errors'

export function attachApiInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((request) => {
    if (!appConfig.isApiConfigured) return Promise.reject(new ApiConfigurationError())
    return request
  })

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(normalizeApiError(error)),
  )
}
