import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLogout } from '@/features/account/hooks/useLogout'
import { useProfile } from '@/features/account/hooks/useProfile'
import AccountPage from '@/features/account/pages/AccountPage'

vi.mock('@/features/account/hooks/useLogout')
vi.mock('@/features/account/hooks/useProfile')
vi.mock('@/features/account/components/ProfileForm', () => ({
  ProfileForm: () => <p>Profile success state</p>,
}))
vi.mock('@/features/account/components/ChangePasswordForm', () => ({
  ChangePasswordForm: () => <p>Password form</p>,
}))

const refetch = vi.fn()
const logoutMutate = vi.fn()

describe('AccountPage states', () => {
  beforeEach(() => {
    refetch.mockReset()
    logoutMutate.mockReset()
    vi.mocked(useLogout).mockReturnValue({
      mutate: logoutMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useLogout>)
  })

  afterEach(cleanup)

  it('shows a stable settings skeleton while the profile loads', () => {
    vi.mocked(useProfile).mockReturnValue({ isPending: true } as ReturnType<typeof useProfile>)
    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('status', { name: 'Loading account settings' })).toBeInTheDocument()
  })

  it('offers retry after a profile error', () => {
    vi.mocked(useProfile).mockReturnValue({
      isPending: false,
      isError: true,
      isFetching: false,
      refetch,
    } as unknown as ReturnType<typeof useProfile>)
    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(refetch).toHaveBeenCalled()
  })

  it('renders profile, password, and logout controls after success', () => {
    vi.mocked(useProfile).mockReturnValue({
      isPending: false,
      isError: false,
      data: {},
    } as unknown as ReturnType<typeof useProfile>)
    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Profile success state')).toBeInTheDocument()
    expect(screen.getByText('Password form')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
  })
})
