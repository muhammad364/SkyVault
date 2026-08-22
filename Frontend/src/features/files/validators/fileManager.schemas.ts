import { z } from 'zod'

export const vaultNameSchema = z.object({
  name: z.string().trim().min(1, 'Enter a name.').max(255, 'Use no more than 255 characters.'),
})

export type VaultNameValues = z.infer<typeof vaultNameSchema>

export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024

export function validateTransferFile(file: File) {
  if (file.size === 0) return 'Choose a file that contains something.'
  if (file.size > MAX_FILE_SIZE_BYTES) return 'Files must be 100 MB or smaller.'
  return null
}
