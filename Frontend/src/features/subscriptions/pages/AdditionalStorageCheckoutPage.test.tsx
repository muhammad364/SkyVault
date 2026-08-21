import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAdditionalStorageQuote } from '@/features/subscriptions/hooks/useAdditionalStorageQuote'
import { useCurrentSubscription } from '@/features/subscriptions/hooks/useCurrentSubscription'
import { usePurchaseAdditionalStorage } from '@/features/subscriptions/hooks/usePurchaseAdditionalStorage'
import AdditionalStorageCheckoutPage from '@/features/subscriptions/pages/AdditionalStorageCheckoutPage'
import type { PaymentFormValues } from '@/features/subscriptions/validators/payment.schema'

vi.mock('@/features/subscriptions/hooks/useAdditionalStorageQuote')
vi.mock('@/features/subscriptions/hooks/useCurrentSubscription')
vi.mock('@/features/subscriptions/hooks/usePurchaseAdditionalStorage')
vi.mock('@/features/subscriptions/components/AdditionalStorageAmountForm', () => ({
  AdditionalStorageAmountForm: ({ onSubmit }: { onSubmit: (amount: number) => void }) => (
    <button onClick={() => onSubmit(5)}>Quote 5 GB</button>
  ),
}))
vi.mock('@/features/subscriptions/components/PaymentForm', () => ({
  PaymentForm: ({
    onSubmit,
    amountValue,
  }: {
    onSubmit: (payment: PaymentFormValues) => Promise<void>
    amountValue: string
  }) => (
    <button
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
      Pay {amountValue}
    </button>
  ),
}))

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

describe('AdditionalStorageCheckoutPage', () => {
  const mutateAsync = vi.fn()

  beforeEach(() => {
    mutateAsync.mockReset().mockResolvedValue({})
    vi.mocked(useCurrentSubscription).mockReturnValue({
      isPending: false,
      isError: false,
      data: current,
    } as ReturnType<typeof useCurrentSubscription>)
    vi.mocked(useAdditionalStorageQuote).mockImplementation(
      (amount) =>
        ({
          isPending: false,
          isError: false,
          data: amount === 5 ? { storageAmountGb: 5, pricePerGb: 10, totalPrice: 50 } : undefined,
          refetch: vi.fn(),
        }) as unknown as ReturnType<typeof useAdditionalStorageQuote>,
    )
    vi.mocked(usePurchaseAdditionalStorage).mockReturnValue({
      isPending: false,
      isSuccess: false,
      isError: false,
      mutateAsync,
      reset: vi.fn(),
    } as unknown as ReturnType<typeof usePurchaseAdditionalStorage>)
  })

  afterEach(cleanup)

  it('uses the server quote as read-only display and omits price from the purchase request', async () => {
    render(
      <MemoryRouter>
        <AdditionalStorageCheckoutPage />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Quote 5 GB' }))
    expect(await screen.findByText('PKR 50')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Pay PKR 50' }))

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        storageAmountGb: 5,
        payment: {
          cardHolderName: 'Ava Khan',
          cardNumber: '4242424242424242',
          expiryMonth: 12,
          expiryYear: 2099,
          cvv: '123',
        },
      }),
    )
    expect(JSON.stringify(mutateAsync.mock.calls)).not.toContain('totalPrice')
  })
})
