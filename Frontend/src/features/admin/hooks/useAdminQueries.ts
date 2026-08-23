import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/features/admin/services/admin.service'
import { queryKeys } from '@/lib/queryKeys'
import type { AuditLogFilters } from '@/models/admin/AuditLog'

export function useAdminStatistics() {
  return useQuery({
    queryKey: queryKeys.admin.statistics(),
    queryFn: ({ signal }) => adminService.getStatistics(signal),
  })
}

export function useAdminStorageOverview() {
  return useQuery({
    queryKey: queryKeys.admin.storageOverview(),
    queryFn: ({ signal }) => adminService.getStorageOverview(signal),
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.admin.users(),
    queryFn: ({ signal }) => adminService.getUsers(signal),
  })
}

export function useAdminUser(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.admin.user(userId ?? 'missing'),
    queryFn: ({ signal }) => adminService.getUser(userId!, signal),
    enabled: Boolean(userId),
  })
}

export function useAdminUserStorage(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.admin.userStorage(userId ?? 'missing'),
    queryFn: ({ signal }) => adminService.getUserStorage(userId!, signal),
    enabled: Boolean(userId),
  })
}

export function useAdminAuditLogs(filters: AuditLogFilters) {
  return useQuery({
    queryKey: queryKeys.admin.auditLogs(filters),
    queryFn: ({ signal }) => adminService.getAuditLogs(filters, signal),
  })
}

export function useAdminAuditLog(auditLogId: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.auditLog(auditLogId ?? 'missing'),
    queryFn: ({ signal }) => adminService.getAuditLog(auditLogId!, signal),
    enabled: Boolean(auditLogId),
  })
}

export function useAdminPlans() {
  return useQuery({
    queryKey: queryKeys.admin.plans(),
    queryFn: ({ signal }) => adminService.getPlans(signal),
  })
}

export function useAdminProviders() {
  return useQuery({
    queryKey: queryKeys.admin.providers(),
    queryFn: ({ signal }) => adminService.getProviders(signal),
  })
}

export function useAdminAccounts(isActive: boolean | null) {
  return useQuery({
    queryKey: queryKeys.admin.accounts(isActive),
    queryFn: ({ signal }) => adminService.getAccounts(isActive, signal),
  })
}

export function useAdminEmailConfigurations() {
  return useQuery({
    queryKey: queryKeys.admin.emailConfigurations(),
    queryFn: ({ signal }) => adminService.getEmailConfigurations(signal),
  })
}

export function useAdminEmailConfiguration(emailConfigurationId: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.emailConfiguration(emailConfigurationId ?? 'missing'),
    queryFn: ({ signal }) => adminService.getEmailConfiguration(emailConfigurationId!, signal),
    enabled: Boolean(emailConfigurationId),
  })
}

export function useAdminSubscriptions() {
  return useQuery({
    queryKey: queryKeys.admin.subscriptions(),
    queryFn: ({ signal }) => adminService.getSubscriptions(signal),
  })
}

export function useAdminSubscription(subscriptionId: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.subscription(subscriptionId ?? 'missing'),
    queryFn: ({ signal }) => adminService.getSubscription(subscriptionId!, signal),
    enabled: Boolean(subscriptionId),
  })
}

export function useAdminUserSubscriptions(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.admin.userSubscriptions(userId ?? 'missing'),
    queryFn: ({ signal }) => adminService.getUserSubscriptions(userId!, signal),
    enabled: Boolean(userId),
  })
}
