import { Copy, FolderInput, History, Search, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FileManagerDialogs } from '@/features/files/components/FileManagerDialogs'
import { useFileOperations } from '@/features/files/components/FileOperationProvider'
import type {
  FileManagerDialogState,
  FileManagerItem,
} from '@/features/files/lib/fileManager.types'
import { useFileOperationsStore } from '@/features/files/store/fileOperations.store'
import { SearchFilters } from '@/features/search/components/SearchFilters'
import { SearchResultsList } from '@/features/search/components/SearchResultsList'
import { useDebouncedValue } from '@/features/search/hooks/useDebouncedValue'
import { hasSearchCriteria, useSearchResults } from '@/features/search/hooks/useSearchResults'
import { searchRequestFromParams, searchRequestParams } from '@/features/search/lib/searchParams'
import { searchResultItem } from '@/features/search/lib/searchResultItem'
import { searchLabel, useSearchHistoryStore } from '@/features/search/store/searchHistory.store'
import { ShareLinkDialog } from '@/features/sharing/components/ShareLinkDialog'
import type { SearchRequest } from '@/models/search/SearchRequest'

const EMPTY_SEARCH: SearchRequest = {
  query: null,
  fileType: null,
  fromDate: null,
  toDate: null,
}

function normalizedRequest(request: SearchRequest): SearchRequest {
  const clean = (value: string | null) => value?.trim() || null
  return {
    query: clean(request.query),
    fileType: clean(request.fileType),
    fromDate: clean(request.fromDate),
    toDate: clean(request.toDate),
  }
}

function SearchResultsSkeleton() {
  return (
    <div className="grid gap-3" role="status" aria-label="Searching your vault">
      {[0, 1, 2].map((item) => (
        <Skeleton key={item} className="h-32" />
      ))}
    </div>
  )
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const parameterString = params.toString()
  const urlRequest = useMemo(
    () => searchRequestFromParams(new URLSearchParams(parameterString)),
    [parameterString],
  )
  const [draft, setDraft] = useState(urlRequest)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [dialog, setDialog] = useState<FileManagerDialogState>(null)
  const [shareItem, setShareItem] = useState<FileManagerItem | null>(null)
  const operations = useFileOperations()
  const activeOperations = useFileOperationsStore((state) => state.operations)
  const recentSearches = useSearchHistoryStore((state) => state.recentSearches)
  const addRecentSearch = useSearchHistoryStore((state) => state.addRecentSearch)

  useEffect(() => setDraft(urlRequest), [urlRequest])

  const request = useMemo(() => normalizedRequest(draft), [draft])
  const validationError =
    request.fromDate && request.toDate && request.fromDate > request.toDate
      ? 'The uploaded-from date cannot be later than the uploaded-to date.'
      : null
  const debouncedRequest = useDebouncedValue(request, 300)
  const resultsQuery = useSearchResults(
    debouncedRequest,
    hasSearchCriteria(debouncedRequest) && !validationError,
  )
  const requestIsSettling = JSON.stringify(request) !== JSON.stringify(debouncedRequest)

  const openPreview = (item: FileManagerItem) => {
    navigate(`/vault/preview/${item.id}`, {
      state: {
        fileName: item.name,
        returnTo: `/vault/search${parameterString ? `?${parameterString}` : ''}`,
      },
    })
  }

  useEffect(() => setSelected(new Set()), [resultsQuery.data])

  const submitRequest = (next = request) => {
    const normalized = normalizedRequest(next)
    setDraft(normalized)
    setParams(searchRequestParams(normalized))
    if (hasSearchCriteria(normalized)) addRecentSearch(normalized)
  }

  const results = resultsQuery.data ?? []
  const selectedItems = results
    .filter((result) => selected.has(result.fileId))
    .map(searchResultItem)
  const busyIds = new Set(
    activeOperations
      .filter((operation) => ['queued', 'transferring', 'processing'].includes(operation.status))
      .flatMap((operation) => operation.targetIds),
  )

  return (
    <section className="grid min-w-0 gap-4" aria-labelledby="search-heading">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold text-brand">Metadata discovery</p>
        <h2 id="search-heading" className="font-display text-2xl font-bold text-foreground">
          Find what belongs to you.
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Search file metadata with the exact keyword, type, and upload-date filters SkyVault
          supports.
        </p>
      </header>

      <SearchFilters
        value={draft}
        validationError={validationError}
        onChange={setDraft}
        onSubmit={() => submitRequest()}
        onClear={() => {
          setDraft(EMPTY_SEARCH)
          setParams({})
        }}
      />

      {!hasSearchCriteria(request) ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)]">
          <EmptyState
            title="Start with a detail you remember."
            description="Try a file name, extension, MIME type, folder name, or an upload-date range. Search does not inspect file contents."
            illustration={<Sparkles className="text-primary" aria-hidden="true" size={48} />}
          />
          <aside className="rounded-xl bg-card p-4 shadow-rest md:p-5" aria-label="Recent searches">
            <div className="flex items-center gap-2 text-brand">
              <History aria-hidden="true" size={18} />
              <h3 className="font-display text-lg font-bold text-foreground">Recent searches</h3>
            </div>
            {recentSearches.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Searches from this signed-in session will appear here.
              </p>
            ) : (
              <ul className="mt-3 grid gap-2">
                {recentSearches.map((recent) => (
                  <li key={recent.id}>
                    <button
                      type="button"
                      className="min-h-11 w-full rounded-md bg-card-muted px-3 text-left text-sm font-semibold text-foreground hover:text-brand"
                      onClick={() => submitRequest(recent)}
                    >
                      {searchLabel(recent)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      ) : (
        <div className="grid gap-3" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">
              {validationError
                ? 'Adjust the date range to search.'
                : requestIsSettling || resultsQuery.isPending
                  ? 'Searching your vault…'
                  : `${results.length} result${results.length === 1 ? '' : 's'}`}
            </p>
            <p className="text-xs text-muted-foreground">Order is provided by SkyVault.</p>
          </div>

          {selectedItems.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg bg-card-muted p-3">
              <p className="mr-auto text-sm font-semibold text-foreground">
                {selectedItems.length} selected
              </p>
              <Button
                variant="ghost"
                onClick={() => setDialog({ type: 'move', items: selectedItems })}
              >
                <FolderInput aria-hidden="true" size={18} /> Move
              </Button>
              <Button
                variant="ghost"
                onClick={() => setDialog({ type: 'copy', items: selectedItems })}
              >
                <Copy aria-hidden="true" size={18} /> Copy
              </Button>
              <Button
                variant="ghost"
                className="text-danger"
                onClick={() => setDialog({ type: 'delete', items: selectedItems })}
              >
                <Trash2 aria-hidden="true" size={18} /> Trash
              </Button>
            </div>
          ) : null}

          {validationError ? (
            <div className="rounded-xl bg-card p-5 text-sm text-muted-foreground shadow-rest">
              Search will resume when the upload-date range is valid.
            </div>
          ) : requestIsSettling || resultsQuery.isPending ? (
            <SearchResultsSkeleton />
          ) : resultsQuery.isError ? (
            <ErrorState
              title="Search paused before returning results."
              description="Your filters are still here. Try the request again."
              onRetry={() => void resultsQuery.refetch()}
            />
          ) : results.length === 0 ? (
            <EmptyState
              title="No files matched those details."
              description="Try fewer words, a broader type such as image, or a wider upload-date range."
              actionLabel="Clear search"
              onAction={() => {
                setDraft(EMPTY_SEARCH)
                setParams({})
              }}
              illustration={<Search className="text-primary" aria-hidden="true" size={48} />}
            />
          ) : (
            <SearchResultsList
              results={results}
              selected={selected}
              busyIds={busyIds}
              onToggle={(fileId) =>
                setSelected((current) => {
                  const next = new Set(current)
                  if (next.has(fileId)) next.delete(fileId)
                  else next.add(fileId)
                  return next
                })
              }
              onPreview={openPreview}
              onDownload={(item) => void operations.downloadFile(item.id, item.name)}
              onRename={(item) => setDialog({ type: 'rename', item })}
              onMove={(item) => setDialog({ type: 'move', items: [item] })}
              onCopy={(item) => setDialog({ type: 'copy', items: [item] })}
              onReplace={(item) => setDialog({ type: 'replace', item })}
              onShare={setShareItem}
              onDelete={(item) => setDialog({ type: 'delete', items: [item] })}
            />
          )}
        </div>
      )}

      <FileManagerDialogs state={dialog} currentFolderId={null} onClose={() => setDialog(null)} />
      {shareItem ? (
        <ShareLinkDialog
          open
          files={[{ fileId: shareItem.id, fileName: shareItem.name }]}
          initialFileId={shareItem.id}
          onClose={() => setShareItem(null)}
        />
      ) : null}
    </section>
  )
}
