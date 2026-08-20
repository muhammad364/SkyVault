import { describe, expect, it } from 'vitest'
import { createAuthSession, isSessionActive } from '@/features/auth/lib/session'

function token(payload: Record<string, string>) {
  return `header.${btoa(JSON.stringify(payload))}.signature`
}

describe('authentication session', () => {
  it('decodes only a supported role claim and preserves access-token expiry', () => {
    const expiresAt = new Date(Date.now() + 60_000).toISOString()
    const session = createAuthSession({
      token: token({ role: 'Admin', email: 'private@example.com', name: 'Private Name' }),
      expiresAt,
    })

    expect(session).toEqual({ accessToken: expect.any(String), expiresAt, role: 'admin' })
    expect(session).not.toHaveProperty('email')
    expect(isSessionActive(session)).toBe(true)
  })

  it('fails closed for malformed roles and expired sessions', () => {
    expect(createAuthSession({ token: 'malformed', expiresAt: new Date(Date.now() + 60_000).toISOString() }).role).toBeUndefined()
    expect(createAuthSession({ token: token({ role: 'Owner' }), expiresAt: new Date(Date.now() + 60_000).toISOString() }).role).toBeUndefined()
    expect(isSessionActive({ accessToken: 'expired', expiresAt: new Date(Date.now() - 1).toISOString() })).toBe(false)
  })
})
