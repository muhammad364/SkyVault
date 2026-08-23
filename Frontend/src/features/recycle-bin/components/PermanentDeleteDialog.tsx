import { AlertTriangle, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { RecycleBinItem } from '@/models/recycleBin/RecycleBinItem'

export function PermanentDeleteDialog({
  items,
  onClose,
  onConfirm,
}: {
  items: RecycleBinItem[]
  onClose: () => void
  onConfirm: (items: RecycleBinItem[]) => void
}) {
  const [confirmation, setConfirmation] = useState('')
  const expected = items.length === 1 ? (items[0]?.name ?? '') : `DELETE ${items.length}`
  const includesFolder = items.some((item) => item.itemType === 'Folder')

  useEffect(() => setConfirmation(''), [items])

  const description = useMemo(() => {
    if (items.length === 1 && includesFolder) {
      return 'This folder, its complete deleted hierarchy, and contained files will be removed from storage. This cannot be undone.'
    }
    if (includesFolder) {
      return 'Selected folders include their complete deleted hierarchies and contained files. Permanent deletion cannot be undone.'
    }
    return 'These file contents and their metadata will be removed permanently. This cannot be undone.'
  }, [includesFolder, items.length])

  return (
    <Dialog open={items.length > 0} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete permanently?</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-5 grid gap-4">
          <div className="flex items-start gap-3 rounded-lg bg-danger-soft p-4 text-sm text-danger">
            <AlertTriangle className="shrink-0" aria-hidden="true" size={20} />
            <span>Storage is released only after SkyVault completes permanent deletion.</span>
          </div>
          <label
            className="grid gap-2 text-sm font-semibold text-foreground"
            htmlFor="delete-confirmation"
          >
            Type <span className="font-mono text-brand">{expected}</span> to confirm
            <Input
              id="delete-confirmation"
              autoComplete="off"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
          </label>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Keep items
          </Button>
          <Button
            variant="destructive"
            disabled={confirmation !== expected}
            onClick={() => {
              onConfirm(items)
              onClose()
            }}
          >
            <Trash2 aria-hidden="true" size={18} /> Delete permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
