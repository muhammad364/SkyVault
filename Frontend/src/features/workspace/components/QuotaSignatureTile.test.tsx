import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useStorageQuota } from '@/features/subscriptions/hooks/useStorageQuota'
import { QuotaSignatureTile } from '@/features/workspace/components/QuotaSignatureTile'

vi.mock('@/features/subscriptions/hooks/useStorageQuota')
vi.mock('@/features/subscriptions/components/QuotaVisual', () => ({
  QuotaVisual: ({ usagePercentage }: { usagePercentage: number }) => (
    <div>Quota visual {usagePercentage}</div>
  ),
}))

const quota = {
  allocatedStorageBytes: 100 * 1024 ** 3,
  usedStorageBytes: 80 * 1024 ** 3,
  availableStorageBytes: 20 * 1024 ** 3,
  usagePercentage: 80,
  hasActiveSubscription: true,
  canPerformStorageWriteOperations: true,
  isOverQuota: false,
}

function renderTile() {
  return render(
    <MemoryRouter>
      <QuotaSignatureTile />
    </MemoryRouter>,
  )
}

describe('QuotaSignatureTile', () => {
  const refetch = vi.fn()

  beforeEach(() => refetch.mockReset())
  afterEach(cleanup)

  it('renders independent loading and retry states', () => {
    vi.mocked(useStorageQuota).mockReturnValue({ isPending: true } as ReturnType<
      typeof useStorageQuota
    >)
    const view = renderTile()
    expect(
      screen.getByRole('status', { name: 'Loading your storage overview' }),
    ).toBeInTheDocument()
    view.unmount()

    vi.mocked(useStorageQuota).mockReturnValue({
      isPending: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useStorageQuota>)
    renderTile()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('uses API quota values and the shared warning threshold', () => {
    vi.mocked(useStorageQuota).mockReturnValue({
      isPending: false,
      isError: false,
      data: quota,
    } as ReturnType<typeof useStorageQuota>)
    renderTile()

    const meter = screen.getByRole('meter', { name: 'Workspace storage used' })
    expect(meter).toHaveAttribute('aria-valuenow', '80')
    expect(meter.firstElementChild).toHaveClass('bg-warning-strong')
    expect(screen.getByText('20 GB ready for what comes next.')).toBeInTheDocument()
    expect(screen.getByText('Quota visual 80')).toBeInTheDocument()
  })

  it('uses the critical threshold and backend over-quota state', () => {
    vi.mocked(useStorageQuota).mockReturnValue({
      isPending: false,
      isError: false,
      data: { ...quota, usagePercentage: 95, availableStorageBytes: 0, isOverQuota: true },
    } as ReturnType<typeof useStorageQuota>)
    renderTile()

    expect(screen.getByRole('meter').firstElementChild).toHaveClass('bg-danger')
    expect(screen.getByText(/over its current allocation/i)).toBeInTheDocument()
  })

  it('renders the no-subscription empty state with a working storage route', () => {
    vi.mocked(useStorageQuota).mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        allocatedStorageBytes: 0,
        usedStorageBytes: 0,
        availableStorageBytes: 0,
        usagePercentage: 0,
        hasActiveSubscription: false,
        canPerformStorageWriteOperations: false,
        isOverQuota: false,
      },
    } as ReturnType<typeof useStorageQuota>)
    renderTile()

    expect(screen.getByText('Your vault is waiting for a plan.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /choose a plan/i })).toHaveAttribute(
      'href',
      '/vault/storage',
    )
  })
})
