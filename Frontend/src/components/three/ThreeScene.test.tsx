import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ThreeScene } from '@/components/three/ThreeScene'

function setMediaMatch(matches: (query: string) => boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: matches(query),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  })
}

beforeEach(() => {
  setMediaMatch(() => false)
  Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: 8 })
})

afterEach(cleanup)

describe('ThreeScene eligibility', () => {
  it('renders the static fallback on mobile without mounting a Canvas', () => {
    const { container } = render(
      <ThreeScene label="Authentication key and vault dial" fallbackSrc="/brand/auth-key-fallback.svg">
        <span>WebGL scene</span>
      </ThreeScene>,
    )

    expect(screen.getByRole('img', { name: 'Authentication key and vault dial' })).toBeInTheDocument()
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
    expect(screen.queryByText('WebGL scene')).not.toBeInTheDocument()
  })

  it('renders the fallback for reduced motion on a desktop viewport', () => {
    setMediaMatch((query) => query.includes('min-width') || query.includes('prefers-reduced-motion'))
    const { container } = render(
      <ThreeScene label="Reduced-motion key" fallbackSrc="/brand/auth-key-fallback.svg">
        <span>WebGL scene</span>
      </ThreeScene>,
    )
    expect(screen.getByRole('img', { name: 'Reduced-motion key' })).toBeInTheDocument()
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
  })

  it('renders the fallback on low-core desktop hardware', () => {
    setMediaMatch((query) => query.includes('min-width'))
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: 4 })
    const { container } = render(
      <ThreeScene label="Low-power key" fallbackSrc="/brand/auth-key-fallback.svg">
        <span>WebGL scene</span>
      </ThreeScene>,
    )
    expect(screen.getByRole('img', { name: 'Low-power key' })).toBeInTheDocument()
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
  })
})
