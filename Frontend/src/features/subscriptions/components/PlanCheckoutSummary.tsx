import { Database } from 'lucide-react'
import { formatBillingCycle, formatPkr } from '@/lib/formatters'

interface PlanCheckoutSummaryProps {
  name: string
  storageSizeGb: number
  price: number
  billingCycle: number
}

export function PlanCheckoutSummary({
  name,
  storageSizeGb,
  price,
  billingCycle,
}: PlanCheckoutSummaryProps) {
  return (
    <div className="flex flex-col gap-6">
      <span className="flex min-h-12 min-w-12 items-center justify-center self-start rounded-md bg-card text-primary shadow-rest">
        <Database aria-hidden="true" size={24} />
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-sm font-semibold text-primary">Your selection</p>
        <h3 className="truncate font-display text-2xl font-bold text-foreground">{name}</h3>
      </div>
      <dl className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <dt className="text-sm text-muted-foreground">Storage</dt>
          <dd className="font-mono font-semibold tabular-nums text-foreground">
            {storageSizeGb} GB
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <dt className="text-sm text-muted-foreground">Billing</dt>
          <dd className="text-sm font-semibold text-foreground">
            {formatBillingCycle(billingCycle)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-muted-foreground">Price</dt>
          <dd className="font-mono font-semibold tabular-nums text-foreground">
            {formatPkr(price)}
          </dd>
        </div>
      </dl>
      <p className="text-sm text-muted-foreground">
        The server verifies this amount from the selected plan. It cannot be changed here.
      </p>
    </div>
  )
}
