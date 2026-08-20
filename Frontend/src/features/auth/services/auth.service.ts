import { authApi } from '@/api/endpoints/auth.api'
import type { ForgotPasswordRequest } from '@/models/auth/ForgotPasswordRequest'
import type { LoginRequest } from '@/models/auth/LoginRequest'
import type { RegisterUserRequest } from '@/models/auth/RegisterUserRequest'
import type { ResendVerificationRequest } from '@/models/auth/ResendVerificationRequest'
import type { ResetPasswordRequest } from '@/models/auth/ResetPasswordRequest'
import type { VerifyEmailRequest } from '@/models/auth/VerifyEmailRequest'

export const authService = {
  register: (request: RegisterUserRequest, signal?: AbortSignal) => authApi.register(request, signal),
  login: (request: LoginRequest, signal?: AbortSignal) => authApi.login(request, signal),
  verifyEmail: (request: VerifyEmailRequest, signal?: AbortSignal) => authApi.verifyEmail(request, signal),
  resendVerification: (request: ResendVerificationRequest, signal?: AbortSignal) =>
    authApi.resendVerification(request, signal),
  forgotPassword: (request: ForgotPasswordRequest, signal?: AbortSignal) =>
    authApi.forgotPassword(request, signal),
  resetPassword: (request: ResetPasswordRequest, signal?: AbortSignal) => authApi.resetPassword(request, signal),
}
