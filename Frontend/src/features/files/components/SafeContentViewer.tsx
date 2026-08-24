import { FileQuestion } from 'lucide-react'
import { previewKind } from '@/features/files/lib/previewKind'

interface SafeContentViewerProps {
  blob: Blob
  url: string | null
  text: string | null
  title: string
}

export function SafeContentViewer({ blob, url, text, title }: SafeContentViewerProps) {
  const kind = previewKind(blob.type)

  if (kind === 'image' && url) {
    return (
      <img className="max-h-full max-w-full object-contain" src={url} alt={`Preview of ${title}`} />
    )
  }
  if (kind === 'pdf' && url) {
    return (
      <iframe
        className="h-full min-h-[65dvh] w-full rounded-md bg-card"
        src={url}
        title={`Preview of ${title}`}
      />
    )
  }
  if (kind === 'text') {
    return (
      <pre className="max-h-full w-full overflow-auto whitespace-pre-wrap break-words p-4 text-left font-mono text-sm text-foreground">
        {text}
      </pre>
    )
  }
  if (kind === 'audio' && url) {
    // The backend returns media bytes only and exposes no caption-track contract.
    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <audio className="w-full max-w-2xl" src={url} controls />
  }
  if (kind === 'video' && url) {
    // The backend returns media bytes only and exposes no caption-track contract.
    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <video className="max-h-full max-w-full" src={url} controls />
  }

  return (
    <div className="flex max-w-sm flex-col items-center gap-3 text-center">
      <FileQuestion className="text-primary" aria-hidden="true" size={44} />
      <p className="font-semibold text-foreground">Preview isn&apos;t available for this format.</p>
      <p className="text-sm text-muted-foreground">
        Download the file to open it with an application on your device.
      </p>
    </div>
  )
}
