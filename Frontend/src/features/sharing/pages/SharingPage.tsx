import { Link2, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserFiles } from '@/features/files/hooks/useUserFiles'
import { ShareLinkDialog } from '@/features/sharing/components/ShareLinkDialog'
import { ShareLinksList } from '@/features/sharing/components/ShareLinksList'
import { useOwnShareLinks } from '@/features/sharing/hooks/useOwnShareLinks'

function SharingSkeleton() {
  return (
    <div className="grid gap-4" role="status" aria-label="Loading shared links">
      <Skeleton className="h-24" />
      <div className="grid gap-3 lg:grid-cols-2">
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
      </div>
    </div>
  )
}

export default function SharingPage() {
  const links = useOwnShareLinks()
  const files = useUserFiles()
  const [createOpen, setCreateOpen] = useState(false)

  const shareableFiles = useMemo(
    () => files.data?.map((file) => ({ fileId: file.fileId, fileName: file.fileName })) ?? [],
    [files.data],
  )
  const fileNames = useMemo(
    () => new Map(shareableFiles.map((file) => [file.fileId, file.fileName])),
    [shareableFiles],
  )

  if (links.isPending) return <SharingSkeleton />
  if (links.isError) {
    return (
      <ErrorState
        title="Your shared links stayed private."
        description="We couldn't load your sharing workspace."
        onRetry={() => void links.refetch()}
      />
    )
  }

  return (
    <section
      className="grid min-w-0 gap-4 rounded-xl bg-card p-4 shadow-rest md:p-5"
      aria-labelledby="sharing-heading"
    >
      <header className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-brand">View-only access</p>
          <h2 id="sharing-heading" className="font-display text-2xl font-bold text-foreground">
            Shared links
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create private links for individual files and revoke access whenever you need to.
          </p>
        </div>
        <Button
          disabled={files.isPending || files.isError || shareableFiles.length === 0}
          onClick={() => setCreateOpen(true)}
        >
          <Plus aria-hidden="true" size={18} /> Create link
        </Button>
      </header>

      {files.isError ? (
        <div
          className="flex flex-col gap-3 rounded-lg bg-warning-soft p-4 text-sm text-warning sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p>
            File names and new-link selection are unavailable. Existing link controls still work.
          </p>
          <Button variant="ghost" onClick={() => void files.refetch()}>
            Retry files
          </Button>
        </div>
      ) : null}

      {links.data.length === 0 ? (
        <EmptyState
          title="Nothing shared yet"
          description={
            files.isPending
              ? 'Checking which files are ready to share.'
              : shareableFiles.length > 0
                ? 'Create a view-only link when you want someone to preview or download one file.'
                : 'Upload a file before creating your first view-only link.'
          }
          actionLabel={shareableFiles.length > 0 ? 'Create link' : undefined}
          onAction={shareableFiles.length > 0 ? () => setCreateOpen(true) : undefined}
          illustration={<Link2 className="text-primary" aria-hidden="true" size={48} />}
        />
      ) : (
        <ShareLinksList
          links={links.data}
          fileNames={fileNames}
          fileNamesPending={files.isPending}
        />
      )}

      <ShareLinkDialog
        open={createOpen}
        files={shareableFiles}
        onClose={() => setCreateOpen(false)}
      />
    </section>
  )
}
