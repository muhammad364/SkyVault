import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  description: string
  onRetry?: () => void
}

export function ErrorState({ title = "We couldn't reach your vault.", description, onRetry }: ErrorStateProps) {
  return (
    <section className="flex flex-col items-center gap-6 rounded-lg bg-card p-8 text-center shadow-rest" role="alert">
      <span className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-accent-coral-soft text-accent-coral">
        <AlertCircle aria-hidden="true" size={20} />
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
    </section>
  )
}
