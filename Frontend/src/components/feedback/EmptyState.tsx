import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  illustration?: ReactNode
}

export function EmptyState({ title, description, actionLabel, onAction, illustration }: EmptyStateProps) {
  return (
    <section className="flex flex-col items-center gap-6 rounded-lg bg-card p-8 text-center shadow-rest">
      {illustration ?? <img src="/brand/skyvault-mark.svg" className="h-16 w-16" alt="" />}
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </section>
  )
}
