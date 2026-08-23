import { describe, expect, it } from 'vitest'
import { collapseRecycleBinSelection } from '@/features/recycle-bin/lib/recycleBinSelection'
import type { RecycleBinItem } from '@/models/recycleBin/RecycleBinItem'

function item(
  itemId: string,
  itemType: 'File' | 'Folder',
  originalParentFolderId: string | null,
): RecycleBinItem {
  return {
    itemId,
    itemType,
    name: itemId,
    originalParentFolderId,
    extension: itemType === 'File' ? '.txt' : null,
    mimeType: itemType === 'File' ? 'text/plain' : null,
    fileSizeBytes: itemType === 'File' ? 4 : null,
    deletedAt: '2026-08-01T00:00:00Z',
    expiresAt: '2026-08-31T00:00:00Z',
  }
}

describe('collapseRecycleBinSelection', () => {
  it('removes selected descendants already covered by a selected folder hierarchy', () => {
    const root = item('root', 'Folder', null)
    const child = item('child', 'Folder', 'root')
    const nestedFile = item('file', 'File', 'child')
    const separateFile = item('separate', 'File', null)
    const all = [root, child, nestedFile, separateFile]

    expect(collapseRecycleBinSelection(all, all)).toEqual([root, separateFile])
  })

  it('keeps a child selected without its deleted ancestor', () => {
    const root = item('root', 'Folder', null)
    const child = item('child', 'Folder', 'root')
    expect(collapseRecycleBinSelection([child], [root, child])).toEqual([child])
  })
})
