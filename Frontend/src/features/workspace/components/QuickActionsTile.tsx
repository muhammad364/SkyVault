import { ArrowRight, HardDrive, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function QuickActionsTile() {
  return (
    <section
      className="flex min-h-72 flex-col justify-between gap-8 rounded-xl bg-card p-6 shadow-rest"
      aria-labelledby="quick-actions-heading"
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-brand">Quick actions</p>
        <h3 id="quick-actions-heading" className="font-display text-2xl font-bold text-foreground">
          Keep your vault comfortable.
        </h3>
        <p className="text-sm text-muted-foreground">
          Reach the parts of SkyVault that are ready to use today.
        </p>
      </div>
      <div className="grid gap-3">
        <Button asChild>
          <Link to="/vault/storage">
            <HardDrive aria-hidden="true" size={18} /> Manage storage
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/vault/settings">
            <Settings aria-hidden="true" size={18} /> Account settings
          </Link>
        </Button>
      </div>
    </section>
  )
}
