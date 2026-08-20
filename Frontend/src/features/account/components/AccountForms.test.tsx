import { QueryClient, type MutateOptions } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ChangePasswordForm } from '@/features/account/components/ChangePasswordForm'
import { ProfileForm } from '@/features/account/components/ProfileForm'
import { useChangePassword } from '@/features/account/hooks/useChangePassword'
import { useUpdateProfile } from '@/features/account/hooks/useUpdateProfile'
import { clearClientSession } from '@/features/auth/lib/clearClientSession'
import type { ChangePasswordRequest } from '@/models/auth/ChangePasswordRequest'
import type { UpdateUserProfileRequest } from '@/models/auth/UpdateUserProfileRequest'
import type { UserProfileResponse } from '@/models/auth/UserProfileResponse'
import type { MessageResponse } from '@/models/common/MessageResponse'

vi.mock('@/features/account/hooks/useChangePassword')
vi.mock('@/features/account/hooks/useUpdateProfile')
vi.mock('@/features/auth/lib/clearClientSession', () => ({ clearClientSession: vi.fn().mockResolvedValue(undefined) }))

type ProfileMutate = (request: UpdateUserProfileRequest, options?: MutateOptions<UserProfileResponse, Error, UpdateUserProfileRequest>) => void
type PasswordMutate = (request: ChangePasswordRequest, options?: MutateOptions<MessageResponse, Error, ChangePasswordRequest>) => void

const updateMutate = vi.fn<ProfileMutate>()
const passwordMutate = vi.fn<PasswordMutate>()
const mutationContext = { client: new QueryClient(), meta: undefined }
const profile: UserProfileResponse = {
  userId: 'user-1', firstName: 'Ava', lastName: 'Khan', email: 'ava@example.com',
  isEmailVerified: true, allocatedStorageBytes: 0, usedStorageBytes: 0,
}

describe('account forms', () => {
  beforeEach(() => {
    updateMutate.mockReset()
    passwordMutate.mockReset()
    vi.mocked(clearClientSession).mockClear()
    vi.mocked(useUpdateProfile).mockReturnValue({ mutate: updateMutate, isPending: false, isSuccess: false } as unknown as ReturnType<typeof useUpdateProfile>)
    vi.mocked(useChangePassword).mockReturnValue({ mutate: passwordMutate, isPending: false } as unknown as ReturnType<typeof useChangePassword>)
  })

  afterEach(cleanup)

  it('renders the protected profile facts and submits only editable names', async () => {
    const user = userEvent.setup()
    render(<ProfileForm profile={profile} />)

    expect(screen.getByDisplayValue('ava@example.com')).toHaveAttribute('readonly')
    expect(screen.getByText('Verified email')).toBeInTheDocument()
    await user.clear(screen.getByLabelText('First name'))
    await user.type(screen.getByLabelText('First name'), 'Amna')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => expect(updateMutate).toHaveBeenCalled())
    expect(updateMutate.mock.calls[0]?.[0]).toEqual({ firstName: 'Amna', lastName: 'Khan' })
  })

  it('excludes confirmation, clears the session, and returns to login after password change', async () => {
    passwordMutate.mockImplementation((request, options) => {
      void options?.onSuccess?.({ message: 'Changed.' }, request, undefined, mutationContext)
    })
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/vault/settings']}>
        <Routes>
          <Route path="/vault/settings" element={<ChangePasswordForm />} />
          <Route path="/auth/login" element={<p>Login after password change</p>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Current password'), 'old-password')
    await user.type(screen.getByLabelText('New password'), 'new-password')
    await user.type(screen.getByLabelText('Confirm new password'), 'new-password')
    await user.click(screen.getByRole('button', { name: 'Change password' }))

    expect(passwordMutate.mock.calls[0]?.[0]).toEqual({ currentPassword: 'old-password', newPassword: 'new-password' })
    expect(passwordMutate.mock.calls[0]?.[0]).not.toHaveProperty('confirmPassword')
    await waitFor(() => expect(clearClientSession).toHaveBeenCalled())
    expect(await screen.findByText('Login after password change')).toBeInTheDocument()
  })
})
