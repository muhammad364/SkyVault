import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCurrentSubscription } from '@/features/subscriptions/hooks/useCurrentSubscription'
import { useStoragePlan } from '@/features/subscriptions/hooks/useStoragePlan'
import { useSubscribe } from '@/features/subscriptions/hooks/useSubscribe'
import SubscribeCheckoutPage from '@/features/subscriptions/pages/SubscribeCheckoutPage'
import type { PaymentFormValues } from '@/features/subscriptions/validators/payment.schema'

vi.mock('@/features/subscriptions/hooks/useCurrentSubscription')
vi.mock('@/features/subscriptions/hooks/useStoragePlan')
vi.mock('@/features/subscriptions/hooks/useSubscribe')
vi.mock('@/features/subscriptions/components/PaymentForm', () => ({
  PaymentForm: ({
    onSubmit,
    submitDisabled,
    acknowledgement,
  }: {
    onSubmit: (payment: PaymentFormValues) => Promise<void>
    submitDisabled?: boolean
    acknowledgement?: React.ReactNode
  }) => (
    <div>
      {acknowledgement}
      <button
        disabled={submitDisabled}
        onClick={() =>
          void onSubmit({
            cardHolderName: 'Ava Khan',
            cardNumber: '4242424242424242',
            expiryMonth: 12,
            expiryYear: 2099,
            cvv: '123',
          })
        }
      >
        Submit payment
      </button>
    </div>
  ),
}))

const plan = {
  storagePlanId: 'plan-id',
  name: 'Calm 100',
  storageSizeGb: 100,
  price: 2500,
  billingCycle: 1,
  isActive: true,
}
const current = {
  subscriptionId: 'subscription-id',
  userId: 'user-id',
  storagePlanId: 'old-plan',
  storagePlanName: 'Calm 50',
  storageSizeGb: 50,
  price: 1500,
  billingCycle: 1,
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-09-01T00:00:00Z',
  status: 0,
  gracePeriodEndDate: null,
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/vault/storage/subscribe/plan-id']}>
      <Routes>
        <Route path="/vault/storage/subscribe/:storagePlanId" element={<SubscribeCheckoutPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SubscribeCheckoutPage', () => {
  const mutateAsync = vi.fn()
  const reset = vi.fn()

  beforeEach(() => {
    mutateAsync.mockReset().mockResolvedValue(current)
    reset.mockReset()
    vi.mocked(useStoragePlan).mockReturnValue({
      isPending: false,
      isError: false,
      data: plan,
    } as ReturnType<typeof useStoragePlan>)
    vi.mocked(useCurrentSubscription).mockReturnValue({
      isPending: false,
      isError: false,
      data: current,
    } as ReturnType<typeof useCurrentSubscription>)
    vi.mocked(useSubscribe).mockReturnValue({
      isPending: false,
      isSuccess: false,
      isError: false,
      mutateAsync,
      reset,
    } as unknown as ReturnType<typeof useSubscribe>)
  })

  afterEach(cleanup)

  it('requires explicit active-plan replacement acknowledgement and sends the exact DTO', async () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Submit payment' })).toBeDisabled()
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'Submit payment' }))

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        storagePlanId: 'plan-id',
        replaceExistingSubscription: true,
        payment: {
          cardHolderName: 'Ava Khan',
          cardNumber: '4242424242424242',
          expiryMonth: 12,
          expiryYear: 2099,
          cvv: '123',
        },
      }),
    )
  })

  it('renders a full processing screen while the synchronous request is pending', () => {
    vi.mocked(useSubscribe).mockReturnValue({
      isPending: true,
      isSuccess: false,
      isError: false,
    } as ReturnType<typeof useSubscribe>)
    renderPage()
    expect(screen.getByText('Activating your storage plan…')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
  })
})
