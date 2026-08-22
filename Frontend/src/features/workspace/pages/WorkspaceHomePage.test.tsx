import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import WorkspaceHomePage from '@/features/workspace/pages/WorkspaceHomePage'

vi.mock('@/features/workspace/components/WorkspaceGreeting', () => ({
  WorkspaceGreeting: () => <header>Workspace greeting</header>,
}))
vi.mock('@/features/workspace/components/QuotaSignatureTile', () => ({
  QuotaSignatureTile: () => <section>Quota signature</section>,
}))
vi.mock('@/features/workspace/components/PlanStatusTile', () => ({
  PlanStatusTile: () => <section>Plan status</section>,
}))
vi.mock('@/features/workspace/components/RecentFilesTile', () => ({
  RecentFilesTile: () => <section>Recent files</section>,
}))
vi.mock('@/features/workspace/components/QuickActionsTile', () => ({
  QuickActionsTile: () => <section>Quick actions</section>,
}))
vi.mock('@/features/workspace/components/SharedLinksTile', () => ({
  SharedLinksTile: () => <section>Shared links</section>,
}))
vi.mock('@/features/workspace/components/TrashSummaryTile', () => ({
  TrashSummaryTile: () => <section>Trash summary</section>,
}))

afterEach(cleanup)

describe('WorkspaceHomePage', () => {
  it('composes the complete Phase 5 bento without a workspace endpoint', () => {
    render(<WorkspaceHomePage />)

    expect(screen.getByText('Workspace greeting')).toBeInTheDocument()
    expect(screen.getByText('Quota signature')).toBeInTheDocument()
    expect(screen.getByText('Plan status')).toBeInTheDocument()
    expect(screen.getByText('Recent files')).toBeInTheDocument()
    expect(screen.getByText('Quick actions')).toBeInTheDocument()
    expect(screen.getByText('Shared links')).toBeInTheDocument()
    expect(screen.getByText('Trash summary')).toBeInTheDocument()
  })
})
