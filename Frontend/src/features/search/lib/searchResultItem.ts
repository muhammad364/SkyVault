import type { FileManagerItem } from '@/features/files/lib/fileManager.types'
import type { SearchResult } from '@/models/search/SearchResult'

export function searchResultItem(result: SearchResult): FileManagerItem {
  return {
    id: result.fileId,
    type: 'file',
    name: result.fileName,
    extension: result.fileExtension,
    fileSizeBytes: result.fileSizeBytes,
    updatedAt: result.lastModifiedAt,
  }
}
