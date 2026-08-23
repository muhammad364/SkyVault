import { Download, FileQuestion, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useFileOperations } from '@/features/files/components/FileOperationProvider'
import type { FileManagerItem } from '@/features/files/lib/fileManager.types'
import { previewKind } from '@/features/files/lib/previewKind'

export function FilePreviewDialog({
  item,
  onClose,
}: {
  item: FileManagerItem | null
  onClose: () => void
}) {
  const operations = useFileOperations()
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [text, setText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setBlob(null)
    setText(null)
    setUrl(null)
    if (!item) return
    let active = true
    setLoading(true)
    void operations.previewFile(item.id, item.name).then(async (result) => {
      if (!active || !result) {
        setLoading(false)
        return
      }
      const kind = previewKind(result.type)
      setBlob(result)
      if (kind === 'text') setText(await result.text())
      else if (kind !== 'unsupported') setUrl(URL.createObjectURL(result))
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [item, operations])

  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url)
    },
    [url],
  )

  const kind = blob ? previewKind(blob.type) : null

  return (
    <Dialog open={item !== null} onOpenChange={onClose}>
      <DialogContent className="md:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="truncate">{item?.name ?? 'File preview'}</DialogTitle>
          <DialogDescription>
            Preview uses the content type returned by SkyVault. SVG and unknown formats are not
            rendered.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-5 flex min-h-72 items-center justify-center overflow-hidden rounded-lg bg-card-muted p-3">
          {loading ? (
            <div className="flex items-center gap-3 text-sm text-muted-foreground" role="status">
              <LoaderCircle
                className="animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />{' '}
              Preparing preview
            </div>
          ) : kind === 'image' && url ? (
            <img
              className="max-h-[60dvh] max-w-full object-contain"
              src={url}
              alt={`Preview of ${item?.name}`}
            />
          ) : kind === 'pdf' && url ? (
            <iframe
              className="h-[60dvh] w-full rounded-md bg-card"
              src={url}
              title={`Preview of ${item?.name}`}
            />
          ) : kind === 'text' ? (
            <pre className="max-h-[60dvh] w-full overflow-auto whitespace-pre-wrap break-words p-3 text-left font-mono text-sm text-foreground">
              {text}
            </pre>
          ) : kind === 'audio' && url ? (
            // The backend returns media bytes only and exposes no caption-track contract.
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio className="w-full" src={url} controls />
          ) : kind === 'video' && url ? (
            // The backend returns media bytes only and exposes no caption-track contract.
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video className="max-h-[60dvh] max-w-full" src={url} controls />
          ) : (
            <div className="flex max-w-sm flex-col items-center gap-3 text-center">
              <FileQuestion className="text-primary" aria-hidden="true" size={40} />
              <p className="font-semibold text-foreground">
                Preview isn&apos;t available for this format.
              </p>
              <p className="text-sm text-muted-foreground">
                Download the file to open it with an application on your device.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {item ? (
            <Button onClick={() => void operations.downloadFile(item.id, item.name)}>
              <Download aria-hidden="true" size={18} /> Download
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
