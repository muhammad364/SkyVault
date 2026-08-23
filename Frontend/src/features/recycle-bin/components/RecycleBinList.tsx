import { FileText, Folder } from 'lucide-react'
import { RecycleBinItemMenu } from '@/features/recycle-bin/components/RecycleBinItemMenu'
import { cn } from '@/lib/utils'
import { formatBytes, formatDate, formatRelativeDate } from '@/lib/formatters'
import type { RecycleBinItem } from '@/models/recycleBin/RecycleBinItem'

export function RecycleBinList({
  items,
  selected,
  busyIds,
  onToggle,
  onRestore,
  onDelete,
}: {
  items: RecycleBinItem[]
  selected: Set<string>
  busyIds: Set<string>
  onToggle: (itemId: string) => void
  onRestore: (item: RecycleBinItem) => void
  onDelete: (item: RecycleBinItem) => void
}) {
  return (
    <ul className="grid gap-2" aria-label="Deleted files and folders">
      {items.map((item) => {
        const isFolder = item.itemType === 'Folder'
        const actionable = isFolder || item.itemType === 'File'
        const ItemIcon = isFolder ? Folder : FileText
        const busy = busyIds.has(item.itemId)

        return (
          <li
            key={item.itemId}
            className={cn(
              'relative grid min-w-0 gap-3 rounded-lg border bg-card p-3 transition duration-default ease-vault md:grid-cols-[auto_minmax(0,1fr)_minmax(10rem,0.7fr)_auto] md:items-center',
              selected.has(item.itemId) ? 'border-brand shadow-rest' : 'border-border',
            )}
            aria-busy={busy || undefined}
          >
            <label className="flex min-h-11 min-w-11 items-center justify-center">
              <input
                type="checkbox"
                className="h-5 w-5 accent-brand"
                checked={selected.has(item.itemId)}
                disabled={!actionable || busy}
                onChange={() => onToggle(item.itemId)}
                aria-label={`Select ${item.name}`}
              />
            </label>
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                <ItemIcon aria-hidden="true" size={22} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {item.itemType}
                  {!isFolder
                    ? ` · ${item.extension || 'File'} · ${formatBytes(item.fileSizeBytes)}`
                    : ''}
                </p>
              </div>
            </div>
            <div className="grid gap-1 text-sm text-muted-foreground">
              <time dateTime={item.deletedAt}>Deleted {formatRelativeDate(item.deletedAt)}</time>
              <time dateTime={item.expiresAt}>Scheduled removal {formatDate(item.expiresAt)}</time>
            </div>
            {actionable ? (
              <RecycleBinItemMenu item={item} onRestore={onRestore} onDelete={onDelete} />
            ) : (
              <span className="text-xs text-muted-foreground">Actions unavailable</span>
            )}
            {busy ? (
              <span
                className="absolute inset-x-3 bottom-1 h-1 animate-pulse rounded-full bg-primary-action motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
