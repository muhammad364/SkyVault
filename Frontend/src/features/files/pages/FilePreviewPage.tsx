import { ArrowLeft, Download, Expand, LoaderCircle, Minimize, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SafeContentViewer } from '@/features/files/components/SafeContentViewer'
import { useFileOperations } from '@/features/files/components/FileOperationProvider'
import { useFilePreview } from '@/features/files/hooks/useFilePreview'
import { useUserFiles } from '@/features/files/hooks/useUserFiles'

interface PreviewLocationState {
  fileName?: string
  returnTo?: string
}

function safeReturnTo(value: string | undefined) {
  return value?.startsWith('/vault/') && !value.startsWith('/vault/preview/')
    ? value
    : '/vault/files'
}

export default function FilePreviewPage() {
  const { fileId } = useParams<{ fileId: string }>()
  const location = useLocation()
  const state = (location.state ?? {}) as PreviewLocationState
  const files = useUserFiles()
  const preview = useFilePreview(fileId)
  const operations = useFileOperations()
  const viewerRef = useRef<HTMLDivElement>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState('')
  const matchedFile = useMemo(
    () => files.data?.find((file) => file.fileId === fileId),
    [fileId, files.data],
  )
  const fileName = state.fileName || matchedFile?.fileName || 'File preview'
  const returnTo = safeReturnTo(state.returnTo)

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === viewerRef.current)
    document.addEventListener('fullscreenchange', update)
    return () => document.removeEventListener('fullscreenchange', update)
  }, [])

  const toggleFullscreen = async () => {
    if (!document.fullscreenEnabled || !viewerRef.current) return
    try {
      setFullscreenError('')
      if (document.fullscreenElement) await document.exitFullscreen()
      else await viewerRef.current.requestFullscreen()
    } catch {
      setFullscreenError('Full screen is not available in this browser window.')
    }
  }

  return (
    <section className="flex min-h-[calc(100dvh-4rem)] min-w-0 flex-col overflow-hidden rounded-xl bg-card shadow-rest">
      <header className="flex min-w-0 flex-wrap items-center gap-2 border-b border-border p-3 md:p-4">
        <Button asChild variant="secondary" size="icon">
          <Link to={returnTo} aria-label="Back to files">
            <ArrowLeft aria-hidden="true" size={19} />
          </Link>
        </Button>
        <div className="min-w-0 flex-1 px-1">
          <p className="text-xs font-semibold text-brand">Secure preview</p>
          <h2
            className="truncate font-display text-base font-bold text-foreground"
            title={fileName}
          >
            {fileName}
          </h2>
        </div>
        {document.fullscreenEnabled ? (
          <Button type="button" variant="secondary" onClick={() => void toggleFullscreen()}>
            {fullscreen ? (
              <Minimize aria-hidden="true" size={18} />
            ) : (
              <Expand aria-hidden="true" size={18} />
            )}
            <span className="hidden sm:inline">
              {fullscreen ? 'Exit full screen' : 'Full screen'}
            </span>
          </Button>
        ) : null}
        {fileId ? (
          <Button
            onClick={() =>
              void operations.downloadFile(
                fileId,
                matchedFile?.fileName || state.fileName || 'skyvault-file',
              )
            }
          >
            <Download aria-hidden="true" size={18} /> Download
          </Button>
        ) : null}
      </header>

      <div
        ref={viewerRef}
        className="flex min-h-[65dvh] min-w-0 flex-1 items-center justify-center overflow-hidden bg-card-muted p-3 md:p-5"
      >
        {preview.status === 'preparing' || preview.status === 'transferring' ? (
          <div
            className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg bg-card p-5 text-center shadow-rest"
            role="status"
          >
            <LoaderCircle
              className="animate-spin text-primary motion-reduce:animate-none"
              aria-hidden="true"
              size={30}
            />
            <div>
              <p className="font-semibold text-foreground">
                {preview.status === 'preparing' ? 'Preparing preview' : 'Opening your file'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                You can cancel without changing the file.
              </p>
            </div>
            <div className="w-full" aria-label="Preview transfer progress">
              <div className="h-2 overflow-hidden rounded-full bg-card-muted">
                <div
                  className={
                    preview.progress === null
                      ? 'h-full w-1/3 animate-pulse rounded-full bg-primary motion-reduce:animate-none'
                      : 'h-full rounded-full bg-primary'
                  }
                  style={preview.progress === null ? undefined : { width: `${preview.progress}%` }}
                />
              </div>
              {preview.progress !== null ? (
                <p className="mt-2 font-mono text-xs text-muted-foreground">{preview.progress}%</p>
              ) : null}
            </div>
            <Button type="button" variant="ghost" onClick={preview.cancel}>
              <X aria-hidden="true" size={18} /> Cancel preview
            </Button>
          </div>
        ) : preview.status === 'cancelled' ? (
          <div className="flex max-w-sm flex-col items-center gap-3 text-center" role="status">
            <p className="font-semibold text-foreground">Preview cancelled.</p>
            <p className="text-sm text-muted-foreground">Nothing was changed.</p>
            <Button type="button" variant="secondary" onClick={preview.retry}>
              <RotateCcw aria-hidden="true" size={18} /> Try again
            </Button>
          </div>
        ) : preview.status === 'error' ? (
          <div className="flex max-w-md flex-col items-center gap-3 text-center" role="alert">
            <p className="font-semibold text-foreground">This file stayed closed.</p>
            <p className="text-sm text-muted-foreground">{preview.error}</p>
            <Button type="button" variant="secondary" onClick={preview.retry}>
              <RotateCcw aria-hidden="true" size={18} /> Retry preview
            </Button>
          </div>
        ) : preview.blob ? (
          <SafeContentViewer
            blob={preview.blob}
            url={preview.url}
            text={preview.text}
            title={fileName}
          />
        ) : null}
      </div>
      <p className="sr-only" aria-live="polite">
        {fullscreenError}
      </p>
    </section>
  )
}
