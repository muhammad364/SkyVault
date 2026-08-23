import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useCreateAdminPlan, useSetAdminUserActive } from '@/features/admin/hooks/useAdminMutations'
import { adminService } from '@/features/admin/services/admin.service'
import { queryKeys } from '@/lib/queryKeys'

vi.mock('@/features/admin/services/admin.service', () => ({
  adminService: {
    activateUser: vi.fn(),
    deactivateUser: vi.fn(),
    createPlan: vi.fn(),
  },
}))

describe('admin mutations', () => {
  it('uses the requested status action and invalidates the complete admin read family', async () => {
    const response = {
      userId: 'user-id',
      firstName: 'Ava',
      lastName: 'Stone',
      email: 'ava@example.com',
      isVerified: true,
      isActive: false,
      createdAt: '2026-08-23T00:00:00Z',
    }
    vi.mocked(adminService.deactivateUser).mockResolvedValue(response)
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    })
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    function Wrapper({ children }: PropsWithChildren) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
    const { result } = renderHook(() => useSetAdminUserActive(), { wrapper: Wrapper })

    act(() => result.current.mutate({ userId: 'user-id', active: false }))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(adminService.deactivateUser).toHaveBeenCalledWith('user-id')
    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.admin.all() })
  })

  it('also invalidates the shared storage-plan family after plan management', async () => {
    vi.mocked(adminService.createPlan).mockResolvedValue({
      storagePlanId: 'plan-id',
      name: 'Archive',
      storageSizeGb: 500,
      price: 1200,
      billingCycle: 1,
      isActive: true,
    })
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    })
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    function Wrapper({ children }: PropsWithChildren) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
    const { result } = renderHook(() => useCreateAdminPlan(), { wrapper: Wrapper })

    act(() =>
      result.current.mutate({
        name: 'Archive',
        storageSizeGb: 500,
        price: 1200,
        billingCycle: 1,
        isActive: true,
      }),
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.admin.all() })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.storagePlans.all() })
  })
})
