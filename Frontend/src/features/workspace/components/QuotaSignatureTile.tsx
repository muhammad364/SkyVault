import { AlertTriangle, ArrowRight, Database, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { QuotaVisual } from '@/features/subscriptions/components/QuotaVisual'
import { useStorageQuota } from '@/features/subscriptions/hooks/useStorageQuota'
import {
  boundedQuotaPercentage,
  getQuotaSignal,
  quotaMeterClass,
} from '@/features/subscriptions/lib/quotaPresentation'
import { formatBytes, formatQuotaPercentage } from '@/lib/formatters'

export function QuotaSignatureTile() {
  const quota = useStorageQuota()

  if (quota.isPending) {
    return (
      <section
        className="grid min-h-96 gap-6 rounded-xl bg-card p-6 shadow-float md:col-span-2 md:grid-cols-2 md:p-8 lg:col-span-3"
        role="status"
        aria-label="Loading your storage overview"
      >
        <div className="flex flex-col gap-6">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="aspect-square w-full" />
      </section>
    )
  }

  if (quota.isError) {
    return (
      <div className="md:col-span-2 lg:col-span-3">
        <ErrorState
          title="Your storage view stayed closed."
          description="We couldn't load the room inside your vault."
          onRetry={() => void quota.refetch()}
        />
      </div>
    )
  }

  const data = quota.data
  const boundedPercentage = boundedQuotaPercentage(data.usagePercentage)
  const signal = getQuotaSignal(data.usagePercentage)
  const SignalIcon =
    data.isOverQuota || !data.canPerformStorageWriteOperations ? AlertTriangle : ShieldCheck

  return (
    <section
      className="grid min-w-0 gap-6 rounded-xl bg-card p-6 shadow-float md:col-span-2 md:grid-cols-[minmax(0,1.15fr)_minmax(12rem,0.85fr)] md:p-8 lg:col-span-3"
      aria-labelledby="workspace-quota-heading"
    >
      <div className="flex min-w-0 flex-col justify-between gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-brand">Your vault</p>
          <h3
            id="workspace-quota-heading"
            className="text-balance font-display text-3xl font-bold text-foreground"
          >
            {data.hasActiveSubscription
              ? `${formatBytes(data.availableStorageBytes)} ready for what comes next.`
              : 'Your vault is waiting for a plan.'}
          </h3>
          <p className="text-pretty text-sm text-secondary-foreground">
            {data.isOverQuota
              ? 'Your vault is over its current allocation. Your existing files remain safe.'
              : data.canPerformStorageWriteOperations
                ? 'Your storage allocation is ready when you need it.'
                : 'Your existing files stay safe, but storage changes need an active plan.'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Used</span>
              <strong className="font-mono text-2xl tabular-nums text-foreground">
                {formatBytes(data.usedStorageBytes)}
              </strong>
            </div>
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {formatQuotaPercentage(data.usagePercentage)}
            </span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full bg-card-muted"
            role="meter"
            aria-label="Workspace storage used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={boundedPercentage}
            aria-valuetext={`${formatBytes(data.usedStorageBytes)} used of ${formatBytes(data.allocatedStorageBytes)}`}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-page ease-vault ${quotaMeterClass(signal)}`}
              style={{ width: `${boundedPercentage}%` }}
            />
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-1 rounded-md bg-card-muted p-4">
              <dt className="text-sm text-muted-foreground">Allocated</dt>
              <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">
                {formatBytes(data.allocatedStorageBytes)}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1 rounded-md bg-card-muted p-4">
              <dt className="text-sm text-muted-foreground">Available</dt>
              <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">
                {formatBytes(data.availableStorageBytes)}
              </dd>
            </div>
          </dl>
          <div className="flex items-start gap-3 rounded-md border border-border p-4 text-sm text-muted-foreground">
            <SignalIcon
              aria-hidden="true"
              className={data.isOverQuota ? 'shrink-0 text-danger' : 'shrink-0 text-primary'}
              size={20}
            />
            <span>
              {data.canPerformStorageWriteOperations
                ? 'Your vault can accept storage changes.'
                : 'Storage write operations are currently paused.'}
            </span>
          </div>
          <Button asChild>
            <Link to={data.hasActiveSubscription ? '/vault/storage/additional' : '/vault/storage'}>
              {data.hasActiveSubscription ? 'Add more storage' : 'Choose a plan'}
              <ArrowRight aria-hidden="true" size={20} />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-sm min-w-0 items-center justify-center">
        {data.hasActiveSubscription ? (
          <QuotaVisual usagePercentage={data.usagePercentage} />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-card-muted p-8">
            <Database aria-hidden="true" className="text-primary" size={48} />
          </div>
        )}
      </div>
    </section>
  )
}
