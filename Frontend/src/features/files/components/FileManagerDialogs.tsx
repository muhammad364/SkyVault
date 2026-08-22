import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, FileUp, FolderInput, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
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
import { FolderNavigator } from '@/features/files/components/FolderNavigator'
import { useFileOperations } from '@/features/files/components/FileOperationProvider'
import {
  useCreateFolder,
  useRenameFile,
  useRenameFolder,
} from '@/features/files/hooks/useVaultMutations'
import { fileErrorMessage } from '@/features/files/lib/fileErrorMessage'
import type {
  FileManagerDialogState,
  FileManagerItem,
} from '@/features/files/lib/fileManager.types'
import {
  type VaultNameValues,
  validateTransferFile,
  vaultNameSchema,
} from '@/features/files/validators/fileManager.schemas'

interface FileManagerDialogsProps {
  state: FileManagerDialogState
  currentFolderId: string | null
  onClose: () => void
}

function toReferences(items: FileManagerItem[]) {
  return items.map((item) => ({ id: item.id, type: item.type, name: item.name }))
}

export function FileManagerDialogs({ state, currentFolderId, onClose }: FileManagerDialogsProps) {
  const createFolder = useCreateFolder()
  const renameFolder = useRenameFolder()
  const renameFile = useRenameFile()
  const operations = useFileOperations()
  const replaceInput = useRef<HTMLInputElement>(null)
  const [destinationFolderId, setDestinationFolderId] = useState<string | null>(null)
  const [replaceError, setReplaceError] = useState<string | null>(null)
  const [replacementFile, setReplacementFile] = useState<File | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<VaultNameValues>({ resolver: zodResolver(vaultNameSchema) })

  useEffect(() => {
    setDestinationFolderId(null)
    setReplaceError(null)
    setReplacementFile(null)
    reset({
      name: state?.type === 'rename' ? state.item.name : '',
    })
  }, [reset, state])

  const submitName = (values: VaultNameValues) => {
    if (!state) return
    if (state.type === 'create') {
      createFolder.mutate(
        { name: values.name.trim(), parentFolderId: currentFolderId },
        {
          onSuccess: onClose,
          onError: (error: unknown) =>
            setError('root', {
              message:
                fileErrorMessage(error, "We couldn't create this folder.") ??
                'The request was stopped.',
            }),
        },
      )
    }
    if (state.type === 'rename') {
      const options = {
        onSuccess: onClose,
        onError: (error: unknown) =>
          setError('root', {
            message:
              fileErrorMessage(error, "We couldn't rename this item.") ??
              'The request was stopped.',
          }),
      }
      if (state.item.type === 'folder') {
        renameFolder.mutate({ folderId: state.item.id, name: values.name.trim() }, options)
      } else {
        renameFile.mutate({ fileId: state.item.id, fileName: values.name.trim() }, options)
      }
    }
  }

  const items = state && 'items' in state ? state.items : []

  return (
    <>
      <Dialog open={state?.type === 'create' || state?.type === 'rename'} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{state?.type === 'create' ? 'New folder' : 'Rename item'}</DialogTitle>
            <DialogDescription>
              {state?.type === 'create'
                ? 'Create a folder in the location you are viewing.'
                : 'Use a clear name that will be easy to find later.'}
            </DialogDescription>
          </DialogHeader>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit(submitName)} noValidate>
            <label
              className="grid gap-2 text-sm font-semibold text-foreground"
              htmlFor="vault-item-name"
            >
              Name
              <Input id="vault-item-name" {...register('name')} />
            </label>
            {errors.name?.message ? (
              <p className="text-sm text-danger">{errors.name.message}</p>
            ) : null}
            {errors.root?.message ? (
              <p className="rounded-md bg-danger-soft p-3 text-sm text-danger" role="alert">
                {errors.root.message}
              </p>
            ) : null}
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createFolder.isPending || renameFolder.isPending || renameFile.isPending}
              >
                {createFolder.isPending
                  ? 'Creating folder'
                  : renameFolder.isPending || renameFile.isPending
                    ? 'Renaming item'
                    : state?.type === 'create'
                      ? 'Create folder'
                      : 'Save name'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={state?.type === 'move' || state?.type === 'copy'} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{state?.type === 'copy' ? 'Copy files' : 'Move items'}</DialogTitle>
            <DialogDescription>
              Choose a destination. SkyVault will validate conflicts and folder hierarchy.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 max-h-72 overflow-y-auto rounded-lg border border-border p-2">
            <FolderNavigator
              mode="select"
              selectedId={destinationFolderId}
              onSelect={setDestinationFolderId}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Destination: {destinationFolderId === null ? 'Root' : 'Selected folder'}
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (state?.type === 'copy') {
                  operations.copyFiles(toReferences(items), destinationFolderId)
                } else if (state?.type === 'move') {
                  operations.moveItems(toReferences(items), destinationFolderId)
                }
                onClose()
              }}
            >
              <FolderInput aria-hidden="true" size={18} />
              {state?.type === 'copy' ? 'Copy here' : 'Move here'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={state?.type === 'delete'} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Trash?</DialogTitle>
            <DialogDescription>
              {items.some((item) => item.type === 'folder')
                ? 'Selected folders and their complete hierarchy will move to Trash. They will continue to use storage until permanently removed.'
                : 'Selected files will move to Trash and continue to use storage until permanently removed.'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 flex items-start gap-3 rounded-lg bg-danger-soft p-4 text-sm text-danger">
            <AlertTriangle className="shrink-0" aria-hidden="true" size={20} />
            <span>
              {items.length} item{items.length === 1 ? '' : 's'} selected.
            </span>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Keep items
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                operations.deleteItems(toReferences(items))
                onClose()
              }}
            >
              <Trash2 aria-hidden="true" size={18} /> Move to Trash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={state?.type === 'replace'} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace file contents?</DialogTitle>
            <DialogDescription>
              SkyVault does not keep version history. The current contents cannot be recovered after
              replacement.
            </DialogDescription>
          </DialogHeader>
          <input
            ref={replaceInput}
            type="file"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              setReplacementFile(file)
              setReplaceError(validateTransferFile(file))
            }}
          />
          <button
            type="button"
            className="mt-5 flex min-h-24 w-full items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong bg-card-muted p-4 text-sm font-semibold text-foreground hover:border-brand"
            onClick={() => replaceInput.current?.click()}
          >
            <FileUp aria-hidden="true" size={20} />
            {replacementFile?.name ?? 'Choose replacement file'}
          </button>
          {replaceError ? (
            <p className="mt-2 text-sm text-danger" role="alert">
              {replaceError}
            </p>
          ) : null}
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={!replacementFile || Boolean(replaceError)}
              onClick={() => {
                if (
                  state?.type !== 'replace' ||
                  !replacementFile ||
                  validateTransferFile(replacementFile)
                )
                  return
                operations.replaceFile(state.item.id, state.item.name, replacementFile)
                onClose()
              }}
            >
              Replace contents
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
