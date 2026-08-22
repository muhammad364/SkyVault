import { describe, expect, it } from 'vitest'
import {
  boundedQuotaPercentage,
  getQuotaSignal,
  quotaMeterClass,
} from '@/features/subscriptions/lib/quotaPresentation'

describe('quota presentation', () => {
  it('keeps the approved normal, warning, and critical thresholds shared', () => {
    expect(getQuotaSignal(79.9)).toBe('normal')
    expect(getQuotaSignal(80)).toBe('warning')
    expect(getQuotaSignal(95)).toBe('critical')
    expect(quotaMeterClass('normal')).toBe('bg-primary')
    expect(quotaMeterClass('warning')).toBe('bg-warning-strong')
    expect(quotaMeterClass('critical')).toBe('bg-danger')
  })

  it('bounds only the visual meter value', () => {
    expect(boundedQuotaPercentage(-1)).toBe(0)
    expect(boundedQuotaPercentage(42.5)).toBe(42.5)
    expect(boundedQuotaPercentage(120)).toBe(100)
  })
})
