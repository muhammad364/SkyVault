import { FileText, FolderOpen } from 'lucide-react'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserFiles } from '@/features/files/hooks/useUserFiles'
import { selectRecentFiles } from '@/features/workspace/lib/workspacePresentation'
import { formatBytes, formatRelativeDate } from '@/lib/formatters'

export function RecentFilesTile() {
  const files = useUserFiles()

  if (files.isPending) {
    return (
      <section
        className="flex min-h-80 flex-col gap-5 rounded-xl bg-card p-6 shadow-rest lg:col-span-2"
        role="status"
        aria-label="Loading recent files"
      >
        <Skeleton className="h-7 w-36" />
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-16 w-full" />
        ))}
      </section>
    )
  }

  if (files.isError) {
    return (
      <div className="lg:col-span-2">
        <ErrorState
          title="Your recent files stayed out of view."
          description="We couldn't load the files you touched most recently."
          onRetry={() => void files.refetch()}
        />
      </div>
    )
  }

  if (files.data.length === 0) {
    return (
      <section
        className="flex min-h-80 flex-col items-center justify-center gap-5 rounded-xl bg-card p-6 text-center shadow-rest lg:col-span-2"
        aria-labelledby="recent-files-heading"
      >
        <span className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-card-muted text-primary">
          <FolderOpen aria-hidden="true" size={20} />
        </span>
        <div className="flex max-w-sm flex-col gap-2">
          <p className="text-sm font-semibold text-brand">Recent files</p>
          <h3 id="recent-files-heading" className="font-display text-2xl font-bold text-foreground">
            Nothing here yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Files will settle here after they become part of your vault.
          </p>
        </div>
      </section>
    )
  }

  const recentFiles = selectRecentFiles(files.data)

  return (
    <section
      className="flex min-h-80 min-w-0 flex-col gap-5 rounded-xl bg-card p-6 shadow-rest lg:col-span-2"
      aria-labelledby="recent-files-heading"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-brand">Continue where you left off</p>
        <h3 id="recent-files-heading" className="font-display text-2xl font-bold text-foreground">
          Recent files
        </h3>
      </div>
      <ul className="grid min-w-0 gap-3">
        {recentFiles.map((file) => (
          <li
            key={file.fileId}
            className="flex min-w-0 items-center gap-4 rounded-md bg-card-muted p-4"
          >
            <span className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
              <FileText aria-hidden="true" size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{file.fileName}</p>
              <p className="truncate text-sm text-muted-foreground">
                <span className="font-mono tabular-nums">{formatBytes(file.fileSizeBytes)}</span>
                {' · '}
                {file.extension || 'File'}
              </p>
            </div>
            <time
              className="hidden shrink-0 text-sm text-muted-foreground sm:block"
              dateTime={file.updatedAt}
            >
              {formatRelativeDate(file.updatedAt)}
            </time>
          </li>
        ))}
      </ul>
    </section>
  )
}
