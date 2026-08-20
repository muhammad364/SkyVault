import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '@/api/errors'

export function applyApiFieldErrors<TValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TValues>,
  fields: readonly Path<TValues>[],
) {
  if (!(error instanceof ApiError) || !error.fieldErrors) return false

  let applied = false
  for (const [serverField, messages] of Object.entries(error.fieldErrors)) {
    const field = fields.find((candidate) => candidate.toLowerCase() === serverField.toLowerCase())
    if (!field || messages.length === 0) continue
    setError(field, { type: 'server', message: messages[0] })
    applied = true
  }

  return applied
}
