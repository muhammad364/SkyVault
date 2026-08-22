import { Archive, FileText, Folder } from 'lucide-react'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecycleBinItems } from '@/features/recycle-bin/hooks/useRecycleBinItems'
import { selectRecentlyDeletedItems } from '@/features/workspace/lib/workspacePresentation'
import { formatDate, formatRelativeDate } from '@/lib/formatters'

export function TrashSummaryTile() {
  const items = useRecycleBinItems()

  if (items.isPending) {
    return (
      <section
        className="flex min-h-56 flex-col gap-4 rounded-xl bg-card p-5 shadow-rest md:col-span-2 lg:col-span-2"
        role="status"
        aria-label="Loading trash summary"
      >
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </section>
    )
  }

  if (items.isError) {
    return (
      <div className="md:col-span-2 lg:col-span-2">
        <ErrorState
          title="Your trash summary stayed closed."
          description="We couldn't load the things waiting in your recycle bin."
          onRetry={() => void items.refetch()}
        />
      </div>
    )
  }

  if (items.data.length === 0) {
    return (
      <section
        className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-xl bg-card p-5 text-center shadow-rest md:col-span-2 lg:col-span-2"
        aria-labelledby="trash-summary-heading"
      >
        <span className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-card-muted text-primary">
          <Archive aria-hidden="true" size={20} />
        </span>
        <div className="flex max-w-sm flex-col gap-2">
          <p className="text-xs font-semibold text-brand">Trash</p>
          <h3 id="trash-summary-heading" className="font-display text-xl font-bold text-foreground">
            Nothing waiting here
          </h3>
          <p className="text-sm text-muted-foreground">
            Deleted files and folders will stay visible here until their API-provided expiry date.
          </p>
        </div>
      </section>
    )
  }

  const recentItems = selectRecentlyDeletedItems(items.data)

  return (
    <section
      className="flex min-h-56 min-w-0 flex-col gap-4 rounded-xl bg-card p-5 shadow-rest md:col-span-2 lg:col-span-2"
      aria-labelledby="trash-summary-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-xs font-semibold text-brand">Trash</p>
          <h3 id="trash-summary-heading" className="font-display text-xl font-bold text-foreground">
            Recently deleted
          </h3>
        </div>
        <span className="rounded-full bg-card-muted px-3 py-1 font-mono text-sm font-semibold tabular-nums text-primary">
          {items.data.length}
        </span>
      </div>
      <ul className="grid gap-2">
        {recentItems.map((item) => {
          const ItemIcon = item.itemType === 'Folder' ? Folder : FileText

          return (
            <li
              key={item.itemId}
              className="flex min-w-0 flex-col gap-3 rounded-md bg-card-muted p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <ItemIcon aria-hidden="true" className="shrink-0 text-primary" size={20} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.itemType}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <time dateTime={item.deletedAt}>Deleted {formatRelativeDate(item.deletedAt)}</time>
                <time dateTime={item.expiresAt}>Expires {formatDate(item.expiresAt)}</time>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
