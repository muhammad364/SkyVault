export interface UserProfileResponse {
  userId: string
  firstName: string
  lastName: string
  email: string
  allocatedStorageBytes: number
  usedStorageBytes: number
  isEmailVerified: boolean
}
