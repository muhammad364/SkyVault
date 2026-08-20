import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ResendVerificationForm } from '@/features/auth/components/ResendVerificationForm'
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword'
import { useResendVerification } from '@/features/auth/hooks/useResendVerification'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'

vi.mock('@/features/auth/hooks/useForgotPassword')
vi.mock('@/features/auth/hooks/useResendVerification')

afterEach(cleanup)

describe('generic authentication recovery', () => {
  it('uses a generic forgot-password success message', () => {
    vi.mocked(useForgotPassword).mockReturnValue({ isSuccess: true } as ReturnType<typeof useForgotPassword>)
    render(<MemoryRouter><ForgotPasswordPage /></MemoryRouter>)
    expect(screen.getByText('If that account can receive password email, a message is on its way.')).toBeInTheDocument()
  })

  it('uses a generic resend-verification success message', () => {
    vi.mocked(useResendVerification).mockReturnValue({ isSuccess: true } as ReturnType<typeof useResendVerification>)
    render(<ResendVerificationForm />)
    expect(screen.getByText('If that account can receive verification email, a message is on its way.')).toBeInTheDocument()
  })
})
