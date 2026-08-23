export interface CreateStorageAccountRequest {
  providerId: string
  accountName: string
  totalCapacityBytes: number
  priority: number
}

export interface UpdateStorageAccountRequest {
  accountName: string
  totalCapacityBytes: number
  priority: number
}

export interface StorageAccountResponse {
  storageAccountId: string
  providerId: string
  providerName: string
  providerType: string
  accountName: string
  totalCapacityBytes: number
  usedCapacityBytes: number
  availableCapacityBytes: number
  priority: number
  isActive: boolean
  createdAt: string
}
