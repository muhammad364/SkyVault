import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountService } from '@/features/account/services/account.service'
import { useLogout } from '@/features/account/hooks/useLogout'
import { authService } from '@/features/auth/services/auth.service'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { clearClientSession } from '@/features/auth/lib/clearClientSession'
import { useAuthStore } from '@/store/auth.store'

vi.mock('@/features/auth/services/auth.service', () => ({ authService: { login: vi.fn() } }))
vi.mock('@/features/account/services/account.service', () => ({ accountService: { logout: vi.fn() } }))
vi.mock('@/features/auth/lib/clearClientSession', () => ({ clearClientSession: vi.fn().mockResolvedValue(undefined) }))

function token(payload: Record<string, string>) {
  return `header.${btoa(JSON.stringify(payload))}.signature`
}

describe('authentication hooks', () => {
  let client: QueryClient
  let wrapper: ({ children }: PropsWithChildren) => JSX.Element

  beforeEach(() => {
    client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
    wrapper = ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
    vi.clearAllMocks()
    useAuthStore.setState({ session: null })
  })

  afterEach(() => client.clear())

  it('persists a successful access-token session with a fail-closed UI role', async () => {
    const response = {
      token: token({ role: 'User' }),
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    }
    vi.mocked(authService.login).mockResolvedValue(response)
    const { result } = renderHook(() => useLogin(), { wrapper })

    act(() => result.current.mutate({ email: 'ava@example.com', password: 'long-enough' }))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(useAuthStore.getState().session).toEqual({ accessToken: response.token, expiresAt: response.expiresAt, role: 'user' })
  })

  it('purges local session state even when the stateless logout endpoint fails', async () => {
    vi.mocked(accountService.logout).mockRejectedValue(new Error('Offline'))
    const { result } = renderHook(() => useLogout(), { wrapper })

    act(() => result.current.mutate())
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(clearClientSession).toHaveBeenCalled()
  })
})
