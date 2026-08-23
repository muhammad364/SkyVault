export interface CreateStoragePlanRequest {
  name: string
  storageSizeGb: number
  price: number
  billingCycle: number
  isActive: boolean
}

export interface UpdateStoragePlanRequest {
  name: string
  storageSizeGb: number
  price: number
  billingCycle: number
  isActive: boolean
}
