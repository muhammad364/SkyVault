import { AlertTriangle, ArrowRight, Database, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { QuotaVisual } from '@/features/subscriptions/components/QuotaVisual'
import { formatBytes, formatQuotaPercentage } from '@/lib/formatters'
import type { StorageQuotaResponse } from '@/models/storage/StorageQuotaResponse'
import {
  boundedQuotaPercentage,
  getQuotaSignal,
  quotaMeterClass,
} from '@/features/subscriptions/lib/quotaPresentation'

interface QuotaCardProps {
  quota: StorageQuotaResponse
}

export function QuotaCard({ quota }: QuotaCardProps) {
  const boundedPercentage = boundedQuotaPercentage(quota.usagePercentage)
  const signalClass = quotaMeterClass(getQuotaSignal(quota.usagePercentage))
  const SignalIcon =
    quota.isOverQuota || !quota.canPerformStorageWriteOperations ? AlertTriangle : ShieldCheck

  return (
    <section
      className="grid min-w-0 gap-6 rounded-xl bg-card p-6 shadow-float md:p-8 xl:grid-cols-[minmax(0,1fr)_minmax(14rem,0.7fr)]"
      aria-labelledby="quota-heading"
    >
      <div className="flex min-w-0 flex-col justify-between gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-brand">Your storage allocation</p>
          <h2
            id="quota-heading"
            className="text-balance font-display text-3xl font-bold text-foreground"
          >
            {quota.hasActiveSubscription
              ? `${formatBytes(quota.availableStorageBytes)} ready for what comes next.`
              : 'Your vault is waiting for a plan.'}
          </h2>
          <p className="text-pretty text-sm text-secondary-foreground">
            {quota.isOverQuota
              ? 'Your vault is over its current allocation. Add space or choose a larger plan before storing anything new.'
              : quota.canPerformStorageWriteOperations
                ? 'Your allocation updates as your files and additional storage change.'
                : 'Your existing files stay safe, but storing or changing files needs an active subscription.'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Used</span>
              <strong className="font-mono text-2xl tabular-nums text-foreground">
                {formatBytes(quota.usedStorageBytes)}
              </strong>
            </div>
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {formatQuotaPercentage(quota.usagePercentage)}
            </span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full bg-card-muted"
            role="meter"
            aria-label="Storage used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={boundedPercentage}
            aria-valuetext={`${formatBytes(quota.usedStorageBytes)} used of ${formatBytes(quota.allocatedStorageBytes)}`}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-page ease-vault ${signalClass}`}
              style={{ width: `${boundedPercentage}%` }}
            />
          </div>
          <dl className="grid gap-3 sm:grid-cols-3">
            {[
              ['Allocated', quota.allocatedStorageBytes],
              ['Used', quota.usedStorageBytes],
              ['Available', quota.availableStorageBytes],
            ].map(([label, value]) => (
              <div key={label} className="flex min-w-0 flex-col gap-1 rounded-md bg-card-muted p-4">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">
                  {formatBytes(value as number)}
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex items-start gap-3 rounded-md border border-border p-4 text-sm text-muted-foreground">
            <SignalIcon
              aria-hidden="true"
              className={quota.isOverQuota ? 'shrink-0 text-danger' : 'shrink-0 text-primary'}
              size={20}
            />
            <span>
              {quota.canPerformStorageWriteOperations
                ? 'Your vault can accept new files.'
                : 'Storage write operations are currently paused.'}
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {quota.hasActiveSubscription ? (
              <Button asChild>
                <Link to="/vault/storage/additional">
                  Add more storage <ArrowRight aria-hidden="true" size={20} />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <a href="#storage-plans">
                  Choose a plan <ArrowRight aria-hidden="true" size={20} />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div
        className="mx-auto flex w-full max-w-sm min-w-0 items-center justify-center xl:max-w-none"
        aria-hidden={!quota.hasActiveSubscription}
      >
        {quota.hasActiveSubscription ? (
          <QuotaVisual usagePercentage={quota.usagePercentage} />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-card-muted p-8">
            <Database aria-hidden="true" className="text-primary" size={48} />
          </div>
        )}
      </div>
    </section>
  )
}
