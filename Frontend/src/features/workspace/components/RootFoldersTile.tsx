import { ArrowRight, Folder, FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { useFolderContents } from '@/features/folders/hooks/useFolderContents'
import { formatRelativeDate } from '@/lib/formatters'

export function RootFoldersTile() {
  const root = useFolderContents(null)

  if (root.isPending)
    return (
      <section
        className="flex min-h-64 flex-col gap-3 rounded-xl bg-card p-5 shadow-rest lg:col-span-2"
        role="status"
        aria-label="Loading root folders"
      >
        <Skeleton className="h-7 w-36" />
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-12" />
        ))}
      </section>
    )
  if (root.isError)
    return (
      <div className="lg:col-span-2">
        <ErrorState
          title="Your folders stayed closed."
          description="We couldn't load the folders in your vault root."
          onRetry={() => void root.refetch()}
        />
      </div>
    )

  const folders = [...root.data.subFolders]
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 4)

  return (
    <section
      className="flex min-h-64 min-w-0 flex-col gap-4 rounded-xl bg-card p-5 shadow-rest lg:col-span-2"
      aria-labelledby="root-folders-heading"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-brand">Organize your vault</p>
          <h3 id="root-folders-heading" className="font-display text-xl font-bold text-foreground">
            Root folders
          </h3>
        </div>
        <Link
          className="flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-primary hover:bg-card-muted"
          to="/vault/files"
        >
          Browse <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
      {folders.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <FolderOpen className="text-primary" aria-hidden="true" size={36} />
          <p className="text-sm text-muted-foreground">No root folders yet.</p>
          <Link className="font-semibold text-brand underline" to="/vault/files?action=new-folder">
            Create your first folder
          </Link>
        </div>
      ) : (
        <ul className="grid gap-2">
          {folders.map((folder) => (
            <li key={folder.folderId}>
              <Link
                className="flex min-h-12 min-w-0 items-center gap-3 rounded-md bg-card-muted p-3 hover:shadow-rest"
                to={`/vault/files/${folder.folderId}`}
              >
                <Folder className="shrink-0 text-brand" aria-hidden="true" size={20} />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                  {folder.name}
                </span>
                <time
                  className="hidden shrink-0 text-xs text-muted-foreground sm:block"
                  dateTime={folder.updatedAt}
                >
                  {formatRelativeDate(folder.updatedAt)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
