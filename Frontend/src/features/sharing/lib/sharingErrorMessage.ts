import { ApiError, RequestCancelledError } from '@/api/errors'

export function sharingErrorMessage(error: unknown, fallback: string) {
  if (error instanceof RequestCancelledError) return null
  if (!(error instanceof ApiError)) return fallback
  if (error.code === 'vault_item_not_found') return 'That file is no longer available to share.'
  if (error.code === 'share_link_expired') return 'This share link has expired.'
  if (error.code === 'share_link_revoked') return 'This share link was revoked.'
  if (error.code === 'share_link_invalid') return 'This share link is invalid.'
  if (error.code === 'shared_file_not_found') return 'The shared file is no longer available.'
  if (error.status === 408) return 'This is taking longer than expected. Please try again.'
  return fallback
}
