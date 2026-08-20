import { QueryClient, type MutateOptions } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/api/errors'
import { useRegister } from '@/features/auth/hooks/useRegister'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import type { RegisterUserRequest } from '@/models/auth/RegisterUserRequest'
import type { RegisterUserResponse } from '@/models/auth/RegisterUserResponse'

vi.mock('@/features/auth/hooks/useRegister')

type RegisterMutate = (
  request: RegisterUserRequest,
  options?: MutateOptions<RegisterUserResponse, Error, RegisterUserRequest>,
) => void

const registerMutate = vi.fn<RegisterMutate>()
const mutationContext = { client: new QueryClient(), meta: undefined }

function renderPage() {
  return render(<MemoryRouter><RegisterPage /></MemoryRouter>)
}

async function completeForm() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('First name'), 'Ava')
  await user.type(screen.getByLabelText('Last name'), 'Khan')
  await user.type(screen.getByLabelText('Email address'), 'ava@example.com')
  await user.type(screen.getByLabelText('Password'), 'long-enough')
  await user.type(screen.getByLabelText('Confirm password'), 'long-enough')
  await user.click(screen.getByRole('button', { name: 'Create your account' }))
}

describe('RegisterPage', () => {
  beforeEach(() => {
    registerMutate.mockReset()
    vi.mocked(useRegister).mockReturnValue({ mutate: registerMutate, isPending: false } as unknown as ReturnType<typeof useRegister>)
  })

  afterEach(cleanup)

  it('excludes the client-only confirmation field from the registration DTO', async () => {
    renderPage()
    await completeForm()

    await waitFor(() => expect(registerMutate).toHaveBeenCalled())
    expect(registerMutate.mock.calls[0]?.[0]).toEqual({
      firstName: 'Ava', lastName: 'Khan', email: 'ava@example.com', password: 'long-enough',
    })
    expect(registerMutate.mock.calls[0]?.[0]).not.toHaveProperty('confirmPassword')
  })

  it('maps duplicate registration to the email field without exposing server text', async () => {
    registerMutate.mockImplementation((_request, options) => {
      options?.onError?.(new ApiError(409, 'Safe response', undefined, undefined, 'email_already_registered'), _request, undefined, mutationContext)
    })
    renderPage()
    await completeForm()

    expect(await screen.findByText('An account already uses this email address.')).toBeInTheDocument()
  })
})
