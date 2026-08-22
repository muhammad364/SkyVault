import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FileTransferOptions } from '@/api/endpoints/files.api'
import {
  FileOperationProvider,
  useFileOperations,
} from '@/features/files/components/FileOperationProvider'
import { filesService } from '@/features/files/services/files.service'
import {
  clearFileOperations,
  useFileOperationsStore,
} from '@/features/files/store/fileOperations.store'
import type { FileResponse } from '@/models/file/FileResponse'

vi.mock('@/features/files/services/files.service', () => ({
  filesService: { upload: vi.fn() },
}))
vi.mock('@/features/files/hooks/vaultInvalidation', () => ({
  invalidateVaultReads: vi.fn(() => Promise.resolve()),
}))

function UploadHarness() {
  const { uploadFiles } = useFileOperations()
  return (
    <button onClick={() => uploadFiles([new File(['vault'], 'notes.txt')], null)}>Upload</button>
  )
}

describe('FileOperationProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearFileOperations()
  })
  afterEach(cleanup)

  it('uses real transport progress and closes the cancellation boundary at 100%', async () => {
    let resolveUpload: ((value: FileResponse) => void) | undefined
    let transferOptions: FileTransferOptions | undefined
    vi.mocked(filesService.upload).mockImplementation((_request, options) => {
      transferOptions = options
      return new Promise<FileResponse>((resolve) => {
        resolveUpload = resolve
      })
    })

    render(
      <QueryClientProvider client={new QueryClient()}>
        <FileOperationProvider>
          <UploadHarness />
        </FileOperationProvider>
      </QueryClientProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Upload' }))
    await waitFor(() => expect(filesService.upload).toHaveBeenCalledOnce())

    act(() => transferOptions?.onUploadProgress?.({ loaded: 5, total: 10 } as never))
    let operation = useFileOperationsStore.getState().operations[0]
    expect(operation).toMatchObject({ status: 'transferring', progress: 50, cancellable: true })

    act(() => transferOptions?.onUploadProgress?.({ loaded: 10, total: 10 } as never))
    operation = useFileOperationsStore.getState().operations[0]
    expect(operation).toMatchObject({ status: 'processing', progress: 100, cancellable: false })

    act(() =>
      resolveUpload?.({
        fileId: 'file-id',
        folderId: '00000000-0000-0000-0000-000000000000',
        fileName: 'notes.txt',
        extension: '.txt',
        mimeType: 'text/plain',
        fileSizeBytes: 5,
        uploadedAt: '2026-08-23T00:00:00Z',
        updatedAt: '2026-08-23T00:00:00Z',
      }),
    )
    await waitFor(() =>
      expect(useFileOperationsStore.getState().operations[0]).toMatchObject({
        status: 'completed',
        file: undefined,
      }),
    )
  })
})
