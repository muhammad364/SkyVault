import { ChevronRight, Ellipsis } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { FolderContentsResponse } from '@/models/folder/FolderContentsResponse'

export function FileBreadcrumbs({ ancestry }: { ancestry: FolderContentsResponse[] }) {
  const middle = ancestry.slice(0, -1)
  const visibleMiddle = middle.length > 2 ? middle.slice(-1) : middle
  const hiddenMiddle = middle.length > 2 ? middle.slice(0, -1) : []
  const current = ancestry.at(-1)

  return (
    <nav aria-label="Folder breadcrumbs" className="min-w-0">
      <ol className="flex min-h-11 min-w-0 items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link
            className="flex min-h-11 items-center rounded-sm px-2 font-medium hover:bg-card-muted hover:text-foreground"
            to="/vault/files"
          >
            Root
          </Link>
        </li>
        {hiddenMiddle.length > 0 ? (
          <>
            <ChevronRight className="shrink-0" aria-hidden="true" size={16} />
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-sm hover:bg-card-muted"
                    aria-label="Earlier folders"
                  >
                    <Ellipsis aria-hidden="true" size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hiddenMiddle.map((folder) => (
                    <DropdownMenuItem key={folder.currentFolderId} asChild>
                      <Link to={`/vault/files/${folder.currentFolderId}`}>
                        {folder.currentFolderName}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </>
        ) : null}
        {visibleMiddle.map((folder) => (
          <li className="contents" key={folder.currentFolderId}>
            <ChevronRight className="shrink-0" aria-hidden="true" size={16} />
            <Link
              className="flex min-h-11 max-w-36 items-center truncate rounded-sm px-2 font-medium hover:bg-card-muted hover:text-foreground"
              to={`/vault/files/${folder.currentFolderId}`}
            >
              {folder.currentFolderName}
            </Link>
          </li>
        ))}
        {current ? (
          <li className="contents">
            <ChevronRight className="shrink-0" aria-hidden="true" size={16} />
            <span
              className="min-w-0 truncate px-2 font-semibold text-foreground"
              aria-current="page"
            >
              {current.currentFolderName}
            </span>
          </li>
        ) : null}
      </ol>
    </nav>
  )
}
