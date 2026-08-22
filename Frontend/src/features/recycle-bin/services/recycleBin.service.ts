import { recycleBinApi } from '@/api/endpoints/recycle-bin.api'

export const recycleBinService = {
  getItems: (signal?: AbortSignal) => recycleBinApi.getItems(signal),
}
