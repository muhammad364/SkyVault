import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useProfile } from '@/features/account/hooks/useProfile'
import { WorkspaceGreeting } from '@/features/workspace/components/WorkspaceGreeting'

vi.mock('@/features/account/hooks/useProfile')

describe('WorkspaceGreeting', () => {
  const refetch = vi.fn()

  beforeEach(() => refetch.mockReset())
  afterEach(cleanup)

  it('shows a stable loading state', () => {
    vi.mocked(useProfile).mockReturnValue({ isPending: true } as ReturnType<typeof useProfile>)

    render(<WorkspaceGreeting />)

    expect(screen.getByRole('status', { name: 'Loading your greeting' })).toBeInTheDocument()
  })

  it('keeps the workspace usable and offers retry after a profile error', () => {
    vi.mocked(useProfile).mockReturnValue({
      isPending: false,
      isError: true,
      isFetching: false,
      refetch,
    } as unknown as ReturnType<typeof useProfile>)

    render(<WorkspaceGreeting />)
    fireEvent.click(screen.getByRole('button', { name: 'Try greeting again' }))

    expect(screen.getByRole('heading', { name: 'Welcome back.' })).toBeInTheDocument()
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('personalizes the greeting only with the API profile name', () => {
    vi.mocked(useProfile).mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        userId: 'user-id',
        firstName: 'Haroon',
        lastName: 'Khalid',
        email: 'haroon@example.com',
        allocatedStorageBytes: 100,
        usedStorageBytes: 20,
        isEmailVerified: true,
      },
    } as ReturnType<typeof useProfile>)

    render(<WorkspaceGreeting />)

    expect(screen.getByRole('heading', { name: 'Welcome back, Haroon.' })).toBeInTheDocument()
  })
})
