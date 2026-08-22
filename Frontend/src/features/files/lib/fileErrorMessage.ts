import { ApiError, RequestCancelledError } from '@/api/errors'

const operationMessages = {
  duplicate_name: 'That name is already in use in this folder.',
  empty_file: 'Choose a file that contains something.',
  file_too_large: 'Files must be 100 MB or smaller.',
  insufficient_quota: 'Your vault does not have enough available storage.',
  invalid_destination: 'That destination cannot accept this item.',
  storage_unavailable: 'Storage is temporarily unavailable. Please try again.',
  vault_item_not_found: 'That item is no longer in your vault.',
} as const

export function fileErrorMessage(error: unknown, fallback: string) {
  if (error instanceof RequestCancelledError) return null
  if (error instanceof ApiError && error.code && error.code in operationMessages) {
    return operationMessages[error.code as keyof typeof operationMessages]
  }
  if (error instanceof ApiError) return error.message
  return fallback
}
