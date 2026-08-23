import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { invalidateVaultReads } from '@/features/files/hooks/vaultInvalidation'
import { queryKeys } from '@/lib/queryKeys'

describe('invalidateVaultReads', () => {
  it('invalidates parameterized search reads after vault mutations', async () => {
    const queryClient = new QueryClient()
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')

    await invalidateVaultReads(queryClient)

    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.search.all() })
  })
})
