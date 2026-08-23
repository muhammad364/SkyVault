import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog } from '@/features/admin/components/AdminConfirmDialog'
import { AdminProviderDialog } from '@/features/admin/components/AdminProviderDialog'
import {
  AdminSectionError,
  AdminSectionSkeleton,
} from '@/features/admin/components/AdminSectionState'
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge'
import { useSetAdminProviderActive } from '@/features/admin/hooks/useAdminMutations'
import { useAdminProviders } from '@/features/admin/hooks/useAdminQueries'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { formatDate } from '@/lib/formatters'
import type { StorageProviderResponse } from '@/models/storageProvider/StorageProvider'

export function AdminProvidersSection() {
  const providers = useAdminProviders()
  const setActive = useSetAdminProviderActive()
  const [editing, setEditing] = useState<StorageProviderResponse | 'new' | null>(null)
  const [statusTarget, setStatusTarget] = useState<StorageProviderResponse | null>(null)
  const [actionError, setActionError] = useState('')

  const changeStatus = () => {
    if (!statusTarget) return
    setActive.mutate(
      { providerId: statusTarget.providerId, active: !statusTarget.isActive },
      {
        onSuccess: () => setStatusTarget(null),
        onError: (error) =>
          setActionError(adminErrorMessage(error, "We couldn't update this provider right now.")),
      },
    )
  }

  return (
    <section className="min-w-0 rounded-lg bg-card p-4 shadow-rest">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Storage providers</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Provider type is fixed after creation by the update DTO.
          </p>
        </div>
        <Button type="button" onClick={() => setEditing('new')}>
          <Plus aria-hidden="true" size={17} /> Add provider
        </Button>
      </div>
      {providers.isPending ? (
        <div className="mt-4">
          <AdminSectionSkeleton rows={2} />
        </div>
      ) : providers.isError ? (
        <div className="mt-4">
          <AdminSectionError
            title="Providers are unavailable."
            description={adminErrorMessage(
              providers.error,
              'Refresh to request storage providers again.',
            )}
            retry={() => providers.refetch()}
            retrying={providers.isFetching}
          />
        </div>
      ) : providers.data.length === 0 ? (
        <p className="mt-4 rounded-md bg-card-muted p-4 text-sm text-muted-foreground">
          No storage providers were returned. Use Add provider to create one.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {providers.data.map((provider) => (
            <article
              key={provider.providerId}
              className="min-w-0 overflow-hidden rounded-md border border-border p-4"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-foreground">{provider.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {provider.providerType} · Added {formatDate(provider.createdAt)}
                  </p>
                </div>
                <AdminStatusBadge active={provider.isActive} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={() => setEditing(provider)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={provider.isActive ? 'text-danger' : undefined}
                  onClick={() => {
                    setActionError('')
                    setStatusTarget(provider)
                  }}
                >
                  {provider.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <AdminProviderDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        provider={editing && editing !== 'new' ? editing : undefined}
      />
      {statusTarget ? (
        <AdminConfirmDialog
          open
          onOpenChange={(open) => !open && setStatusTarget(null)}
          title={`${statusTarget.isActive ? 'Deactivate' : 'Activate'} provider?`}
          description={
            statusTarget.isActive
              ? 'Associated accounts remain configured, but the backend rejects provider-dependent activation and storage work while this provider is inactive.'
              : 'This changes only the provider active flag. Associated accounts keep their own returned status.'
          }
          confirmLabel={statusTarget.isActive ? 'Deactivate' : 'Activate'}
          pendingLabel="Updating provider"
          pending={setActive.isPending}
          destructive={statusTarget.isActive}
          error={actionError}
          onConfirm={changeStatus}
        />
      ) : null}
    </section>
  )
}
