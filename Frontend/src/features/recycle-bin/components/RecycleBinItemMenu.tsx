import { Ellipsis, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { RecycleBinItem } from '@/models/recycleBin/RecycleBinItem'

export function RecycleBinItemMenu({
  item,
  onRestore,
  onDelete,
}: {
  item: RecycleBinItem
  onRestore: (item: RecycleBinItem) => void
  onDelete: (item: RecycleBinItem) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={`Actions for ${item.name}`}>
          <Ellipsis aria-hidden="true" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onRestore(item)}>
          <RotateCcw aria-hidden="true" size={18} /> Restore
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => onDelete(item)}>
          <Trash2 aria-hidden="true" size={18} /> Delete permanently
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
