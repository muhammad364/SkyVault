import { describe, expect, it, vi } from 'vitest'
import { filesApi } from '@/api/endpoints/files.api'
import { recycleBinApi } from '@/api/endpoints/recycle-bin.api'
import { sharingApi } from '@/api/endpoints/sharing.api'
import { filesService } from '@/features/files/services/files.service'
import { recycleBinService } from '@/features/recycle-bin/services/recycleBin.service'
import { sharingService } from '@/features/sharing/services/sharing.service'

vi.mock('@/api/endpoints/files.api', () => ({ filesApi: { getUserFiles: vi.fn() } }))
vi.mock('@/api/endpoints/sharing.api', () => ({ sharingApi: { getOwnShareLinks: vi.fn() } }))
vi.mock('@/api/endpoints/recycle-bin.api', () => ({ recycleBinApi: { getItems: vi.fn() } }))

describe('Phase 5 read services', () => {
  it('passes signals and untouched endpoint responses through each feature service', async () => {
    const controller = new AbortController()
    const files = [{ fileId: 'file-id' }]
    const links = [{ shareLinkId: 'link-id' }]
    const trash = [{ itemId: 'item-id' }]
    vi.mocked(filesApi.getUserFiles).mockResolvedValue(files as never)
    vi.mocked(sharingApi.getOwnShareLinks).mockResolvedValue(links as never)
    vi.mocked(recycleBinApi.getItems).mockResolvedValue(trash as never)

    await expect(filesService.getUserFiles(controller.signal)).resolves.toBe(files)
    await expect(sharingService.getOwnShareLinks(controller.signal)).resolves.toBe(links)
    await expect(recycleBinService.getItems(controller.signal)).resolves.toBe(trash)
    expect(filesApi.getUserFiles).toHaveBeenCalledWith(controller.signal)
    expect(sharingApi.getOwnShareLinks).toHaveBeenCalledWith(controller.signal)
    expect(recycleBinApi.getItems).toHaveBeenCalledWith(controller.signal)
  })
})
