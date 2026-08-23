import { PackageOpen, Plus } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog } from '@/features/admin/components/AdminConfirmDialog'
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader'
import { AdminPlanDialog } from '@/features/admin/components/AdminPlanDialog'
import {
  AdminSectionError,
  AdminSectionSkeleton,
} from '@/features/admin/components/AdminSectionState'
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge'
import { useSetAdminPlanActive } from '@/features/admin/hooks/useAdminMutations'
import { useAdminPlans } from '@/features/admin/hooks/useAdminQueries'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { formatBillingCycle, formatPkr } from '@/lib/formatters'
import type { StoragePlanResponse } from '@/models/storagePlan/StoragePlanResponse'

export default function AdminPlansPage() {
  const plans = useAdminPlans()
  const setActive = useSetAdminPlanActive()
  const [editing, setEditing] = useState<StoragePlanResponse | 'new' | null>(null)
  const [statusPlan, setStatusPlan] = useState<StoragePlanResponse | null>(null)
  const [actionError, setActionError] = useState('')

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <AdminPageHeader
        eyebrow="Plan management"
        title="The active catalogue."
        description="Create, edit, and deactivate plans returned by the existing catalogue endpoint. Inactive plans are not discoverable through that list contract."
        actions={
          <Button type="button" onClick={() => setEditing('new')}>
            <Plus aria-hidden="true" size={18} /> New plan
          </Button>
        }
      />
      <p className="rounded-md bg-warning-soft p-3 text-sm text-foreground">
        Deactivated plans leave this list. The backend exposes an activation action but no admin
        endpoint that lists inactive plan IDs.
      </p>
      {plans.isPending ? (
        <AdminSectionSkeleton rows={4} />
      ) : plans.isError ? (
        <AdminSectionError
          title="Plans are unavailable."
          description={adminErrorMessage(
            plans.error,
            'Refresh to request the active catalogue again.',
          )}
          retry={() => plans.refetch()}
          retrying={plans.isFetching}
        />
      ) : plans.data.length === 0 ? (
        <EmptyState
          title="No active plans were returned."
          description="Create a plan to add it to the active catalogue."
          illustration={
            <span className="flex min-h-16 min-w-16 items-center justify-center rounded-full bg-card-muted text-primary">
              <PackageOpen aria-hidden="true" size={24} />
            </span>
          }
          actionLabel="Create plan"
          onAction={() => setEditing('new')}
        />
      ) : (
        <section
          className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3"
          aria-label="Storage plans"
        >
          {plans.data.map((plan) => (
            <article
              key={plan.storagePlanId}
              className="min-w-0 overflow-hidden rounded-lg bg-card p-4 shadow-rest"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg font-bold text-foreground">
                    {plan.name}
                  </h2>
                  <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                    {plan.storageSizeGb} GB
                  </p>
                </div>
                <AdminStatusBadge active={plan.isActive} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="min-w-0 rounded-md bg-card-muted p-3">
                  <dt className="text-xs text-muted-foreground">Price</dt>
                  <dd className="mt-1 truncate font-semibold text-foreground">
                    {formatPkr(plan.price)}
                  </dd>
                </div>
                <div className="min-w-0 rounded-md bg-card-muted p-3">
                  <dt className="text-xs text-muted-foreground">Billing</dt>
                  <dd className="mt-1 truncate font-semibold text-foreground">
                    {formatBillingCycle(plan.billingCycle)}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={() => setEditing(plan)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-danger"
                  onClick={() => {
                    setActionError('')
                    setStatusPlan(plan)
                  }}
                >
                  Deactivate
                </Button>
              </div>
            </article>
          ))}
        </section>
      )}
      <AdminPlanDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        plan={editing && editing !== 'new' ? editing : undefined}
      />
      {statusPlan ? (
        <AdminConfirmDialog
          open
          title="Deactivate this plan?"
          description={`${statusPlan.name} will leave the active catalogue. Existing subscription records remain governed by the backend.`}
          confirmLabel="Deactivate plan"
          pendingLabel="Deactivating plan"
          pending={setActive.isPending}
          destructive
          error={actionError}
          onOpenChange={(open) => !open && setStatusPlan(null)}
          onConfirm={() =>
            setActive.mutate(
              { storagePlanId: statusPlan.storagePlanId, active: false },
              {
                onSuccess: () => setStatusPlan(null),
                onError: (error) =>
                  setActionError(
                    adminErrorMessage(error, "We couldn't deactivate this plan right now."),
                  ),
              },
            )
          }
        />
      ) : null}
    </div>
  )
}
