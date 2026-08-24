import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { AdminConfirmDialog } from '@/features/admin/components/AdminConfirmDialog'
import {
  AdminSectionError,
  AdminSectionSkeleton,
} from '@/features/admin/components/AdminSectionState'
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge'
import { AdminStorageAccountDialog } from '@/features/admin/components/AdminStorageAccountDialog'
import { useSetAdminAccountActive } from '@/features/admin/hooks/useAdminMutations'
import { useAdminAccounts, useAdminProviders } from '@/features/admin/hooks/useAdminQueries'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { formatBytes } from '@/lib/formatters'
import type { StorageAccountResponse } from '@/models/storageAccount/StorageAccount'

export function AdminStorageAccountsSection() {
  const providers = useAdminProviders()
  const [filter, setFilter] = useState<boolean | null>(null)
  const accounts = useAdminAccounts(filter)
  const setActive = useSetAdminAccountActive()
  const [editing, setEditing] = useState<StorageAccountResponse | 'new' | null>(null)
  const [statusTarget, setStatusTarget] = useState<StorageAccountResponse | null>(null)
  const [actionError, setActionError] = useState('')

  const changeStatus = () => {
    if (!statusTarget) return
    setActive.mutate(
      { storageAccountId: statusTarget.storageAccountId, active: !statusTarget.isActive },
      {
        onSuccess: () => setStatusTarget(null),
        onError: (error) =>
          setActionError(adminErrorMessage(error, "We couldn't update this account right now.")),
      },
    )
  }

  return (
    <section className="min-w-0 rounded-lg bg-card p-4 shadow-rest">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Storage accounts</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Physical capacity, usage, priority, and provider association.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            id="storage-account-filter"
            aria-label="Filter storage account status"
            value={filter === null ? 'all' : String(filter)}
            onValueChange={(value) => setFilter(value === 'all' ? null : value === 'true')}
            className="w-40"
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
          />
          <Button
            type="button"
            disabled={!providers.data?.some((provider) => provider.isActive)}
            onClick={() => setEditing('new')}
          >
            <Plus aria-hidden="true" size={17} /> Add account
          </Button>
        </div>
      </div>
      {accounts.isPending ? (
        <div className="mt-4">
          <AdminSectionSkeleton rows={3} />
        </div>
      ) : accounts.isError ? (
        <div className="mt-4">
          <AdminSectionError
            title="Storage accounts are unavailable."
            description={adminErrorMessage(
              accounts.error,
              'Refresh to request storage accounts again.',
            )}
            retry={() => accounts.refetch()}
            retrying={accounts.isFetching}
          />
        </div>
      ) : accounts.data.length === 0 ? (
        <p className="mt-4 rounded-md bg-card-muted p-4 text-sm text-muted-foreground">
          No storage accounts match the requested status.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {accounts.data.map((account) => (
            <article
              key={account.storageAccountId}
              className="min-w-0 overflow-hidden rounded-md border border-border p-4"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-foreground">{account.accountName}</h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {account.providerName} · {account.providerType}
                  </p>
                </div>
                <AdminStatusBadge active={account.isActive} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {[
                  ['Capacity', account.totalCapacityBytes],
                  ['Used', account.usedCapacityBytes],
                  ['Available', account.availableCapacityBytes],
                ].map(([label, value]) => (
                  <div key={String(label)} className="min-w-0 rounded-md bg-card-muted p-3">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="mt-1 truncate font-mono font-semibold text-foreground">
                      {formatBytes(Number(value))}
                    </dd>
                  </div>
                ))}
                <div className="min-w-0 rounded-md bg-card-muted p-3">
                  <dt className="text-muted-foreground">Priority</dt>
                  <dd className="mt-1 truncate font-mono font-semibold text-foreground">
                    {account.priority}
                  </dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={() => setEditing(account)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={account.isActive ? 'text-danger' : undefined}
                  onClick={() => {
                    setActionError('')
                    setStatusTarget(account)
                  }}
                >
                  {account.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <AdminStorageAccountDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        account={editing && editing !== 'new' ? editing : undefined}
        providers={providers.data ?? []}
      />
      {statusTarget ? (
        <AdminConfirmDialog
          open
          onOpenChange={(open) => !open && setStatusTarget(null)}
          title={`${statusTarget.isActive ? 'Deactivate' : 'Activate'} storage account?`}
          description="This changes only the explicit active flag for the selected storage account. The backend validates its associated provider."
          confirmLabel={statusTarget.isActive ? 'Deactivate' : 'Activate'}
          pendingLabel="Updating account"
          pending={setActive.isPending}
          destructive={statusTarget.isActive}
          error={actionError}
          onConfirm={changeStatus}
        />
      ) : null}
    </section>
  )
}
