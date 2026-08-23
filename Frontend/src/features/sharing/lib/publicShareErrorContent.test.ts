import { describe, expect, it } from 'vitest'
import { ApiError } from '@/api/errors'
import { publicShareErrorContent } from '@/features/sharing/lib/publicShareErrorContent'

describe('publicShareErrorContent', () => {
  it('keeps offline, expired, revoked, invalid, file-missing, and link-missing states distinct', () => {
    expect(publicShareErrorContent(new ApiError(503, 'Safe'), false)[0]).toBe("You're offline.")
    expect(
      publicShareErrorContent(
        new ApiError(400, 'Safe', undefined, undefined, 'share_link_expired'),
      )[0],
    ).toBe('This link has expired.')
    expect(
      publicShareErrorContent(
        new ApiError(400, 'Safe', undefined, undefined, 'share_link_revoked'),
      )[0],
    ).toBe('This link was revoked.')
    expect(
      publicShareErrorContent(
        new ApiError(400, 'Safe', undefined, undefined, 'share_link_invalid'),
      )[0],
    ).toBe('This link is invalid.')
    expect(
      publicShareErrorContent(
        new ApiError(404, 'Safe', undefined, undefined, 'shared_file_not_found'),
      )[0],
    ).toBe('This file is unavailable.')
    expect(publicShareErrorContent(new ApiError(404, 'Safe'))[0]).toBe(
      'This share could not be found.',
    )
  })
})
