import { apiClient } from '@/api/client'
import type { MessageResponse } from '@/models/common/MessageResponse'
import type { RecycleBinItem } from '@/models/recycleBin/RecycleBinItem'

const BASE = '/api/recycle-bin'
const NO_AUTOMATIC_TIMEOUT = 0

export const recycleBinApi = {
  getItems: (signal?: AbortSignal) =>
    apiClient.get<RecycleBinItem[]>(BASE, { signal }).then((response) => response.data),
  restoreFile: (fileId: string, signal?: AbortSignal) =>
    apiClient
      .post<MessageResponse>(`${BASE}/files/${fileId}/restore`, undefined, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  restoreFolder: (folderId: string, signal?: AbortSignal) =>
    apiClient
      .post<MessageResponse>(`${BASE}/folders/${folderId}/restore`, undefined, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  permanentlyDeleteFile: (fileId: string, signal?: AbortSignal) =>
    apiClient
      .delete<MessageResponse>(`${BASE}/files/${fileId}`, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  permanentlyDeleteFolder: (folderId: string, signal?: AbortSignal) =>
    apiClient
      .delete<MessageResponse>(`${BASE}/folders/${folderId}`, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
}
