import axios from 'axios'
import { ApiConfigurationError } from '@/app/config'
import type { ApiErrorPayload, ApiFieldErrors } from '@/api/types/api.types'

export class RequestCancelledError extends Error {
  constructor() {
    super('The request was cancelled.')
    this.name = 'RequestCancelledError'
  }
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fieldErrors?: ApiFieldErrors,
    readonly traceId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return typeof value === 'object' && value !== null && 'statusCode' in value && 'message' in value
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
    const payload = error.response?.data
    const fields = isApiErrorPayload(payload) ? payload.errors ?? undefined : undefined
    const traceId = isApiErrorPayload(payload) ? payload.traceId || undefined : undefined
    return new ApiError(status, safeMessage(status), fields, traceId)
  }

  return new ApiError(500, safeMessage(500))
}
