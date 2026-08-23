import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AdminSectionError,
  AdminSectionSkeleton,
} from '@/features/admin/components/AdminSectionState'
import { useAdminSubscription } from '@/features/admin/hooks/useAdminQueries'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { subscriptionStatusLabel } from '@/features/subscriptions/lib/subscriptionPresentation'
import { formatBillingCycle, formatDate, formatPkr } from '@/lib/formatters'

interface AdminSubscriptionDialogProps {
  subscriptionId: string | null
  onOpenChange: (open: boolean) => void
}

export function AdminSubscriptionDialog({
  subscriptionId,
  onOpenChange,
}: AdminSubscriptionDialogProps) {
  const subscription = useAdminSubscription(subscriptionId)
  return (
    <Dialog open={Boolean(subscriptionId)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscription record</DialogTitle>
          <DialogDescription>
            Exact plan, billing, status, and lifecycle fields returned by the subscription
            controller.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-5">
          {subscription.isPending ? (
            <AdminSectionSkeleton rows={3} />
          ) : subscription.isError ? (
            <AdminSectionError
              title="Subscription is unavailable."
              description={adminErrorMessage(
                subscription.error,
                'Refresh to request this subscription again.',
              )}
              retry={() => subscription.refetch()}
              retrying={subscription.isFetching}
            />
          ) : (
            <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
              {[
                ['Plan', subscription.data.storagePlanName],
                ['Status', subscriptionStatusLabel(subscription.data.status)],
                ['Storage', `${subscription.data.storageSizeGb} GB`],
                ['Price', formatPkr(subscription.data.price)],
                ['Billing', formatBillingCycle(subscription.data.billingCycle)],
                ['Started', formatDate(subscription.data.startDate)],
                ['Ends', formatDate(subscription.data.endDate)],
                ['Grace period ends', formatDate(subscription.data.gracePeriodEndDate)],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 rounded-md bg-card-muted p-3">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-foreground">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
