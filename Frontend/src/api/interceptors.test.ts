import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { attachApiInterceptors } from '@/api/interceptors'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/auth.store'

afterEach(() => {
  useAuthStore.setState({ session: null })
  vi.restoreAllMocks()
})

describe('authentication interceptors', () => {
  it('attaches an active access token centrally', async () => {
    const client = axios.create({
      adapter: async (config) => ({ config, data: {}, headers: {}, status: 200, statusText: 'OK' }),
    })
    attachApiInterceptors(client)
    useAuthStore.setState({
      session: { accessToken: 'active-token', expiresAt: new Date(Date.now() + 60_000).toISOString() },
    })

    const response = await client.get('/profile')
    expect(response.config.headers.Authorization).toBe('Bearer active-token')
  })

  it('clears expired sessions before a request and authenticated sessions after a 401', async () => {
    const cancel = vi.spyOn(queryClient, 'cancelQueries').mockResolvedValue(undefined)
    const remove = vi.spyOn(queryClient, 'removeQueries')
    const successClient = axios.create({
      adapter: async (config) => ({ config, data: {}, headers: {}, status: 200, statusText: 'OK' }),
    })
    attachApiInterceptors(successClient)
    useAuthStore.setState({
      session: { accessToken: 'expired-token', expiresAt: new Date(Date.now() - 1).toISOString() },
    })

    const expiredResponse = await successClient.get('/profile')
    await vi.waitFor(() => expect(useAuthStore.getState().session).toBeNull())
    expect(expiredResponse.config.headers.Authorization).toBeUndefined()

    const unauthorizedClient = axios.create({
      adapter: async (config: InternalAxiosRequestConfig) => {
        const response: AxiosResponse = { config, data: { statusCode: 401, message: 'No access.' }, headers: {}, status: 401, statusText: 'Unauthorized' }
        throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, response)
      },
    })
    attachApiInterceptors(unauthorizedClient)
    useAuthStore.setState({
      session: { accessToken: 'active-token', expiresAt: new Date(Date.now() + 60_000).toISOString() },
    })

    await expect(unauthorizedClient.get('/profile')).rejects.toMatchObject({ status: 401 })
    await vi.waitFor(() => expect(useAuthStore.getState().session).toBeNull())
    expect(cancel).toHaveBeenCalled()
    expect(remove).toHaveBeenCalled()
  })
})
