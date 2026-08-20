import { ApiError } from '@/api/errors'

export function authErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) return fallback
  if (error.code === 'invalid_credentials') return 'That email and password combination did not match.'
  if (error.code === 'email_not_verified') return 'Verify your email before signing in.'
  if (error.code === 'account_inactive') return 'This account is not available right now.'
  if (error.code === 'email_already_registered') return 'An account already uses this email address.'
  if (error.code === 'invalid_verification_token') return 'This verification link is invalid or has expired.'
  if (error.code === 'invalid_reset_token') return 'This password reset link is invalid or has expired.'
  if (error.code === 'current_password_incorrect') return 'Your current password is incorrect.'
  if (error.code === 'user_not_found') return 'We could not find that account.'
  return fallback
}
