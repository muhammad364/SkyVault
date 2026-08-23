import { z } from 'zod'

export const adminPlanSchema = z.object({
  name: z.string().trim().min(1, 'Plan name is required.').max(100),
  storageSizeGb: z.number().int().min(1, 'Storage must be at least 1 GB.'),
  price: z.number().min(0, 'Price cannot be negative.'),
  billingCycle: z.number().int().min(1).max(12, 'Billing cycle must be from 1 to 12 months.'),
  isActive: z.boolean(),
})

export const adminProviderSchema = z.object({
  name: z.string().trim().min(1, 'Provider name is required.').max(100),
  providerType: z.string().trim().min(1, 'Provider type is required.').max(50),
})

export const adminStorageAccountSchema = z.object({
  providerId: z.string().uuid('Choose a storage provider.'),
  accountName: z.string().trim().min(1, 'Account name is required.').max(150),
  totalCapacityBytes: z
    .number()
    .int()
    .positive('Capacity must be a positive whole-byte value.')
    .max(Number.MAX_SAFE_INTEGER, 'Capacity exceeds the browser-safe integer range.'),
  priority: z.number().int().positive('Priority must be a positive whole number.'),
})

export const adminEmailConfigurationSchema = z
  .object({
    smtpHost: z.string().trim().min(1, 'SMTP host is required.'),
    smtpPort: z.number().int().min(1).max(65535, 'SMTP port must be from 1 to 65535.'),
    useSsl: z.boolean(),
    requiresAuthentication: z.boolean(),
    senderEmail: z.string().trim().email('Enter a valid sender email.'),
    senderDisplayName: z.string(),
    username: z.string(),
    password: z.string(),
    isActive: z.boolean(),
  })
  .superRefine((values, context) => {
    if (!values.requiresAuthentication) return
    if (!values.username.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['username'],
        message: 'Username is required when authentication is enabled.',
      })
    }
    if (!values.password) {
      context.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password is required when authentication is enabled.',
      })
    }
  })

export type AdminPlanValues = z.infer<typeof adminPlanSchema>
export type AdminProviderValues = z.infer<typeof adminProviderSchema>
export type AdminStorageAccountValues = z.infer<typeof adminStorageAccountSchema>
export type AdminEmailConfigurationValues = z.infer<typeof adminEmailConfigurationSchema>
