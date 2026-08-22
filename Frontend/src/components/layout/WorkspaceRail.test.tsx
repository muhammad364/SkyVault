import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WorkspaceRail } from '@/components/layout/WorkspaceRail'
import { useLogout } from '@/features/account/hooks/useLogout'

vi.mock('@/features/account/hooks/useLogout')

afterEach(cleanup)

describe('WorkspaceRail', () => {
  const mutate = vi.fn()

  beforeEach(() => {
    mutate.mockReset()
    vi.mocked(useLogout).mockReturnValue({
      isPending: false,
      mutate,
    } as unknown as ReturnType<typeof useLogout>)
  })

  it('makes storage reachable in both dock and rail layouts', () => {
    render(
      <MemoryRouter>
        <WorkspaceRail />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Storage' })).toHaveAttribute('href', '/vault/storage')
  })

  it('stays within the framed viewport and keeps account controls at the bottom', () => {
    render(
      <MemoryRouter>
        <WorkspaceRail />
      </MemoryRouter>,
    )

    const rail = screen.getByRole('navigation', { name: 'Vault navigation' })
    expect(rail).toHaveClass('md:sticky', 'md:h-[calc(100dvh-2.5rem)]', 'md:self-start')
    expect(rail).not.toHaveClass('md:min-h-dvh')
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Account settings' })).toHaveLength(2)
    const signOut = screen.getByRole('button', { name: 'Sign out' })
    expect(signOut).toHaveClass('bg-card-muted', 'text-danger')
    expect(signOut).not.toHaveClass('bg-destructive')
  })

  it('signs out from the rail and returns to login after session cleanup settles', () => {
    mutate.mockImplementation((_variables, options) => options?.onSettled?.())

    render(
      <MemoryRouter initialEntries={['/vault']}>
        <Routes>
          <Route path="/vault" element={<WorkspaceRail />} />
          <Route path="/auth/login" element={<p>Login route</p>} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(mutate).toHaveBeenCalledOnce()
    expect(screen.getByText('Login route')).toBeInTheDocument()
  })
})
