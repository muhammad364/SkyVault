import { ArrowRight, Database } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PlansSkeleton } from '@/features/marketing/components/PlansSkeleton'
import { StoragePlanGraphic } from '@/features/marketing/components/StoragePlanGraphic'
import { usePublicStoragePlans } from '@/features/marketing/hooks/usePublicStoragePlans'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function billingSummary(billingCycle: number) {
  return billingCycle === 1 ? 'Billed every month' : `Billed every ${billingCycle} months`
}

function billingValue(billingCycle: number) {
  return billingCycle === 1 ? 'Monthly' : `${billingCycle} months`
}

function formatPlanPrice(price: number) {
  return new Intl.NumberFormat('en-PK', { maximumFractionDigits: 2 }).format(price)
}

export function PublicPlansPreview() {
  const { data: plans, isPending, isError, refetch } = usePublicStoragePlans()
  const reducedMotion = useReducedMotion()

  return (
    <section id="plans" className="flex scroll-mt-32 flex-col gap-8" aria-labelledby="plans-heading">
      <div className="flex max-w-2xl flex-col gap-3">
        <p className="text-sm font-semibold text-primary">Storage plans</p>
        <h2 id="plans-heading" className="text-balance font-display text-3xl font-bold text-foreground">
          Choose the space that feels right for you.
        </h2>
        <p className="text-pretty text-muted-foreground">
          Plan availability comes directly from SkyVault. Sign in to choose one for your vault.
        </p>
      </div>
      {isPending ? <PlansSkeleton /> : null}
      {isError ? (
        <ErrorState
          description="We couldn't load the available storage plans right now."
          onRetry={() => void refetch()}
        />
      ) : null}
      {plans && plans.length === 0 ? (
        <section className="rounded-lg bg-card p-8 text-center shadow-rest">
          <div className="flex flex-col items-center gap-4">
            <Database aria-hidden="true" className="text-primary" size={24} />
            <div className="flex max-w-md flex-col gap-2">
              <h3 className="font-display text-xl font-bold text-foreground">Plans are on their way.</h3>
              <p className="text-sm text-muted-foreground">
                Create your vault and we'll help you find the right amount of space.
              </p>
            </div>
            <Button asChild>
              <Link to="/auth/register">Create your vault</Link>
            </Button>
          </div>
        </section>
      ) : null}
      {plans && plans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.storagePlanId}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: reducedMotion ? 0 : 0.24, delay: reducedMotion ? 0 : index * 0.04 }}
              className="min-w-0 rounded-lg bg-card p-6 shadow-rest transition duration-default ease-vault hover:-translate-y-0.5 hover:shadow-hover focus-within:-translate-y-0.5 focus-within:shadow-hover motion-reduce:transform-none"
            >
              <div className="flex min-h-full flex-col gap-5">
                <StoragePlanGraphic storageSizeGb={plan.storageSizeGb} />
                <div className="flex min-w-0 flex-col gap-3">
                  <p className="text-sm font-semibold text-primary">Storage plan</p>
                  <h3 className="truncate font-display text-2xl font-bold text-foreground">{plan.name}</h3>
                </div>
                <dl className="grid grid-cols-2 gap-4">
                  <div className="min-w-0 rounded-md bg-card-muted p-4">
                    <div className="flex flex-col gap-1">
                      <dt className="text-sm font-medium text-muted-foreground">Storage</dt>
                      <dd className="font-mono text-xl font-bold tabular-nums text-primary">{plan.storageSizeGb} GB</dd>
                    </div>
                  </div>
                  <div className="min-w-0 rounded-md bg-card-muted p-4">
                    <div className="flex flex-col gap-1">
                      <dt className="text-sm font-medium text-muted-foreground">Billing</dt>
                      <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">
                        {billingValue(plan.billingCycle)}
                      </dd>
                    </div>
                  </div>
                </dl>
                <div className="border-t border-border pt-4">
                  <div className="flex flex-col gap-1">
                    <p className="font-mono text-2xl font-bold tabular-nums text-foreground">
                      PKR {formatPlanPrice(plan.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">{billingSummary(plan.billingCycle)}</p>
                  </div>
                </div>
                <p className="text-pretty text-sm text-muted-foreground">
                  Private storage, intelligent search, and a calm workspace are included.
                </p>
                <Button asChild className="w-full">
                  <Link to="/auth/login">
                    Sign in to choose <ArrowRight aria-hidden="true" size={20} />
                  </Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
