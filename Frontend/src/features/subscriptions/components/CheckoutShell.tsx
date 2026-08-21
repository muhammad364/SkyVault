import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface CheckoutShellProps {
  eyebrow: string
  title: string
  description: string
  summary: ReactNode
  children: ReactNode
}

export function CheckoutShell({
  eyebrow,
  title,
  description,
  summary,
  children,
}: CheckoutShellProps) {
  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="self-start">
        <Link to="/vault/storage">
          <ArrowLeft aria-hidden="true" size={20} /> Back to storage
        </Link>
      </Button>
      <header className="flex max-w-2xl flex-col gap-3">
        <p className="text-sm font-semibold text-brand">{eyebrow}</p>
        <h2 className="text-balance font-display text-4xl font-bold text-foreground">{title}</h2>
        <p className="text-pretty text-secondary-foreground">{description}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <aside className="rounded-xl bg-card-muted p-6">{summary}</aside>
        <section
          className="rounded-xl bg-card p-6 shadow-float md:p-8"
          aria-label="Payment details"
        >
          {children}
        </section>
      </div>
    </div>
  )
}
