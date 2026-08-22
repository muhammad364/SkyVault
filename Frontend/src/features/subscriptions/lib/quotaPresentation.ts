export type QuotaSignal = 'normal' | 'warning' | 'critical'

export function getQuotaSignal(usagePercentage: number): QuotaSignal {
  if (usagePercentage >= 95) return 'critical'
  if (usagePercentage >= 80) return 'warning'
  return 'normal'
}

export function quotaMeterClass(signal: QuotaSignal): string {
  if (signal === 'critical') return 'bg-danger'
  if (signal === 'warning') return 'bg-warning-strong'
  return 'bg-primary'
}

export function boundedQuotaPercentage(usagePercentage: number): number {
  return Math.max(0, Math.min(100, usagePercentage))
}
