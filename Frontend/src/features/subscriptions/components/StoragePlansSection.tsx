import { ArrowRight, Database, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { appConfig } from '@/app/config'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { useStoragePlans } from '@/features/subscriptions/hooks/useStoragePlans'
import { formatBillingCycle, formatPkr } from '@/lib/formatters'

export function StoragePlansSection() {
  const plans = useStoragePlans()

  return (
    <section
      id="storage-plans"
      className="flex scroll-mt-8 flex-col gap-6"
      aria-labelledby="storage-plans-heading"
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <p className="text-sm font-semibold text-primary">Storage plans</p>
        <h2
          id="storage-plans-heading"
          className="text-balance font-display text-3xl font-bold text-foreground"
        >
          Choose room for the life inside your vault.
        </h2>
        <p className="text-pretty text-sm text-muted-foreground">
          Every plan and price below comes directly from SkyVault.
        </p>
      </div>
      {plans.isPending ? (
        <div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          aria-label="Loading storage plans"
        >
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="min-h-72 animate-pulse rounded-xl bg-card shadow-rest motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : null}
      {plans.isError ? (
        <ErrorState
          description="We couldn't load storage plans."
          onRetry={() => void plans.refetch()}
        />
      ) : null}
      {plans.data?.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-card p-8 text-center shadow-rest">
          <Database aria-hidden="true" className="text-primary" size={32} />
          <div className="flex max-w-md flex-col gap-2">
            <h3 className="font-display text-xl font-bold text-foreground">
              No plans are available yet.
            </h3>
            <p className="text-sm text-muted-foreground">
              Your current files remain safe. Check again when you are ready.
            </p>
          </div>
          <Button onClick={() => void plans.refetch()}>Check again</Button>
        </div>
      ) : null}
      {plans.data && plans.data.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.data.map((plan) => {
            const recommended =
              plan.isActive &&
              appConfig.recommendedStoragePlanId?.toLowerCase() === plan.storagePlanId.toLowerCase()
            return (
              <article
                key={plan.storagePlanId}
                className="flex min-w-0 flex-col justify-between gap-8 rounded-xl bg-card p-6 shadow-rest transition duration-default ease-vault hover:-translate-y-0.5 hover:shadow-hover focus-within:-translate-y-0.5 focus-within:shadow-hover motion-reduce:transform-none"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-col gap-2">
                      <p className="text-sm font-semibold text-primary">Storage plan</p>
                      <h3 className="truncate font-display text-2xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                    </div>
                    {recommended ? (
                      <span className="flex items-center gap-2 rounded-full bg-accent-amber-soft px-3 py-1 text-sm font-semibold text-foreground">
                        <Sparkles aria-hidden="true" size={16} /> Recommended
                      </span>
                    ) : null}
                  </div>
                  <p className="font-mono text-3xl font-bold tabular-nums text-primary">
                    {plan.storageSizeGb} GB
                  </p>
                  <dl className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 rounded-md bg-card-muted p-4">
                      <dt className="text-sm text-muted-foreground">Price</dt>
                      <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">
                        {formatPkr(plan.price)}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1 rounded-md bg-card-muted p-4">
                      <dt className="text-sm text-muted-foreground">Billing</dt>
                      <dd className="text-sm font-semibold text-foreground">
                        {formatBillingCycle(plan.billingCycle)}
                      </dd>
                    </div>
                  </dl>
                </div>
                <Button asChild className="w-full">
                  <Link to={`/vault/storage/subscribe/${plan.storagePlanId}`}>
                    Choose {plan.name} <ArrowRight aria-hidden="true" size={20} />
                  </Link>
                </Button>
              </article>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
