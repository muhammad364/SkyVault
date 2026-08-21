import { ArrowLeft, CircleCheck, LoaderCircle, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface CheckoutProcessingProps {
  title: string
}

export function CheckoutProcessing({ title }: CheckoutProcessingProps) {
  return (
    <section
      className="flex min-h-96 flex-col items-center justify-center gap-6 rounded-xl bg-card p-8 text-center shadow-float"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="flex min-h-16 min-w-16 items-center justify-center rounded-full bg-card-muted text-primary">
        <LoaderCircle
          aria-hidden="true"
          className="animate-spin motion-reduce:animate-none"
          size={32}
        />
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Keep this page open while SkyVault completes the request.
        </p>
      </div>
    </section>
  )
}

interface CheckoutSuccessProps {
  title: string
  description: string
}

export function CheckoutSuccess({ title, description }: CheckoutSuccessProps) {
  return (
    <section
      className="flex min-h-96 flex-col items-center justify-center gap-6 rounded-xl bg-card p-8 text-center shadow-float"
      role="status"
    >
      <span className="flex min-h-16 min-w-16 items-center justify-center rounded-full bg-card-muted text-primary">
        <CircleCheck aria-hidden="true" size={32} />
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild>
        <Link to="/vault/storage">
          View my storage <ArrowLeft aria-hidden="true" size={20} />
        </Link>
      </Button>
    </section>
  )
}

interface CheckoutFailureProps {
  description: string
  onRetry: () => void
}

export function CheckoutFailure({ description, onRetry }: CheckoutFailureProps) {
  return (
    <section
      className="flex min-h-96 flex-col items-center justify-center gap-6 rounded-xl bg-card p-8 text-center shadow-float"
      role="alert"
    >
      <span className="flex min-h-16 min-w-16 items-center justify-center rounded-full bg-danger-soft text-danger">
        <RotateCcw aria-hidden="true" size={32} />
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="font-display text-2xl font-bold text-foreground">Nothing was charged.</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onRetry}>Try payment again</Button>
        <Button asChild variant="ghost">
          <Link to="/vault/storage">Back to storage</Link>
        </Button>
      </div>
    </section>
  )
}
