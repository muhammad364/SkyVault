import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ErrorPage } from '@/pages/errors/ErrorPage'

describe('ErrorPage', () => {
  it('renders a branded server-error page with retry and trace details', () => {
    const onRetry = vi.fn()

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ErrorPage status={500} traceId="trace-123" onRetry={onRetry} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Something went wrong on our side.' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Trace trace-123')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
