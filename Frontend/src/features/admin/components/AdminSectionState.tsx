import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function AdminSectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-lg bg-card p-4 shadow-rest" aria-label="Loading administration data">
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    </div>
  )
}

interface AdminSectionErrorProps {
  title: string
  description: string
  retry: () => void
  retrying?: boolean
}

export function AdminSectionError({ title, description, retry, retrying }: AdminSectionErrorProps) {
  return (
    <section className="rounded-lg bg-card p-5 shadow-rest" role="alert">
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Button
        className="mt-4"
        type="button"
        variant="secondary"
        onClick={retry}
        disabled={retrying}
      >
        <RotateCcw aria-hidden="true" size={16} /> {retrying ? 'Refreshing' : 'Try again'}
      </Button>
    </section>
  )
}
