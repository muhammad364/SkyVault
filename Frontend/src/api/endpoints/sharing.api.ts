import type { AxiosProgressEvent } from 'axios'
import { apiClient } from '@/api/client'
import type { MessageResponse } from '@/models/common/MessageResponse'
import type { GenerateShareLinkRequest } from '@/models/sharing/GenerateShareLinkRequest'
import type { GenerateShareLinkResponse } from '@/models/sharing/GenerateShareLinkResponse'

const OWNER_BASE = '/api/share-links'
const PUBLIC_BASE = '/api/share'
const NO_AUTOMATIC_TIMEOUT = 0

export interface SharedFileTransferOptions {
  signal?: AbortSignal
  onDownloadProgress?: (event: AxiosProgressEvent) => void
}

export interface SharedFileDownload {
  blob: Blob
  fileName: string | null
}

function contentDispositionFileName(header: unknown) {
  if (typeof header !== 'string') return null
  const encoded = header.match(/filename\*=UTF-8''([^;]+)/i)?.[1]
  if (encoded) {
    try {
      return decodeURIComponent(encoded)
    } catch {
      return encoded
    }
  }
  return header.match(/filename="?([^";]+)"?/i)?.[1] ?? null
}

export const sharingApi = {
  getOwnShareLinks: (signal?: AbortSignal) =>
    apiClient
      .get<GenerateShareLinkResponse[]>(OWNER_BASE, { signal })
      .then((response) => response.data),
  generateShareLink: (request: GenerateShareLinkRequest, signal?: AbortSignal) =>
    apiClient
      .post<GenerateShareLinkResponse>(OWNER_BASE, request, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  revokeShareLink: (shareLinkId: string, signal?: AbortSignal) =>
    apiClient
      .patch<MessageResponse>(`${OWNER_BASE}/${shareLinkId}/revoke`, undefined, {
        signal,
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  previewSharedFile: (shareToken: string, options: SharedFileTransferOptions = {}) =>
    apiClient
      .get<Blob>(`${PUBLIC_BASE}/${encodeURIComponent(shareToken)}`, {
        signal: options.signal,
        onDownloadProgress: options.onDownloadProgress,
        responseType: 'blob',
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then((response) => response.data),
  downloadSharedFile: (shareToken: string, options: SharedFileTransferOptions = {}) =>
    apiClient
      .get<Blob>(`${PUBLIC_BASE}/${encodeURIComponent(shareToken)}/download`, {
        signal: options.signal,
        onDownloadProgress: options.onDownloadProgress,
        responseType: 'blob',
        timeout: NO_AUTOMATIC_TIMEOUT,
      })
      .then<SharedFileDownload>((response) => ({
        blob: response.data,
        fileName: contentDispositionFileName(response.headers['content-disposition']),
      })),
}
