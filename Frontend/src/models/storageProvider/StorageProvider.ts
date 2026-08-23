export interface CreateStorageProviderRequest {
  name: string
  providerType: string
}

export interface UpdateStorageProviderRequest {
  name: string
}

export interface StorageProviderResponse {
  providerId: string
  name: string
  providerType: string
  isActive: boolean
  createdAt: string
}
