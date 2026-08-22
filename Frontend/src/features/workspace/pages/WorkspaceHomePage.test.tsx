import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import WorkspaceHomePage from '@/features/workspace/pages/WorkspaceHomePage'

vi.mock('@/features/workspace/components/WorkspaceGreeting', () => ({
  WorkspaceGreeting: () => <header>Workspace greeting</header>,
}))
vi.mock('@/features/workspace/components/StorageOverviewTile', () => ({
  StorageOverviewTile: () => <section>Storage overview</section>,
}))
vi.mock('@/features/workspace/components/RootFoldersTile', () => ({
  RootFoldersTile: () => <section>Root folders</section>,
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
    const { container } = render(<WorkspaceHomePage />)

    expect(screen.getByText('Workspace greeting')).toBeInTheDocument()
    expect(screen.getByText('Storage overview')).toBeInTheDocument()
    expect(screen.getByText('Root folders')).toBeInTheDocument()
    expect(screen.getByText('Recent files')).toBeInTheDocument()
    expect(screen.getByText('Quick actions')).toBeInTheDocument()
    expect(screen.getByText('Shared links')).toBeInTheDocument()
    expect(screen.getByText('Trash summary')).toBeInTheDocument()

    const greeting = screen.getByText('Workspace greeting')
    const quickActions = screen.getByText('Quick actions')
    const files = screen.getByText('Recent files')
    const folders = screen.getByText('Root folders')
    expect(
      greeting.compareDocumentPosition(quickActions) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0)
    expect(quickActions.compareDocumentPosition(files) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(
      0,
    )
    expect(files.compareDocumentPosition(folders) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0)
    expect(container.firstElementChild).toHaveClass('gap-5')
    expect(files.parentElement).toHaveClass('gap-4')
  })
})
