import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrandMark } from '@/components/brand/BrandMark'
import { BrandSignature } from '@/components/brand/BrandSignature'

describe('BrandSignature', () => {
  it('uses the cleaned theme emblems with an exact live wordmark', () => {
    const { container } = render(<BrandSignature variant="hero" />)
    const images = Array.from(container.querySelectorAll('img'))

    expect(screen.getByText('Sky')).toBeInTheDocument()
    expect(screen.getByText('Vault')).toBeInTheDocument()
    expect(images.map((image) => image.getAttribute('src'))).toEqual([
      '/brand/skyvault-emblem-light-v3.png',
      '/brand/skyvault-emblem-dark-v3.png',
    ])
    expect(images.every((image) => image.getAttribute('alt') === '')).toBe(true)
  })

  it('ships deterministic light and dark mark variants', () => {
    const { container } = render(<BrandMark alt="SkyVault mark" />)
    const images = Array.from(container.querySelectorAll('img'))

    expect(images.map((image) => image.getAttribute('src'))).toEqual([
      '/brand/skyvault-mark.svg',
      '/brand/skyvault-mark-dark-v3.svg',
    ])
    expect(images[0]).toHaveClass('dark:hidden')
    expect(images[1]).toHaveClass('dark:block')
  })
})
