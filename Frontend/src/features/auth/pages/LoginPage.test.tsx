import { QueryClient, type MutateOptions } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/api/errors'
import { LoginRoleMismatchError, useLogin } from '@/features/auth/hooks/useLogin'
import LoginPage from '@/features/auth/pages/LoginPage'
import type { LoginRequest } from '@/models/auth/LoginRequest'
import type { LoginResponse } from '@/models/auth/LoginResponse'

vi.mock('@/features/auth/hooks/useLogin', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/auth/hooks/useLogin')>()
  return { ...actual, useLogin: vi.fn() }
})

type LoginMutate = (
  request: LoginRequest,
  options?: MutateOptions<LoginResponse, Error, LoginRequest>,
) => void
const loginMutate = vi.fn<LoginMutate>()
const mutationContext = { client: new QueryClient(), meta: undefined }

function token(role: 'User' | 'Admin') {
  return `header.${btoa(JSON.stringify({ role }))}.signature`
}

async function submitLogin() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Email address'), 'ava@example.com')
  await user.type(screen.getByLabelText('Password'), 'long-enough')
  await user.click(screen.getByRole('button', { name: 'Sign in' }))
}

describe('LoginPage', () => {
  beforeEach(() => {
    loginMutate.mockReset()
    vi.mocked(useLogin).mockReturnValue({
      mutate: loginMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useLogin>)
  })

  afterEach(cleanup)

  it('returns a successful login to the originally requested route', async () => {
    loginMutate.mockImplementation((request, options) => {
      options?.onSuccess?.(
        { token: token('User'), expiresAt: new Date(Date.now() + 60_000).toISOString() },
        request,
        undefined,
        mutationContext,
      )
    })
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/auth/login', state: { from: { pathname: '/vault/settings' } } },
        ]}
      >
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/vault/settings" element={<p>Requested settings route</p>} />
        </Routes>
      </MemoryRouter>,
    )
    await submitLogin()
    expect(await screen.findByText('Requested settings route')).toBeInTheDocument()
  })

  it('sends unverified login attempts to the resend recovery route', async () => {
    loginMutate.mockImplementation((request, options) => {
      options?.onError?.(
        new ApiError(403, 'Safe response', undefined, undefined, 'email_not_verified'),
        request,
        undefined,
        mutationContext,
      )
    })
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/check-email" element={<p>Check email recovery</p>} />
        </Routes>
      </MemoryRouter>,
    )
    await submitLogin()
    expect(await screen.findByText('Check email recovery')).toBeInTheDocument()
  })

  it('shows an admin-only form without registration or password recovery and routes an admin token', async () => {
    loginMutate.mockImplementation((request, options) => {
      options?.onSuccess?.(
        {
          token: token('Admin'),
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
        },
        request,
        undefined,
        mutationContext,
      )
    })
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/auth/login',
            state: { from: { pathname: '/admin/users' }, loginMode: 'admin' },
          },
        ]}
      >
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/admin/users" element={<p>Admin users route</p>} />
        </Routes>
      </MemoryRouter>,
    )

    const adminTab = screen.getByRole('tab', { name: 'Admin' })
    expect(adminTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByLabelText('Administrator email')).toBeInTheDocument()
    expect(screen.queryByText('Forgot your password?')).not.toBeInTheDocument()
    expect(screen.queryByText('Create your account')).not.toBeInTheDocument()
    const user = userEvent.setup()
    adminTab.focus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'User' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument()
    await user.keyboard('{ArrowRight}')
    expect(adminTab).toHaveAttribute('aria-selected', 'true')
    await user.type(screen.getByLabelText('Administrator email'), 'admin@example.com')
    await user.type(screen.getByLabelText('Password'), 'long-enough')
    await user.click(screen.getByRole('button', { name: 'Sign in as admin' }))
    expect(await screen.findByText('Admin users route')).toBeInTheDocument()
  })

  it('rejects a non-admin token submitted through the admin tab', async () => {
    loginMutate.mockImplementation((request, options) => {
      options?.onError?.(new LoginRoleMismatchError('admin'), request, undefined, mutationContext)
    })
    render(
      <MemoryRouter initialEntries={[{ pathname: '/auth/login', state: { loginMode: 'admin' } }]}>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/admin" element={<p>Admin route</p>} />
        </Routes>
      </MemoryRouter>,
    )
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Administrator email'), 'person@example.com')
    await user.type(screen.getByLabelText('Password'), 'long-enough')
    await user.click(screen.getByRole('button', { name: 'Sign in as admin' }))

    expect(
      await screen.findByText('These credentials do not belong to an administrator account.'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Admin route')).not.toBeInTheDocument()
  })
})
