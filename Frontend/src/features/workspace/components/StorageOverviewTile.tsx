import { ArrowRight, HardDrive, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { QuotaVisual } from '@/features/subscriptions/components/QuotaVisual'
import { useCurrentSubscription } from '@/features/subscriptions/hooks/useCurrentSubscription'
import { useStorageQuota } from '@/features/subscriptions/hooks/useStorageQuota'
import {
  boundedQuotaPercentage,
  getQuotaSignal,
  quotaMeterClass,
} from '@/features/subscriptions/lib/quotaPresentation'
import { subscriptionStatusLabel } from '@/features/subscriptions/lib/subscriptionPresentation'
import {
  formatBillingCycle,
  formatBytes,
  formatDate,
  formatQuotaPercentage,
} from '@/lib/formatters'

export function StorageOverviewTile() {
  const quota = useStorageQuota()
  const subscription = useCurrentSubscription()

  return (
    <section
      className="grid min-w-0 gap-5 rounded-xl bg-card p-5 shadow-rest md:grid-cols-[minmax(0,1fr)_minmax(13rem,0.55fr)] lg:col-span-4"
      aria-labelledby="storage-overview-heading"
    >
      <div className="grid min-w-0 gap-5 md:grid-cols-2">
        <div className="min-w-0">
          <div className="mb-4">
            <p className="text-xs font-semibold text-brand">Storage overview</p>
            <h3
              id="storage-overview-heading"
              className="font-display text-xl font-bold text-foreground"
            >
              Space and plan, together
            </h3>
          </div>
          {quota.isPending ? (
            <div className="grid gap-3" role="status" aria-label="Loading storage quota">
              <Skeleton className="h-8" />
              <Skeleton className="h-2" />
              <Skeleton className="h-16" />
            </div>
          ) : quota.isError ? (
            <div className="rounded-lg bg-danger-soft p-4 text-sm text-danger" role="alert">
              <p>Your quota stayed out of view.</p>
              <Button
                variant="ghost"
                className="mt-2 px-3 text-danger"
                onClick={() => void quota.refetch()}
              >
                <RotateCcw size={16} /> Retry quota
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              <div className="flex items-end justify-between gap-3">
                <strong className="font-mono text-lg tabular-nums text-foreground">
                  {formatBytes(quota.data.usedStorageBytes)} used
                </strong>
                <span className="font-mono text-sm text-muted-foreground">
                  {formatQuotaPercentage(quota.data.usagePercentage)}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-card-muted"
                role="meter"
                aria-label="Workspace storage used"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={boundedQuotaPercentage(quota.data.usagePercentage)}
                aria-valuetext={`${formatBytes(quota.data.usedStorageBytes)} used of ${formatBytes(quota.data.allocatedStorageBytes)}`}
              >
                <div
                  className={`h-full rounded-full ${quotaMeterClass(getQuotaSignal(quota.data.usagePercentage))}`}
                  style={{ width: `${boundedQuotaPercentage(quota.data.usagePercentage)}%` }}
                />
              </div>
              <dl className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-card-muted p-3">
                  <dt className="text-xs text-muted-foreground">Allocated</dt>
                  <dd className="font-mono text-sm font-semibold text-foreground">
                    {formatBytes(quota.data.allocatedStorageBytes)}
                  </dd>
                </div>
                <div className="rounded-md bg-card-muted p-3">
                  <dt className="text-xs text-muted-foreground">Available</dt>
                  <dd className="font-mono text-sm font-semibold text-foreground">
                    {formatBytes(quota.data.availableStorageBytes)}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
        <div className="min-w-0 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
          <p className="mb-3 text-xs font-semibold text-brand">Current plan</p>
          {subscription.isPending ? (
            <div className="grid gap-3" role="status" aria-label="Loading current plan">
              <Skeleton className="h-8" />
              <Skeleton className="h-16" />
              <Skeleton className="h-5" />
            </div>
          ) : subscription.isError ? (
            <div className="rounded-lg bg-danger-soft p-4 text-sm text-danger" role="alert">
              <p>Your plan stayed out of view.</p>
              <Button
                variant="ghost"
                className="mt-2 px-3 text-danger"
                onClick={() => void subscription.refetch()}
              >
                <RotateCcw size={16} /> Retry plan
              </Button>
            </div>
          ) : !subscription.data ? (
            <div className="grid gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card-muted text-primary">
                <HardDrive aria-hidden="true" size={20} />
              </span>
              <p className="font-display text-lg font-bold text-foreground">No plan yet</p>
              <p className="text-sm text-muted-foreground">Storage writes need an active plan.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-3">
                <p className="truncate font-display text-lg font-bold text-foreground">
                  {subscription.data.storagePlanName}
                </p>
                <span className="rounded-full bg-card-muted px-2.5 py-1 text-xs font-semibold text-primary">
                  {subscriptionStatusLabel(subscription.data.status)}
                </span>
              </div>
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Capacity</dt>
                  <dd className="font-mono font-semibold text-foreground">
                    {subscription.data.storageSizeGb} GB
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Billing</dt>
                  <dd className="font-semibold text-foreground">
                    {formatBillingCycle(subscription.data.billingCycle)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Period ends</dt>
                  <dd className="font-semibold text-foreground">
                    <time dateTime={subscription.data.endDate}>
                      {formatDate(subscription.data.endDate)}
                    </time>
                  </dd>
                </div>
              </dl>
            </div>
          )}
          <Link
            className="mt-4 flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-primary hover:underline"
            to="/vault/storage"
          >
            Manage storage <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
      <div className="mx-auto w-full max-w-44 self-center">
        {quota.data?.hasActiveSubscription ? (
          <QuotaVisual usagePercentage={quota.data.usagePercentage} />
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-lg bg-card-muted">
            <HardDrive className="text-primary" aria-hidden="true" size={40} />
          </div>
        )}
      </div>
    </section>
  )
}
