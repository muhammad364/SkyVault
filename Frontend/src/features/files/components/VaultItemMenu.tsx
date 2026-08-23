import {
  Copy,
  Download,
  Ellipsis,
  Eye,
  FolderInput,
  Pencil,
  RefreshCw,
  Share2,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { FileManagerItem } from '@/features/files/lib/fileManager.types'

interface VaultItemMenuProps {
  item: FileManagerItem
  onPreview: (item: FileManagerItem) => void
  onDownload: (item: FileManagerItem) => void
  onRename: (item: FileManagerItem) => void
  onMove: (item: FileManagerItem) => void
  onCopy: (item: FileManagerItem) => void
  onReplace: (item: FileManagerItem) => void
  onShare: (item: FileManagerItem) => void
  onDelete: (item: FileManagerItem) => void
}

export function VaultItemMenu({
  item,
  onPreview,
  onDownload,
  onRename,
  onMove,
  onCopy,
  onReplace,
  onShare,
  onDelete,
}: VaultItemMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label={`Actions for ${item.name}`}
          onClick={(event) => event.stopPropagation()}
        >
          <Ellipsis aria-hidden="true" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
        {item.type === 'file' ? (
          <>
            <DropdownMenuItem onSelect={() => onPreview(item)}>
              <Eye aria-hidden="true" size={18} /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDownload(item)}>
              <Download aria-hidden="true" size={18} /> Download
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuItem onSelect={() => onRename(item)}>
          <Pencil aria-hidden="true" size={18} /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onMove(item)}>
          <FolderInput aria-hidden="true" size={18} /> Move
        </DropdownMenuItem>
        {item.type === 'file' ? (
          <>
            <DropdownMenuItem onSelect={() => onCopy(item)}>
              <Copy aria-hidden="true" size={18} /> Copy
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onReplace(item)}>
              <RefreshCw aria-hidden="true" size={18} /> Replace contents
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onShare(item)}>
              <Share2 aria-hidden="true" size={18} /> Share
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => onDelete(item)}>
          <Trash2 aria-hidden="true" size={18} /> Move to Trash
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
