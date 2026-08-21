import { Database, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdditionalStoragePurchases } from '@/features/subscriptions/hooks/useAdditionalStoragePurchases'
import { formatDate, formatPkr } from '@/lib/formatters'
import { AdditionalStoragePurchaseStatus } from '@/models/additionalStorage/AdditionalStoragePurchaseStatus'

interface PurchaseHistoryProps {
  canPurchaseAdditionalStorage: boolean
}

export function PurchaseHistory({ canPurchaseAdditionalStorage }: PurchaseHistoryProps) {
  const purchases = useAdditionalStoragePurchases()

  if (purchases.isPending) return <Skeleton className="min-h-80 w-full rounded-xl" />
  if (purchases.isError) {
    return (
      <ErrorState
        description="We couldn't load your additional storage history."
        onRetry={() => void purchases.refetch()}
      />
    )
  }

  return (
    <section
      className="flex min-h-80 flex-col gap-6 rounded-xl bg-card p-6 shadow-rest"
      aria-labelledby="purchase-history-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-sm font-semibold text-primary">Additional storage</p>
          <h2
            id="purchase-history-heading"
            className="font-display text-2xl font-bold text-foreground"
          >
            Space you added
          </h2>
        </div>
        <Database aria-hidden="true" className="shrink-0 text-primary" size={24} />
      </div>
      {purchases.data.length === 0 ? (
        <div className="flex flex-1 flex-col items-start justify-between gap-6 rounded-lg bg-card-muted p-6">
          <p className="text-sm text-muted-foreground">
            No additional storage yet. When your vault needs more room, it will appear here.
          </p>
          {canPurchaseAdditionalStorage ? (
            <Button asChild variant="ghost">
              <Link to="/vault/storage/additional">
                <Plus aria-hidden="true" size={18} /> Add storage
              </Link>
            </Button>
          ) : (
            <p className="text-sm font-semibold text-foreground">
              Activate a plan before purchasing additional storage.
            </p>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {purchases.data.map((purchase) => {
            const active = purchase.status === AdditionalStoragePurchaseStatus.Active
            return (
              <li
                key={purchase.additionalStoragePurchaseId}
                className="flex items-center justify-between gap-4 rounded-md bg-card-muted p-4"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <strong className="font-mono text-sm tabular-nums text-foreground">
                    +{purchase.storageAmountGb} GB
                  </strong>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(purchase.purchaseDate)} · {formatPkr(purchase.price)}
                  </span>
                </div>
                <span
                  className={
                    active
                      ? 'rounded-full bg-card px-3 py-1 text-sm font-semibold text-primary'
                      : 'rounded-full bg-accent-amber-soft px-3 py-1 text-sm font-semibold text-foreground'
                  }
                >
                  {active ? 'Active' : 'Inactive'}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
