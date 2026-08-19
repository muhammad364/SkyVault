import { describe, expect, it } from 'vitest'
import { formatBytes, formatPercentage, formatRelativeDate } from '@/lib/formatters'

describe('formatters', () => {
  it('formats byte values without inventing a value for invalid input', () => {
    expect(formatBytes(1_048_576)).toBe('1 MB')
    expect(formatBytes(-1)).toBe('—')
  })

  it('formats a precomputed percentage', () => {
    expect(formatPercentage(0.8)).toBe('80%')
  })

  it('formats invalid dates safely', () => {
    expect(formatRelativeDate('not-a-date')).toBe('—')
  })
})
