export interface StorageQuotaResponse {
  allocatedStorageBytes: number
  usedStorageBytes: number
  availableStorageBytes: number
  usagePercentage: number
  hasActiveSubscription: boolean
  canPerformStorageWriteOperations: boolean
  isOverQuota: boolean
}
