import axios from 'axios'
import { ApiConfigurationError } from '@/app/config'
import type { ApiErrorPayload, ApiFieldErrors } from '@/api/types/api.types'

export class RequestCancelledError extends Error {
  constructor() {
    super('The request was cancelled.')
    this.name = 'RequestCancelledError'
  }
}

export type ApiErrorCode =
  | 'account_inactive'
  | 'current_password_incorrect'
  | 'email_already_registered'
  | 'email_not_verified'
  | 'duplicate_name'
  | 'empty_file'
  | 'file_too_large'
  | 'insufficient_quota'
  | 'invalid_destination'
  | 'invalid_credentials'
  | 'invalid_reset_token'
  | 'invalid_verification_token'
  | 'invalid_payment_card'
  | 'payment_card_expired'
  | 'payment_details_invalid'
  | 'plan_allocation_too_small'
  | 'storage_plan_inactive'
  | 'storage_plan_not_found'
  | 'subscription_already_active'
  | 'subscription_required'
  | 'subscription_unavailable'
  | 'storage_unavailable'
  | 'share_link_expired'
  | 'share_link_invalid'
  | 'share_link_revoked'
  | 'shared_file_not_found'
  | 'vault_item_not_found'
  | 'user_not_found'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fieldErrors?: ApiFieldErrors,
    readonly traceId?: string,
    readonly code?: ApiErrorCode,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function apiErrorCode(payload: ApiErrorPayload): ApiErrorCode | undefined {
  const message = payload.message.trim().toLowerCase()
  if (message === 'invalid email or password.') return 'invalid_credentials'
  if (message === 'please verify your email before logging in.') return 'email_not_verified'
  if (message === 'user account is inactive.') return 'account_inactive'
  if (message === 'this email already exists.') return 'email_already_registered'
  if (message === 'invalid or expired verification token.') return 'invalid_verification_token'
  if (message === 'invalid or expired reset token.') return 'invalid_reset_token'
  if (message === 'the current password is incorrect.') return 'current_password_incorrect'
  if (message === 'user not found.' || message === 'user not found') return 'user_not_found'
  if (message === 'storage plan not found.') return 'storage_plan_not_found'
  if (message === 'selected storage plan is inactive.') return 'storage_plan_inactive'
  if (message.includes('already have an active subscription')) return 'subscription_already_active'
  if (
    message.includes('do not provide enough capacity') ||
    message.includes('resulting storage allocation is smaller')
  ) {
    return 'plan_allocation_too_small'
  }
  if (message.includes('must have an active storage plan')) return 'subscription_required'
  if (message.includes('no active subscription or subscription within the grace period')) {
    return 'subscription_unavailable'
  }
  if (
    message === 'the provided card number is invalid.' ||
    message.includes('card number must contain')
  ) {
    return 'invalid_payment_card'
  }
  if (message === 'the card has expired.') return 'payment_card_expired'
  if (message.includes('cvv') || message.includes('card holder name'))
    return 'payment_details_invalid'
  if (message.includes('already exists') || message.includes('duplicate')) return 'duplicate_name'
  if (message.includes('cannot be empty') || message.includes('empty file')) return 'empty_file'
  if (message.includes('100 mb') || message.includes('file size limit')) return 'file_too_large'
  if (message.includes('insufficient storage') || message.includes('storage quota')) {
    return 'insufficient_quota'
  }
  if (
    message.includes('destination') ||
    message.includes('descendant') ||
    message.includes('into itself')
  ) {
    return 'invalid_destination'
  }
  if (
    message.includes('storage provider') ||
    message.includes('cloud storage') ||
    message.includes('physical storage')
  ) {
    return 'storage_unavailable'
  }
  if (message === 'share link has expired.') return 'share_link_expired'
  if (message === 'share link has been revoked.') return 'share_link_revoked'
  if (message === 'share link is invalid.') return 'share_link_invalid'
  if (message === 'shared file not found.') return 'shared_file_not_found'
  if (message.includes('file not found') || message.includes('folder not found')) {
    return 'vault_item_not_found'
  }
  return undefined
}

function isFieldErrors(value: unknown): value is ApiFieldErrors {
  if (typeof value !== 'object' || value === null) return false
  return Object.values(value).every(
    (messages) =>
      Array.isArray(messages) && messages.every((message) => typeof message === 'string'),
  )
}

function readApiErrorPayload(value: unknown): ApiErrorPayload | null {
  if (typeof value !== 'object' || value === null) return null
  const record = value as Record<string, unknown>
  const statusCode = record.statusCode ?? record.StatusCode
  const message = record.message ?? record.Message
  if (typeof statusCode !== 'number' || typeof message !== 'string') return null

  const errors = record.errors ?? record.Errors
  const text = (camelCase: string, pascalCase: string) => {
    const candidate = record[camelCase] ?? record[pascalCase]
    return typeof candidate === 'string' ? candidate : ''
  }

  return {
    statusCode,
    message,
    exceptionType: text('exceptionType', 'ExceptionType'),
    requestId: text('requestId', 'RequestId'),
    traceId: text('traceId', 'TraceId'),
    path: text('path', 'Path'),
    timestampUtc: text('timestampUtc', 'TimestampUtc'),
    errors: isFieldErrors(errors) ? errors : null,
  }
}

function safeMessage(status: number): string {
  if (status === 400) return 'Some details need your attention.'
  if (status === 401) return 'Please sign in to continue.'
  if (status === 403) return "This part of SkyVault isn't yours to open."
  if (status === 404) return "We couldn't find that part of your vault."
  if (status === 408) return 'This is taking longer than expected.'
  if (status === 413) return 'That file is too large for this request.'
  if (status === 429) return 'Your vault needs a moment. Please try again shortly.'
  if (status >= 500) return 'Something went wrong on our side. Your files are safe.'
  return "We couldn't complete that request."
}

export function normalizeApiError(error: unknown): Error {
  if (error instanceof ApiConfigurationError || error instanceof RequestCancelledError) return error

  if (axios.isCancel(error)) return new RequestCancelledError()

  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
      return new RequestCancelledError()
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError(408, safeMessage(408))
    }

    const status = error.response?.status ?? 503
    if (status === 499) return new RequestCancelledError()
    const payload = readApiErrorPayload(error.response?.data)
    const fields = payload?.errors ?? undefined
    const traceId = payload?.traceId || undefined
    const code = payload ? apiErrorCode(payload) : undefined
    return new ApiError(status, safeMessage(status), fields, traceId, code)
  }

  return new ApiError(500, safeMessage(500))
}

export async function normalizeApiErrorWithBlobPayload(error: unknown): Promise<Error> {
  if (
    axios.isAxiosError(error) &&
    error.response?.data instanceof Blob &&
    error.response.data.type.includes('json')
  ) {
    try {
      const blob = error.response.data
      const payloadText =
        typeof blob.text === 'function'
          ? await blob.text()
          : await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(String(reader.result ?? ''))
              reader.onerror = () => reject(reader.error)
              reader.readAsText(blob)
            })
      error.response.data = JSON.parse(payloadText)
    } catch {
      // Fall through to status-only safe normalization.
    }
  }

  return normalizeApiError(error)
}
