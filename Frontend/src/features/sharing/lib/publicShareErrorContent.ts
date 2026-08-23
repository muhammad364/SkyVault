import { ApiError } from '@/api/errors'

export function publicShareErrorContent(
  error: unknown,
  online = typeof navigator === 'undefined' || navigator.onLine,
) {
  if (!online) {
    return ["You're offline.", 'Reconnect to prepare this shared file, then try again.'] as const
  }
  if (error instanceof ApiError) {
    if (error.code === 'share_link_expired')
      return [
        'This link has expired.',
        'Ask the file owner to create a new view-only link.',
      ] as const
    if (error.code === 'share_link_revoked')
      return [
        'This link was revoked.',
        'The file owner has withdrawn access to this shared file.',
      ] as const
    if (error.code === 'share_link_invalid')
      return [
        'This link is invalid.',
        'Check that the complete share link was copied correctly.',
      ] as const
    if (error.code === 'shared_file_not_found')
      return [
        'This file is unavailable.',
        'The shared file may have been moved to Trash or removed.',
      ] as const
    if (error.status === 404)
      return [
        'This share could not be found.',
        'Check the link or ask the file owner for a new one.',
      ] as const
  }
  return ["We couldn't open this shared file.", 'Try again when your connection is ready.'] as const
}
