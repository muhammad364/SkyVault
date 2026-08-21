import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { WorkspaceRail } from '@/components/layout/WorkspaceRail'

afterEach(cleanup)

describe('WorkspaceRail', () => {
  it('makes storage reachable in both dock and rail layouts', () => {
    render(
      <MemoryRouter>
        <WorkspaceRail />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Storage' })).toHaveAttribute('href', '/vault/storage')
  })
})
