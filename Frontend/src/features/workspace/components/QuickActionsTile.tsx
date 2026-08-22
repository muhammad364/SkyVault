import { ArrowRight, FileUp, FolderOpen, FolderPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

const actions = [
  {
    to: '/vault/files?action=upload',
    title: 'Upload files',
    description: 'Add files to your root folder',
    icon: FileUp,
  },
  {
    to: '/vault/files?action=new-folder',
    title: 'New folder',
    description: 'Organize your vault',
    icon: FolderPlus,
  },
  {
    to: '/vault/files',
    title: 'Browse files',
    description: 'Open your file manager',
    icon: FolderOpen,
  },
]

export function QuickActionsTile() {
  return (
    <section className="grid gap-2 sm:grid-cols-3" aria-label="File quick actions">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.to}
            to={action.to}
            className="pressable group flex min-h-16 min-w-0 items-center gap-3 rounded-lg bg-card p-3 text-foreground shadow-rest transition duration-default ease-vault hover:shadow-hover motion-reduce:transform-none"
          >
            <span className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
              <Icon aria-hidden="true" size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{action.title}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {action.description}
              </span>
            </span>
            <ArrowRight
              className="shrink-0 transition-transform duration-micro group-hover:translate-x-0.5 motion-reduce:transform-none"
              aria-hidden="true"
              size={17}
            />
          </Link>
        )
      })}
    </section>
  )
}
