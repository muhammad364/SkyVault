import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  useAdminAuditLogs,
  useAdminStatistics,
  useAdminStorageOverview,
} from '@/features/admin/hooks/useAdminQueries'
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage'

vi.mock('@/features/admin/hooks/useAdminQueries')
vi.mock('@/features/admin/components/AdminDashboardCharts', () => ({
  SystemActivityChart: () => <div>System activity chart</div>,
  StorageCapacityChart: () => <div>Storage capacity chart</div>,
}))

afterEach(cleanup)

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    vi.mocked(useAdminStatistics).mockReturnValue({
      data: {
        totalUsers: 12,
        activeUsers: 9,
        totalStoragePlans: 4,
        activeStoragePlans: 3,
        totalSubscriptions: 8,
        activeSubscriptions: 6,
      },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useAdminStatistics>)
    vi.mocked(useAdminStorageOverview).mockReturnValue({
      data: {
        totalPhysicalCapacityBytes: 4096,
        totalAllocatedBytes: 3072,
        totalUsedBytes: 2048,
        totalAvailableBytes: 1024,
      },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useAdminStorageOverview>)
    vi.mocked(useAdminAuditLogs).mockReturnValue({
      data: [
        {
          auditLogId: 'audit-id',
          administratorId: 'admin-id',
          administratorEmail: 'admin@example.com',
          action: 'UserActivated',
          entityType: 'User',
          entityId: 'user-id',
          description: 'Administrator activated a user account.',
          createdAt: new Date().toISOString(),
        },
      ],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useAdminAuditLogs>)
  })

  it('renders only API-backed system, storage, and audit facts', () => {
    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('9 active')).toBeInTheDocument()
    expect(screen.getByText('System activity chart')).toBeInTheDocument()
    expect(screen.getByText('Storage capacity chart')).toBeInTheDocument()
    expect(screen.getByText('UserActivated')).toBeInTheDocument()
    expect(screen.queryByText(/revenue/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/growth/i)).not.toBeInTheDocument()
  })

  it('keeps storage available when the statistics request fails', () => {
    vi.mocked(useAdminStatistics).mockReturnValue({
      isPending: false,
      isError: true,
      error: new Error('failure'),
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useAdminStatistics>)
    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('System statistics are unavailable.')).toBeInTheDocument()
    expect(screen.getByText('Storage capacity chart')).toBeInTheDocument()
  })
})
