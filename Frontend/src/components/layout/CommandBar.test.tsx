import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLocation } from 'react-router-dom'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CommandBar } from '@/components/layout/CommandBar'
import { useSearchResults } from '@/features/search/hooks/useSearchResults'
import { clearSearchHistory } from '@/features/search/store/searchHistory.store'

vi.mock('@/features/search/hooks/useSearchResults', () => ({ useSearchResults: vi.fn() }))

const result = {
  fileId: 'file-1',
  fileName: 'Budget.pdf',
  fileExtension: 'pdf',
  mimeType: 'application/pdf',
  fileSizeBytes: 2048,
  folderId: 'folder-1',
  folderName: 'Finance',
  uploadedAt: '2026-01-01T00:00:00Z',
  lastModifiedAt: '2026-01-02T00:00:00Z',
}

function Location() {
  const location = useLocation()
  return <output>{`${location.pathname}${location.search}`}</output>
}

function renderCommand() {
  return render(
    <MemoryRouter initialEntries={['/vault']}>
      <CommandBar />
      <Location />
    </MemoryRouter>,
  )
}

describe('CommandBar', () => {
  beforeEach(() => {
    clearSearchHistory()
    vi.clearAllMocks()
    vi.mocked(useSearchResults).mockReturnValue({
      data: [result],
      isPending: false,
      isError: false,
    } as ReturnType<typeof useSearchResults>)
  })

  it('opens with slash and supports arrow/Enter result navigation', async () => {
    const user = userEvent.setup()
    renderCommand()

    fireEvent.keyDown(window, { key: '/' })
    const input = await screen.findByRole('textbox', { name: 'Search words' })
    await user.type(input, 'budget')
    await user.keyboard('{ArrowDown}{Enter}')

    expect(screen.getByRole('status')).toHaveTextContent('/vault/files/folder-1')
  })

  it('opens with Ctrl+K, submits to the full search page, and closes with Escape', async () => {
    const user = userEvent.setup()
    renderCommand()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    const input = await screen.findByRole('textbox', { name: 'Search words' })
    await user.type(input, 'annual report')
    await user.keyboard('{Enter}')
    expect(screen.getByRole('status')).toHaveTextContent('/vault/search?query=annual+report')

    fireEvent.keyDown(window, { key: '/' })
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
