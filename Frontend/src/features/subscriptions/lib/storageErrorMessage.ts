import { ApiError } from '@/api/errors'

const messages = {
  invalid_payment_card: 'Check the card number and try again.',
  payment_card_expired: 'This card has expired. Use another card to continue.',
  payment_details_invalid: 'Check your payment details and try again.',
  plan_allocation_too_small:
    'That plan does not leave enough room for the files already in your vault.',
  storage_plan_inactive: 'That plan is no longer available. Choose another plan.',
  storage_plan_not_found: 'We could not find that storage plan.',
  subscription_already_active:
    'Confirm that you want to replace your current plan before continuing.',
  subscription_required: 'Choose a storage plan before adding more space.',
  subscription_unavailable:
    'This subscription can no longer be renewed. Choose a new plan instead.',
} as const

export function storageErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError && error.code && error.code in messages) {
    return messages[error.code as keyof typeof messages]
  }
  if (error instanceof ApiError) return error.message
  return fallback
}
