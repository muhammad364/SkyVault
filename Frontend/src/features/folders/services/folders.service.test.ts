import { describe, expect, it, vi } from 'vitest'
import { foldersApi } from '@/api/endpoints/folders.api'
import { foldersService } from '@/features/folders/services/folders.service'

vi.mock('@/api/endpoints/folders.api')

describe('foldersService ancestry', () => {
  it('walks parent responses with one unchanged AbortSignal and returns root-to-current order', async () => {
    const signal = new AbortController().signal
    vi.mocked(foldersApi.getContents)
      .mockResolvedValueOnce({
        currentFolderId: 'child',
        currentFolderName: 'Child',
        parentFolderId: 'parent',
        subFolders: [],
        files: [],
      })
      .mockResolvedValueOnce({
        currentFolderId: 'parent',
        currentFolderName: 'Parent',
        parentFolderId: null,
        subFolders: [],
        files: [],
      })

    const result = await foldersService.getAncestry('child', signal)

    expect(result.map((folder) => folder.currentFolderName)).toEqual(['Parent', 'Child'])
    expect(foldersApi.getContents).toHaveBeenNthCalledWith(1, 'child', signal)
    expect(foldersApi.getContents).toHaveBeenNthCalledWith(2, 'parent', signal)
  })
})
