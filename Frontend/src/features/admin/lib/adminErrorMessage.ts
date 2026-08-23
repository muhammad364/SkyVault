import { ApiError, RequestCancelledError } from '@/api/errors'

export function adminErrorMessage(error: unknown, fallback: string) {
  if (error instanceof RequestCancelledError) return ''
  if (!(error instanceof ApiError)) return fallback
  if (error.code === 'duplicate_name') return 'That name is already in use.'
  if (error.code === 'user_not_found') return 'That user is no longer available.'
  if (error.code === 'storage_unavailable') {
    return 'The storage configuration cannot accept that change.'
  }
  if (error.status === 403) return 'Your administrator session cannot perform this action.'
  if (error.status === 404) return 'That record is no longer available.'
  if (error.status === 409)
    return 'The record changed before this action completed. Refresh and try again.'
  return fallback
}
