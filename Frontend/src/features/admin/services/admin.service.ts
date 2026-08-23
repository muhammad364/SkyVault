import { adminApi } from '@/api/endpoints/admin.api'
import { emailConfigurationsApi } from '@/api/endpoints/email-configurations.api'
import { storageAccountsApi } from '@/api/endpoints/storage-accounts.api'
import { storagePlansApi } from '@/api/endpoints/storage-plans.api'
import { storageProvidersApi } from '@/api/endpoints/storage-providers.api'
import { subscriptionsApi } from '@/api/endpoints/subscriptions.api'
import type { AuditLogFilters } from '@/models/admin/AuditLog'
import type {
  CreateEmailConfigurationRequest,
  UpdateEmailConfigurationRequest,
} from '@/models/emailConfiguration/EmailConfiguration'
import type {
  CreateStorageAccountRequest,
  UpdateStorageAccountRequest,
} from '@/models/storageAccount/StorageAccount'
import type {
  CreateStoragePlanRequest,
  UpdateStoragePlanRequest,
} from '@/models/storagePlan/StoragePlanRequests'
import type {
  CreateStorageProviderRequest,
  UpdateStorageProviderRequest,
} from '@/models/storageProvider/StorageProvider'

export const adminService = {
  getStatistics: (signal?: AbortSignal) => adminApi.getStatistics(signal),
  getStorageOverview: (signal?: AbortSignal) => adminApi.getStorageOverview(signal),
  getUsers: (signal?: AbortSignal) => adminApi.getUsers(signal),
  getUser: (userId: string, signal?: AbortSignal) => adminApi.getUser(userId, signal),
  getUserStorage: (userId: string, signal?: AbortSignal) => adminApi.getUserStorage(userId, signal),
  activateUser: (userId: string) => adminApi.activateUser(userId),
  deactivateUser: (userId: string) => adminApi.deactivateUser(userId),
  getAuditLogs: (filters: AuditLogFilters, signal?: AbortSignal) =>
    adminApi.getAuditLogs(filters, signal),
  getAuditLog: (auditLogId: string, signal?: AbortSignal) =>
    adminApi.getAuditLog(auditLogId, signal),
  getPlans: (signal?: AbortSignal) => storagePlansApi.getAllPlansForAdmin(signal),
  createPlan: (request: CreateStoragePlanRequest) => storagePlansApi.create(request),
  updatePlan: (storagePlanId: string, request: UpdateStoragePlanRequest) =>
    storagePlansApi.update(storagePlanId, request),
  activatePlan: (storagePlanId: string) => storagePlansApi.activate(storagePlanId),
  deactivatePlan: (storagePlanId: string) => storagePlansApi.deactivate(storagePlanId),
  getProviders: (signal?: AbortSignal) => storageProvidersApi.getAll(signal),
  createProvider: (request: CreateStorageProviderRequest) => storageProvidersApi.create(request),
  updateProvider: (providerId: string, request: UpdateStorageProviderRequest) =>
    storageProvidersApi.update(providerId, request),
  activateProvider: (providerId: string) => storageProvidersApi.activate(providerId),
  deactivateProvider: (providerId: string) => storageProvidersApi.deactivate(providerId),
  getAccounts: (isActive: boolean | null, signal?: AbortSignal) =>
    storageAccountsApi.getAll(isActive, signal),
  createAccount: (request: CreateStorageAccountRequest) => storageAccountsApi.create(request),
  updateAccount: (storageAccountId: string, request: UpdateStorageAccountRequest) =>
    storageAccountsApi.update(storageAccountId, request),
  activateAccount: (storageAccountId: string) => storageAccountsApi.activate(storageAccountId),
  deactivateAccount: (storageAccountId: string) => storageAccountsApi.deactivate(storageAccountId),
  getEmailConfigurations: (signal?: AbortSignal) => emailConfigurationsApi.getAll(signal),
  getEmailConfiguration: (emailConfigurationId: string, signal?: AbortSignal) =>
    emailConfigurationsApi.getById(emailConfigurationId, signal),
  createEmailConfiguration: (request: CreateEmailConfigurationRequest) =>
    emailConfigurationsApi.create(request),
  updateEmailConfiguration: (
    emailConfigurationId: string,
    request: UpdateEmailConfigurationRequest,
  ) => emailConfigurationsApi.update(emailConfigurationId, request),
  activateEmailConfiguration: (emailConfigurationId: string) =>
    emailConfigurationsApi.activate(emailConfigurationId),
  deactivateEmailConfiguration: (emailConfigurationId: string) =>
    emailConfigurationsApi.deactivate(emailConfigurationId),
  deleteEmailConfiguration: (emailConfigurationId: string) =>
    emailConfigurationsApi.remove(emailConfigurationId),
  getSubscriptions: (signal?: AbortSignal) => subscriptionsApi.getAll(signal),
  getSubscription: (subscriptionId: string, signal?: AbortSignal) =>
    subscriptionsApi.getById(subscriptionId, signal),
  getUserSubscriptions: (userId: string, signal?: AbortSignal) =>
    subscriptionsApi.getByUserId(userId, signal),
}
