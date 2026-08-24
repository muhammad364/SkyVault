import { z } from 'zod'

const email = z
  .string()
  .trim()
  .min(1, 'Enter your email address.')
  .email('Enter a valid email address.')
  .max(255)
const password = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(100, 'Use no more than 100 characters.')
const name = z
  .string()
  .trim()
  .min(1, 'This name is required.')
  .max(100, 'Use no more than 100 characters.')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.'),
})

export const registerSchema = z
  .object({
    firstName: name,
    lastName: name,
    email,
    password,
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Your passwords do not match.',
    path: ['confirmPassword'],
  })

export const emailSchema = z.object({ email })

export const resetPasswordSchema = z
  .object({
    newPassword: password,
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'Your passwords do not match.',
    path: ['confirmPassword'],
  })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type EmailValues = z.infer<typeof emailSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
