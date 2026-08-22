import { apiClient } from '@/api/client'
import type { CreateFolderRequest } from '@/models/folder/CreateFolderRequest'
import type { FolderContentsResponse } from '@/models/folder/FolderContentsResponse'
import type { FolderResponse } from '@/models/folder/FolderResponse'
import type { MoveFolderRequest } from '@/models/folder/MoveFolderRequest'
import type { RenameFolderRequest } from '@/models/folder/RenameFolderRequest'
import type { MessageResponse } from '@/models/common/MessageResponse'

const BASE = '/api/folders'
const NO_AUTOMATIC_TIMEOUT = 0

export const foldersApi = {
  create: (request: CreateFolderRequest, signal?: AbortSignal) =>
    apiClient
      .post<FolderResponse>(BASE, request, { signal, timeout: NO_AUTOMATIC_TIMEOUT })
      .then((response) => response.data),
  getRoot: (signal?: AbortSignal) =>
    apiClient
      .get<FolderContentsResponse>(`${BASE}/root`, { signal })
      .then((response) => response.data),
  getContents: (folderId: string, signal?: AbortSignal) =>
    apiClient
      .get<FolderContentsResponse>(`${BASE}/${folderId}`, { signal })
      .then((response) => response.data),
  rename: (folderId: string, request: RenameFolderRequest, signal?: AbortSignal) =>
    apiClient
      .put<MessageResponse>(`${BASE}/${folderId}`, request, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  move: (folderId: string, request: MoveFolderRequest, signal?: AbortSignal) =>
    apiClient
      .put<MessageResponse>(`${BASE}/${folderId}/move`, request, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  delete: (folderId: string, signal?: AbortSignal) =>
    apiClient
      .delete<MessageResponse>(`${BASE}/${folderId}`, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
}
