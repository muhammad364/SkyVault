import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { SearchResultsList } from '@/features/search/components/SearchResultsList'
import type { SearchResult } from '@/models/search/SearchResult'

const results: SearchResult[] = [
  {
    fileId: 'rank-1',
    fileName: 'First from server',
    fileExtension: 'txt',
    mimeType: 'text/plain',
    fileSizeBytes: 100,
    folderId: null,
    folderName: null,
    uploadedAt: '2026-03-01T00:00:00Z',
    lastModifiedAt: '2026-03-02T00:00:00Z',
  },
  {
    fileId: 'rank-2',
    fileName: 'Second from server',
    fileExtension: 'pdf',
    mimeType: 'application/pdf',
    fileSizeBytes: 200,
    folderId: 'folder-2',
    folderName: 'Reports',
    uploadedAt: '2026-02-01T00:00:00Z',
    lastModifiedAt: '2026-02-02T00:00:00Z',
  },
]

describe('SearchResultsList', () => {
  it('preserves server order, renders DTO metadata, folder destinations, and reused file actions', async () => {
    const user = userEvent.setup()
    const action = vi.fn()
    render(
      <MemoryRouter>
        <SearchResultsList
          results={results}
          selected={new Set()}
          busyIds={new Set()}
          onToggle={action}
          onPreview={action}
          onDownload={action}
          onRename={action}
          onMove={action}
          onCopy={action}
          onReplace={action}
          onShare={action}
          onDelete={action}
        />
      </MemoryRouter>,
    )

    const list = screen.getByRole('list', { name: 'Search results' })
    const rows = within(list).getAllByRole('listitem')
    expect(rows[0]).toHaveTextContent('First from server')
    expect(rows[1]).toHaveTextContent('Second from server')
    expect(rows[0]).toHaveTextContent('text/plain')
    expect(screen.getByRole('link', { name: 'Root' })).toHaveAttribute('href', '/vault/files')
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveAttribute(
      'href',
      '/vault/files/folder-2',
    )

    await user.click(screen.getByRole('button', { name: 'Actions for First from server' }))
    for (const name of [
      'Preview',
      'Download',
      'Rename',
      'Move',
      'Copy',
      'Replace contents',
      'Share',
      'Move to Trash',
    ]) {
      expect(await screen.findByRole('menuitem', { name })).toBeInTheDocument()
    }
  })
})
