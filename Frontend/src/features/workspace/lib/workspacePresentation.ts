import type { FileResponse } from '@/models/file/FileResponse'
import type { RecycleBinItem } from '@/models/recycleBin/RecycleBinItem'
import type { GenerateShareLinkResponse } from '@/models/sharing/GenerateShareLinkResponse'

export const RECENT_FILE_LIMIT = 4
export const SUMMARY_ITEM_LIMIT = 2

function timestamp(value: string): number {
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function selectRecentFiles(files: FileResponse[]): FileResponse[] {
  return [...files]
    .sort((left, right) => timestamp(right.updatedAt) - timestamp(left.updatedAt))
    .slice(0, RECENT_FILE_LIMIT)
}

export function selectNewestShareLinks(
  links: GenerateShareLinkResponse[],
): GenerateShareLinkResponse[] {
  return [...links]
    .sort((left, right) => timestamp(right.createdAt) - timestamp(left.createdAt))
    .slice(0, SUMMARY_ITEM_LIMIT)
}

export function selectRecentlyDeletedItems(items: RecycleBinItem[]): RecycleBinItem[] {
  return [...items]
    .sort((left, right) => timestamp(right.deletedAt) - timestamp(left.deletedAt))
    .slice(0, SUMMARY_ITEM_LIMIT)
}
