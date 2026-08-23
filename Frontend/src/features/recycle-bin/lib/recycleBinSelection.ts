import type { RecycleBinItem } from '@/models/recycleBin/RecycleBinItem'

export function collapseRecycleBinSelection(
  selectedItems: RecycleBinItem[],
  allItems: RecycleBinItem[],
) {
  const folders = new Map(
    allItems
      .filter((item) => item.itemType === 'Folder')
      .map((folder) => [folder.itemId, folder] as const),
  )
  const selectedFolderIds = new Set(
    selectedItems.filter((item) => item.itemType === 'Folder').map((item) => item.itemId),
  )

  return selectedItems.filter((item) => {
    let parentId = item.originalParentFolderId
    const visited = new Set<string>()

    while (parentId && !visited.has(parentId)) {
      if (selectedFolderIds.has(parentId)) return false
      visited.add(parentId)
      parentId = folders.get(parentId)?.originalParentFolderId ?? null
    }

    return true
  })
}
