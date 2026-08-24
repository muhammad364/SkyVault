import { z } from 'zod'

const name = z
  .string()
  .trim()
  .min(1, 'This name is required.')
  .max(100, 'Use no more than 100 characters.')
const password = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(100, 'Use no more than 100 characters.')

export const profileSchema = z.object({
  firstName: name,
  lastName: name,
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.'),
    newPassword: password,
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'Your passwords do not match.',
    path: ['confirmPassword'],
  })

export type ProfileValues = z.infer<typeof profileSchema>
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
