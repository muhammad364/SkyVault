import { apiClient } from '@/api/client'
import type { FileResponse } from '@/models/file/FileResponse'

const BASE = '/api/files'

export const filesApi = {
  getUserFiles: (signal?: AbortSignal) =>
    apiClient.get<FileResponse[]>(BASE, { signal }).then((response) => response.data),
}
