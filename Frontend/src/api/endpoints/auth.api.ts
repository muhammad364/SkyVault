import { apiClient } from '@/api/client'
import type { ChangePasswordRequest } from '@/models/auth/ChangePasswordRequest'
import type { ForgotPasswordRequest } from '@/models/auth/ForgotPasswordRequest'
import type { LoginRequest } from '@/models/auth/LoginRequest'
import type { LoginResponse } from '@/models/auth/LoginResponse'
import type { RegisterUserRequest } from '@/models/auth/RegisterUserRequest'
import type { RegisterUserResponse } from '@/models/auth/RegisterUserResponse'
import type { ResendVerificationRequest } from '@/models/auth/ResendVerificationRequest'
import type { ResetPasswordRequest } from '@/models/auth/ResetPasswordRequest'
import type { UpdateUserProfileRequest } from '@/models/auth/UpdateUserProfileRequest'
import type { UserProfileResponse } from '@/models/auth/UserProfileResponse'
import type { VerifyEmailRequest } from '@/models/auth/VerifyEmailRequest'
import type { MessageResponse } from '@/models/common/MessageResponse'

const BASE = '/api/auth'

export const authApi = {
  register: (body: RegisterUserRequest, signal?: AbortSignal) =>
    apiClient
      .post<RegisterUserResponse>(`${BASE}/register`, body, { signal })
      .then((response) => response.data),
  login: (body: LoginRequest, signal?: AbortSignal) =>
    apiClient
      .post<LoginResponse>(`${BASE}/login`, body, { signal })
      .then((response) => response.data),
  verifyEmail: (body: VerifyEmailRequest, signal?: AbortSignal) =>
    apiClient
      .post<MessageResponse>(`${BASE}/verify-email`, body, { signal })
      .then((response) => response.data),
  resendVerification: (body: ResendVerificationRequest, signal?: AbortSignal) =>
    apiClient
      .post<MessageResponse>(`${BASE}/resend-verification`, body, { signal })
      .then((response) => response.data),
  forgotPassword: (body: ForgotPasswordRequest, signal?: AbortSignal) =>
    apiClient
      .post<MessageResponse>(`${BASE}/forgot-password`, body, { signal })
      .then((response) => response.data),
  resetPassword: (body: ResetPasswordRequest, signal?: AbortSignal) =>
    apiClient
      .post<MessageResponse>(`${BASE}/reset-password`, body, { signal })
      .then((response) => response.data),
  getProfile: (signal?: AbortSignal) =>
    apiClient
      .get<UserProfileResponse>(`${BASE}/profile`, { signal })
      .then((response) => response.data),
  updateProfile: (body: UpdateUserProfileRequest, signal?: AbortSignal) =>
    apiClient
      .put<UserProfileResponse>(`${BASE}/profile`, body, { signal })
      .then((response) => response.data),
  changePassword: (body: ChangePasswordRequest, signal?: AbortSignal) =>
    apiClient
      .post<MessageResponse>(`${BASE}/change-password`, body, { signal })
      .then((response) => response.data),
  logout: (signal?: AbortSignal) =>
    apiClient
      .post<MessageResponse>(`${BASE}/logout`, undefined, { signal })
      .then((response) => response.data),
}
