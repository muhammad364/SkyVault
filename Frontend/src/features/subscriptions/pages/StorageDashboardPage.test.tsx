import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useStorageQuota } from '@/features/subscriptions/hooks/useStorageQuota'
import StorageDashboardPage from '@/features/subscriptions/pages/StorageDashboardPage'

vi.mock('@/features/subscriptions/hooks/useStorageQuota')
vi.mock('@/features/subscriptions/components/StorageDashboardSkeleton', () => ({
  StorageDashboardSkeleton: () => <div>Storage dashboard loading</div>,
}))
vi.mock('@/features/subscriptions/components/QuotaCard', () => ({
  QuotaCard: () => <div>Quota ready</div>,
}))
vi.mock('@/features/subscriptions/components/CurrentSubscriptionCard', () => ({
  CurrentSubscriptionCard: () => <div>Current subscription</div>,
}))
vi.mock('@/features/subscriptions/components/PurchaseHistory', () => ({
  PurchaseHistory: () => <div>Purchase history</div>,
}))
vi.mock('@/features/subscriptions/components/StoragePlansSection', () => ({
  StoragePlansSection: () => <div>Plan catalogue</div>,
}))

const quota = {
  allocatedStorageBytes: 100,
  usedStorageBytes: 25,
  availableStorageBytes: 75,
  usagePercentage: 25,
  hasActiveSubscription: true,
  canPerformStorageWriteOperations: true,
  isOverQuota: false,
}

describe('StorageDashboardPage states', () => {
  const refetch = vi.fn()

  beforeEach(() => refetch.mockReset())
  afterEach(cleanup)

  it('shows the storage-shaped loading state while quota loads', () => {
    vi.mocked(useStorageQuota).mockReturnValue({
      isPending: true,
      isError: false,
    } as ReturnType<typeof useStorageQuota>)

    render(<StorageDashboardPage />)

    expect(screen.getByText('Storage dashboard loading')).toBeInTheDocument()
    expect(screen.queryByText('Quota ready')).not.toBeInTheDocument()
  })

  it('shows safe retry guidance when quota loading fails', () => {
    vi.mocked(useStorageQuota).mockReturnValue({
      isPending: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useStorageQuota>)

    render(<StorageDashboardPage />)
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    expect(screen.getByText(/couldn't load your storage allocation/i)).toBeInTheDocument()
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('renders API quota and the remaining storage surfaces on success', () => {
    vi.mocked(useStorageQuota).mockReturnValue({
      isPending: false,
      isError: false,
      data: quota,
    } as ReturnType<typeof useStorageQuota>)

    render(<StorageDashboardPage />)

    expect(screen.getByText('Quota ready')).toBeInTheDocument()
    expect(screen.getByText('Current subscription')).toBeInTheDocument()
    expect(screen.getByText('Purchase history')).toBeInTheDocument()
    expect(screen.getByText('Plan catalogue')).toBeInTheDocument()
  })
})
