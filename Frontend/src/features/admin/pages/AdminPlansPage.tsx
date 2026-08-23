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

type PlanStatusFilter = 'all' | 'active' | 'inactive'

export default function AdminPlansPage() {
  const plans = useAdminPlans()
  const setActive = useSetAdminPlanActive()
  const [editing, setEditing] = useState<StoragePlanResponse | 'new' | null>(null)
  const [statusPlan, setStatusPlan] = useState<StoragePlanResponse | null>(null)
  const [actionError, setActionError] = useState('')
  const [statusFilter, setStatusFilter] = useState<PlanStatusFilter>('all')
  const visiblePlans =
    plans.data?.filter(
      (plan) =>
        statusFilter === 'all' || (statusFilter === 'active' ? plan.isActive : !plan.isActive),
    ) ?? []

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <AdminPageHeader
        eyebrow="Plan management"
        title="Storage plan catalogue."
        description="Create and edit plans, or control whether each plan is available to customers."
        actions={
          <Button type="button" onClick={() => setEditing('new')}>
            <Plus aria-hidden="true" size={18} /> New plan
          </Button>
        }
      />
      {plans.isPending ? (
        <AdminSectionSkeleton rows={4} />
      ) : plans.isError ? (
        <AdminSectionError
          title="Plans are unavailable."
          description={adminErrorMessage(
            plans.error,
            'Refresh to request the administrator catalogue again.',
          )}
          retry={() => plans.refetch()}
          retrying={plans.isFetching}
        />
      ) : plans.data.length === 0 ? (
        <EmptyState
          title="No storage plans were returned."
          description="Create a plan to start the customer catalogue."
          illustration={
            <span className="flex min-h-16 min-w-16 items-center justify-center rounded-full bg-card-muted text-primary">
              <PackageOpen aria-hidden="true" size={24} />
            </span>
          }
          actionLabel="Create plan"
          onAction={() => setEditing('new')}
        />
      ) : (
        <>
          <div className="flex flex-col gap-2 rounded-lg bg-card p-3 shadow-rest sm:flex-row sm:items-center sm:justify-between">
            <label className="flex min-w-0 items-center gap-3 text-sm font-semibold text-foreground">
              Status
              <select
                className="min-h-11 min-w-0 rounded-sm border border-border bg-card px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as PlanStatusFilter)}
              >
                <option value="all">All plans</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Showing {visiblePlans.length} of {plans.data.length}
            </p>
          </div>
          {visiblePlans.length === 0 ? (
            <EmptyState
              title={`No ${statusFilter} plans were found.`}
              description="Choose another status filter to see the rest of the catalogue."
              illustration={
                <span className="flex min-h-16 min-w-16 items-center justify-center rounded-full bg-card-muted text-primary">
                  <PackageOpen aria-hidden="true" size={24} />
                </span>
              }
              actionLabel="Show all plans"
              onAction={() => setStatusFilter('all')}
            />
          ) : (
            <section
              className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3"
              aria-label="Storage plans"
            >
              {visiblePlans.map((plan) => (
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
                      className={plan.isActive ? 'text-danger' : 'text-primary'}
                      onClick={() => {
                        setActionError('')
                        setStatusPlan(plan)
                      }}
                    >
                      {plan.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}
      <AdminPlanDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        plan={editing && editing !== 'new' ? editing : undefined}
      />
      {statusPlan ? (
        <AdminConfirmDialog
          open
          title={`${statusPlan.isActive ? 'Deactivate' : 'Activate'} this plan?`}
          description={
            statusPlan.isActive
              ? `${statusPlan.name} will leave the customer catalogue. Existing subscription records remain governed by the backend.`
              : `${statusPlan.name} will become available in the customer catalogue.`
          }
          confirmLabel={`${statusPlan.isActive ? 'Deactivate' : 'Activate'} plan`}
          pendingLabel={`${statusPlan.isActive ? 'Deactivating' : 'Activating'} plan`}
          pending={setActive.isPending}
          destructive={statusPlan.isActive}
          error={actionError}
          onOpenChange={(open) => !open && setStatusPlan(null)}
          onConfirm={() =>
            setActive.mutate(
              { storagePlanId: statusPlan.storagePlanId, active: !statusPlan.isActive },
              {
                onSuccess: () => setStatusPlan(null),
                onError: (error) =>
                  setActionError(
                    adminErrorMessage(
                      error,
                      `We couldn't ${statusPlan.isActive ? 'deactivate' : 'activate'} this plan right now.`,
                    ),
                  ),
              },
            )
          }
        />
      ) : null}
    </div>
  )
}
