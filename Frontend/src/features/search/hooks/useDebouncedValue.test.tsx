import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from '@/features/search/hooks/useDebouncedValue'

afterEach(() => vi.useRealTimers())

describe('useDebouncedValue', () => {
  it('waits 300 ms and cancels the stale value', () => {
    vi.useFakeTimers()
    const value = renderHook(({ query }) => useDebouncedValue(query, 300), {
      initialProps: { query: 'first' },
    })

    value.rerender({ query: 'stale' })
    act(() => vi.advanceTimersByTime(200))
    value.rerender({ query: 'latest' })
    act(() => vi.advanceTimersByTime(299))
    expect(value.result.current).toBe('first')

    act(() => vi.advanceTimersByTime(1))
    expect(value.result.current).toBe('latest')
  })
})
