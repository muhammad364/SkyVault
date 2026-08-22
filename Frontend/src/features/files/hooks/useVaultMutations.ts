import { useMutation, useQueryClient } from '@tanstack/react-query'
import { foldersService } from '@/features/folders/services/folders.service'
import { filesService } from '@/features/files/services/files.service'
import { invalidateVaultReads } from '@/features/files/hooks/vaultInvalidation'
import { queryKeys } from '@/lib/queryKeys'
import type { FolderContentsResponse } from '@/models/folder/FolderContentsResponse'
import type { CreateFolderRequest } from '@/models/folder/CreateFolderRequest'
import type { CopyFileRequest } from '@/models/file/CopyFileRequest'
import type { FileResponse } from '@/models/file/FileResponse'

type FolderSnapshot = Array<[readonly unknown[], FolderContentsResponse | undefined]>

export function useCreateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateFolderRequest) => foldersService.create(request),
    onSuccess: () => invalidateVaultReads(queryClient),
  })
}

export function useRenameFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) =>
      foldersService.rename(folderId, { name }),
    onMutate: async ({ folderId, name }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.folders.all() })
      const snapshots = queryClient.getQueriesData<FolderContentsResponse>({
        queryKey: queryKeys.folders.all(),
      }) as FolderSnapshot
      snapshots.forEach(([key, contents]) => {
        if (!contents) return
        queryClient.setQueryData<FolderContentsResponse>(key, {
          ...contents,
          currentFolderName:
            contents.currentFolderId === folderId ? name : contents.currentFolderName,
          subFolders: contents.subFolders.map((folder) =>
            folder.folderId === folderId ? { ...folder, name } : folder,
          ),
        })
      })
      return { snapshots }
    },
    onError: (_error, _variables, context) =>
      context?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value)),
    onSettled: () => invalidateVaultReads(queryClient),
  })
}

export function useRenameFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ fileId, fileName }: { fileId: string; fileName: string }) =>
      filesService.rename(fileId, { fileName }),
    onMutate: async ({ fileId, fileName }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.folders.all() }),
        queryClient.cancelQueries({ queryKey: queryKeys.files.all() }),
      ])
      const folderSnapshots = queryClient.getQueriesData<FolderContentsResponse>({
        queryKey: queryKeys.folders.all(),
      }) as FolderSnapshot
      const allFiles = queryClient.getQueryData<FileResponse[]>(queryKeys.files.all())

      folderSnapshots.forEach(([key, contents]) => {
        if (!contents) return
        queryClient.setQueryData<FolderContentsResponse>(key, {
          ...contents,
          files: contents.files.map((file) =>
            file.fileId === fileId ? { ...file, fileName } : file,
          ),
        })
      })
      queryClient.setQueryData<FileResponse[]>(queryKeys.files.all(), (current) =>
        current?.map((file) => (file.fileId === fileId ? { ...file, fileName } : file)),
      )
      return { folderSnapshots, allFiles }
    },
    onError: (_error, _variables, context) => {
      context?.folderSnapshots.forEach(([key, value]) => queryClient.setQueryData(key, value))
      queryClient.setQueryData(queryKeys.files.all(), context?.allFiles)
    },
    onSettled: () => invalidateVaultReads(queryClient),
  })
}

export function useCopyFiles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CopyFileRequest) => filesService.copy(request),
    onSuccess: () => invalidateVaultReads(queryClient),
  })
}

export function useMoveFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      fileId,
      destinationFolderId,
    }: {
      fileId: string
      destinationFolderId: string | null
    }) => filesService.move(fileId, { destinationFolderId }),
    onSuccess: () => invalidateVaultReads(queryClient),
  })
}

export function useMoveFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      folderId,
      destinationFolderId,
    }: {
      folderId: string
      destinationFolderId: string | null
    }) => foldersService.move(folderId, { destinationFolderId }),
    onSuccess: () => invalidateVaultReads(queryClient),
  })
}

export function useDeleteFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (fileId: string) => filesService.delete(fileId),
    onSuccess: () => invalidateVaultReads(queryClient),
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (folderId: string) => foldersService.delete(folderId),
    onSuccess: () => invalidateVaultReads(queryClient),
  })
}
