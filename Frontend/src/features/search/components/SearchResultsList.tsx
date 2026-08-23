import { File, FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { VaultItemMenu } from '@/features/files/components/VaultItemMenu'
import type { FileManagerItem } from '@/features/files/lib/fileManager.types'
import { searchResultItem } from '@/features/search/lib/searchResultItem'
import { formatBytes, formatDate } from '@/lib/formatters'
import type { SearchResult } from '@/models/search/SearchResult'

interface SearchResultsListProps {
  results: SearchResult[]
  selected: Set<string>
  busyIds: Set<string>
  onToggle: (fileId: string) => void
  onPreview: (item: FileManagerItem) => void
  onDownload: (item: FileManagerItem) => void
  onRename: (item: FileManagerItem) => void
  onMove: (item: FileManagerItem) => void
  onCopy: (item: FileManagerItem) => void
  onReplace: (item: FileManagerItem) => void
  onShare: (item: FileManagerItem) => void
  onDelete: (item: FileManagerItem) => void
}

export function SearchResultsList({
  results,
  selected,
  busyIds,
  onToggle,
  onPreview,
  onDownload,
  onRename,
  onMove,
  onCopy,
  onReplace,
  onShare,
  onDelete,
}: SearchResultsListProps) {
  return (
    <ol className="grid gap-3" aria-label="Search results">
      {results.map((result) => {
        const item = searchResultItem(result)
        const selectedItem = selected.has(result.fileId)
        const busy = busyIds.has(result.fileId)
        const folderDestination = result.folderId
          ? `/vault/files/${result.folderId}`
          : '/vault/files'

        return (
          <li
            key={result.fileId}
            className={`relative grid min-w-0 gap-3 rounded-lg border bg-card p-4 shadow-rest transition duration-default ease-vault hover:-translate-y-0.5 hover:shadow-hover motion-reduce:transform-none md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center ${
              selectedItem ? 'border-brand' : 'border-border'
            }`}
            aria-busy={busy || undefined}
          >
            <input
              type="checkbox"
              className="h-5 w-5 accent-brand"
              checked={selectedItem}
              onChange={() => onToggle(result.fileId)}
              aria-label={`Select ${result.fileName}`}
            />
            <div className="flex min-w-0 gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                <File aria-hidden="true" size={22} />
              </span>
              <div className="min-w-0">
                <button
                  type="button"
                  className="block max-w-full truncate text-left text-sm font-semibold text-foreground hover:text-brand hover:underline"
                  onClick={() => onPreview(item)}
                >
                  {result.fileName}
                </button>
                <p className="mt-1 truncate font-mono text-xs tabular-nums text-muted-foreground">
                  {result.fileExtension || 'File'} · {result.mimeType} ·{' '}
                  {formatBytes(result.fileSizeBytes)}
                </p>
                <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <div>
                    <dt className="inline font-semibold text-foreground">Uploaded </dt>
                    <dd className="inline">{formatDate(result.uploadedAt)}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-foreground">Modified </dt>
                    <dd className="inline">{formatDate(result.lastModifiedAt)}</dd>
                  </div>
                </dl>
                <Link
                  className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  to={folderDestination}
                >
                  <FolderOpen aria-hidden="true" size={17} />
                  {result.folderName ?? 'Root'}
                </Link>
              </div>
            </div>
            <VaultItemMenu
              item={item}
              onPreview={onPreview}
              onDownload={onDownload}
              onRename={onRename}
              onMove={onMove}
              onCopy={onCopy}
              onReplace={onReplace}
              onShare={onShare}
              onDelete={onDelete}
            />
            {busy ? (
              <span
                className="absolute inset-x-3 bottom-1 h-1 animate-pulse rounded-full bg-primary-action motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
