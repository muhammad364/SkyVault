import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import {
  CheckoutFailure,
  CheckoutProcessing,
  CheckoutSuccess,
} from '@/features/subscriptions/components/CheckoutStates'
import { CheckoutShell } from '@/features/subscriptions/components/CheckoutShell'
import { PaymentForm } from '@/features/subscriptions/components/PaymentForm'
import { PlanCheckoutSummary } from '@/features/subscriptions/components/PlanCheckoutSummary'
import { useCurrentSubscription } from '@/features/subscriptions/hooks/useCurrentSubscription'
import { useRenewSubscription } from '@/features/subscriptions/hooks/useRenewSubscription'
import { storageErrorMessage } from '@/features/subscriptions/lib/storageErrorMessage'
import type { PaymentFormValues } from '@/features/subscriptions/validators/payment.schema'
import { formatPkr } from '@/lib/formatters'
import { useNavigate } from 'react-router-dom'

export default function RenewSubscriptionPage() {
  const current = useCurrentSubscription()
  const renew = useRenewSubscription()
  const navigate = useNavigate()

  if (current.isPending) return <PageSkeleton />
  if (current.isError)
    return (
      <ErrorState
        description="We couldn't prepare your renewal."
        onRetry={() => void current.refetch()}
      />
    )
  if (!current.data) {
    return (
      <EmptyState
        title="There is no plan to renew."
        description="Choose a storage plan to open your vault again."
        actionLabel="Back to storage"
        onAction={() => navigate('/vault/storage')}
      />
    )
  }

  if (renew.isPending) return <CheckoutProcessing title="Renewing your storage plan…" />
  if (renew.isSuccess) {
    return (
      <CheckoutSuccess
        title="Your plan is renewed."
        description={`${renew.data.storagePlanName} now continues through your new billing period.`}
      />
    )
  }
  if (renew.isError) {
    return (
      <CheckoutFailure
        description={storageErrorMessage(
          renew.error,
          "We couldn't renew your plan. Check your details and try again.",
        )}
        onRetry={() => renew.reset()}
      />
    )
  }

  const subscription = current.data
  async function handlePayment(payment: PaymentFormValues) {
    try {
      await renew.mutateAsync({ payment })
    } catch {
      // The mutation state renders the normalized failure screen.
    }
  }

  return (
    <CheckoutShell
      eyebrow="Plan renewal"
      title="Keep your vault active."
      description="Renew the plan already connected to your files. SkyVault verifies the price before processing."
      summary={
        <PlanCheckoutSummary
          name={subscription.storagePlanName}
          storageSizeGb={subscription.storageSizeGb}
          price={subscription.price}
          billingCycle={subscription.billingCycle}
        />
      }
    >
      <PaymentForm
        amountLabel="Renewal price"
        amountValue={formatPkr(subscription.price)}
        submitLabel="Renew my plan"
        onSubmit={handlePayment}
      />
    </CheckoutShell>
  )
}
