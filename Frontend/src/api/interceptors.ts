import type { AxiosInstance } from 'axios'
import { appConfig, ApiConfigurationError } from '@/app/config'
import { ApiError, normalizeApiErrorWithBlobPayload } from '@/api/errors'
import { clearClientSession } from '@/features/auth/lib/clearClientSession'
import { isSessionActive } from '@/features/auth/lib/session'
import { useAuthStore } from '@/store/auth.store'

export function attachApiInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((request) => {
    if (!appConfig.isApiConfigured) return Promise.reject(new ApiConfigurationError())

    const session = useAuthStore.getState().session
    if (session && !isSessionActive(session)) {
      void clearClientSession()
    } else if (session) {
      request.headers.set('Authorization', `Bearer ${session.accessToken}`)
    }

    return request
  })

  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const normalized = await normalizeApiErrorWithBlobPayload(error)
      if (
        normalized instanceof ApiError &&
        normalized.status === 401 &&
        useAuthStore.getState().session
      ) {
        void clearClientSession()
      }
      return Promise.reject(normalized)
    },
  )
}
