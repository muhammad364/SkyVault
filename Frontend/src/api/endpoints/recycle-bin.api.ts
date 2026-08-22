import { apiClient } from '@/api/client'
import type { RecycleBinItem } from '@/models/recycleBin/RecycleBinItem'

const BASE = '/api/recycle-bin'

export const recycleBinApi = {
  getItems: (signal?: AbortSignal) =>
    apiClient.get<RecycleBinItem[]>(BASE, { signal }).then((response) => response.data),
}
