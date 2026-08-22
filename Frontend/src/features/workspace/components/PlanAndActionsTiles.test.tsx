import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCurrentSubscription } from '@/features/subscriptions/hooks/useCurrentSubscription'
import { PlanStatusTile } from '@/features/workspace/components/PlanStatusTile'
import { QuickActionsTile } from '@/features/workspace/components/QuickActionsTile'

vi.mock('@/features/subscriptions/hooks/useCurrentSubscription')

function renderPlan() {
  return render(
    <MemoryRouter>
      <PlanStatusTile />
    </MemoryRouter>,
  )
}

describe('PlanStatusTile and QuickActionsTile', () => {
  const refetch = vi.fn()

  beforeEach(() => refetch.mockReset())
  afterEach(cleanup)

  it('renders plan loading, error/retry, and no-plan states', () => {
    vi.mocked(useCurrentSubscription).mockReturnValue({
      isPending: true,
    } as ReturnType<typeof useCurrentSubscription>)
    const loadingView = renderPlan()
    expect(screen.getByRole('status', { name: 'Loading your plan status' })).toBeInTheDocument()
    loadingView.unmount()

    vi.mocked(useCurrentSubscription).mockReturnValue({
      isPending: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useCurrentSubscription>)
    const errorView = renderPlan()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(refetch).toHaveBeenCalledOnce()
    errorView.unmount()

    vi.mocked(useCurrentSubscription).mockReturnValue({
      isPending: false,
      isError: false,
      data: null,
    } as ReturnType<typeof useCurrentSubscription>)
    renderPlan()
    expect(screen.getByRole('heading', { name: 'No plan yet' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explore plans/i })).toHaveAttribute(
      'href',
      '/vault/storage',
    )
  })

  it('renders plan facts only from SubscriptionResponse', () => {
    vi.mocked(useCurrentSubscription).mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        subscriptionId: 'subscription-id',
        userId: 'user-id',
        storagePlanId: 'plan-id',
        storagePlanName: 'Studio Vault',
        storageSizeGb: 250,
        price: 2499,
        billingCycle: 3,
        startDate: '2026-08-01T00:00:00Z',
        endDate: '2026-11-01T00:00:00Z',
        status: 0,
        gracePeriodEndDate: null,
      },
    } as ReturnType<typeof useCurrentSubscription>)
    const { container } = renderPlan()

    expect(screen.getByText('Studio Vault')).toBeInTheDocument()
    expect(screen.getByText('250 GB')).toBeInTheDocument()
    expect(screen.getByText('Every 3 months')).toBeInTheDocument()
    expect(container.querySelector('time[datetime="2026-11-01T00:00:00Z"]')).toBeInTheDocument()
  })

  it('offers the three working file-first quick actions', () => {
    render(
      <MemoryRouter>
        <QuickActionsTile />
      </MemoryRouter>,
    )

    const links = screen.getAllByRole('link')
    const actions = screen.getByLabelText('File quick actions')
    expect(links).toHaveLength(3)
    expect(actions).toHaveClass('grid', 'sm:grid-cols-3')
    expect(links[0]).toHaveClass('flex', 'min-h-16', 'items-center', 'rounded-lg', 'p-3')
    expect(links[1]).toHaveClass('flex', 'min-h-16', 'items-center', 'rounded-lg', 'p-3')
    expect(screen.getByRole('link', { name: /upload files/i })).toHaveAttribute(
      'href',
      '/vault/files?action=upload',
    )
    expect(screen.getByRole('link', { name: /new folder/i })).toHaveAttribute(
      'href',
      '/vault/files?action=new-folder',
    )
    expect(screen.getByRole('link', { name: /browse files/i })).toHaveAttribute(
      'href',
      '/vault/files',
    )
    expect(links.map((link) => link.getAttribute('href'))).not.toContain('/vault/search')
    expect(links.map((link) => link.getAttribute('href'))).not.toContain('/vault/trash')
  })
})
