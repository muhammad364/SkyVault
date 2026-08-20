import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LandingHero } from '@/features/marketing/components/LandingHero'

vi.mock('@/hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({ isSm: false, isMd: false, isLg: false, isXl: false, is2Xl: false }),
}))

vi.mock('@/hooks/useReducedMotion', () => ({ useReducedMotion: () => true }))

describe('LandingHero', () => {
  it('uses the static safe fallback and does not mount a canvas on an ineligible viewport', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <LandingHero />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'A quieter home for every file.' })).toBeInTheDocument()
    expect(screen.queryByText('SkyVault')).not.toBeInTheDocument()
    expect(document.querySelector('img[src*="skyvault-emblem"]')).not.toBeInTheDocument()
    expect(screen.getByAltText('A heavy SkyVault safe with a circular locking door')).toHaveAttribute(
      'src',
      '/brand/landing-vault-fallback-v2.png',
    )
    expect(document.querySelector('canvas')).not.toBeInTheDocument()
  })
})
