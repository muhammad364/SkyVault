import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSearchResults } from '@/features/search/hooks/useSearchResults'
import SearchPage from '@/features/search/pages/SearchPage'

vi.mock('@/features/search/hooks/useSearchResults', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/features/search/hooks/useSearchResults')>()
  return { ...original, useSearchResults: vi.fn() }
})
vi.mock('@/features/files/components/FileOperationProvider', () => ({
  useFileOperations: () => ({ downloadFile: vi.fn() }),
}))
vi.mock('@/features/files/store/fileOperations.store', () => ({
  useFileOperationsStore: (selector: (state: { operations: never[] }) => unknown) =>
    selector({ operations: [] }),
}))
vi.mock('@/features/files/components/FileManagerDialogs', () => ({
  FileManagerDialogs: () => null,
}))
vi.mock('@/features/files/components/FilePreviewDialog', () => ({
  FilePreviewDialog: () => null,
}))
vi.mock('@/features/sharing/components/ShareLinkDialog', () => ({ ShareLinkDialog: () => null }))
vi.mock('@/features/search/components/SearchResultsList', () => ({
  SearchResultsList: ({ results }: { results: Array<{ fileId: string; fileName: string }> }) => (
    <ol aria-label="Rendered results">
      {results.map((result) => (
        <li key={result.fileId}>{result.fileName}</li>
      ))}
    </ol>
  ),
}))

const results = [
  {
    fileId: 'rank-2',
    fileName: 'Server first',
    fileExtension: 'pdf',
    mimeType: 'application/pdf',
    fileSizeBytes: 1,
    folderId: null,
    folderName: null,
    uploadedAt: '2026-01-01T00:00:00Z',
    lastModifiedAt: '2026-01-02T00:00:00Z',
  },
  {
    fileId: 'rank-1',
    fileName: 'Server second',
    fileExtension: 'txt',
    mimeType: 'text/plain',
    fileSizeBytes: 2,
    folderId: null,
    folderName: null,
    uploadedAt: '2026-02-01T00:00:00Z',
    lastModifiedAt: '2026-02-02T00:00:00Z',
  },
]

describe('SearchPage', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(cleanup)

  it('hydrates supported URL fields and preserves backend result order', () => {
    vi.mocked(useSearchResults).mockReturnValue({
      data: results,
      isPending: false,
      isError: false,
    } as ReturnType<typeof useSearchResults>)

    render(
      <MemoryRouter
        initialEntries={[
          '/vault/search?query=report&fileType=pdf&fromDate=2026-01-01&toDate=2026-12-31&size=large',
        ]}
      >
        <SearchPage />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText('Search words')).toHaveValue('report')
    expect(screen.getByLabelText('File type or extension')).toHaveValue('pdf')
    expect(screen.getByLabelText('Uploaded from')).toHaveValue('2026-01-01')
    expect(screen.getByLabelText('Uploaded to')).toHaveValue('2026-12-31')
    expect(useSearchResults).toHaveBeenCalledWith(
      {
        query: 'report',
        fileType: 'pdf',
        fromDate: '2026-01-01',
        toDate: '2026-12-31',
      },
      true,
    )
    const rendered = screen.getByRole('list', { name: 'Rendered results' })
    const rows = within(rendered).getAllByRole('listitem')
    expect(rows[0]).toHaveTextContent('Server first')
    expect(rows[1]).toHaveTextContent('Server second')
  })

  it('keeps the empty state request-free and provides loading and retry states', () => {
    vi.mocked(useSearchResults).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as ReturnType<typeof useSearchResults>)
    const view = render(
      <MemoryRouter initialEntries={['/vault/search']}>
        <SearchPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Start with a detail you remember.')).toBeInTheDocument()
    expect(useSearchResults).toHaveBeenCalledWith(
      { query: null, fileType: null, fromDate: null, toDate: null },
      false,
    )

    view.unmount()
    vi.mocked(useSearchResults).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as ReturnType<typeof useSearchResults>)
    const loading = render(
      <MemoryRouter initialEntries={['/vault/search?query=report']}>
        <SearchPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('status', { name: 'Searching your vault' })).toBeInTheDocument()

    loading.unmount()
    vi.mocked(useSearchResults).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useSearchResults>)
    render(
      <MemoryRouter initialEntries={['/vault/search?query=report']}>
        <SearchPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Search paused before returning results.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
