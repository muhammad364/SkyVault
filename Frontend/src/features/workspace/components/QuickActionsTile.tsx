import { ArrowRight, HardDrive, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

export function QuickActionsTile() {
  return (
    <section
      className="flex flex-col gap-4 rounded-xl bg-card p-4 shadow-rest xl:flex-row xl:items-center"
      aria-labelledby="quick-actions-heading"
    >
      <div className="flex max-w-xl flex-col gap-1 xl:w-64 xl:shrink-0">
        <p className="text-xs font-semibold text-brand">Quick actions</p>
        <h2 id="quick-actions-heading" className="font-display text-xl font-bold text-foreground">
          Keep your vault comfortable.
        </h2>
        <p className="text-sm text-muted-foreground">
          Reach the parts of SkyVault that are ready to use today.
        </p>
      </div>
      <div
        className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2"
        aria-label="Available quick actions"
      >
        <Link
          to="/vault/storage"
          className="pressable group flex min-h-16 items-center gap-3 rounded-lg bg-card-muted p-3 text-foreground shadow-rest transition duration-default ease-vault hover:shadow-hover motion-reduce:transform-none"
        >
          <span className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <HardDrive aria-hidden="true" size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">Manage storage</span>
            <span className="block text-xs text-muted-foreground">Review quota and plans</span>
          </span>
          <ArrowRight
            className="shrink-0 transition-transform duration-micro ease-vault group-hover:translate-x-1 motion-reduce:transform-none"
            aria-hidden="true"
            size={18}
          />
        </Link>
        <Link
          to="/vault/settings"
          className="pressable group flex min-h-16 items-center gap-3 rounded-lg bg-card-muted p-3 text-foreground shadow-rest transition duration-default ease-vault hover:shadow-hover motion-reduce:transform-none"
        >
          <span className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <Settings aria-hidden="true" size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">Account settings</span>
            <span className="block text-xs text-muted-foreground">Update your profile</span>
          </span>
          <ArrowRight
            className="shrink-0 transition-transform duration-micro ease-vault group-hover:translate-x-1 motion-reduce:transform-none"
            aria-hidden="true"
            size={18}
          />
        </Link>
      </div>
    </section>
  )
}
