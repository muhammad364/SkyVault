import { ArrowRight, Database } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { usePublicStoragePlans } from '@/features/marketing/hooks/usePublicStoragePlans'

function billingSummary(billingCycle: number) {
  return billingCycle === 1 ? 'Billed every month' : `Billed every ${billingCycle} months`
}

function formatPlanPrice(price: number) {
  return new Intl.NumberFormat('en-PK', { maximumFractionDigits: 2 }).format(price)
}

function PlansSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading storage plans">
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex flex-col gap-4 rounded-lg bg-card p-6 shadow-rest">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}
    </div>
  )
}

export function PublicPlansPreview() {
  const { data: plans, isPending, isError, refetch } = usePublicStoragePlans()

  return (
    <section id="plans" className="flex flex-col gap-8" aria-labelledby="plans-heading">
      <div className="flex max-w-2xl flex-col gap-3">
        <p className="text-sm font-semibold text-primary">Storage plans</p>
        <h2 id="plans-heading" className="text-balance font-display text-3xl font-bold text-foreground">
          Choose the space that feels right for you.
        </h2>
        <p className="text-pretty text-muted-foreground">Plan availability comes directly from SkyVault. Sign in to choose one for your vault.</p>
      </div>
      {isPending ? <PlansSkeleton /> : null}
      {isError ? (
        <ErrorState description="We couldn't load the available storage plans right now." onRetry={() => void refetch()} />
      ) : null}
      {plans && plans.length === 0 ? (
        <section className="flex flex-col items-center gap-4 rounded-lg bg-card p-8 text-center shadow-rest">
          <Database aria-hidden="true" className="text-primary" size={24} />
          <div className="flex max-w-md flex-col gap-2">
            <h3 className="font-display text-xl font-bold text-foreground">Plans are on their way.</h3>
            <p className="text-sm text-muted-foreground">Create your vault and we’ll help you find the right amount of space.</p>
          </div>
          <Button asChild><Link to="/auth?mode=register">Create your vault</Link></Button>
        </section>
      ) : null}
      {plans && plans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.storagePlanId} className="flex min-w-0 flex-col gap-5 rounded-lg bg-card p-6 shadow-rest transition duration-default ease-vault hover:-translate-y-0.5 hover:shadow-hover motion-reduce:transform-none">
              <div className="flex min-w-0 flex-col gap-2">
                <h3 className="truncate font-display text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="font-mono text-3xl font-bold tabular-nums text-primary">{plan.storageSizeGb} GB</p>
                <p className="font-mono text-lg font-semibold tabular-nums text-foreground">PKR {formatPlanPrice(plan.price)}</p>
                <p className="text-sm text-muted-foreground">{billingSummary(plan.billingCycle)}</p>
              </div>
              <Button asChild className="w-full">
                <Link to="/auth?mode=login">
                  Sign in to choose <ArrowRight aria-hidden="true" size={20} />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
