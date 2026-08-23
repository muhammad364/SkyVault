import { recycleBinApi } from '@/api/endpoints/recycle-bin.api'

export const recycleBinService = {
  getItems: (signal?: AbortSignal) => recycleBinApi.getItems(signal),
  restoreFile: (fileId: string, signal?: AbortSignal) => recycleBinApi.restoreFile(fileId, signal),
  restoreFolder: (folderId: string, signal?: AbortSignal) =>
    recycleBinApi.restoreFolder(folderId, signal),
  permanentlyDeleteFile: (fileId: string, signal?: AbortSignal) =>
    recycleBinApi.permanentlyDeleteFile(fileId, signal),
  permanentlyDeleteFolder: (folderId: string, signal?: AbortSignal) =>
    recycleBinApi.permanentlyDeleteFolder(folderId, signal),
}
