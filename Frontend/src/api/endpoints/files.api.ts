import type { AxiosProgressEvent } from 'axios'
import { apiClient } from '@/api/client'
import type { MessageResponse } from '@/models/common/MessageResponse'
import type { CopyFileRequest } from '@/models/file/CopyFileRequest'
import type { FileResponse } from '@/models/file/FileResponse'
import type { MoveFileRequest } from '@/models/file/MoveFileRequest'
import type { RenameFileRequest } from '@/models/file/RenameFileRequest'
import type { ReplaceFileRequest } from '@/models/file/ReplaceFileRequest'
import type { UploadFileRequest } from '@/models/file/UploadFileRequest'

const BASE = '/api/files'
const NO_AUTOMATIC_TIMEOUT = 0

export interface FileTransferOptions {
  signal?: AbortSignal
  onUploadProgress?: (event: AxiosProgressEvent) => void
  onDownloadProgress?: (event: AxiosProgressEvent) => void
}

function fileFormData(file: File, folderId?: string | null) {
  const data = new FormData()
  data.append('file', file)
  if (folderId) data.append('folderId', folderId)
  return data
}

export const filesApi = {
  getUserFiles: (signal?: AbortSignal) =>
    apiClient.get<FileResponse[]>(BASE, { signal }).then((response) => response.data),
  upload: (request: UploadFileRequest, options: FileTransferOptions = {}) =>
    apiClient
      .post<FileResponse>(BASE, fileFormData(request.file, request.folderId), {
        signal: options.signal,
        onUploadProgress: options.onUploadProgress,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  download: (fileId: string, options: FileTransferOptions = {}) =>
    apiClient
      .get<Blob>(`${BASE}/${fileId}/download`, {
        signal: options.signal,
        onDownloadProgress: options.onDownloadProgress,
        responseType: 'blob',
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  preview: (fileId: string, options: FileTransferOptions = {}) =>
    apiClient
      .get<Blob>(`${BASE}/${fileId}/preview`, {
        signal: options.signal,
        onDownloadProgress: options.onDownloadProgress,
        responseType: 'blob',
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  rename: (fileId: string, request: RenameFileRequest, signal?: AbortSignal) =>
    apiClient
      .put<MessageResponse>(`${BASE}/${fileId}/rename`, request, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  move: (fileId: string, request: MoveFileRequest, signal?: AbortSignal) =>
    apiClient
      .put<MessageResponse>(`${BASE}/${fileId}/move`, request, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  replace: (fileId: string, request: ReplaceFileRequest, options: FileTransferOptions = {}) =>
    apiClient
      .put<MessageResponse>(`${BASE}/${fileId}/replace`, fileFormData(request.file), {
        signal: options.signal,
        onUploadProgress: options.onUploadProgress,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  copy: (request: CopyFileRequest, signal?: AbortSignal) =>
    apiClient
      .post<FileResponse[]>(`${BASE}/copy`, request, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  delete: (fileId: string, signal?: AbortSignal) =>
    apiClient
      .delete<MessageResponse>(`${BASE}/${fileId}`, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
}
