import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import FilesPage from '@/features/files/pages/FilesPage'
import { useFolderAncestry, useFolderContents } from '@/features/folders/hooks/useFolderContents'
import { useFileOperationsStore } from '@/features/files/store/fileOperations.store'
import { useUiStore } from '@/store/ui.store'

const operationMethods = vi.hoisted(() => ({
  uploadFiles: vi.fn(),
  replaceFile: vi.fn(),
  previewFile: vi.fn(),
  downloadFile: vi.fn(),
  copyFiles: vi.fn(),
  moveItems: vi.fn(),
  deleteItems: vi.fn(),
}))

vi.mock('@/features/folders/hooks/useFolderContents')
vi.mock('@/features/files/components/FileOperationProvider', () => ({
  useFileOperations: () => operationMethods,
}))
vi.mock('@/features/files/components/FolderNavigator', () => ({
  FolderNavigator: () => <nav>Folder navigator</nav>,
}))
vi.mock('@/features/files/components/EmptyFolderVisual', () => ({
  EmptyFolderVisual: () => <div>Folder visual</div>,
}))
vi.mock('@/features/files/components/FileManagerDialogs', () => ({
  FileManagerDialogs: ({ state }: { state: { type: string } | null }) =>
    state ? <div>Dialog {state.type}</div> : null,
}))
vi.mock('@/features/files/components/FilePreviewDialog', () => ({
  FilePreviewDialog: () => null,
}))

const rootContents = {
  currentFolderId: null,
  currentFolderName: 'Root',
  parentFolderId: null,
  subFolders: [
    {
      folderId: 'folder-1',
      parentFolderId: null,
      name: 'Design',
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-08-22T00:00:00Z',
    },
  ],
  files: [
    {
      fileId: 'file-1',
      fileName: 'Notes.txt',
      extension: '.txt',
      fileSizeBytes: 12,
      updatedAt: '2026-08-23T00:00:00Z',
    },
  ],
}

function renderPage(path = '/vault/files') {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/vault/files" element={<FilesPage />} />
        <Route path="/vault/files/:folderId" element={<FilesPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('FilesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useFileOperationsStore.setState({ operations: [], controllers: {} })
    useUiStore.setState({ fileViewMode: 'grid' })
    vi.mocked(useFolderAncestry).mockReturnValue({ data: [] } as unknown as ReturnType<
      typeof useFolderAncestry
    >)
  })
  afterEach(cleanup)

  it('renders API folder contents with folders before files and local filtering', () => {
    vi.mocked(useFolderContents).mockReturnValue({
      isPending: false,
      isError: false,
      data: rootContents,
    } as ReturnType<typeof useFolderContents>)
    renderPage()

    expect(screen.getByRole('heading', { name: 'Root' })).toBeInTheDocument()
    const folder = screen.getByText('Design').closest('button')
    const file = screen.getByText('Notes.txt').closest('button')
    expect(folder).not.toBeNull()
    expect(file).not.toBeNull()
    if (!folder || !file) throw new Error('Expected file-manager item buttons.')
    expect(folder.compareDocumentPosition(file) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0)

    fireEvent.change(screen.getByLabelText('Filter this folder'), { target: { value: 'notes' } })
    expect(screen.queryByText('Design')).not.toBeInTheDocument()
    expect(screen.getByText('Notes.txt')).toBeInTheDocument()
  })

  it('opens owner-approved home actions and uses 3D only for a true empty state', () => {
    vi.mocked(useFolderContents).mockReturnValue({
      isPending: false,
      isError: false,
      data: { ...rootContents, subFolders: [], files: [] },
    } as unknown as ReturnType<typeof useFolderContents>)
    const view = renderPage('/vault/files?action=new-folder')
    expect(screen.getByText('Dialog create')).toBeInTheDocument()
    expect(screen.getByText('Folder visual')).toBeInTheDocument()
    view.unmount()

    renderPage('/vault/files?action=upload')
    expect(operationMethods.uploadFiles).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Upload files' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /choose files from your device/i }),
    ).toBeInTheDocument()
  })
})
