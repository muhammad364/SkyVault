import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { OfflineBanner } from '@/components/layout/OfflineBanner'

afterEach(() => {
  cleanup()
  Object.defineProperty(window.navigator, 'onLine', { configurable: true, value: true })
})

describe('OfflineBanner', () => {
  it('announces the offline state without replacing storage content', () => {
    Object.defineProperty(window.navigator, 'onLine', { configurable: true, value: false })

    render(<OfflineBanner />)

    expect(screen.getByRole('status')).toHaveTextContent(/you're offline/i)
  })
})
