import { describe, expect, it } from 'vitest'
import { extractShareToken, publicShareUrl } from '@/features/sharing/lib/publicShareUrl'

describe('publicShareUrl', () => {
  it('wraps only the token returned in the controller share URL', () => {
    const apiUrl = 'https://api.skyvault.test/api/share/secure_token-1'
    expect(extractShareToken(apiUrl)).toBe('secure_token-1')
    expect(publicShareUrl(apiUrl, 'https://app.skyvault.test')).toBe(
      'https://app.skyvault.test/share/secure_token-1',
    )
  })

  it('rejects an unrecognized API URL instead of exposing a raw stream URL', () => {
    const value = 'https://api.skyvault.test/unrecognized/value'
    expect(publicShareUrl(value, 'https://app.skyvault.test')).toBeNull()
  })
})
