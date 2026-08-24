import type { MutateOptions } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useResetPassword } from '@/features/auth/hooks/useResetPassword'
import { useResendVerification } from '@/features/auth/hooks/useResendVerification'
import { useVerifyEmail } from '@/features/auth/hooks/useVerifyEmail'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import VerifyEmailPage from '@/features/auth/pages/VerifyEmailPage'
import type { ResetPasswordRequest } from '@/models/auth/ResetPasswordRequest'
import type { VerifyEmailRequest } from '@/models/auth/VerifyEmailRequest'
import type { MessageResponse } from '@/models/common/MessageResponse'

vi.mock('@/features/auth/hooks/useResetPassword')
vi.mock('@/features/auth/hooks/useResendVerification')
vi.mock('@/features/auth/hooks/useVerifyEmail')

type ResetMutate = (
  request: ResetPasswordRequest,
  options?: MutateOptions<MessageResponse, Error, ResetPasswordRequest>,
) => void
type VerifyMutateAsync = (request: VerifyEmailRequest) => Promise<MessageResponse>

const resetMutate = vi.fn<ResetMutate>()
const verifyMutateAsync = vi.fn<VerifyMutateAsync>()

function LocationProbe() {
  const location = useLocation()
  return (
    <output aria-label="current location">
      {location.pathname}
      {location.search}
    </output>
  )
}

describe('verification and reset token handling', () => {
  beforeEach(() => {
    resetMutate.mockReset()
    verifyMutateAsync.mockReset()
    verifyMutateAsync.mockImplementation(() => new Promise(() => undefined))
    vi.mocked(useResetPassword).mockReturnValue({
      mutate: resetMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useResetPassword>)
    vi.mocked(useResendVerification).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
    } as unknown as ReturnType<typeof useResendVerification>)
    vi.mocked(useVerifyEmail).mockReturnValue({
      mutateAsync: verifyMutateAsync,
      isPending: false,
      isSuccess: false,
      error: null,
    } as unknown as ReturnType<typeof useVerifyEmail>)
  })

  afterEach(cleanup)

  it('reads a verification token once, strips it from the URL, and verifies once', async () => {
    render(
      <MemoryRouter initialEntries={['/auth/verify-email?token=verification-secret']}>
        <VerifyEmailPage />
        <LocationProbe />
      </MemoryRouter>,
    )

    await waitFor(() =>
      expect(verifyMutateAsync).toHaveBeenCalledWith({ token: 'verification-secret' }),
    )
    await waitFor(() =>
      expect(screen.getByLabelText('current location')).toHaveTextContent('/auth/verify-email'),
    )
    expect(screen.getByLabelText('current location')).not.toHaveTextContent('verification-secret')
    expect(verifyMutateAsync).toHaveBeenCalledTimes(1)
  })

  it('keeps reset submission user-driven and excludes confirmation from the DTO', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/auth/reset-password?token=reset-secret']}>
        <ResetPasswordPage />
        <LocationProbe />
      </MemoryRouter>,
    )

    await waitFor(() =>
      expect(screen.getByLabelText('current location')).not.toHaveTextContent('reset-secret'),
    )
    expect(resetMutate).not.toHaveBeenCalled()
    await user.type(screen.getByLabelText('New password'), 'new-password')
    await user.type(screen.getByLabelText('Confirm new password'), 'new-password')
    await user.click(screen.getByRole('button', { name: 'Update password' }))

    await waitFor(() => expect(resetMutate).toHaveBeenCalled())
    expect(resetMutate.mock.calls[0]?.[0]).toEqual({
      token: 'reset-secret',
      newPassword: 'new-password',
    })
    expect(resetMutate.mock.calls[0]?.[0]).not.toHaveProperty('confirmPassword')
  })

  it('renders real recovery states when tokens are missing', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/auth/verify-email']}>
        <VerifyEmailPage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/does not contain a token/i)).toBeInTheDocument()
    unmount()
    render(
      <MemoryRouter initialEntries={['/auth/reset-password']}>
        <ResetPasswordPage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/reset link does not contain a token/i)).toBeInTheDocument()
  })
})
