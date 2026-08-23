import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { adminService } from '@/features/admin/services/admin.service'
import { queryKeys } from '@/lib/queryKeys'
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

function useAdminMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  relatedQueryKeys: QueryKey[] = [],
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.all() }),
        ...relatedQueryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
      ]),
  })
}

export function useSetAdminUserActive() {
  return useAdminMutation(({ userId, active }: { userId: string; active: boolean }) =>
    active ? adminService.activateUser(userId) : adminService.deactivateUser(userId),
  )
}

export function useCreateAdminPlan() {
  return useAdminMutation(
    (request: CreateStoragePlanRequest) => adminService.createPlan(request),
    [queryKeys.storagePlans.all()],
  )
}

export function useUpdateAdminPlan() {
  return useAdminMutation(
    ({ storagePlanId, request }: { storagePlanId: string; request: UpdateStoragePlanRequest }) =>
      adminService.updatePlan(storagePlanId, request),
    [queryKeys.storagePlans.all()],
  )
}

export function useSetAdminPlanActive() {
  return useAdminMutation(
    ({ storagePlanId, active }: { storagePlanId: string; active: boolean }) =>
      active
        ? adminService.activatePlan(storagePlanId)
        : adminService.deactivatePlan(storagePlanId),
    [queryKeys.storagePlans.all()],
  )
}

export function useCreateAdminProvider() {
  return useAdminMutation((request: CreateStorageProviderRequest) =>
    adminService.createProvider(request),
  )
}

export function useUpdateAdminProvider() {
  return useAdminMutation(
    ({ providerId, request }: { providerId: string; request: UpdateStorageProviderRequest }) =>
      adminService.updateProvider(providerId, request),
  )
}

export function useSetAdminProviderActive() {
  return useAdminMutation(({ providerId, active }: { providerId: string; active: boolean }) =>
    active
      ? adminService.activateProvider(providerId)
      : adminService.deactivateProvider(providerId),
  )
}

export function useCreateAdminAccount() {
  return useAdminMutation((request: CreateStorageAccountRequest) =>
    adminService.createAccount(request),
  )
}

export function useUpdateAdminAccount() {
  return useAdminMutation(
    ({
      storageAccountId,
      request,
    }: {
      storageAccountId: string
      request: UpdateStorageAccountRequest
    }) => adminService.updateAccount(storageAccountId, request),
  )
}

export function useSetAdminAccountActive() {
  return useAdminMutation(
    ({ storageAccountId, active }: { storageAccountId: string; active: boolean }) =>
      active
        ? adminService.activateAccount(storageAccountId)
        : adminService.deactivateAccount(storageAccountId),
  )
}

export function useCreateEmailConfiguration() {
  return useAdminMutation((request: CreateEmailConfigurationRequest) =>
    adminService.createEmailConfiguration(request),
  )
}

export function useUpdateEmailConfiguration() {
  return useAdminMutation(
    ({
      emailConfigurationId,
      request,
    }: {
      emailConfigurationId: string
      request: UpdateEmailConfigurationRequest
    }) => adminService.updateEmailConfiguration(emailConfigurationId, request),
  )
}

export function useSetEmailConfigurationActive() {
  return useAdminMutation(
    ({ emailConfigurationId, active }: { emailConfigurationId: string; active: boolean }) =>
      active
        ? adminService.activateEmailConfiguration(emailConfigurationId)
        : adminService.deactivateEmailConfiguration(emailConfigurationId),
  )
}

export function useDeleteEmailConfiguration() {
  return useAdminMutation((emailConfigurationId: string) =>
    adminService.deleteEmailConfiguration(emailConfigurationId),
  )
}
