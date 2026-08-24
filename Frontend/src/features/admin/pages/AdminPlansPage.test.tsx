import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSetAdminPlanActive } from '@/features/admin/hooks/useAdminMutations'
import { useAdminPlans } from '@/features/admin/hooks/useAdminQueries'
import AdminPlansPage from '@/features/admin/pages/AdminPlansPage'

const mutate = vi.fn()

vi.mock('@/features/admin/hooks/useAdminQueries', () => ({ useAdminPlans: vi.fn() }))
vi.mock('@/features/admin/hooks/useAdminMutations', () => ({ useSetAdminPlanActive: vi.fn() }))
vi.mock('@/features/admin/components/AdminPlanDialog', () => ({ AdminPlanDialog: () => null }))
vi.mock('@/features/admin/components/AdminConfirmDialog', () => ({
  AdminConfirmDialog: ({
    confirmLabel,
    onConfirm,
  }: {
    confirmLabel: string
    onConfirm: () => void
  }) => <button onClick={onConfirm}>Confirm {confirmLabel}</button>,
}))

const plans = [
  {
    storagePlanId: 'active-plan',
    name: 'Active plan',
    storageSizeGb: 10,
    price: 500,
    billingCycle: 1,
    isActive: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    storagePlanId: 'inactive-plan',
    name: 'Archived plan',
    storageSizeGb: 20,
    price: 900,
    billingCycle: 1,
    isActive: false,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
]

describe('AdminPlansPage all-status catalogue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAdminPlans).mockReturnValue({
      data: plans,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useAdminPlans>)
    vi.mocked(useSetAdminPlanActive).mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useSetAdminPlanActive>)
  })
  afterEach(cleanup)

  it('filters inactive plans locally and exposes their activation action', async () => {
    const user = userEvent.setup()
    render(<AdminPlansPage />)
    expect(screen.getByText('Showing 2 of 2')).toBeInTheDocument()

    await user.click(screen.getByRole('combobox', { name: 'Status' }))
    await user.click(screen.getByRole('option', { name: 'Inactive' }))
    expect(screen.queryByText('Active plan')).not.toBeInTheDocument()
    expect(screen.getByText('Archived plan')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Activate' }))
    await user.click(screen.getByRole('button', { name: 'Confirm Activate plan' }))
    expect(mutate).toHaveBeenCalledWith(
      { storagePlanId: 'inactive-plan', active: true },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    )
  })
})
