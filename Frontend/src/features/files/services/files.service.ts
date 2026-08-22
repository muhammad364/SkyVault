import { filesApi } from '@/api/endpoints/files.api'
import type { FileTransferOptions } from '@/api/endpoints/files.api'
import type { CopyFileRequest } from '@/models/file/CopyFileRequest'
import type { MoveFileRequest } from '@/models/file/MoveFileRequest'
import type { RenameFileRequest } from '@/models/file/RenameFileRequest'
import type { ReplaceFileRequest } from '@/models/file/ReplaceFileRequest'
import type { UploadFileRequest } from '@/models/file/UploadFileRequest'

export const filesService = {
  getUserFiles: (signal?: AbortSignal) => filesApi.getUserFiles(signal),
  upload: (request: UploadFileRequest, options?: FileTransferOptions) =>
    filesApi.upload(request, options),
  download: (fileId: string, options?: FileTransferOptions) => filesApi.download(fileId, options),
  preview: (fileId: string, options?: FileTransferOptions) => filesApi.preview(fileId, options),
  rename: (fileId: string, request: RenameFileRequest, signal?: AbortSignal) =>
    filesApi.rename(fileId, request, signal),
  move: (fileId: string, request: MoveFileRequest, signal?: AbortSignal) =>
    filesApi.move(fileId, request, signal),
  replace: (fileId: string, request: ReplaceFileRequest, options?: FileTransferOptions) =>
    filesApi.replace(fileId, request, options),
  copy: (request: CopyFileRequest, signal?: AbortSignal) => filesApi.copy(request, signal),
  delete: (fileId: string, signal?: AbortSignal) => filesApi.delete(fileId, signal),
}
