import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PurchaseHistory } from '@/features/subscriptions/components/PurchaseHistory'
import { useAdditionalStoragePurchases } from '@/features/subscriptions/hooks/useAdditionalStoragePurchases'

vi.mock('@/features/subscriptions/hooks/useAdditionalStoragePurchases')

afterEach(cleanup)

describe('PurchaseHistory', () => {
  it('renders the empty history with an additional-storage action', () => {
    vi.mocked(useAdditionalStoragePurchases).mockReturnValue({
      isPending: false,
      isError: false,
      data: [],
    } as unknown as ReturnType<typeof useAdditionalStoragePurchases>)

    render(
      <MemoryRouter>
        <PurchaseHistory canPurchaseAdditionalStorage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/no additional storage yet/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /add storage/i })).toHaveAttribute(
      'href',
      '/vault/storage/additional',
    )
  })

  it('keeps additional storage unavailable without an active subscription', () => {
    vi.mocked(useAdditionalStoragePurchases).mockReturnValue({
      isPending: false,
      isError: false,
      data: [],
    } as unknown as ReturnType<typeof useAdditionalStoragePurchases>)

    render(
      <MemoryRouter>
        <PurchaseHistory canPurchaseAdditionalStorage={false} />
      </MemoryRouter>,
    )

    expect(screen.getByText(/activate a plan before purchasing/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /add storage/i })).not.toBeInTheDocument()
  })
})
