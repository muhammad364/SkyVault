import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useUserFiles } from '@/features/files/hooks/useUserFiles'
import { RecentFilesTile } from '@/features/workspace/components/RecentFilesTile'
import type { FileResponse } from '@/models/file/FileResponse'

vi.mock('@/features/files/hooks/useUserFiles')

function file(index: number): FileResponse {
  return {
    fileId: `file-${index}`,
    folderId: 'folder-id',
    fileName: `File ${index}`,
    extension: '.txt',
    mimeType: 'text/plain',
    fileSizeBytes: index + 1,
    uploadedAt: `2026-08-0${index + 1}T00:00:00Z`,
    updatedAt: `2026-08-0${index + 1}T00:00:00Z`,
  }
}

describe('RecentFilesTile', () => {
  const refetch = vi.fn()

  beforeEach(() => refetch.mockReset())
  afterEach(cleanup)

  it('renders loading, error/retry, and empty states', () => {
    vi.mocked(useUserFiles).mockReturnValue({ isPending: true } as ReturnType<typeof useUserFiles>)
    const view = render(<RecentFilesTile />)
    expect(screen.getByRole('status', { name: 'Loading recent files' })).toBeInTheDocument()
    view.unmount()

    vi.mocked(useUserFiles).mockReturnValue({
      isPending: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useUserFiles>)
    const errorView = render(<RecentFilesTile />)
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(refetch).toHaveBeenCalledOnce()
    errorView.unmount()

    vi.mocked(useUserFiles).mockReturnValue({
      isPending: false,
      isError: false,
      data: [],
    } as unknown as ReturnType<typeof useUserFiles>)
    render(<RecentFilesTile />)
    expect(screen.getByRole('heading', { name: 'Nothing here yet' })).toBeInTheDocument()
  })

  it('shows only the four most recently updated DTOs', () => {
    vi.mocked(useUserFiles).mockReturnValue({
      isPending: false,
      isError: false,
      data: [file(0), file(5), file(2), file(4), file(1), file(3)],
    } as ReturnType<typeof useUserFiles>)
    render(<RecentFilesTile />)

    expect(screen.getByText('File 5')).toBeInTheDocument()
    expect(screen.getByText('File 4')).toBeInTheDocument()
    expect(screen.getByText('File 3')).toBeInTheDocument()
    expect(screen.getByText('File 2')).toBeInTheDocument()
    expect(screen.queryByText('File 1')).not.toBeInTheDocument()
    expect(screen.queryByText('File 0')).not.toBeInTheDocument()
  })
})
