export interface RecycleBinItem {
  itemId: string
  itemType: string
  name: string
  originalParentFolderId: string | null
  extension: string | null
  mimeType: string | null
  fileSizeBytes: number | null
  deletedAt: string
  expiresAt: string
}
