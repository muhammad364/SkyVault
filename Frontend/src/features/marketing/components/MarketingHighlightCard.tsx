import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarketingHighlightCardProps {
  title: string
  description: string
  icon: LucideIcon
  marquee?: boolean
}

export function MarketingHighlightCard({
  title,
  description,
  icon: Icon,
  marquee = false,
}: MarketingHighlightCardProps) {
  return (
    <article
      className={cn(
        'rounded-lg bg-card p-6 shadow-rest transition duration-default ease-vault hover:-translate-y-0.5 hover:shadow-hover motion-reduce:transform-none',
        marquee && 'w-72 flex-none sm:w-80',
      )}
    >
      <div className="flex flex-col gap-5">
        <span className="flex min-h-11 min-w-11 self-start items-center justify-center rounded-md bg-card-muted text-primary">
          <Icon aria-hidden="true" size={20} />
        </span>
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
          <p className="text-pretty text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </article>
  )
}
