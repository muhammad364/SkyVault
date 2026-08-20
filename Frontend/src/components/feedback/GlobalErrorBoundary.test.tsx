import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { GlobalErrorBoundary } from '@/components/feedback/GlobalErrorBoundary'

function BrokenScreen(): ReactElement {
  throw new Error('Render exploded')
}

describe('GlobalErrorBoundary', () => {
  it('turns render failures into the branded generic error page', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <GlobalErrorBoundary>
          <BrokenScreen />
        </GlobalErrorBoundary>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: "We couldn't keep this screen open." })).toBeInTheDocument()
    consoleError.mockRestore()
  })
})
