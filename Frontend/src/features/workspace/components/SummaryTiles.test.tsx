import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRecycleBinItems } from '@/features/recycle-bin/hooks/useRecycleBinItems'
import { useOwnShareLinks } from '@/features/sharing/hooks/useOwnShareLinks'
import { SharedLinksTile } from '@/features/workspace/components/SharedLinksTile'
import { TrashSummaryTile } from '@/features/workspace/components/TrashSummaryTile'

vi.mock('@/features/sharing/hooks/useOwnShareLinks')
vi.mock('@/features/recycle-bin/hooks/useRecycleBinItems')

function renderInRouter(children: ReactNode) {
  return render(<MemoryRouter>{children}</MemoryRouter>)
}

describe('workspace sharing and trash summaries', () => {
  const refetch = vi.fn()

  beforeEach(() => refetch.mockReset())
  afterEach(cleanup)

  it('renders both empty states without linking unfinished feature routes', () => {
    vi.mocked(useOwnShareLinks).mockReturnValue({
      isPending: false,
      isError: false,
      data: [],
    } as unknown as ReturnType<typeof useOwnShareLinks>)
    vi.mocked(useRecycleBinItems).mockReturnValue({
      isPending: false,
      isError: false,
      data: [],
    } as unknown as ReturnType<typeof useRecycleBinItems>)

    renderInRouter(
      <>
        <SharedLinksTile />
        <TrashSummaryTile />
      </>,
    )

    expect(screen.getByRole('heading', { name: 'Nothing shared yet' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nothing waiting here' })).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('keeps loading and error recovery independent', () => {
    vi.mocked(useOwnShareLinks).mockReturnValue({
      isPending: true,
    } as ReturnType<typeof useOwnShareLinks>)
    vi.mocked(useRecycleBinItems).mockReturnValue({
      isPending: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useRecycleBinItems>)

    renderInRouter(
      <>
        <SharedLinksTile />
        <TrashSummaryTile />
      </>,
    )

    expect(screen.getByRole('status', { name: 'Loading shared links summary' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('summarizes only explicit share fields and never renders share secrets', () => {
    vi.mocked(useOwnShareLinks).mockReturnValue({
      isPending: false,
      isError: false,
      data: [
        {
          shareLinkId: 'link-new',
          fileId: 'file-1',
          shareUrl: 'https://api.example/api/share/private-new-token',
          expiresAt: '2026-09-22T00:00:00Z',
          isRevoked: false,
          createdAt: '2026-08-22T00:00:00Z',
        },
        {
          shareLinkId: 'link-old',
          fileId: 'file-2',
          shareUrl: 'https://api.example/api/share/private-old-token',
          expiresAt: null,
          isRevoked: true,
          createdAt: '2026-08-21T00:00:00Z',
        },
      ],
    } as ReturnType<typeof useOwnShareLinks>)

    const { container } = renderInRouter(<SharedLinksTile />)

    expect(screen.getByText('Not revoked')).toBeInTheDocument()
    expect(screen.getByText('Revoked')).toBeInTheDocument()
    expect(container.querySelector('time[datetime="2026-09-22T00:00:00Z"]')).toBeInTheDocument()
    expect(screen.getByText('No expiry provided')).toBeInTheDocument()
    expect(container.textContent).not.toContain('private-new-token')
    expect(container.textContent).not.toContain('private-old-token')
    expect(screen.getByRole('link', { name: 'Manage shared links' })).toHaveAttribute(
      'href',
      '/vault/sharing',
    )
  })

  it('shows the two newest trash items with API-provided metadata', () => {
    vi.mocked(useRecycleBinItems).mockReturnValue({
      isPending: false,
      isError: false,
      data: [
        {
          itemId: 'older',
          itemType: 'File',
          name: 'Older note.txt',
          originalParentFolderId: null,
          extension: '.txt',
          mimeType: 'text/plain',
          fileSizeBytes: 100,
          deletedAt: '2026-08-20T00:00:00Z',
          expiresAt: '2026-09-19T00:00:00Z',
        },
        {
          itemId: 'newest',
          itemType: 'Folder',
          name: 'Newest folder',
          originalParentFolderId: 'folder-id',
          extension: null,
          mimeType: null,
          fileSizeBytes: null,
          deletedAt: '2026-08-22T00:00:00Z',
          expiresAt: '2026-09-21T00:00:00Z',
        },
        {
          itemId: 'middle',
          itemType: 'File',
          name: 'Middle note.txt',
          originalParentFolderId: null,
          extension: '.txt',
          mimeType: 'text/plain',
          fileSizeBytes: 200,
          deletedAt: '2026-08-21T00:00:00Z',
          expiresAt: '2026-09-20T00:00:00Z',
        },
      ],
    } as ReturnType<typeof useRecycleBinItems>)

    const { container } = renderInRouter(<TrashSummaryTile />)

    expect(screen.getByText('Newest folder')).toBeInTheDocument()
    expect(screen.getByText('Middle note.txt')).toBeInTheDocument()
    expect(screen.queryByText('Older note.txt')).not.toBeInTheDocument()
    expect(container.querySelector('time[datetime="2026-09-21T00:00:00Z"]')).toBeInTheDocument()
    expect(container.querySelector('time[datetime="2026-09-20T00:00:00Z"]')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open Recycle Bin' })).toHaveAttribute(
      'href',
      '/vault/trash',
    )
  })
})
