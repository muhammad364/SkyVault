import { sharingApi } from '@/api/endpoints/sharing.api'

export const sharingService = {
  getOwnShareLinks: (signal?: AbortSignal) => sharingApi.getOwnShareLinks(signal),
}
