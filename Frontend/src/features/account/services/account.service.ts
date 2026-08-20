import { authApi } from '@/api/endpoints/auth.api'
import type { ChangePasswordRequest } from '@/models/auth/ChangePasswordRequest'
import type { UpdateUserProfileRequest } from '@/models/auth/UpdateUserProfileRequest'

export const accountService = {
  getProfile: (signal?: AbortSignal) => authApi.getProfile(signal),
  updateProfile: (request: UpdateUserProfileRequest, signal?: AbortSignal) =>
    authApi.updateProfile(request, signal),
  changePassword: (request: ChangePasswordRequest, signal?: AbortSignal) =>
    authApi.changePassword(request, signal),
  logout: (signal?: AbortSignal) => authApi.logout(signal),
}
