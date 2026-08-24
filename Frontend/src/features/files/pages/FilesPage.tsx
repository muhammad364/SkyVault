import {
  ArrowDownAZ,
  Copy,
  File,
  FilePlus2,
  Folder,
  FolderInput,
  FolderPlus,
  Grid2X2,
  List,
  Menu,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyFolderVisual } from '@/features/files/components/EmptyFolderVisual'
import { FileBreadcrumbs } from '@/features/files/components/FileBreadcrumbs'
import { FileManagerDialogs } from '@/features/files/components/FileManagerDialogs'
import { FolderNavigator } from '@/features/files/components/FolderNavigator'
import { useFileOperations } from '@/features/files/components/FileOperationProvider'
import { VaultItemMenu } from '@/features/files/components/VaultItemMenu'
import { useFolderAncestry, useFolderContents } from '@/features/folders/hooks/useFolderContents'
import type {
  FileManagerDialogState,
  FileManagerItem,
} from '@/features/files/lib/fileManager.types'
import { useFileOperationsStore } from '@/features/files/store/fileOperations.store'
import { validateTransferFile } from '@/features/files/validators/fileManager.schemas'
import { ShareLinkDialog } from '@/features/sharing/components/ShareLinkDialog'
import { formatBytes, formatRelativeDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/ui.store'

type SortMode = 'name-asc' | 'name-desc' | 'updated-desc' | 'updated-asc'

function itemKey(item: FileManagerItem) {
  return `${item.type}:${item.id}`
}

function sortItems(items: FileManagerItem[], mode: SortMode) {
  const direction = mode.endsWith('desc') ? -1 : 1
  const field = mode.startsWith('updated') ? 'updated' : 'name'
  return [...items].sort((left, right) => {
    if (left.type !== right.type) return left.type === 'folder' ? -1 : 1
    if (field === 'updated') {
      return (new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime()) * direction
    }
    return left.name.localeCompare(right.name, undefined, { sensitivity: 'base' }) * direction
  })
}

function FilesPageSkeleton() {
  return (
    <div
      className="grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]"
      role="status"
      aria-label="Loading files and folders"
    >
      <Skeleton className="hidden min-h-[34rem] lg:block" />
      <div className="grid gap-4">
        <Skeleton className="h-24" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} className="h-40" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function FilesPage() {
  const { folderId } = useParams<{ folderId: string }>()
  const currentFolderId = folderId ?? null
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const contents = useFolderContents(currentFolderId)
  const ancestry = useFolderAncestry(currentFolderId)
  const operations = useFileOperations()
  const activeOperations = useFileOperationsStore((state) => state.operations)
  const fileViewMode = useUiStore((state) => state.fileViewMode)
  const setFileViewMode = useUiStore((state) => state.setFileViewMode)
  const uploadInput = useRef<HTMLInputElement>(null)
  const [filter, setFilter] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('name-asc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [dialog, setDialog] = useState<FileManagerDialogState>(null)
  const [shareItem, setShareItem] = useState<FileManagerItem | null>(null)
  const [navigatorOpen, setNavigatorOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadNotice, setUploadNotice] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    setSelected(new Set())
    setFilter('')
  }, [currentFolderId])

  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'upload') setUploadOpen(true)
    if (action === 'new-folder') setDialog({ type: 'create' })
    if (action) setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  const allItems = useMemo<FileManagerItem[]>(() => {
    if (!contents.data) return []
    return [
      ...contents.data.subFolders.map((folder) => ({
        id: folder.folderId,
        type: 'folder' as const,
        name: folder.name,
        updatedAt: folder.updatedAt,
      })),
      ...contents.data.files.map((file) => ({
        id: file.fileId,
        type: 'file' as const,
        name: file.fileName,
        extension: file.extension,
        fileSizeBytes: file.fileSizeBytes,
        updatedAt: file.updatedAt,
      })),
    ]
  }, [contents.data])

  const visibleItems = useMemo(() => {
    const normalized = filter.trim().toLocaleLowerCase()
    const matching = normalized
      ? allItems.filter((item) =>
          `${item.name} ${item.extension ?? ''}`.toLocaleLowerCase().includes(normalized),
        )
      : allItems
    return sortItems(matching, sortMode)
  }, [allItems, filter, sortMode])

  const selectedItems = allItems.filter((item) => selected.has(itemKey(item)))
  const selectedHasFolders = selectedItems.some((item) => item.type === 'folder')
  const activeTargetIds = new Set(
    activeOperations
      .filter((operation) => ['queued', 'transferring', 'processing'].includes(operation.status))
      .flatMap((operation) => operation.targetIds),
  )

  const queueUploads = (chosenFiles: File[]) => {
    const valid: File[] = []
    const rejected: string[] = []
    chosenFiles.forEach((file) => {
      if (validateTransferFile(file)) rejected.push(file.name)
      else valid.push(file)
    })
    if (rejected.length) {
      setUploadNotice(
        `${rejected.length} file${rejected.length === 1 ? '' : 's'} skipped. Files must contain data and be 100 MB or smaller.`,
      )
    } else setUploadNotice(null)
    if (valid.length) operations.uploadFiles(valid, currentFolderId)
  }

  const openDialog = (next: FileManagerDialogState) => {
    setDialog(next)
    setSelected(new Set())
  }

  const openPreview = (item: FileManagerItem) => {
    if (item.type !== 'file') return
    navigate(`/vault/preview/${item.id}`, {
      state: {
        fileName: item.name,
        returnTo: currentFolderId ? `/vault/files/${currentFolderId}` : '/vault/files',
      },
    })
  }

  if (contents.isPending) return <FilesPageSkeleton />

  if (contents.isError) {
    return (
      <ErrorState
        title="This folder stayed closed."
        description="We couldn't load its files and folders. It may have moved or no longer exist."
        onRetry={() => void contents.refetch()}
      />
    )
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="hidden min-h-[34rem] rounded-xl bg-card p-3 shadow-rest lg:block">
        <div className="mb-3 px-2">
          <p className="text-xs font-semibold text-brand">Folder tree</p>
          <h2 className="font-display text-lg font-bold text-foreground">Your folders</h2>
        </div>
        <FolderNavigator selectedId={currentFolderId} />
      </aside>

      <section
        className={cn(
          'min-w-0 rounded-xl border border-transparent bg-card p-4 shadow-rest transition duration-micro md:p-5',
          dragActive && 'border-brand bg-brand-soft',
        )}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragActive(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (event.currentTarget === event.target) setDragActive(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragActive(false)
          queueUploads(Array.from(event.dataTransfer.files))
        }}
      >
        <input
          ref={uploadInput}
          type="file"
          multiple
          className="sr-only"
          onChange={(event) => {
            queueUploads(Array.from(event.target.files ?? []))
            event.target.value = ''
            setUploadOpen(false)
          }}
        />

        <header className="grid gap-4 border-b border-border pb-4">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              {currentFolderId === null ? (
                <FileBreadcrumbs ancestry={[]} />
              ) : ancestry.isPending ? (
                <Skeleton className="h-11 w-56" />
              ) : ancestry.isError ? (
                <div className="flex min-h-11 items-center gap-2 text-sm text-danger" role="alert">
                  Breadcrumbs unavailable.
                  <button
                    className="font-semibold underline"
                    onClick={() => void ancestry.refetch()}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <FileBreadcrumbs ancestry={ancestry.data} />
              )}
              <h2 className="truncate font-display text-2xl font-bold text-foreground">
                {contents.data.currentFolderName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {contents.data.subFolders.length} folder
                {contents.data.subFolders.length === 1 ? '' : 's'} · {contents.data.files.length}{' '}
                file{contents.data.files.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                className="lg:hidden"
                variant="secondary"
                onClick={() => setNavigatorOpen(true)}
              >
                <Menu aria-hidden="true" size={18} /> Folders
              </Button>
              <Button variant="secondary" onClick={() => setDialog({ type: 'create' })}>
                <FolderPlus aria-hidden="true" size={18} /> New folder
              </Button>
              <Button onClick={() => setUploadOpen(true)}>
                <Upload aria-hidden="true" size={18} /> Upload
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative min-w-0 flex-1" htmlFor="current-folder-filter">
              <span className="sr-only">Filter this folder</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
                size={18}
              />
              <Input
                id="current-folder-filter"
                className="pl-10"
                placeholder="Filter this folder"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              />
            </label>
            <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
              <ArrowDownAZ aria-hidden="true" size={18} />
              <Select
                aria-label="Sort items"
                value={sortMode}
                onValueChange={(value) => setSortMode(value as SortMode)}
                className="min-w-44"
                options={[
                  { value: 'name-asc', label: 'Name A–Z' },
                  { value: 'name-desc', label: 'Name Z–A' },
                  { value: 'updated-desc', label: 'Newest updated' },
                  { value: 'updated-asc', label: 'Oldest updated' },
                ]}
              />
            </div>
            <div className="flex rounded-full bg-card-muted p-1" aria-label="File view">
              <Button
                variant={fileViewMode === 'grid' ? 'primary' : 'ghost'}
                size="icon"
                onClick={() => setFileViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={fileViewMode === 'grid'}
              >
                <Grid2X2 aria-hidden="true" size={18} />
              </Button>
              <Button
                variant={fileViewMode === 'list' ? 'primary' : 'ghost'}
                size="icon"
                onClick={() => setFileViewMode('list')}
                aria-label="List view"
                aria-pressed={fileViewMode === 'list'}
              >
                <List aria-hidden="true" size={18} />
              </Button>
            </div>
          </div>
          {uploadNotice ? (
            <p className="rounded-md bg-warning-soft p-3 text-sm text-warning" role="alert">
              {uploadNotice}
            </p>
          ) : null}
        </header>

        {selectedItems.length > 0 ? (
          <div
            className="my-4 flex flex-wrap items-center gap-2 rounded-lg bg-card-muted p-3"
            aria-label="Selected item actions"
          >
            <p className="mr-auto text-sm font-semibold text-foreground">
              {selectedItems.length} selected
            </p>
            <Button
              variant="ghost"
              onClick={() => openDialog({ type: 'move', items: selectedItems })}
            >
              <FolderInput aria-hidden="true" size={18} /> Move
            </Button>
            <Button
              variant="ghost"
              disabled={selectedHasFolders}
              title={
                selectedHasFolders
                  ? 'Folders cannot be copied because the API has no folder-copy operation.'
                  : undefined
              }
              onClick={() => openDialog({ type: 'copy', items: selectedItems })}
            >
              <Copy aria-hidden="true" size={18} /> Copy
            </Button>
            <Button
              variant="ghost"
              className="text-danger"
              onClick={() => openDialog({ type: 'delete', items: selectedItems })}
            >
              <Trash2 aria-hidden="true" size={18} /> Trash
            </Button>
          </div>
        ) : null}

        {allItems.length === 0 ? (
          <div className="pt-5">
            <EmptyState
              title="This folder is ready for something new."
              description="Drop files here on desktop, choose Upload on any device, or create a folder to start organizing."
              actionLabel="Choose files"
              onAction={() => setUploadOpen(true)}
              illustration={<EmptyFolderVisual />}
            />
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="pt-5">
            <EmptyState
              title="No matches in this folder"
              description="Try a different file name or extension. This filter only applies to the folder you are viewing."
              actionLabel="Clear filter"
              onAction={() => setFilter('')}
              illustration={<Search className="text-primary" aria-hidden="true" size={48} />}
            />
          </div>
        ) : (
          <ul
            className={cn(
              'mt-4 min-w-0',
              fileViewMode === 'grid' ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3' : 'grid gap-2',
            )}
          >
            {visibleItems.map((item) => {
              const key = itemKey(item)
              const checked = selected.has(key)
              const busy = activeTargetIds.has(item.id)
              return (
                <li
                  key={key}
                  className={cn(
                    'group relative min-w-0 overflow-hidden rounded-lg border bg-card transition duration-default ease-vault hover:-translate-y-0.5 hover:shadow-hover motion-reduce:transform-none',
                    checked ? 'border-brand shadow-rest' : 'border-border',
                    fileViewMode === 'grid' ? 'p-4' : 'flex items-center gap-3 p-3',
                  )}
                  aria-busy={busy || undefined}
                >
                  <input
                    type="checkbox"
                    className={cn(
                      'h-5 w-5 accent-brand',
                      fileViewMode === 'grid' ? 'absolute left-4 top-4' : 'shrink-0',
                    )}
                    checked={checked}
                    onChange={() =>
                      setSelected((current) => {
                        const next = new Set(current)
                        if (next.has(key)) next.delete(key)
                        else next.add(key)
                        return next
                      })
                    }
                    aria-label={`Select ${item.name}`}
                  />
                  <button
                    type="button"
                    className={cn(
                      'max-w-full min-w-0 overflow-hidden text-left focus-visible:rounded-sm',
                      fileViewMode === 'grid'
                        ? 'flex w-full flex-col gap-4 pt-9'
                        : 'flex min-h-11 flex-1 items-center gap-3',
                    )}
                    onClick={() =>
                      item.type === 'folder'
                        ? navigate(`/vault/files/${item.id}`)
                        : openPreview(item)
                    }
                  >
                    <span
                      className={cn(
                        'flex shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand',
                        fileViewMode === 'grid' ? 'h-12 w-12' : 'h-11 w-11',
                      )}
                    >
                      {item.type === 'folder' ? (
                        <Folder aria-hidden="true" size={24} />
                      ) : (
                        <File aria-hidden="true" size={24} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className="block truncate text-sm font-semibold text-foreground"
                        title={item.name}
                      >
                        {item.name}
                      </span>
                      <span className="block truncate font-mono text-xs tabular-nums text-muted-foreground">
                        {item.type === 'file'
                          ? `${formatBytes(item.fileSizeBytes)} · ${item.extension || 'File'} · `
                          : ''}
                        {formatRelativeDate(item.updatedAt)}
                      </span>
                    </span>
                  </button>
                  <div className={cn(fileViewMode === 'grid' && 'absolute right-2 top-2')}>
                    <VaultItemMenu
                      item={item}
                      onPreview={openPreview}
                      onDownload={(target) => void operations.downloadFile(target.id, target.name)}
                      onRename={(target) => setDialog({ type: 'rename', item: target })}
                      onMove={(target) => setDialog({ type: 'move', items: [target] })}
                      onCopy={(target) => setDialog({ type: 'copy', items: [target] })}
                      onReplace={(target) => setDialog({ type: 'replace', item: target })}
                      onShare={setShareItem}
                      onDelete={(target) => setDialog({ type: 'delete', items: [target] })}
                    />
                  </div>
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
        )}
      </section>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription>
              Files upload one at a time to {contents.data.currentFolderName}. Each file must
              contain data and be 100 MB or smaller.
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            className="mt-5 flex min-h-32 w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong bg-card-muted p-5 text-center text-foreground hover:border-brand"
            onClick={() => uploadInput.current?.click()}
          >
            <FilePlus2 className="text-brand" aria-hidden="true" size={28} />
            <span className="font-semibold">Choose files from your device</span>
            <span className="text-sm text-muted-foreground">You can select more than one.</span>
          </button>
        </DialogContent>
      </Dialog>

      <Dialog open={navigatorOpen} onOpenChange={setNavigatorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Browse folders</DialogTitle>
            <DialogDescription>
              Open a folder without losing your place in the workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 max-h-[60dvh] overflow-y-auto">
            <FolderNavigator
              selectedId={currentFolderId}
              onNavigated={() => setNavigatorOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <FileManagerDialogs
        state={dialog}
        currentFolderId={currentFolderId}
        onClose={() => setDialog(null)}
      />
      {shareItem ? (
        <ShareLinkDialog
          open
          files={[{ fileId: shareItem.id, fileName: shareItem.name }]}
          initialFileId={shareItem.id}
          onClose={() => setShareItem(null)}
        />
      ) : null}
    </div>
  )
}
