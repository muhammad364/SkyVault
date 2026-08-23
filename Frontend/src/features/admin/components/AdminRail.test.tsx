import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AdminRail } from '@/features/admin/components/AdminRail'
import { useLogout } from '@/features/account/hooks/useLogout'

vi.mock('@/features/account/hooks/useLogout')

afterEach(cleanup)

describe('AdminRail', () => {
  it('exposes only administration and account destinations', () => {
    vi.mocked(useLogout).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useLogout>)
    render(
      <MemoryRouter>
        <AdminRail />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('navigation', { name: 'Administration navigation' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute('href', '/admin/users')
    expect(screen.getByRole('link', { name: 'Infrastructure' })).toHaveAttribute(
      'href',
      '/admin/infrastructure',
    )
    expect(screen.queryByRole('link', { name: 'Files' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Storage' })).not.toBeInTheDocument()
  })
})
