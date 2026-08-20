import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/api/client'
import { authApi } from '@/api/endpoints/auth.api'

vi.mock('@/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({ data: {} })
    vi.mocked(apiClient.post).mockResolvedValue({ data: { message: 'Done.' } })
    vi.mocked(apiClient.put).mockResolvedValue({ data: {} })
  })

  it('posts exact authentication DTOs to the documented endpoints', async () => {
    const registration = { firstName: 'Ava', lastName: 'Khan', email: 'ava@example.com', password: 'long-enough' }
    const login = { email: 'ava@example.com', password: 'long-enough' }
    const reset = { token: 'reset-token', newPassword: 'new-password' }

    await authApi.register(registration)
    await authApi.login(login)
    await authApi.resendVerification({ email: registration.email })
    await authApi.forgotPassword({ email: registration.email })
    await authApi.verifyEmail({ token: 'verify-token' })
    await authApi.resetPassword(reset)
    await authApi.changePassword({ currentPassword: 'old-password', newPassword: 'new-password' })

    expect(apiClient.post).toHaveBeenNthCalledWith(1, '/api/auth/register', registration, { signal: undefined })
    expect(apiClient.post).toHaveBeenNthCalledWith(2, '/api/auth/login', login, { signal: undefined })
    expect(apiClient.post).toHaveBeenNthCalledWith(3, '/api/auth/resend-verification', { email: registration.email }, { signal: undefined })
    expect(apiClient.post).toHaveBeenNthCalledWith(4, '/api/auth/forgot-password', { email: registration.email }, { signal: undefined })
    expect(apiClient.post).toHaveBeenNthCalledWith(5, '/api/auth/verify-email', { token: 'verify-token' }, { signal: undefined })
    expect(apiClient.post).toHaveBeenNthCalledWith(6, '/api/auth/reset-password', reset, { signal: undefined })
    expect(apiClient.post).toHaveBeenNthCalledWith(7, '/api/auth/change-password', { currentPassword: 'old-password', newPassword: 'new-password' }, { signal: undefined })
  })

  it('forwards the profile AbortSignal and keeps profile updates typed', async () => {
    const controller = new AbortController()
    const update = { firstName: 'Ava', lastName: 'Khan' }

    await authApi.getProfile(controller.signal)
    await authApi.updateProfile(update, controller.signal)

    expect(apiClient.get).toHaveBeenCalledWith('/api/auth/profile', { signal: controller.signal })
    expect(apiClient.put).toHaveBeenCalledWith('/api/auth/profile', update, { signal: controller.signal })
  })
})
