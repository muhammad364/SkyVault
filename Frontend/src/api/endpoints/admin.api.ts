import { apiClient } from '@/api/client'
import type { AdminUser } from '@/models/admin/AdminUser'
import type { AuditLog, AuditLogFilters } from '@/models/admin/AuditLog'
import type { StorageOverview } from '@/models/admin/StorageOverview'
import type { SystemStatistics } from '@/models/admin/SystemStatistics'
import type { UserStorageAllocation } from '@/models/admin/UserStorageAllocation'

const BASE = '/api/admin'

export const adminApi = {
  getUsers: (signal?: AbortSignal) =>
    apiClient.get<AdminUser[]>(`${BASE}/users`, { signal }).then((response) => response.data),
  getUser: (userId: string, signal?: AbortSignal) =>
    apiClient
      .get<AdminUser>(`${BASE}/users/${userId}`, { signal })
      .then((response) => response.data),
  activateUser: (userId: string, signal?: AbortSignal) =>
    apiClient
      .put<AdminUser>(`${BASE}/users/${userId}/activate`, undefined, { signal, timeout: 0 })
      .then((response) => response.data),
  deactivateUser: (userId: string, signal?: AbortSignal) =>
    apiClient
      .put<AdminUser>(`${BASE}/users/${userId}/deactivate`, undefined, { signal, timeout: 0 })
      .then((response) => response.data),
  getStorageOverview: (signal?: AbortSignal) =>
    apiClient
      .get<StorageOverview>(`${BASE}/storage/overview`, { signal })
      .then((response) => response.data),
  getUserStorage: (userId: string, signal?: AbortSignal) =>
    apiClient
      .get<UserStorageAllocation>(`${BASE}/users/${userId}/storage`, { signal })
      .then((response) => response.data),
  getStatistics: (signal?: AbortSignal) =>
    apiClient
      .get<SystemStatistics>(`${BASE}/statistics`, { signal })
      .then((response) => response.data),
  getAuditLogs: (filters: AuditLogFilters, signal?: AbortSignal) =>
    apiClient
      .get<AuditLog[]>(`${BASE}/audit-logs`, {
        signal,
        params: {
          administratorId: filters.administratorId ?? undefined,
          action: filters.action ?? undefined,
          performedFrom: filters.performedFrom ?? undefined,
          performedTo: filters.performedTo ?? undefined,
          skip: filters.skip,
          take: filters.take,
        },
      })
      .then((response) => response.data),
  getAuditLog: (auditLogId: string, signal?: AbortSignal) =>
    apiClient
      .get<AuditLog>(`${BASE}/audit-logs/${auditLogId}`, { signal })
      .then((response) => response.data),
}
