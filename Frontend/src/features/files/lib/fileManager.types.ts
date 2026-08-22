export interface FileManagerItem {
  id: string
  type: 'file' | 'folder'
  name: string
  extension?: string
  fileSizeBytes?: number
  updatedAt: string
}

export type FileManagerDialogState =
  | { type: 'create' }
  | { type: 'rename'; item: FileManagerItem }
  | { type: 'move'; items: FileManagerItem[] }
  | { type: 'copy'; items: FileManagerItem[] }
  | { type: 'delete'; items: FileManagerItem[] }
  | { type: 'replace'; item: FileManagerItem }
  | null
