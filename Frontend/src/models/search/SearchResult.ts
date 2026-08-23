export interface SearchResult {
  fileId: string
  fileName: string
  fileExtension: string
  mimeType: string
  fileSizeBytes: number
  folderId: string | null
  folderName: string | null
  uploadedAt: string
  lastModifiedAt: string
}
