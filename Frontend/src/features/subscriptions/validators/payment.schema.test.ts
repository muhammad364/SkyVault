import { describe, expect, it } from 'vitest'
import {
  additionalStorageAmountSchema,
  paymentSchema,
} from '@/features/subscriptions/validators/payment.schema'

const validPayment = {
  cardHolderName: 'Ava Khan',
  cardNumber: '4242 4242 4242 4242',
  expiryMonth: 12,
  expiryYear: 2099,
  cvv: '123',
}

describe('Phase 4 payment validation', () => {
  it('accepts the backend-compatible payment shape', () => {
    expect(paymentSchema.safeParse(validPayment).success).toBe(true)
  })

  it('rejects invalid Luhn, expired, and CVV values', () => {
    expect(
      paymentSchema.safeParse({ ...validPayment, cardNumber: '4242 4242 4242 4241' }).success,
    ).toBe(false)
    expect(paymentSchema.safeParse({ ...validPayment, expiryYear: 2001 }).success).toBe(false)
    expect(paymentSchema.safeParse({ ...validPayment, cvv: '12' }).success).toBe(false)
  })

  it('requires a positive whole number of gigabytes', () => {
    expect(additionalStorageAmountSchema.safeParse({ storageAmountGb: 5 }).success).toBe(true)
    expect(additionalStorageAmountSchema.safeParse({ storageAmountGb: 0 }).success).toBe(false)
    expect(additionalStorageAmountSchema.safeParse({ storageAmountGb: 1.5 }).success).toBe(false)
  })
})
