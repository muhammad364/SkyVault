import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { PublicPlansPreview } from '@/features/marketing/components/PublicPlansPreview'
import { usePublicStoragePlans } from '@/features/marketing/hooks/usePublicStoragePlans'

vi.mock('@/features/marketing/hooks/usePublicStoragePlans', () => ({
  usePublicStoragePlans: vi.fn(),
}))

const mockedUsePublicStoragePlans = vi.mocked(usePublicStoragePlans)

describe('PublicPlansPreview', () => {
  it('renders only plan facts returned by the public plans endpoint', () => {
    mockedUsePublicStoragePlans.mockReturnValue({
      data: [
        { storagePlanId: 'plan-1', name: 'Basic', storageSizeGb: 4, price: 20, billingCycle: 12, isActive: true },
        { storagePlanId: 'plan-2', name: 'Student', storageSizeGb: 2, price: 10, billingCycle: 1, isActive: true },
      ],
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicStoragePlans>)

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PublicPlansPreview />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Basic' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Student' })).toBeInTheDocument()
    expect(screen.getByText('4 GB')).toBeInTheDocument()
    expect(screen.getByText('2 GB')).toBeInTheDocument()
    expect(screen.getByText('PKR 20')).toBeInTheDocument()
    expect(screen.getByText('PKR 10')).toBeInTheDocument()
    expect(screen.getByText('Billed every 12 months')).toBeInTheDocument()
    expect(screen.getByText('Billed every month')).toBeInTheDocument()
    expect(screen.getAllByText('Private storage, intelligent search, and a calm workspace are included.')).toHaveLength(2)
    expect(screen.getByLabelText('4 GB secure storage')).toBeInTheDocument()
    expect(screen.getByLabelText('2 GB secure storage')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Sign in to choose' })).toHaveLength(2)
  })

  it('offers a retry when public plans cannot be loaded', () => {
    const refetch = vi.fn()
    mockedUsePublicStoragePlans.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof usePublicStoragePlans>)

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PublicPlansPreview />
      </MemoryRouter>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent("We couldn't load the available storage plans right now.")
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
