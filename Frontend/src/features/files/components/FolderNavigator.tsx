import { ChevronDown, ChevronRight, Folder, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useFolderContents } from '@/features/folders/hooks/useFolderContents'
import { cn } from '@/lib/utils'
import type { FolderSummary } from '@/models/folder/FolderSummary'

interface FolderNavigatorProps {
  mode?: 'navigate' | 'select'
  selectedId?: string | null
  onSelect?: (folderId: string | null) => void
  onNavigated?: () => void
}

interface FolderTreeNodeProps extends FolderNavigatorProps {
  folder: FolderSummary
  level: number
}

function FolderTreeNode({
  folder,
  level,
  mode = 'navigate',
  selectedId,
  onSelect,
  onNavigated,
}: FolderTreeNodeProps) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const contents = useFolderContents(folder.folderId, expanded)
  const selected = selectedId === folder.folderId

  const choose = () => {
    if (mode === 'select') onSelect?.(folder.folderId)
    else {
      navigate(`/vault/files/${folder.folderId}`)
      onNavigated?.()
    }
  }

  return (
    <li>
      <div
        className={cn(
          'flex min-h-11 items-center gap-1 rounded-md pr-1',
          selected ? 'bg-brand-soft text-brand' : 'text-foreground hover:bg-card-muted',
        )}
        style={{ paddingLeft: `${Math.min(level, 5) * 12}px` }}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="min-h-11 min-w-11 shrink-0"
          onClick={() => setExpanded((current) => !current)}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${folder.name}`}
          aria-expanded={expanded}
        >
          {contents.isFetching ? (
            <LoaderCircle className="animate-spin motion-reduce:animate-none" size={16} />
          ) : expanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </Button>
        <button
          type="button"
          className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-sm px-1 text-left text-sm font-medium"
          onClick={choose}
        >
          <Folder className="shrink-0" aria-hidden="true" size={18} />
          <span className="truncate">{folder.name}</span>
        </button>
      </div>
      {expanded ? (
        contents.isError ? (
          <div className="ml-11 flex items-center gap-2 py-2 text-xs text-danger" role="alert">
            Couldn&apos;t open this branch.
            <button className="font-semibold underline" onClick={() => void contents.refetch()}>
              Retry
            </button>
          </div>
        ) : contents.data?.subFolders.length === 0 ? (
          <p className="ml-12 py-2 text-xs text-muted-foreground">No folders inside</p>
        ) : (
          <ul>
            {contents.data?.subFolders.map((child) => (
              <FolderTreeNode
                key={child.folderId}
                folder={child}
                level={level + 1}
                mode={mode}
                selectedId={selectedId}
                onSelect={onSelect}
                onNavigated={onNavigated}
              />
            ))}
          </ul>
        )
      ) : null}
    </li>
  )
}

export function FolderNavigator({
  mode = 'navigate',
  selectedId,
  onSelect,
  onNavigated,
}: FolderNavigatorProps) {
  const root = useFolderContents(null)
  const navigate = useNavigate()
  const rootSelected = selectedId === null

  return (
    <nav aria-label={mode === 'select' ? 'Choose destination folder' : 'Folder navigator'}>
      <button
        type="button"
        className={cn(
          'flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm font-semibold',
          rootSelected ? 'bg-brand-soft text-brand' : 'text-foreground hover:bg-card-muted',
        )}
        onClick={() => {
          if (mode === 'select') onSelect?.(null)
          else {
            navigate('/vault/files')
            onNavigated?.()
          }
        }}
      >
        <Folder aria-hidden="true" size={18} /> Root
      </button>
      {root.isPending ? (
        <p
          className="flex min-h-11 items-center gap-2 px-3 text-sm text-muted-foreground"
          role="status"
        >
          <LoaderCircle className="animate-spin motion-reduce:animate-none" size={16} /> Loading
          folders
        </p>
      ) : root.isError ? (
        <div className="p-3 text-sm text-danger" role="alert">
          <p>Folders stayed out of view.</p>
          <button className="mt-1 font-semibold underline" onClick={() => void root.refetch()}>
            Try again
          </button>
        </div>
      ) : root.data.subFolders.length === 0 ? (
        <p className="px-3 py-2 text-xs text-muted-foreground">No folders yet</p>
      ) : (
        <ul className="mt-1">
          {root.data.subFolders.map((folder) => (
            <FolderTreeNode
              key={folder.folderId}
              folder={folder}
              level={1}
              mode={mode}
              selectedId={selectedId}
              onSelect={onSelect}
              onNavigated={onNavigated}
            />
          ))}
        </ul>
      )}
    </nav>
  )
}
