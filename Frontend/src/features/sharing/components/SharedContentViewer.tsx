import { FileQuestion } from 'lucide-react'
import { previewKind } from '@/features/files/lib/previewKind'

export function SharedContentViewer({
  blob,
  url,
  text,
}: {
  blob: Blob
  url: string | null
  text: string | null
}) {
  const kind = previewKind(blob.type)

  if (kind === 'image' && url) {
    return (
      <img
        className="max-h-[65dvh] max-w-full object-contain"
        src={url}
        alt="Shared file preview"
      />
    )
  }
  if (kind === 'pdf' && url) {
    return (
      <iframe
        className="h-[65dvh] w-full rounded-md bg-card"
        src={url}
        title="Shared PDF preview"
      />
    )
  }
  if (kind === 'text') {
    return (
      <pre className="max-h-[65dvh] w-full overflow-auto whitespace-pre-wrap break-words p-3 text-left font-mono text-sm text-foreground">
        {text}
      </pre>
    )
  }
  if (kind === 'audio' && url) {
    // The public response contains media bytes only and exposes no caption-track contract.
    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <audio className="w-full" src={url} controls />
  }
  if (kind === 'video' && url) {
    // The public response contains media bytes only and exposes no caption-track contract.
    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <video className="max-h-[65dvh] max-w-full" src={url} controls />
  }

  return (
    <div className="flex max-w-sm flex-col items-center gap-3 text-center">
      <FileQuestion className="text-primary" aria-hidden="true" size={44} />
      <p className="font-semibold text-foreground">Preview isn't available for this format.</p>
      <p className="text-sm text-muted-foreground">
        Download the file to open it with an application on your device.
      </p>
    </div>
  )
}
