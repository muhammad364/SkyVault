import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CurrentSubscriptionCard } from '@/features/subscriptions/components/CurrentSubscriptionCard'
import { useCancelSubscription } from '@/features/subscriptions/hooks/useCancelSubscription'
import { useCurrentSubscription } from '@/features/subscriptions/hooks/useCurrentSubscription'

vi.mock('@/features/subscriptions/hooks/useCancelSubscription')
vi.mock('@/features/subscriptions/hooks/useCurrentSubscription')
vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

const current = {
  subscriptionId: 'subscription-id',
  userId: 'user-id',
  storagePlanId: 'plan-id',
  storagePlanName: 'Calm 100',
  storageSizeGb: 100,
  price: 2500,
  billingCycle: 1,
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-09-01T00:00:00Z',
  status: 0,
  gracePeriodEndDate: null,
}

describe('CurrentSubscriptionCard lifecycle', () => {
  const mutateAsync = vi.fn()

  beforeEach(() => {
    mutateAsync.mockReset().mockResolvedValue({ ...current, status: 2 })
    vi.mocked(useCurrentSubscription).mockReturnValue({
      isPending: false,
      isError: false,
      data: current,
    } as ReturnType<typeof useCurrentSubscription>)
    vi.mocked(useCancelSubscription).mockReturnValue({
      isPending: false,
      isError: false,
      mutateAsync,
    } as unknown as ReturnType<typeof useCancelSubscription>)
  })

  afterEach(cleanup)

  it('traps cancellation in an explicit confirmation and restores trigger focus', async () => {
    render(
      <MemoryRouter>
        <CurrentSubscriptionCard />
      </MemoryRouter>,
    )
    const trigger = screen.getByRole('button', { name: 'Cancel plan' })
    fireEvent.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Cancel your storage plan?' })).toBeInTheDocument()
    expect(screen.getByText(/storage changes will stop immediately/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Yes, cancel my plan' }))
    await waitFor(() => expect(mutateAsync).toHaveBeenCalledOnce())
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('offers renewal and plan choice during a returned grace period', () => {
    vi.mocked(useCurrentSubscription).mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        ...current,
        status: 2,
        gracePeriodEndDate: '2026-09-08T00:00:00Z',
      },
    } as ReturnType<typeof useCurrentSubscription>)

    render(
      <MemoryRouter>
        <CurrentSubscriptionCard />
      </MemoryRouter>,
    )

    expect(screen.getByText('Cancelled')).toBeInTheDocument()
    expect(screen.getByText(/renew by/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /renew/i })).toHaveAttribute(
      'href',
      '/vault/storage/renew',
    )
    expect(screen.getByRole('link', { name: 'Change plan' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /add storage/i })).not.toBeInTheDocument()
  })

  it('directs a user without a subscription to the plan catalogue', () => {
    vi.mocked(useCurrentSubscription).mockReturnValue({
      isPending: false,
      isError: false,
      data: null,
    } as ReturnType<typeof useCurrentSubscription>)

    render(
      <MemoryRouter>
        <CurrentSubscriptionCard />
      </MemoryRouter>,
    )

    expect(screen.getByText('No plan yet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explore plans' })).toHaveAttribute(
      'href',
      '#storage-plans',
    )
  })
})
