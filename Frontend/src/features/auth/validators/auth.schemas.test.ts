import { describe, expect, it } from 'vitest'
import { changePasswordSchema, profileSchema } from '@/features/account/validators/account.schemas'
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema } from '@/features/auth/validators/auth.schemas'

describe('authentication validation contracts', () => {
  it('requires backend-compatible email, name, and password lengths', () => {
    expect(emailSchema.safeParse({ email: 'not-an-email' }).success).toBe(false)
    expect(loginSchema.safeParse({ email: 'ava@example.com', password: '' }).success).toBe(false)
    expect(registerSchema.safeParse({
      firstName: '', lastName: 'Khan', email: 'ava@example.com', password: 'short', confirmPassword: 'different',
    }).success).toBe(false)
    expect(profileSchema.safeParse({ firstName: 'A'.repeat(101), lastName: 'Khan' }).success).toBe(false)
  })

  it('keeps password confirmations client-side and validates equality', () => {
    expect(resetPasswordSchema.safeParse({ newPassword: 'new-password', confirmPassword: 'different' }).success).toBe(false)
    expect(changePasswordSchema.safeParse({
      currentPassword: 'old-password', newPassword: 'new-password', confirmPassword: 'new-password',
    }).success).toBe(true)
  })
})
