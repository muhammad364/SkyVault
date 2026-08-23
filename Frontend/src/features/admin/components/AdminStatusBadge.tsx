import { cn } from '@/lib/utils'

interface AdminStatusBadgeProps {
  active: boolean
  activeLabel?: string
  inactiveLabel?: string
}

export function AdminStatusBadge({
  active,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
}: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        active ? 'bg-success-soft text-foreground' : 'bg-card-muted text-muted-foreground',
      )}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  )
}
