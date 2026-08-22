import { ArrowRight, FileText, FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserFiles } from '@/features/files/hooks/useUserFiles'
import { selectRecentFiles } from '@/features/workspace/lib/workspacePresentation'
import { formatBytes, formatRelativeDate } from '@/lib/formatters'

function fileDestination(folderId: string, fileId: string) {
  const root = !folderId || folderId === '00000000-0000-0000-0000-000000000000'
  return `${root ? '/vault/files' : `/vault/files/${folderId}`}?preview=${fileId}`
}

export function RecentFilesTile() {
  const files = useUserFiles()

  if (files.isPending)
    return (
      <section
        className="flex min-h-64 flex-col gap-3 rounded-xl bg-card p-5 shadow-rest lg:col-span-2"
        role="status"
        aria-label="Loading recent files"
      >
        <Skeleton className="h-7 w-36" />
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-12" />
        ))}
      </section>
    )
  if (files.isError)
    return (
      <div className="lg:col-span-2">
        <ErrorState
          title="Your recent files stayed out of view."
          description="We couldn't load the files you touched most recently."
          onRetry={() => void files.refetch()}
        />
      </div>
    )

  const recentFiles = selectRecentFiles(files.data)

  return (
    <section
      className="flex min-h-64 min-w-0 flex-col gap-4 rounded-xl bg-card p-5 shadow-rest lg:col-span-2"
      aria-labelledby="recent-files-heading"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-brand">Continue where you left off</p>
          <h3 id="recent-files-heading" className="font-display text-xl font-bold text-foreground">
            Recent files
          </h3>
        </div>
        <Link
          className="flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-primary hover:bg-card-muted"
          to="/vault/files"
        >
          Browse <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
      {recentFiles.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <FolderOpen className="text-primary" aria-hidden="true" size={36} />
          <p className="text-sm text-muted-foreground">
            Files will settle here after they become part of your vault.
          </p>
          <Link className="font-semibold text-brand underline" to="/vault/files?action=upload">
            Upload your first file
          </Link>
        </div>
      ) : (
        <ul className="grid min-w-0 gap-2">
          {recentFiles.map((file) => (
            <li key={file.fileId}>
              <Link
                className="flex min-h-12 min-w-0 items-center gap-3 rounded-md bg-card-muted p-3 hover:shadow-rest"
                to={fileDestination(file.folderId, file.fileId)}
              >
                <span className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                  <FileText aria-hidden="true" size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{file.fileName}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    <span className="font-mono tabular-nums">
                      {formatBytes(file.fileSizeBytes)}
                    </span>
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
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
