import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import DesignSystemPage from '@/pages/DesignSystemPage'

describe('DesignSystemPage', () => {
  it('renders the design-system showcase and accessible theme controls', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DesignSystemPage />
        </ThemeProvider>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Design system' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Use dark theme' })).toBeInTheDocument()
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })
})
