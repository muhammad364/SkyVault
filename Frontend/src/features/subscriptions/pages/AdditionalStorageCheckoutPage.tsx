import { Database, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { AdditionalStorageAmountForm } from '@/features/subscriptions/components/AdditionalStorageAmountForm'
import {
  CheckoutFailure,
  CheckoutProcessing,
  CheckoutSuccess,
} from '@/features/subscriptions/components/CheckoutStates'
import { CheckoutShell } from '@/features/subscriptions/components/CheckoutShell'
import { PaymentForm } from '@/features/subscriptions/components/PaymentForm'
import { useAdditionalStorageQuote } from '@/features/subscriptions/hooks/useAdditionalStorageQuote'
import { useCurrentSubscription } from '@/features/subscriptions/hooks/useCurrentSubscription'
import { usePurchaseAdditionalStorage } from '@/features/subscriptions/hooks/usePurchaseAdditionalStorage'
import { isActiveSubscription } from '@/features/subscriptions/lib/subscriptionPresentation'
import { storageErrorMessage } from '@/features/subscriptions/lib/storageErrorMessage'
import type { PaymentFormValues } from '@/features/subscriptions/validators/payment.schema'
import { formatPkr } from '@/lib/formatters'

export default function AdditionalStorageCheckoutPage() {
  const current = useCurrentSubscription()
  const navigate = useNavigate()
  const [quotedAmount, setQuotedAmount] = useState<number | null>(null)
  const quote = useAdditionalStorageQuote(quotedAmount)
  const purchase = usePurchaseAdditionalStorage()

  if (current.isPending) return <PageSkeleton />
  if (current.isError)
    return (
      <ErrorState
        description="We couldn't check your current plan."
        onRetry={() => void current.refetch()}
      />
    )
  if (!current.data || !isActiveSubscription(current.data.status)) {
    return (
      <EmptyState
        title="An active plan comes first."
        description="Renew your plan or choose a new one before adding extra storage."
        illustration={<Database aria-hidden="true" className="text-primary" size={48} />}
        actionLabel="Back to storage"
        onAction={() => navigate('/vault/storage')}
      />
    )
  }

  if (purchase.isPending) return <CheckoutProcessing title="Adding room to your vault…" />
  if (purchase.isSuccess) {
    return (
      <CheckoutSuccess
        title={`${purchase.data.storageAmountGb} GB was added.`}
        description={`Your storage allocation increased after a successful ${formatPkr(purchase.data.price)} purchase.`}
      />
    )
  }
  if (purchase.isError) {
    return (
      <CheckoutFailure
        description={storageErrorMessage(
          purchase.error,
          "We couldn't add storage. Check your details and try again.",
        )}
        onRetry={() => purchase.reset()}
      />
    )
  }

  async function handlePayment(payment: PaymentFormValues) {
    if (!quote.data) return
    try {
      await purchase.mutateAsync({ storageAmountGb: quote.data.storageAmountGb, payment })
    } catch {
      // The mutation state renders the normalized failure screen.
    }
  }

  const summary = quote.data ? (
    <div className="flex flex-col gap-6">
      <p className="text-sm font-semibold text-brand">Your server quote</p>
      <p className="font-mono text-4xl font-bold tabular-nums text-foreground">
        +{quote.data.storageAmountGb} GB
      </p>
      <dl className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <dt className="text-sm text-muted-foreground">Price per GB</dt>
          <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">
            {formatPkr(quote.data.pricePerGb)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-muted-foreground">Total</dt>
          <dd className="font-mono font-semibold tabular-nums text-foreground">
            {formatPkr(quote.data.totalPrice)}
          </dd>
        </div>
      </dl>
      <Button variant="ghost" onClick={() => setQuotedAmount(null)}>
        <RotateCcw aria-hidden="true" size={18} /> Change amount
      </Button>
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <Database aria-hidden="true" className="text-primary" size={32} />
      <h3 className="font-display text-2xl font-bold text-foreground">
        Add exactly the room you need.
      </h3>
      <p className="text-sm text-muted-foreground">
        The backend calculates a fresh read-only quote before payment details are requested.
      </p>
    </div>
  )

  return (
    <CheckoutShell
      eyebrow="Additional storage"
      title="Make more space without changing plans."
      description="Choose a whole number of gigabytes, review the live server quote, then complete payment."
      summary={summary}
    >
      {!quote.data ? (
        <div className="flex flex-col gap-6">
          <AdditionalStorageAmountForm
            onSubmit={setQuotedAmount}
            onAmountChange={() => setQuotedAmount(null)}
          />
          {quote.isPending ? (
            <p className="text-sm text-muted-foreground" role="status">
              Preparing your quote…
            </p>
          ) : null}
          {quote.isError ? (
            <div className="flex flex-col items-start gap-3" role="alert">
              <p className="text-sm text-danger">
                {storageErrorMessage(quote.error, "We couldn't prepare that quote.")}
              </p>
              <Button variant="ghost" onClick={() => void quote.refetch()}>
                Try quote again
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <PaymentForm
          amountLabel="Read-only total"
          amountValue={formatPkr(quote.data.totalPrice)}
          submitLabel="Purchase additional storage"
          onSubmit={handlePayment}
        />
      )}
      <Button asChild variant="ghost" className="mt-4 w-full">
        <Link to="/vault/storage">Cancel before payment</Link>
      </Button>
    </CheckoutShell>
  )
}
