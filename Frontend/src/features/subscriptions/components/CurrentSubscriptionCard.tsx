import { ArrowRight, CalendarClock, CreditCard, RefreshCw, ShieldOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { useCancelSubscription } from '@/features/subscriptions/hooks/useCancelSubscription'
import { useCurrentSubscription } from '@/features/subscriptions/hooks/useCurrentSubscription'
import {
  isActiveSubscription,
  subscriptionStatusLabel,
} from '@/features/subscriptions/lib/subscriptionPresentation'
import { storageErrorMessage } from '@/features/subscriptions/lib/storageErrorMessage'
import { formatBillingCycle, formatDate, formatPkr } from '@/lib/formatters'

export function CurrentSubscriptionCard() {
  const subscription = useCurrentSubscription()
  const cancelSubscription = useCancelSubscription()
  const [dialogOpen, setDialogOpen] = useState(false)

  if (subscription.isPending) return <Skeleton className="min-h-80 w-full rounded-xl" />
  if (subscription.isError) {
    return (
      <ErrorState
        description="We couldn't load your current plan."
        onRetry={() => void subscription.refetch()}
      />
    )
  }

  if (!subscription.data) {
    return (
      <section
        className="flex min-h-80 flex-col justify-between gap-8 rounded-xl bg-card p-6 shadow-rest"
        aria-labelledby="current-plan-heading"
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-primary">Current plan</p>
          <h2 id="current-plan-heading" className="font-display text-2xl font-bold text-foreground">
            No plan yet
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose the space that suits your vault and activate it with one secure payment.
          </p>
        </div>
        <Button asChild>
          <a href="#storage-plans">
            Explore plans <ArrowRight aria-hidden="true" size={20} />
          </a>
        </Button>
      </section>
    )
  }

  const current = subscription.data
  const active = isActiveSubscription(current.status)

  async function handleCancel() {
    try {
      await cancelSubscription.mutateAsync()
      setDialogOpen(false)
      toast.success('Your subscription has been cancelled. Your files are still safe.')
    } catch {
      // The dialog keeps the safe, normalized error visible for retry.
    }
  }

  return (
    <section
      className="flex min-h-80 flex-col justify-between gap-8 rounded-xl bg-card p-6 shadow-rest"
      aria-labelledby="current-plan-heading"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-sm font-semibold text-primary">Current plan</p>
            <h2
              id="current-plan-heading"
              className="truncate font-display text-2xl font-bold text-foreground"
            >
              {current.storagePlanName}
            </h2>
          </div>
          <span
            className={
              active
                ? 'rounded-full bg-card-muted px-3 py-1 text-sm font-semibold text-primary'
                : 'rounded-full bg-accent-amber-soft px-3 py-1 text-sm font-semibold text-foreground'
            }
          >
            {subscriptionStatusLabel(current.status)}
          </span>
        </div>
        <dl className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 rounded-md bg-card-muted p-4">
            <dt className="text-sm text-muted-foreground">Plan storage</dt>
            <dd className="font-mono font-semibold tabular-nums text-foreground">
              {current.storageSizeGb} GB
            </dd>
          </div>
          <div className="flex flex-col gap-1 rounded-md bg-card-muted p-4">
            <dt className="text-sm text-muted-foreground">Price</dt>
            <dd className="font-mono font-semibold tabular-nums text-foreground">
              {formatPkr(current.price)}
            </dd>
          </div>
          <div className="flex flex-col gap-1 rounded-md bg-card-muted p-4">
            <dt className="text-sm text-muted-foreground">Billing</dt>
            <dd className="text-sm font-semibold text-foreground">
              {formatBillingCycle(current.billingCycle)}
            </dd>
          </div>
          <div className="flex flex-col gap-1 rounded-md bg-card-muted p-4">
            <dt className="text-sm text-muted-foreground">{active ? 'Renews through' : 'Ended'}</dt>
            <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">
              {formatDate(current.endDate)}
            </dd>
          </div>
        </dl>
        {!active && current.gracePeriodEndDate ? (
          <div className="flex items-start gap-3 rounded-md bg-accent-amber-soft p-4 text-sm text-foreground">
            <CalendarClock aria-hidden="true" className="shrink-0 text-accent-amber" size={20} />
            <span>
              Renew by {formatDate(current.gracePeriodEndDate)} to reactivate this plan and your
              additional storage.
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button asChild>
          <Link to="/vault/storage/renew">
            <RefreshCw aria-hidden="true" size={18} /> Renew
          </Link>
        </Button>
        {active ? (
          <Button asChild variant="ghost">
            <Link to="/vault/storage/additional">
              <CreditCard aria-hidden="true" size={18} /> Add storage
            </Link>
          </Button>
        ) : null}
        <Button asChild variant="ghost">
          <a href="#storage-plans">Change plan</a>
        </Button>
        {active ? (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <ShieldOff aria-hidden="true" size={18} /> Cancel plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel your storage plan?</DialogTitle>
                <DialogDescription>
                  New uploads and storage changes will stop immediately, and additional storage
                  becomes inactive. Your existing files remain available to view and download.
                </DialogDescription>
              </DialogHeader>
              {cancelSubscription.isError ? (
                <p className="pt-4 text-sm text-accent-coral" role="alert">
                  {storageErrorMessage(
                    cancelSubscription.error,
                    "We couldn't cancel your plan. Nothing was changed.",
                  )}
                </p>
              ) : null}
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" disabled={cancelSubscription.isPending}>
                    Keep my plan
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  disabled={cancelSubscription.isPending}
                  onClick={() => void handleCancel()}
                >
                  {cancelSubscription.isPending ? 'Cancelling plan' : 'Yes, cancel my plan'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
    </section>
  )
}
