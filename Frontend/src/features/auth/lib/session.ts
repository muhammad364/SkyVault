import type { LoginResponse } from '@/models/auth/LoginResponse'
import type { AuthSession, UserRole } from '@/store/auth.store'

const roleClaimKeys = ['role', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as const

function decodePayload(token: string): Record<string, unknown> | null {
  const payload = token.split('.')[1]
  if (!payload) return null

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const value: unknown = JSON.parse(atob(padded))
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function readRole(token: string): UserRole | undefined {
  const payload = decodePayload(token)
  if (!payload) return undefined

  for (const key of roleClaimKeys) {
    const value = payload[key]
    if (typeof value !== 'string') continue
    const role = value.toLowerCase()
    if (role === 'user' || role === 'admin') return role
  }

  return undefined
}

export function createAuthSession(response: LoginResponse): AuthSession {
  return {
    accessToken: response.token,
    expiresAt: response.expiresAt,
    role: readRole(response.token),
  }
}

export function isSessionActive(session: AuthSession | null, now = Date.now()) {
  if (!session?.accessToken) return false
  const expiresAt = Date.parse(session.expiresAt)
  return Number.isFinite(expiresAt) && expiresAt > now
}
