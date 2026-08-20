import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DeferredLandingSection } from '@/features/marketing/components/DeferredLandingSection'

const viewState = vi.hoisted(() => ({ isNear: false }))

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return { ...actual, useInView: () => viewState.isNear }
})

describe('DeferredLandingSection', () => {
  it('keeps a stable skeleton until the section nears the viewport', () => {
    viewState.isNear = false
    const { rerender } = render(
      <DeferredLandingSection label="Loading benefits">
        <p>Deferred content</p>
      </DeferredLandingSection>,
    )

    expect(screen.getByLabelText('Loading landing section')).toBeInTheDocument()
    expect(screen.queryByText('Deferred content')).not.toBeInTheDocument()

    viewState.isNear = true
    rerender(
      <DeferredLandingSection label="Loading benefits">
        <p>Deferred content</p>
      </DeferredLandingSection>,
    )

    expect(screen.getByText('Deferred content')).toBeInTheDocument()
  })
})
