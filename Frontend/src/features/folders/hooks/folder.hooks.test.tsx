import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFolderAncestry, useFolderContents } from '@/features/folders/hooks/useFolderContents'
import { foldersService } from '@/features/folders/services/folders.service'
import { useCreateFolder, useRenameFolder } from '@/features/files/hooks/useVaultMutations'
import { queryKeys } from '@/lib/queryKeys'
import type { FolderContentsResponse } from '@/models/folder/FolderContentsResponse'

vi.mock('@/features/folders/services/folders.service', () => ({
  foldersService: {
    getContentsFor: vi.fn(),
    getAncestry: vi.fn(),
    create: vi.fn(),
    rename: vi.fn(),
  },
}))

const contents: FolderContentsResponse = {
  currentFolderId: 'folder-id',
  currentFolderName: 'Design',
  parentFolderId: null,
  subFolders: [],
  files: [],
}

describe('folder query and mutation hooks', () => {
  let queryClient: QueryClient
  let wrapper: ({ children }: PropsWithChildren) => JSX.Element

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    vi.clearAllMocks()
    vi.mocked(foldersService.getContentsFor).mockResolvedValue(contents)
    vi.mocked(foldersService.getAncestry).mockResolvedValue([contents])
  })
  afterEach(() => queryClient.clear())

  it('uses exact folder keys and forwards React Query cancellation signals unchanged', async () => {
    const current = renderHook(() => useFolderContents('folder-id'), { wrapper })
    const ancestry = renderHook(() => useFolderAncestry('folder-id'), { wrapper })
    await waitFor(() => {
      expect(current.result.current.isSuccess).toBe(true)
      expect(ancestry.result.current.isSuccess).toBe(true)
    })

    expect(foldersService.getContentsFor).toHaveBeenCalledWith('folder-id', expect.any(AbortSignal))
    expect(foldersService.getAncestry).toHaveBeenCalledWith('folder-id', expect.any(AbortSignal))
    expect(queryClient.getQueryData(queryKeys.folders.contents('folder-id'))).toEqual(contents)
    expect(queryClient.getQueryData(queryKeys.folders.ancestry('folder-id'))).toEqual([contents])
  })

  it('invalidates home/file reads after create and rolls an optimistic rename back on failure', async () => {
    vi.mocked(foldersService.create).mockResolvedValue({
      folderId: 'new-folder',
      name: 'New',
      parentFolderId: null,
      createdAt: '2026-08-23T00:00:00Z',
      updatedAt: '2026-08-23T00:00:00Z',
    })
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const create = renderHook(() => useCreateFolder(), { wrapper })
    await act(() => create.result.current.mutateAsync({ name: 'New', parentFolderId: null }))
    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.folders.all() })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.files.all() })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.storageQuota.current() })

    queryClient.setQueryData(queryKeys.folders.contents('folder-id'), contents)
    vi.mocked(foldersService.rename).mockRejectedValue(new Error('conflict'))
    const rename = renderHook(() => useRenameFolder(), { wrapper })
    await act(async () => {
      await expect(
        rename.result.current.mutateAsync({ folderId: 'folder-id', name: 'Changed' }),
      ).rejects.toThrow('conflict')
    })
    expect(
      queryClient.getQueryData<FolderContentsResponse>(queryKeys.folders.contents('folder-id'))
        ?.currentFolderName,
    ).toBe('Design')
  })
})
