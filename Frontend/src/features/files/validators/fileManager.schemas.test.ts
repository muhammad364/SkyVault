import { describe, expect, it } from 'vitest'
import {
  MAX_FILE_SIZE_BYTES,
  validateTransferFile,
} from '@/features/files/validators/fileManager.schemas'

function fileWithSize(size: number) {
  const file = new File(['x'], 'boundary.bin')
  Object.defineProperty(file, 'size', { value: size })
  return file
}

describe('file transfer size boundary', () => {
  it('accepts exactly 100 MiB and rejects the first byte over it', () => {
    expect(MAX_FILE_SIZE_BYTES).toBe(100 * 1024 * 1024)
    expect(validateTransferFile(fileWithSize(MAX_FILE_SIZE_BYTES))).toBeNull()
    expect(validateTransferFile(fileWithSize(MAX_FILE_SIZE_BYTES + 1))).toMatch(/100 MB/i)
  })

  it('rejects empty files', () => {
    expect(validateTransferFile(fileWithSize(0))).toMatch(/contains something/i)
  })
})
