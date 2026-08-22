import type { FileSummary } from '@/models/folder/FileSummary'
import type { FolderSummary } from '@/models/folder/FolderSummary'

export interface FolderContentsResponse {
  currentFolderId: string | null
  currentFolderName: string
  parentFolderId: string | null
  subFolders: FolderSummary[]
  files: FileSummary[]
}
