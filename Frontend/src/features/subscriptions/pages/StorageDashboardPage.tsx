import { ErrorState } from '@/components/feedback/ErrorState'
import { CurrentSubscriptionCard } from '@/features/subscriptions/components/CurrentSubscriptionCard'
import { PurchaseHistory } from '@/features/subscriptions/components/PurchaseHistory'
import { QuotaCard } from '@/features/subscriptions/components/QuotaCard'
import { StorageDashboardSkeleton } from '@/features/subscriptions/components/StorageDashboardSkeleton'
import { StoragePlansSection } from '@/features/subscriptions/components/StoragePlansSection'
import { useStorageQuota } from '@/features/subscriptions/hooks/useStorageQuota'

export default function StorageDashboardPage() {
  const quota = useStorageQuota()

  return (
    <div className="flex flex-col gap-8">
      <header className="flex max-w-3xl flex-col gap-3">
        <p className="text-sm font-semibold text-primary">Storage and subscription</p>
        <h2 className="text-balance font-display text-4xl font-bold text-foreground">
          A living view of the room inside your vault.
        </h2>
        <p className="text-pretty text-muted-foreground">
          See what you use, what remains, and how your plan supports your personal workspace.
        </p>
      </header>
      {quota.isPending ? <StorageDashboardSkeleton /> : null}
      {quota.isError ? (
        <ErrorState
          description="We couldn't load your storage allocation."
          onRetry={() => void quota.refetch()}
        />
      ) : null}
      {quota.data ? <QuotaCard quota={quota.data} /> : null}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <CurrentSubscriptionCard />
        <PurchaseHistory
          canPurchaseAdditionalStorage={quota.data?.hasActiveSubscription === true}
        />
      </div>
      <StoragePlansSection />
    </div>
  )
}
