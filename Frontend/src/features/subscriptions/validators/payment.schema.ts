import { z } from 'zod'

function passesLuhn(value: string) {
  const digits = value.replace(/[\s-]/g, '')
  let sum = 0
  let shouldDouble = false

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

export const paymentSchema = z
  .object({
    cardHolderName: z
      .string()
      .trim()
      .min(1, 'Enter the name shown on the card.')
      .max(100, 'Use 100 characters or fewer.'),
    cardNumber: z
      .string()
      .min(1, 'Enter a card number.')
      .regex(/^[0-9\s-]+$/, 'Use digits, spaces, or hyphens only.')
      .refine((value) => {
        const length = value.replace(/[\s-]/g, '').length
        return length >= 13 && length <= 19
      }, 'Card number must contain between 13 and 19 digits.')
      .refine(passesLuhn, 'Check the card number and try again.'),
    expiryMonth: z.coerce
      .number()
      .int()
      .min(1, 'Choose a valid month.')
      .max(12, 'Choose a valid month.'),
    expiryYear: z.coerce
      .number()
      .int()
      .min(2000, 'Choose a valid year.')
      .max(2100, 'Choose a valid year.'),
    cvv: z.string().regex(/^\d{3,4}$/, 'CVV must contain 3 or 4 digits.'),
  })
  .superRefine(({ expiryMonth, expiryYear }, context) => {
    const now = new Date()
    const hasExpired =
      expiryYear < now.getFullYear() ||
      (expiryYear === now.getFullYear() && expiryMonth < now.getMonth() + 1)
    if (hasExpired) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expiryYear'],
        message: 'This card has expired.',
      })
    }
  })

export type PaymentFormValues = z.infer<typeof paymentSchema>

export const additionalStorageAmountSchema = z.object({
  storageAmountGb: z.coerce
    .number()
    .int('Enter a whole number of gigabytes.')
    .min(1, 'Add at least 1 GB.')
    .max(2_147_483_647, 'That storage amount is too large.'),
})

export type AdditionalStorageAmountValues = z.infer<typeof additionalStorageAmountSchema>
