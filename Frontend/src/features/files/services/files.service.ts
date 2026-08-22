import { filesApi } from '@/api/endpoints/files.api'

export const filesService = {
  getUserFiles: (signal?: AbortSignal) => filesApi.getUserFiles(signal),
}
