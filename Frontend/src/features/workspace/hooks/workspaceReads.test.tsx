import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useUserFiles } from '@/features/files/hooks/useUserFiles'
import { filesService } from '@/features/files/services/files.service'
import { useRecycleBinItems } from '@/features/recycle-bin/hooks/useRecycleBinItems'
import { recycleBinService } from '@/features/recycle-bin/services/recycleBin.service'
import { useOwnShareLinks } from '@/features/sharing/hooks/useOwnShareLinks'
import { sharingService } from '@/features/sharing/services/sharing.service'
import { queryKeys } from '@/lib/queryKeys'

vi.mock('@/features/files/services/files.service', () => ({
  filesService: { getUserFiles: vi.fn() },
}))
vi.mock('@/features/sharing/services/sharing.service', () => ({
  sharingService: { getOwnShareLinks: vi.fn() },
}))
vi.mock('@/features/recycle-bin/services/recycleBin.service', () => ({
  recycleBinService: { getItems: vi.fn() },
}))

describe('Phase 5 read hooks', () => {
  let queryClient: QueryClient
  let wrapper: ({ children }: PropsWithChildren) => JSX.Element

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    vi.clearAllMocks()
    vi.mocked(filesService.getUserFiles).mockResolvedValue([])
    vi.mocked(sharingService.getOwnShareLinks).mockResolvedValue([])
    vi.mocked(recycleBinService.getItems).mockResolvedValue([])
  })

  afterEach(() => queryClient.clear())

  it('uses controller-specific query keys and forwards React Query signals', async () => {
    const files = renderHook(() => useUserFiles(), { wrapper })
    const links = renderHook(() => useOwnShareLinks(), { wrapper })
    const trash = renderHook(() => useRecycleBinItems(), { wrapper })

    await waitFor(() => {
      expect(files.result.current.isSuccess).toBe(true)
      expect(links.result.current.isSuccess).toBe(true)
      expect(trash.result.current.isSuccess).toBe(true)
    })

    expect(filesService.getUserFiles).toHaveBeenCalledWith(expect.any(AbortSignal))
    expect(sharingService.getOwnShareLinks).toHaveBeenCalledWith(expect.any(AbortSignal))
    expect(recycleBinService.getItems).toHaveBeenCalledWith(expect.any(AbortSignal))
    expect(queryClient.getQueryData(queryKeys.files.all())).toEqual([])
    expect(queryClient.getQueryData(queryKeys.sharing.own())).toEqual([])
    expect(queryClient.getQueryData(queryKeys.recycleBin.items())).toEqual([])
  })

  it('aborts an in-flight summary read when its consumer unmounts', async () => {
    let receivedSignal: AbortSignal | undefined
    vi.mocked(filesService.getUserFiles).mockImplementation((signal) => {
      receivedSignal = signal
      return new Promise(() => undefined)
    })

    const files = renderHook(() => useUserFiles(), { wrapper })
    await waitFor(() => expect(filesService.getUserFiles).toHaveBeenCalledOnce())
    files.unmount()

    expect(receivedSignal?.aborted).toBe(true)
  })
})
