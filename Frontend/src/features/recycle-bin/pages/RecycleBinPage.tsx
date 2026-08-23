import { Archive, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useFileOperations } from '@/features/files/components/FileOperationProvider'
import { useFileOperationsStore } from '@/features/files/store/fileOperations.store'
import { PermanentDeleteDialog } from '@/features/recycle-bin/components/PermanentDeleteDialog'
import { RecycleBinList } from '@/features/recycle-bin/components/RecycleBinList'
import { useRecycleBinItems } from '@/features/recycle-bin/hooks/useRecycleBinItems'
import { collapseRecycleBinSelection } from '@/features/recycle-bin/lib/recycleBinSelection'
import type { RecycleBinItem } from '@/models/recycleBin/RecycleBinItem'

type ItemTypeFilter = 'All' | 'File' | 'Folder'
type SortMode = 'deleted-desc' | 'deleted-asc' | 'expires-asc' | 'name-asc'

function operationReferences(items: RecycleBinItem[]) {
  return items
    .filter((item) => item.itemType === 'File' || item.itemType === 'Folder')
    .map((item) => ({
      id: item.itemId,
      name: item.name,
      type: item.itemType === 'Folder' ? ('folder' as const) : ('file' as const),
    }))
}

function sortItems(items: RecycleBinItem[], sortMode: SortMode) {
  return [...items].sort((left, right) => {
    if (sortMode === 'name-asc') return left.name.localeCompare(right.name)
    if (sortMode === 'expires-asc') {
      return new Date(left.expiresAt).getTime() - new Date(right.expiresAt).getTime()
    }
    const difference = new Date(left.deletedAt).getTime() - new Date(right.deletedAt).getTime()
    return sortMode === 'deleted-asc' ? difference : -difference
  })
}

function RecycleBinSkeleton() {
  return (
    <div className="grid gap-4" role="status" aria-label="Loading Recycle Bin">
      <Skeleton className="h-24" />
      <Skeleton className="h-16" />
      {[0, 1, 2, 3].map((item) => (
        <Skeleton key={item} className="h-24" />
      ))}
    </div>
  )
}

export default function RecycleBinPage() {
  const itemsQuery = useRecycleBinItems()
  const operations = useFileOperations()
  const activeOperations = useFileOperationsStore((state) => state.operations)
  const [filter, setFilter] = useState('')
  const [itemType, setItemType] = useState<ItemTypeFilter>('All')
  const [sortMode, setSortMode] = useState<SortMode>('deleted-desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleteItems, setDeleteItems] = useState<RecycleBinItem[]>([])

  const visibleItems = useMemo(() => {
    if (!itemsQuery.data) return []
    const normalized = filter.trim().toLocaleLowerCase()
    return sortItems(
      itemsQuery.data.filter(
        (item) =>
          (itemType === 'All' || item.itemType === itemType) &&
          (!normalized ||
            `${item.name} ${item.extension ?? ''}`.toLocaleLowerCase().includes(normalized)),
      ),
      sortMode,
    )
  }, [filter, itemType, itemsQuery.data, sortMode])

  if (itemsQuery.isPending) return <RecycleBinSkeleton />
  if (itemsQuery.isError) {
    return (
      <ErrorState
        title="Your Recycle Bin stayed closed."
        description="We couldn't load your deleted files and folders."
        onRetry={() => void itemsQuery.refetch()}
      />
    )
  }

  const allItems = itemsQuery.data
  const selectedItems = allItems.filter((item) => selected.has(item.itemId))
  const busyIds = new Set(
    activeOperations
      .filter(
        (operation) =>
          ['restore', 'permanent-delete'].includes(operation.kind) &&
          ['queued', 'transferring', 'processing'].includes(operation.status),
      )
      .flatMap((operation) => operation.targetIds),
  )
  const runRestore = (targets: RecycleBinItem[]) => {
    const collapsed = collapseRecycleBinSelection(targets, allItems)
    operations.restoreRecycleBinItems(operationReferences(collapsed))
    setSelected(new Set())
  }
  const runPermanentDelete = (targets: RecycleBinItem[]) => {
    const collapsed = collapseRecycleBinSelection(targets, allItems)
    operations.permanentlyDeleteRecycleBinItems(operationReferences(collapsed))
    setSelected(new Set())
  }

  return (
    <section
      className="grid min-w-0 gap-4 rounded-xl bg-card p-4 shadow-rest md:p-5"
      aria-labelledby="trash-heading"
    >
      <header className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-brand">Recovery space</p>
          <h2 id="trash-heading" className="font-display text-2xl font-bold text-foreground">
            Recycle Bin
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Restore items while they remain available, or remove them permanently. Scheduled removal
            dates come directly from SkyVault.
          </p>
        </div>
        <span className="w-fit rounded-full bg-card-muted px-3 py-1 font-mono text-sm font-semibold tabular-nums text-primary">
          {allItems.length} item{allItems.length === 1 ? '' : 's'}
        </span>
      </header>

      {allItems.length === 0 ? (
        <EmptyState
          title="Your Recycle Bin is clear."
          description="Files and folders moved to Trash will wait here until their API-provided removal date."
          illustration={<Archive className="text-primary" aria-hidden="true" size={48} />}
        />
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="relative" htmlFor="trash-filter">
              <span className="sr-only">Filter deleted items</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
                size={18}
              />
              <Input
                id="trash-filter"
                className="pl-10"
                placeholder="Filter deleted items"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              />
            </label>
            <label className="flex min-h-11 items-center rounded-sm border border-border bg-card px-3 text-sm font-medium text-foreground">
              <span className="sr-only">Item type</span>
              <select
                className="min-h-10 bg-transparent outline-none"
                value={itemType}
                onChange={(event) => setItemType(event.target.value as ItemTypeFilter)}
              >
                <option value="All">All items</option>
                <option value="File">Files</option>
                <option value="Folder">Folders</option>
              </select>
            </label>
            <label className="flex min-h-11 items-center rounded-sm border border-border bg-card px-3 text-sm font-medium text-foreground">
              <span className="sr-only">Sort deleted items</span>
              <select
                className="min-h-10 bg-transparent outline-none"
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
              >
                <option value="deleted-desc">Recently deleted</option>
                <option value="deleted-asc">Oldest deleted</option>
                <option value="expires-asc">Removal date</option>
                <option value="name-asc">Name A–Z</option>
              </select>
            </label>
          </div>

          {selectedItems.length > 0 ? (
            <div
              className="flex flex-wrap items-center gap-2 rounded-lg bg-card-muted p-3"
              aria-label="Selected Recycle Bin actions"
            >
              <p className="mr-auto text-sm font-semibold text-foreground">
                {selectedItems.length} selected
              </p>
              <Button variant="ghost" onClick={() => runRestore(selectedItems)}>
                <RotateCcw aria-hidden="true" size={18} /> Restore
              </Button>
              <Button
                variant="ghost"
                className="text-danger"
                onClick={() => setDeleteItems(selectedItems)}
              >
                <Trash2 aria-hidden="true" size={18} /> Delete permanently
              </Button>
            </div>
          ) : null}

          {visibleItems.length === 0 ? (
            <EmptyState
              title="No deleted items match"
              description="Clear or adjust the local filters to see other items."
              actionLabel="Clear filters"
              onAction={() => {
                setFilter('')
                setItemType('All')
              }}
              illustration={<Search className="text-primary" aria-hidden="true" size={48} />}
            />
          ) : (
            <RecycleBinList
              items={visibleItems}
              selected={selected}
              busyIds={busyIds}
              onToggle={(itemId) =>
                setSelected((current) => {
                  const next = new Set(current)
                  if (next.has(itemId)) next.delete(itemId)
                  else next.add(itemId)
                  return next
                })
              }
              onRestore={(item) => runRestore([item])}
              onDelete={(item) => setDeleteItems([item])}
            />
          )}
        </>
      )}

      <PermanentDeleteDialog
        items={deleteItems}
        onClose={() => setDeleteItems([])}
        onConfirm={runPermanentDelete}
      />
    </section>
  )
}
