import { useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { RequestCancelledError } from '@/api/errors'
import { foldersService } from '@/features/folders/services/folders.service'
import { invalidateVaultReads } from '@/features/files/hooks/vaultInvalidation'
import { fileErrorMessage } from '@/features/files/lib/fileErrorMessage'
import {
  type FileOperationKind,
  useFileOperationsStore,
} from '@/features/files/store/fileOperations.store'
import { filesService } from '@/features/files/services/files.service'

export interface VaultItemReference {
  id: string
  type: 'file' | 'folder'
  name: string
}

interface FileOperationContextValue {
  uploadFiles: (files: File[], destinationFolderId: string | null) => void
  replaceFile: (fileId: string, currentName: string, file: File) => void
  previewFile: (fileId: string, fileName: string) => Promise<Blob | null>
  downloadFile: (fileId: string, fileName: string) => Promise<void>
  copyFiles: (items: VaultItemReference[], destinationFolderId: string | null) => void
  moveItems: (items: VaultItemReference[], destinationFolderId: string | null) => void
  deleteItems: (items: VaultItemReference[]) => void
}

const FileOperationContext = createContext<FileOperationContextValue | null>(null)

function operationId() {
  return crypto.randomUUID()
}

function isCancelled(error: unknown) {
  return error instanceof RequestCancelledError
}

export function FileOperationProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const operations = useFileOperationsStore((state) => state.operations)
  const add = useFileOperationsStore((state) => state.add)
  const update = useFileOperationsStore((state) => state.update)
  const setController = useFileOperationsStore((state) => state.setController)
  const transferRunning = useRef(false)

  useEffect(() => {
    const next = operations.find(
      (operation) =>
        ['upload', 'replace'].includes(operation.kind) && operation.status === 'queued',
    )
    if (!next || transferRunning.current || !next.file) return

    transferRunning.current = true
    const controller = new AbortController()
    setController(next.id, controller)
    update(next.id, { status: 'transferring', cancellable: true, progress: 0 })

    const options = {
      signal: controller.signal,
      onUploadProgress: ({ loaded, total }: { loaded: number; total?: number }) => {
        if (!total) return
        const progress = Math.min(100, Math.round((loaded / total) * 100))
        update(next.id, {
          progress,
          status: progress >= 100 ? 'processing' : 'transferring',
          cancellable: progress < 100,
        })
      },
    }
    const request =
      next.kind === 'replace' && next.targetIds[0]
        ? filesService.replace(next.targetIds[0], { file: next.file }, options)
        : filesService.upload(
            { file: next.file, folderId: next.destinationFolderId ?? null },
            options,
          )

    void request
      .then(async () => {
        update(next.id, {
          status: 'completed',
          progress: 100,
          cancellable: false,
          file: undefined,
        })
        await invalidateVaultReads(queryClient)
      })
      .catch((error: unknown) => {
        if (isCancelled(error) || controller.signal.aborted) {
          update(next.id, { status: 'cancelled', progress: null, cancellable: false })
          return
        }
        update(next.id, {
          status: 'failed',
          progress: null,
          cancellable: false,
          error:
            fileErrorMessage(
              error,
              `We couldn't ${next.kind === 'replace' ? 'replace' : 'upload'} ${next.label}.`,
            ) ?? undefined,
        })
      })
      .finally(() => {
        setController(next.id, undefined)
        transferRunning.current = false
        // Wake the queue after the current transfer settles; controller changes are not selected here.
        update(next.id, {})
      })
  }, [add, operations, queryClient, setController, update])

  const uploadFiles = useCallback(
    (files: File[], destinationFolderId: string | null) => {
      files.forEach((file) =>
        add({
          id: operationId(),
          kind: 'upload',
          label: file.name,
          status: 'queued',
          progress: null,
          cancellable: true,
          targetIds: [],
          file,
          destinationFolderId,
        }),
      )
    },
    [add],
  )

  const replaceFile = useCallback(
    (fileId: string, currentName: string, file: File) => {
      add({
        id: operationId(),
        kind: 'replace',
        label: `Replace ${currentName}`,
        status: 'queued',
        progress: null,
        cancellable: true,
        targetIds: [fileId],
        file,
      })
    },
    [add],
  )

  const transferBlob = useCallback(
    async (kind: 'preview' | 'download', fileId: string, fileName: string) => {
      const id = operationId()
      const controller = new AbortController()
      add({
        id,
        kind,
        label: `${kind === 'preview' ? 'Preview' : 'Download'} ${fileName}`,
        status: 'processing',
        progress: null,
        cancellable: true,
        targetIds: [fileId],
      })
      setController(id, controller)
      try {
        const request = kind === 'preview' ? filesService.preview : filesService.download
        const blob = await request(fileId, {
          signal: controller.signal,
          onDownloadProgress: ({ loaded, total }) => {
            if (!total) return
            update(id, {
              status: 'transferring',
              progress: Math.min(100, Math.round((loaded / total) * 100)),
            })
          },
        })
        update(id, { status: 'completed', progress: 100, cancellable: false })
        return blob
      } catch (error) {
        if (isCancelled(error) || controller.signal.aborted) {
          update(id, { status: 'cancelled', progress: null, cancellable: false })
          return null
        }
        update(id, {
          status: 'failed',
          progress: null,
          cancellable: false,
          error: fileErrorMessage(error, `We couldn't prepare ${fileName}.`) ?? undefined,
        })
        return null
      } finally {
        setController(id, undefined)
      }
    },
    [add, setController, update],
  )

  const previewFile = useCallback(
    (fileId: string, fileName: string) => transferBlob('preview', fileId, fileName),
    [transferBlob],
  )

  const downloadFile = useCallback(
    async (fileId: string, fileName: string) => {
      const blob = await transferBlob('download', fileId, fileName)
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = fileName
      anchor.click()
      URL.revokeObjectURL(url)
    },
    [transferBlob],
  )

  const runServerOperation = useCallback(
    (
      kind: Exclude<FileOperationKind, 'upload' | 'replace' | 'preview' | 'download'>,
      label: string,
      targetIds: string[],
      request: () => Promise<unknown>,
    ) => {
      const id = operationId()
      add({
        id,
        kind,
        label,
        status: 'processing',
        progress: null,
        cancellable: false,
        targetIds,
      })
      void request()
        .then(async () => {
          update(id, { status: 'completed' })
          await invalidateVaultReads(queryClient)
        })
        .catch((error: unknown) =>
          update(id, {
            status: 'failed',
            error:
              fileErrorMessage(error, `We couldn't complete ${label.toLowerCase()}.`) ?? undefined,
          }),
        )
    },
    [add, queryClient, update],
  )

  const copyFiles = useCallback(
    (items: VaultItemReference[], destinationFolderId: string | null) => {
      if (items.some((item) => item.type !== 'file')) return
      runServerOperation(
        'copy',
        items.length === 1 ? `Copy ${items[0].name}` : `Copy ${items.length} files`,
        items.map((item) => item.id),
        () =>
          filesService.copy({
            fileIds: items.map((item) => item.id),
            destinationFolderId,
          }),
      )
    },
    [runServerOperation],
  )

  const runSequential = useCallback(
    (kind: 'move' | 'delete', items: VaultItemReference[], destinationFolderId?: string | null) => {
      const id = operationId()
      const label = `${kind === 'move' ? 'Move' : 'Move to Trash'} ${items.length} item${items.length === 1 ? '' : 's'}`
      add({
        id,
        kind,
        label,
        status: 'processing',
        progress: null,
        cancellable: false,
        completedCount: 0,
        totalCount: items.length,
        targetIds: items.map((item) => item.id),
      })

      void (async () => {
        let completedCount = 0
        try {
          for (const item of items) {
            if (
              useFileOperationsStore.getState().operations.find((op) => op.id === id)?.stopRequested
            ) {
              update(id, {
                status: 'cancelled',
                completedCount,
                error: `${completedCount} of ${items.length} completed before queued work stopped.`,
              })
              await invalidateVaultReads(queryClient)
              return
            }
            if (kind === 'move') {
              if (item.type === 'file') {
                await filesService.move(item.id, {
                  destinationFolderId: destinationFolderId ?? null,
                })
              } else {
                await foldersService.move(item.id, {
                  destinationFolderId: destinationFolderId ?? null,
                })
              }
            } else if (item.type === 'file') {
              await filesService.delete(item.id)
            } else {
              await foldersService.delete(item.id)
            }
            completedCount += 1
            update(id, { completedCount })
          }
          update(id, { status: 'completed', completedCount })
          await invalidateVaultReads(queryClient)
        } catch (error) {
          update(id, {
            status: 'failed',
            completedCount,
            error: `${completedCount} of ${items.length} completed. ${fileErrorMessage(error, 'The remaining queued work was stopped.') ?? ''}`,
          })
          await invalidateVaultReads(queryClient)
        }
      })()
    },
    [add, queryClient, update],
  )

  const value = useMemo<FileOperationContextValue>(
    () => ({
      uploadFiles,
      replaceFile,
      previewFile,
      downloadFile,
      copyFiles,
      moveItems: (items, destinationFolderId) => runSequential('move', items, destinationFolderId),
      deleteItems: (items) => runSequential('delete', items),
    }),
    [copyFiles, downloadFile, previewFile, replaceFile, runSequential, uploadFiles],
  )

  return <FileOperationContext.Provider value={value}>{children}</FileOperationContext.Provider>
}

// The provider and its colocated hook intentionally share one private context.
// eslint-disable-next-line react-refresh/only-export-components
export function useFileOperations() {
  const context = useContext(FileOperationContext)
  if (!context) throw new Error('useFileOperations must be used within FileOperationProvider.')
  return context
}
