import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAdminStatistics } from '@/features/admin/hooks/useAdminQueries'
import { adminService } from '@/features/admin/services/admin.service'
import { queryKeys } from '@/lib/queryKeys'

vi.mock('@/features/admin/services/admin.service', () => ({
  adminService: { getStatistics: vi.fn() },
}))

afterEach(cleanup)

describe('admin query hooks', () => {
  it('uses the stable admin query key and aborts the forwarded signal on unmount', async () => {
    let observedSignal: AbortSignal | undefined
    vi.mocked(adminService.getStatistics).mockImplementation(
      (signal) =>
        new Promise(() => {
          observedSignal = signal
        }),
    )
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    function Wrapper({ children }: PropsWithChildren) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
    function Probe() {
      useAdminStatistics()
      return null
    }

    const view = render(<Probe />, { wrapper: Wrapper })
    await waitFor(() => expect(observedSignal).toBeDefined())
    expect(queryClient.getQueryState(queryKeys.admin.statistics())).toBeDefined()
    view.unmount()
    expect(observedSignal?.aborted).toBe(true)
  })
})
