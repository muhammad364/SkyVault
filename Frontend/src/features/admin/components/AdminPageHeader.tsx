import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}

export function AdminPageHeader({ eyebrow, title, description, actions }: AdminPageHeaderProps) {
  return (
    <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">{eyebrow}</p>
        <h1 className="mt-1 text-balance font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-pretty text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  )
}
