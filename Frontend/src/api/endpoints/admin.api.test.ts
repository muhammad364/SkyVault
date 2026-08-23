import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/api/client'
import { adminApi } from '@/api/endpoints/admin.api'
import { emailConfigurationsApi } from '@/api/endpoints/email-configurations.api'
import { storageAccountsApi } from '@/api/endpoints/storage-accounts.api'
import { storagePlansApi } from '@/api/endpoints/storage-plans.api'
import { storageProvidersApi } from '@/api/endpoints/storage-providers.api'
import { subscriptionsApi } from '@/api/endpoints/subscriptions.api'

vi.mock('@/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Phase 10 endpoint contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
    vi.mocked(apiClient.post).mockResolvedValue({ data: {} })
    vi.mocked(apiClient.put).mockResolvedValue({ data: {} })
    vi.mocked(apiClient.patch).mockResolvedValue({ data: {} })
    vi.mocked(apiClient.delete).mockResolvedValue({ data: {} })
  })

  it('uses exact core admin read, user mutation, storage, statistics, and audit routes', async () => {
    const controller = new AbortController()
    const filters = {
      administratorId: 'administrator-id',
      action: 'UserActivated',
      performedFrom: '2026-08-01T00:00:00.000Z',
      performedTo: '2026-08-23T00:00:00.000Z',
      skip: 25,
      take: 25,
    }
    await adminApi.getUsers(controller.signal)
    await adminApi.getUser('user-id', controller.signal)
    await adminApi.activateUser('user-id', controller.signal)
    await adminApi.deactivateUser('user-id', controller.signal)
    await adminApi.getStorageOverview(controller.signal)
    await adminApi.getUserStorage('user-id', controller.signal)
    await adminApi.getStatistics(controller.signal)
    await adminApi.getAuditLogs(filters, controller.signal)
    await adminApi.getAuditLog('audit-id', controller.signal)

    expect(apiClient.get).toHaveBeenCalledWith('/api/admin/users', { signal: controller.signal })
    expect(apiClient.get).toHaveBeenCalledWith('/api/admin/users/user-id', {
      signal: controller.signal,
    })
    expect(apiClient.put).toHaveBeenNthCalledWith(
      1,
      '/api/admin/users/user-id/activate',
      undefined,
      { signal: controller.signal, timeout: 0 },
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      2,
      '/api/admin/users/user-id/deactivate',
      undefined,
      { signal: controller.signal, timeout: 0 },
    )
    expect(apiClient.get).toHaveBeenCalledWith('/api/admin/storage/overview', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenCalledWith('/api/admin/users/user-id/storage', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenCalledWith('/api/admin/statistics', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenCalledWith('/api/admin/audit-logs', {
      signal: controller.signal,
      params: filters,
    })
    expect(apiClient.get).toHaveBeenCalledWith('/api/admin/audit-logs/audit-id', {
      signal: controller.signal,
    })
  })

  it('uses exact storage plan and admin subscription controller actions', async () => {
    const controller = new AbortController()
    const create = {
      name: 'Archive',
      storageSizeGb: 500,
      price: 1200,
      billingCycle: 1,
      isActive: true,
    }
    await storagePlansApi.create(create, controller.signal)
    await storagePlansApi.update('plan-id', create, controller.signal)
    await storagePlansApi.activate('plan-id', controller.signal)
    await storagePlansApi.deactivate('plan-id', controller.signal)
    await subscriptionsApi.getAll(controller.signal)
    await subscriptionsApi.getById('subscription-id', controller.signal)
    await subscriptionsApi.getByUserId('user-id', controller.signal)

    expect(apiClient.post).toHaveBeenCalledWith('/api/storage-plans', create, {
      signal: controller.signal,
      timeout: 0,
    })
    expect(apiClient.put).toHaveBeenCalledWith('/api/storage-plans/plan-id', create, {
      signal: controller.signal,
      timeout: 0,
    })
    expect(apiClient.patch).toHaveBeenCalledWith('/api/storage-plans/plan-id/activate', undefined, {
      signal: controller.signal,
      timeout: 0,
    })
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/api/storage-plans/plan-id/deactivate',
      undefined,
      { signal: controller.signal, timeout: 0 },
    )
    expect(apiClient.get).toHaveBeenCalledWith('/api/subscriptions', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenCalledWith('/api/subscriptions/subscription-id', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenCalledWith('/api/subscriptions/user/user-id', {
      signal: controller.signal,
    })
  })

  it('uses exact provider and storage-account contracts with timeout-free writes', async () => {
    const controller = new AbortController()
    await storageProvidersApi.getAll(controller.signal)
    await storageProvidersApi.getById('provider-id', controller.signal)
    await storageProvidersApi.create({ name: 'Primary', providerType: 'S3' }, controller.signal)
    await storageProvidersApi.update('provider-id', { name: 'Primary 2' }, controller.signal)
    await storageProvidersApi.activate('provider-id', controller.signal)
    await storageProvidersApi.deactivate('provider-id', controller.signal)
    await storageAccountsApi.getAll(false, controller.signal)
    await storageAccountsApi.getById('account-id', controller.signal)
    await storageAccountsApi.create(
      { providerId: 'provider-id', accountName: 'Bucket', totalCapacityBytes: 2048, priority: 1 },
      controller.signal,
    )
    await storageAccountsApi.update(
      'account-id',
      { accountName: 'Bucket 2', totalCapacityBytes: 4096, priority: 2 },
      controller.signal,
    )
    await storageAccountsApi.activate('account-id', controller.signal)
    await storageAccountsApi.deactivate('account-id', controller.signal)

    expect(apiClient.get).toHaveBeenCalledWith('/api/storage-providers', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenCalledWith('/api/storage-providers/provider-id', {
      signal: controller.signal,
    })
    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/storage-providers',
      { name: 'Primary', providerType: 'S3' },
      { signal: controller.signal, timeout: 0 },
    )
    expect(apiClient.put).toHaveBeenCalledWith(
      '/api/storage-providers/provider-id',
      { name: 'Primary 2' },
      { signal: controller.signal, timeout: 0 },
    )
    expect(apiClient.get).toHaveBeenCalledWith('/api/storage-accounts', {
      signal: controller.signal,
      params: { isActive: false },
    })
    expect(apiClient.get).toHaveBeenCalledWith('/api/storage-accounts/account-id', {
      signal: controller.signal,
    })
    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/storage-accounts',
      { providerId: 'provider-id', accountName: 'Bucket', totalCapacityBytes: 2048, priority: 1 },
      { signal: controller.signal, timeout: 0 },
    )
    expect(apiClient.put).toHaveBeenCalledWith(
      '/api/storage-accounts/account-id',
      { accountName: 'Bucket 2', totalCapacityBytes: 4096, priority: 2 },
      { signal: controller.signal, timeout: 0 },
    )
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/api/storage-accounts/account-id/activate',
      undefined,
      { signal: controller.signal, timeout: 0 },
    )
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/api/storage-accounts/account-id/deactivate',
      undefined,
      { signal: controller.signal, timeout: 0 },
    )
  })

  it('keeps SMTP passwords request-only and uses exact configuration routes', async () => {
    const controller = new AbortController()
    const request = {
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      useSsl: true,
      requiresAuthentication: true,
      senderEmail: 'mail@example.com',
      senderDisplayName: null,
      username: 'mailer',
      password: 'secret',
      isActive: true,
    }
    await emailConfigurationsApi.getAll(controller.signal)
    await emailConfigurationsApi.getById('config-id', controller.signal)
    await emailConfigurationsApi.create(request, controller.signal)
    const update = {
      smtpHost: request.smtpHost,
      smtpPort: request.smtpPort,
      useSsl: request.useSsl,
      requiresAuthentication: request.requiresAuthentication,
      senderEmail: request.senderEmail,
      senderDisplayName: request.senderDisplayName,
      username: request.username,
      password: request.password,
    }
    await emailConfigurationsApi.update('config-id', update, controller.signal)
    await emailConfigurationsApi.activate('config-id', controller.signal)
    await emailConfigurationsApi.deactivate('config-id', controller.signal)
    await emailConfigurationsApi.remove('config-id', controller.signal)

    expect(apiClient.get).toHaveBeenCalledWith('/api/admin/email-configurations', {
      signal: controller.signal,
    })
    expect(apiClient.get).toHaveBeenCalledWith('/api/admin/email-configurations/config-id', {
      signal: controller.signal,
    })
    expect(apiClient.post).toHaveBeenCalledWith('/api/admin/email-configurations', request, {
      signal: controller.signal,
      timeout: 0,
    })
    expect(apiClient.put).toHaveBeenCalledWith(
      '/api/admin/email-configurations/config-id',
      update,
      { signal: controller.signal, timeout: 0 },
    )
    expect(apiClient.delete).toHaveBeenCalledWith('/api/admin/email-configurations/config-id', {
      signal: controller.signal,
      timeout: 0,
    })
  })
})
