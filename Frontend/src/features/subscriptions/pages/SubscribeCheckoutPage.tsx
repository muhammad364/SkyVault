import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
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
import { useStoragePlan } from '@/features/subscriptions/hooks/useStoragePlan'
import { useSubscribe } from '@/features/subscriptions/hooks/useSubscribe'
import { isActiveSubscription } from '@/features/subscriptions/lib/subscriptionPresentation'
import { storageErrorMessage } from '@/features/subscriptions/lib/storageErrorMessage'
import type { PaymentFormValues } from '@/features/subscriptions/validators/payment.schema'
import { formatPkr } from '@/lib/formatters'

export default function SubscribeCheckoutPage() {
  const { storagePlanId = '' } = useParams()
  const navigate = useNavigate()
  const plan = useStoragePlan(storagePlanId)
  const current = useCurrentSubscription()
  const subscribe = useSubscribe()
  const [replacementConfirmed, setReplacementConfirmed] = useState(false)

  if (plan.isPending || current.isPending) return <PageSkeleton />
  if (plan.isError || current.isError) {
    return (
      <ErrorState
        description="We couldn't prepare this plan for checkout."
        onRetry={() => void Promise.all([plan.refetch(), current.refetch()])}
      />
    )
  }
  if (!plan.data || !plan.data.isActive) {
    return (
      <EmptyState
        title="That plan is not available."
        description="Choose another plan that is ready for your vault."
        actionLabel="Back to storage"
        onAction={() => navigate('/vault/storage')}
      />
    )
  }

  const replacesActivePlan = Boolean(current.data && isActiveSubscription(current.data.status))
  const selectedPlan = plan.data

  if (subscribe.isPending) return <CheckoutProcessing title="Activating your storage plan…" />
  if (subscribe.isSuccess) {
    return (
      <CheckoutSuccess
        title={`${subscribe.data.storagePlanName} is active.`}
        description={`${subscribe.data.storageSizeGb} GB is now part of your personal vault.`}
      />
    )
  }
  if (subscribe.isError) {
    return (
      <CheckoutFailure
        description={storageErrorMessage(
          subscribe.error,
          "We couldn't activate this plan. Check your details and try again.",
        )}
        onRetry={() => subscribe.reset()}
      />
    )
  }

  async function handlePayment(payment: PaymentFormValues) {
    try {
      await subscribe.mutateAsync({
        storagePlanId: selectedPlan.storagePlanId,
        replaceExistingSubscription: replacesActivePlan,
        payment,
      })
    } catch {
      // The mutation state renders the normalized failure screen.
    }
  }

  return (
    <CheckoutShell
      eyebrow="Plan checkout"
      title="Give your vault room to grow."
      description="Review the API-provided plan and enter payment details to activate it."
      summary={<PlanCheckoutSummary {...selectedPlan} />}
    >
      <PaymentForm
        amountLabel="Plan price"
        amountValue={formatPkr(selectedPlan.price)}
        submitLabel={replacesActivePlan ? 'Replace and activate plan' : 'Activate plan'}
        submitDisabled={replacesActivePlan && !replacementConfirmed}
        acknowledgement={
          replacesActivePlan ? (
            <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg bg-warning-soft p-4 text-sm text-warning">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 shrink-0 accent-primary"
                checked={replacementConfirmed}
                onChange={(event) => setReplacementConfirmed(event.target.checked)}
              />
              <span>
                I understand this immediately replaces my active {current.data?.storagePlanName}{' '}
                plan.
              </span>
            </label>
          ) : undefined
        }
        onSubmit={handlePayment}
      />
    </CheckoutShell>
  )
}
