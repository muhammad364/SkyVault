import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StoragePlansSection } from '@/features/subscriptions/components/StoragePlansSection'
import { useStoragePlans } from '@/features/subscriptions/hooks/useStoragePlans'

const mockConfig = vi.hoisted(() => ({ recommendedStoragePlanId: null as string | null }))

vi.mock('@/app/config', () => ({ appConfig: mockConfig }))
vi.mock('@/features/subscriptions/hooks/useStoragePlans')

const plans = [
  {
    storagePlanId: 'plan-one',
    name: 'Studio Vault',
    storageSizeGb: 250,
    price: 2499,
    billingCycle: 1,
    isActive: true,
  },
  {
    storagePlanId: 'plan-two',
    name: 'Archive Vault',
    storageSizeGb: 1000,
    price: 7499,
    billingCycle: 1,
    isActive: false,
  },
]

function renderPlans() {
  return render(
    <MemoryRouter>
      <StoragePlansSection />
    </MemoryRouter>,
  )
}

describe('StoragePlansSection recommendation', () => {
  beforeEach(() => {
    mockConfig.recommendedStoragePlanId = null
    vi.mocked(useStoragePlans).mockReturnValue({
      isPending: false,
      isError: false,
      data: plans,
    } as ReturnType<typeof useStoragePlans>)
  })
  afterEach(cleanup)

  it('does not fabricate a recommendation when configuration is absent', () => {
    renderPlans()
    expect(screen.queryByText('Recommended')).not.toBeInTheDocument()
  })

  it('labels only an active plan with the matching configured identifier', () => {
    mockConfig.recommendedStoragePlanId = 'PLAN-ONE'
    renderPlans()
    expect(screen.getByText('Recommended')).toBeInTheDocument()
  })

  it('does not label an inactive matching plan', () => {
    mockConfig.recommendedStoragePlanId = 'plan-two'
    renderPlans()
    expect(screen.queryByText('Recommended')).not.toBeInTheDocument()
  })
})
