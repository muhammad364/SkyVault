import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Copy, Link2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { useGenerateShareLink } from '@/features/sharing/hooks/useSharingMutations'
import { publicShareUrl } from '@/features/sharing/lib/publicShareUrl'
import { sharingErrorMessage } from '@/features/sharing/lib/sharingErrorMessage'

export interface ShareableFile {
  fileId: string
  fileName: string
}

const shareLinkSchema = z
  .object({ fileId: z.string().min(1, 'Choose a file.'), expiresAt: z.string() })
  .superRefine((values, context) => {
    if (!values.expiresAt) return
    const expiresAt = new Date(values.expiresAt)
    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expiresAt'],
        message: 'Choose a future expiration date and time.',
      })
    }
  })

type ShareLinkValues = z.infer<typeof shareLinkSchema>

export function ShareLinkDialog({
  open,
  files,
  initialFileId,
  onClose,
}: {
  open: boolean
  files: ShareableFile[]
  initialFileId?: string
  onClose: () => void
}) {
  const generate = useGenerateShareLink()
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ShareLinkValues>({ resolver: zodResolver(shareLinkSchema) })

  useEffect(() => {
    if (!open) return
    setGeneratedUrl(null)
    setCopyState('idle')
    reset({ fileId: initialFileId ?? files[0]?.fileId ?? '', expiresAt: '' })
  }, [files, initialFileId, open, reset])

  const submit = (values: ShareLinkValues) => {
    generate.mutate(
      {
        fileId: values.fileId,
        expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : null,
      },
      {
        onSuccess: (response) => {
          const wrappedUrl = publicShareUrl(response.shareUrl)
          if (wrappedUrl) setGeneratedUrl(wrappedUrl)
          else {
            setError('root', {
              message: "SkyVault returned a link this app couldn't prepare safely.",
            })
          }
        },
        onError: (error) =>
          setError('root', {
            message:
              sharingErrorMessage(error, "We couldn't create this share link.") ??
              'Link creation stopped.',
          }),
      },
    )
  }

  const copy = async () => {
    if (!generatedUrl) return
    try {
      await navigator.clipboard.writeText(generatedUrl)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="min-w-0 max-w-full overflow-x-hidden md:w-[calc(100vw-2rem)] md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {generatedUrl ? 'Your view-only link is ready' : 'Share a file'}
          </DialogTitle>
          <DialogDescription>
            {generatedUrl
              ? 'Copy this private link for the intended recipient. SkyVault does not persist it in this browser.'
              : 'Recipients can preview and download the file, but cannot change it.'}
          </DialogDescription>
        </DialogHeader>
        {generatedUrl ? (
          <div className="mt-5 grid min-w-0 gap-4 overflow-hidden">
            <label
              className="grid gap-2 text-sm font-semibold text-foreground"
              htmlFor="generated-share-link"
            >
              Share link
              <Input
                id="generated-share-link"
                className="min-w-0 truncate"
                readOnly
                value={generatedUrl}
                onFocus={(event) => event.currentTarget.select()}
              />
            </label>
            <Button onClick={() => void copy()}>
              {copyState === 'copied' ? (
                <Check aria-hidden="true" size={18} />
              ) : (
                <Copy aria-hidden="true" size={18} />
              )}
              {copyState === 'copied' ? 'Copied' : 'Copy link'}
            </Button>
            <p
              className={copyState === 'failed' ? 'text-sm text-danger' : 'sr-only'}
              aria-live="polite"
            >
              {copyState === 'failed'
                ? 'Copy failed. Select the link and copy it manually.'
                : copyState === 'copied'
                  ? 'Link copied.'
                  : ''}
            </p>
          </div>
        ) : (
          <form
            className="mt-5 grid min-w-0 gap-4 overflow-hidden"
            onSubmit={handleSubmit(submit)}
            noValidate
          >
            <label
              className="grid min-w-0 gap-2 text-sm font-semibold text-foreground"
              htmlFor="share-file-id"
            >
              File
              <select
                id="share-file-id"
                className="block min-h-11 w-full min-w-0 max-w-full truncate rounded-sm border border-border bg-card px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('fileId')}
              >
                {files.map((file) => (
                  <option key={file.fileId} value={file.fileId}>
                    {file.fileName}
                  </option>
                ))}
              </select>
            </label>
            {errors.fileId?.message ? (
              <p className="text-sm text-danger">{errors.fileId.message}</p>
            ) : null}
            <label
              className="grid min-w-0 gap-2 text-sm font-semibold text-foreground"
              htmlFor="share-expiry"
            >
              Expiration <span className="font-normal text-muted-foreground">Optional</span>
              <Input id="share-expiry" type="datetime-local" {...register('expiresAt')} />
            </label>
            {errors.expiresAt?.message ? (
              <p className="text-sm text-danger">{errors.expiresAt.message}</p>
            ) : null}
            {errors.root?.message ? (
              <p className="rounded-md bg-danger-soft p-3 text-sm text-danger" role="alert">
                {errors.root.message}
              </p>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={generate.isPending || files.length === 0}>
                <Link2 aria-hidden="true" size={18} />{' '}
                {generate.isPending ? 'Creating link' : 'Create link'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
