import { describe, expect, it } from 'vitest'
import {
  selectNewestShareLinks,
  selectRecentFiles,
  selectRecentlyDeletedItems,
} from '@/features/workspace/lib/workspacePresentation'
import type { FileResponse } from '@/models/file/FileResponse'
import type { RecycleBinItem } from '@/models/recycleBin/RecycleBinItem'
import type { GenerateShareLinkResponse } from '@/models/sharing/GenerateShareLinkResponse'

describe('workspace presentation selectors', () => {
  it('selects no more than four files by DTO updatedAt without mutating API order', () => {
    const files = Array.from({ length: 6 }, (_, index): FileResponse => ({
      fileId: `file-${index}`,
      folderId: 'folder-id',
      fileName: `File ${index}`,
      extension: '.txt',
      mimeType: 'text/plain',
      fileSizeBytes: index + 1,
      uploadedAt: `2026-08-0${index + 1}T00:00:00Z`,
      updatedAt: `2026-08-0${index + 1}T00:00:00Z`,
    }))
    const originalOrder = files.map((file) => file.fileId)

    expect(selectRecentFiles(files).map((file) => file.fileId)).toEqual([
      'file-5',
      'file-4',
      'file-3',
      'file-2',
    ])
    expect(files.map((file) => file.fileId)).toEqual(originalOrder)
  })

  it('selects the two newest share and trash DTOs by their explicit timestamps', () => {
    const links = Array.from({ length: 3 }, (_, index): GenerateShareLinkResponse => ({
      shareLinkId: `link-${index}`,
      fileId: `file-${index}`,
      shareUrl: `https://private.example/${index}`,
      expiresAt: null,
      isRevoked: false,
      createdAt: `2026-08-0${index + 1}T00:00:00Z`,
    }))
    const items = Array.from({ length: 3 }, (_, index): RecycleBinItem => ({
      itemId: `item-${index}`,
      itemType: 'File',
      name: `Item ${index}`,
      originalParentFolderId: null,
      extension: '.txt',
      mimeType: 'text/plain',
      fileSizeBytes: 1,
      deletedAt: `2026-08-0${index + 1}T00:00:00Z`,
      expiresAt: `2026-09-0${index + 1}T00:00:00Z`,
    }))

    expect(selectNewestShareLinks(links).map((link) => link.shareLinkId)).toEqual([
      'link-2',
      'link-1',
    ])
    expect(selectRecentlyDeletedItems(items).map((item) => item.itemId)).toEqual([
      'item-2',
      'item-1',
    ])
  })
})
