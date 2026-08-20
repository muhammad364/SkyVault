import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrandSignature } from '@/components/brand/BrandSignature'

describe('BrandSignature', () => {
  it('uses the cleaned theme emblems with an exact live wordmark', () => {
    const { container } = render(<BrandSignature variant="hero" />)
    const images = Array.from(container.querySelectorAll('img'))

    expect(screen.getByText('Sky')).toBeInTheDocument()
    expect(screen.getByText('Vault')).toBeInTheDocument()
    expect(images.map((image) => image.getAttribute('src'))).toEqual([
      '/brand/skyvault-emblem-light-v2.png',
      '/brand/skyvault-emblem-dark-v2.png',
    ])
    expect(images.every((image) => image.getAttribute('alt') === '')).toBe(true)
  })
})
