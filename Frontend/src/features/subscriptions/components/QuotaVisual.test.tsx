import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QuotaVisual } from '@/features/subscriptions/components/QuotaVisual'

vi.mock('@/components/three/LazyThreeScene', () => ({
  LazyThreeScene: ({ fallback }: { fallback: React.ReactNode }) => fallback,
}))

afterEach(cleanup)

describe('QuotaVisual fallback', () => {
  it.each([
    [25, 'var(--primary)'],
    [80, 'var(--warning-strong)'],
    [95, 'var(--danger)'],
    [120, 'var(--danger)'],
  ])('uses the real %s%% level and semantic signal', (percentage, signal) => {
    const { container } = render(<QuotaVisual usagePercentage={percentage} />)
    expect(screen.getByRole('img')).toHaveAccessibleName(
      `A vault volume filled to ${percentage}% of your storage allocation`,
    )
    const signalRects = Array.from(container.querySelectorAll('rect')).filter(
      (rect) => rect.getAttribute('fill') === signal,
    )
    expect(signalRects).not.toHaveLength(0)
    const fill = signalRects.find((rect) => rect.getAttribute('x') === '78')
    expect(Number(fill?.getAttribute('height'))).toBeLessThanOrEqual(188)
  })
})
