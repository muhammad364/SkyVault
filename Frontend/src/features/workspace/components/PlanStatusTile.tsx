import { ArrowRight, CalendarClock, HardDrive } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentSubscription } from '@/features/subscriptions/hooks/useCurrentSubscription'
import {
  isActiveSubscription,
  subscriptionStatusLabel,
} from '@/features/subscriptions/lib/subscriptionPresentation'
import { formatBillingCycle, formatDate } from '@/lib/formatters'

export function PlanStatusTile() {
  const subscription = useCurrentSubscription()

  if (subscription.isPending) {
    return (
      <section
        className="flex min-h-64 flex-col gap-4 rounded-xl bg-card p-5 shadow-rest"
        role="status"
        aria-label="Loading your plan status"
      >
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-full rounded-full" />
      </section>
    )
  }

  if (subscription.isError) {
    return (
      <ErrorState
        title="Your plan stayed out of view."
        description="We couldn't load your current plan."
        onRetry={() => void subscription.refetch()}
      />
    )
  }

  if (!subscription.data) {
    return (
      <section
        className="flex min-h-64 flex-col justify-between gap-6 rounded-xl bg-card p-5 shadow-rest"
        aria-labelledby="workspace-plan-heading"
      >
        <div className="flex flex-col gap-3">
          <span className="flex min-h-11 min-w-11 self-start items-center justify-center rounded-full bg-card-muted text-primary">
            <HardDrive aria-hidden="true" size={20} />
          </span>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-brand">Plan status</p>
            <h3
              id="workspace-plan-heading"
              className="font-display text-xl font-bold text-foreground"
            >
              No plan yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose an allocation that gives your vault room to grow.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to="/vault/storage">
            Explore plans <ArrowRight aria-hidden="true" size={20} />
          </Link>
        </Button>
      </section>
    )
  }

  const current = subscription.data
  const active = isActiveSubscription(current.status)

  return (
    <section
      className="flex min-h-64 min-w-0 flex-col justify-between gap-6 rounded-xl bg-card p-5 shadow-rest"
      aria-labelledby="workspace-plan-heading"
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-brand">Plan status</p>
            <h3
              id="workspace-plan-heading"
              className="truncate font-display text-xl font-bold text-foreground"
            >
              {current.storagePlanName}
            </h3>
          </div>
          <span
            className={
              active
                ? 'shrink-0 rounded-full bg-card-muted px-3 py-1 text-sm font-semibold text-primary'
                : 'shrink-0 rounded-full bg-warning-soft px-3 py-1 text-sm font-semibold text-warning'
            }
          >
            {subscriptionStatusLabel(current.status)}
          </span>
        </div>
        <dl className="grid gap-2">
          <div className="flex items-center justify-between gap-3 rounded-md bg-card-muted p-3">
            <dt className="text-sm text-muted-foreground">Storage</dt>
            <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">
              {current.storageSizeGb} GB
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-md bg-card-muted p-3">
            <dt className="text-sm text-muted-foreground">Billing</dt>
            <dd className="text-right text-sm font-semibold text-foreground">
              {formatBillingCycle(current.billingCycle)}
            </dd>
          </div>
        </dl>
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <CalendarClock aria-hidden="true" className="shrink-0 text-primary" size={20} />
          <span>
            Current period ends{' '}
            <time dateTime={current.endDate}>{formatDate(current.endDate)}</time>.
          </span>
        </div>
      </div>
      <Button asChild variant="secondary">
        <Link to="/vault/storage">
          Manage storage <ArrowRight aria-hidden="true" size={20} />
        </Link>
      </Button>
    </section>
  )
}
