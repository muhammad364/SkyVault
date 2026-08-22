import { Link2, ShieldOff } from 'lucide-react'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { useOwnShareLinks } from '@/features/sharing/hooks/useOwnShareLinks'
import { selectNewestShareLinks } from '@/features/workspace/lib/workspacePresentation'
import { formatDate, formatRelativeDate } from '@/lib/formatters'

export function SharedLinksTile() {
  const links = useOwnShareLinks()

  if (links.isPending) {
    return (
      <section
        className="flex min-h-72 flex-col gap-5 rounded-xl bg-card p-6 shadow-rest lg:col-span-2"
        role="status"
        aria-label="Loading shared links summary"
      >
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </section>
    )
  }

  if (links.isError) {
    return (
      <div className="lg:col-span-2">
        <ErrorState
          title="Your links stayed private."
          description="We couldn't load your sharing summary."
          onRetry={() => void links.refetch()}
        />
      </div>
    )
  }

  if (links.data.length === 0) {
    return (
      <section
        className="flex min-h-72 flex-col items-center justify-center gap-5 rounded-xl bg-card p-6 text-center shadow-rest lg:col-span-2"
        aria-labelledby="shared-links-heading"
      >
        <span className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-card-muted text-primary">
          <Link2 aria-hidden="true" size={20} />
        </span>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-brand">Shared links</p>
          <h3 id="shared-links-heading" className="font-display text-2xl font-bold text-foreground">
            Nothing shared yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Links you create will appear here without revealing their private addresses.
          </p>
        </div>
      </section>
    )
  }

  const newestLinks = selectNewestShareLinks(links.data)

  return (
    <section
      className="flex min-h-72 min-w-0 flex-col gap-5 rounded-xl bg-card p-6 shadow-rest lg:col-span-2"
      aria-labelledby="shared-links-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-sm font-semibold text-brand">Shared links</p>
          <h3 id="shared-links-heading" className="font-display text-2xl font-bold text-foreground">
            Sharing summary
          </h3>
        </div>
        <span className="rounded-full bg-card-muted px-3 py-1 font-mono text-sm font-semibold tabular-nums text-primary">
          {links.data.length}
        </span>
      </div>
      <ul className="grid gap-3">
        {newestLinks.map((link) => (
          <li
            key={link.shareLinkId}
            className="flex min-w-0 flex-col gap-2 rounded-md bg-card-muted p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
                {link.isRevoked ? (
                  <ShieldOff aria-hidden="true" className="shrink-0 text-danger" size={18} />
                ) : (
                  <Link2 aria-hidden="true" className="shrink-0 text-primary" size={18} />
                )}
                {link.isRevoked ? 'Revoked' : 'Not revoked'}
              </span>
              <time className="shrink-0 text-sm text-muted-foreground" dateTime={link.createdAt}>
                {formatRelativeDate(link.createdAt)}
              </time>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {link.expiresAt ? (
                <>
                  Expires <time dateTime={link.expiresAt}>{formatDate(link.expiresAt)}</time>
                </>
              ) : (
                'No expiry provided'
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
