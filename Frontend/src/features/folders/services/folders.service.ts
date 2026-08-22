import { foldersApi } from '@/api/endpoints/folders.api'
import type { CreateFolderRequest } from '@/models/folder/CreateFolderRequest'
import type { MoveFolderRequest } from '@/models/folder/MoveFolderRequest'
import type { RenameFolderRequest } from '@/models/folder/RenameFolderRequest'

export const foldersService = {
  create: (request: CreateFolderRequest, signal?: AbortSignal) =>
    foldersApi.create(request, signal),
  getRoot: (signal?: AbortSignal) => foldersApi.getRoot(signal),
  getContents: (folderId: string, signal?: AbortSignal) => foldersApi.getContents(folderId, signal),
  getContentsFor: (folderId: string | null, signal?: AbortSignal) =>
    folderId ? foldersApi.getContents(folderId, signal) : foldersApi.getRoot(signal),
  getAncestry: async (folderId: string | null, signal?: AbortSignal) => {
    if (!folderId) return []

    const ancestry = []
    const visited = new Set<string>()
    let currentId: string | null = folderId

    while (currentId && !visited.has(currentId)) {
      visited.add(currentId)
      const current = await foldersApi.getContents(currentId, signal)
      ancestry.unshift(current)
      currentId = current.parentFolderId
    }

    return ancestry
  },
  rename: (folderId: string, request: RenameFolderRequest, signal?: AbortSignal) =>
    foldersApi.rename(folderId, request, signal),
  move: (folderId: string, request: MoveFolderRequest, signal?: AbortSignal) =>
    foldersApi.move(folderId, request, signal),
  delete: (folderId: string, signal?: AbortSignal) => foldersApi.delete(folderId, signal),
}
