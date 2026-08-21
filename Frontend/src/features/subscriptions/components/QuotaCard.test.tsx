import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QuotaCard } from '@/features/subscriptions/components/QuotaCard'

vi.mock('@/features/subscriptions/components/QuotaVisual', () => ({
  QuotaVisual: ({ usagePercentage }: { usagePercentage: number }) => (
    <div>Quota visual {usagePercentage}</div>
  ),
}))

afterEach(cleanup)

const quota = {
  allocatedStorageBytes: 100 * 1024 ** 3,
  usedStorageBytes: 80 * 1024 ** 3,
  availableStorageBytes: 20 * 1024 ** 3,
  usagePercentage: 80,
  hasActiveSubscription: true,
  canPerformStorageWriteOperations: true,
  isOverQuota: false,
}

describe('QuotaCard', () => {
  it('renders API-provided allocation values and accessible amber threshold', () => {
    render(
      <MemoryRouter>
        <QuotaCard quota={quota} />
      </MemoryRouter>,
    )
    const meter = screen.getByRole('meter', { name: 'Storage used' })
    expect(meter).toHaveAttribute('aria-valuenow', '80')
    expect(meter.firstElementChild).toHaveClass('bg-warning-strong')
    expect(screen.getByText('20 GB ready for what comes next.')).toBeInTheDocument()
  })

  it('uses the coral 95% threshold and backend-provided over-quota state', () => {
    render(
      <MemoryRouter>
        <QuotaCard
          quota={{ ...quota, usagePercentage: 95, availableStorageBytes: 0, isOverQuota: true }}
        />
      </MemoryRouter>,
    )
    expect(screen.getByRole('meter').firstElementChild).toHaveClass('bg-danger')
    expect(screen.getByText(/over its current allocation/i)).toBeInTheDocument()
  })

  it('explains the no-subscription write-disabled state and keeps numeric values visible', () => {
    render(
      <MemoryRouter>
        <QuotaCard
          quota={{
            allocatedStorageBytes: 0,
            usedStorageBytes: 5 * 1024 ** 3,
            availableStorageBytes: 0,
            usagePercentage: 0,
            hasActiveSubscription: false,
            canPerformStorageWriteOperations: false,
            isOverQuota: true,
          }}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('Your vault is waiting for a plan.')).toBeInTheDocument()
    expect(screen.getByText('Storage write operations are currently paused.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /choose a plan/i })).toHaveAttribute(
      'href',
      '#storage-plans',
    )
    expect(screen.getAllByText('0 B')).toHaveLength(2)
    expect(screen.getAllByText('5 GB')).toHaveLength(2)
  })
})
