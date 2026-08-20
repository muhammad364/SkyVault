import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MarketingHighlights } from '@/features/marketing/components/MarketingHighlights'

const state = vi.hoisted(() => ({ reducedMotion: false }))

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return { ...actual, useInView: () => true }
})

vi.mock('@/hooks/useReducedMotion', () => ({ useReducedMotion: () => state.reducedMotion }))

describe('MarketingHighlights', () => {
  beforeEach(() => {
    state.reducedMotion = false
  })

  it('renders one accessible card set, hides its visual duplicate, and supports pausing', async () => {
    const user = userEvent.setup()
    render(<MarketingHighlights />)

    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(document.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
    expect(screen.getByTestId('highlights-marquee')).toHaveAttribute('data-paused', 'false')

    await user.click(screen.getByRole('button', { name: 'Pause moving benefit cards' }))

    expect(screen.getByTestId('highlights-marquee')).toHaveAttribute('data-paused', 'true')
    await user.click(screen.getByRole('button', { name: 'Resume moving benefit cards' }))

    expect(screen.getByTestId('highlights-marquee')).toHaveAttribute('data-paused', 'false')
    expect(screen.getByRole('button', { name: 'Pause moving benefit cards' })).toBeInTheDocument()
  })

  it('renders a static grid under reduced motion', () => {
    state.reducedMotion = true
    render(<MarketingHighlights />)

    expect(screen.getByTestId('static-highlights')).toBeInTheDocument()
    expect(screen.queryByTestId('highlights-marquee')).not.toBeInTheDocument()
  })
})
