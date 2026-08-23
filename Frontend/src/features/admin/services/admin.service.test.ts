import { beforeEach, describe, expect, it, vi } from 'vitest'
import { adminApi } from '@/api/endpoints/admin.api'
import { storageAccountsApi } from '@/api/endpoints/storage-accounts.api'
import { adminService } from '@/features/admin/services/admin.service'

vi.mock('@/api/endpoints/admin.api', () => ({
  adminApi: {
    getStatistics: vi.fn(),
    getStorageOverview: vi.fn(),
    getUsers: vi.fn(),
    getUser: vi.fn(),
    getUserStorage: vi.fn(),
    activateUser: vi.fn(),
    deactivateUser: vi.fn(),
    getAuditLogs: vi.fn(),
    getAuditLog: vi.fn(),
  },
}))

vi.mock('@/api/endpoints/storage-accounts.api', () => ({
  storageAccountsApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
  },
}))

describe('admin service', () => {
  beforeEach(() => vi.clearAllMocks())

  it('forwards read signals and returns untouched DTO data', async () => {
    const controller = new AbortController()
    const dto = {
      totalUsers: 8,
      activeUsers: 6,
      totalStoragePlans: 3,
      activeStoragePlans: 2,
      totalSubscriptions: 5,
      activeSubscriptions: 4,
    }
    vi.mocked(adminApi.getStatistics).mockResolvedValue(dto)

    await expect(adminService.getStatistics(controller.signal)).resolves.toBe(dto)
    expect(adminApi.getStatistics).toHaveBeenCalledWith(controller.signal)
  })

  it('forwards the real optional storage-account active filter and signal', async () => {
    const controller = new AbortController()
    const response: never[] = []
    vi.mocked(storageAccountsApi.getAll).mockResolvedValue(response)

    await expect(adminService.getAccounts(false, controller.signal)).resolves.toBe(response)
    expect(storageAccountsApi.getAll).toHaveBeenCalledWith(false, controller.signal)
  })
})
