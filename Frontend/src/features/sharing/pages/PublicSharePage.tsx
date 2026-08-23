import { Download, LoaderCircle, ShieldCheck, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { RequestCancelledError } from '@/api/errors'
import { BrandSignature } from '@/components/brand/BrandSignature'
import { ErrorState } from '@/components/feedback/ErrorState'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/button'
import { SharedContentViewer } from '@/features/sharing/components/SharedContentViewer'
import { publicShareErrorContent } from '@/features/sharing/lib/publicShareErrorContent'
import { sharingService } from '@/features/sharing/services/sharing.service'

type PreviewState = 'loading' | 'ready' | 'cancelled' | 'error'

export default function PublicSharePage() {
  const { shareToken = '' } = useParams<{ shareToken: string }>()
  const previewController = useRef<AbortController | null>(null)
  const downloadController = useRef<AbortController | null>(null)
  const mounted = useRef(true)
  const [state, setState] = useState<PreviewState>('loading')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [text, setText] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [downloadNotice, setDownloadNotice] = useState<{
    kind: 'neutral' | 'error'
    text: string
  } | null>(null)

  const loadPreview = useCallback(async () => {
    previewController.current?.abort()
    const controller = new AbortController()
    previewController.current = controller
    setState('loading')
    setError(null)
    setProgress(null)
    setBlob(null)
    setText(null)
    setUrl(null)
    try {
      const response = await sharingService.previewSharedFile(shareToken, {
        signal: controller.signal,
        onDownloadProgress: ({ loaded, total }) => {
          if (total && mounted.current)
            setProgress(Math.min(100, Math.round((loaded / total) * 100)))
        },
      })
      if (!mounted.current) return
      setBlob(response)
      if (response.type === 'text/plain') setText(await response.text())
      else if (response.type) setUrl(URL.createObjectURL(response))
      setState('ready')
    } catch (caught) {
      if (!mounted.current) return
      if (caught instanceof RequestCancelledError || controller.signal.aborted)
        setState('cancelled')
      else {
        setError(caught)
        setState('error')
      }
    }
  }, [shareToken])

  useEffect(() => {
    mounted.current = true
    void loadPreview()
    return () => {
      mounted.current = false
      previewController.current?.abort()
      downloadController.current?.abort()
    }
  }, [loadPreview])

  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url)
    },
    [url],
  )

  const download = async () => {
    const controller = new AbortController()
    downloadController.current = controller
    setDownloading(true)
    setDownloadProgress(null)
    setDownloadNotice(null)
    try {
      const result = await sharingService.downloadSharedFile(shareToken, {
        signal: controller.signal,
        onDownloadProgress: ({ loaded, total }) => {
          if (total && mounted.current)
            setDownloadProgress(Math.min(100, Math.round((loaded / total) * 100)))
        },
      })
      const downloadUrl = URL.createObjectURL(result.blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = result.fileName ?? 'shared-file'
      anchor.click()
      URL.revokeObjectURL(downloadUrl)
    } catch (caught) {
      if (caught instanceof RequestCancelledError || controller.signal.aborted) {
        setDownloadNotice({ kind: 'neutral', text: 'Download stopped. Nothing changed.' })
      } else {
        setDownloadNotice({
          kind: 'error',
          text: publicShareErrorContent(caught)[1],
        })
      }
    } finally {
      if (mounted.current) setDownloading(false)
    }
  }

  const [errorTitle, errorDescription] = publicShareErrorContent(error)

  return (
    <div className="min-h-dvh bg-canvas p-3 md:p-5">
      <div className="mx-auto grid min-h-[calc(100dvh-1.5rem)] max-w-screen-lg gap-5 rounded-2xl bg-surface p-4 shadow-rest md:min-h-[calc(100dvh-2.5rem)] md:p-6">
        <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <BrandSignature variant="compact" />
          <ThemeToggle />
        </header>
        <main className="grid content-start gap-4" aria-labelledby="shared-file-heading">
          <div className="text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
              <ShieldCheck aria-hidden="true" size={21} />
            </span>
            <p className="mt-3 text-xs font-semibold text-brand">Private view-only share</p>
            <h1
              id="shared-file-heading"
              className="font-display text-2xl font-bold text-foreground"
            >
              A file was shared with you
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              SkyVault exposes no owner details on this public page.
            </p>
          </div>

          {state === 'error' ? (
            <ErrorState
              title={errorTitle}
              description={errorDescription}
              onRetry={() => void loadPreview()}
            />
          ) : null}
          {state === 'cancelled' ? (
            <ErrorState
              title="Preview stopped."
              description="Nothing changed. You can prepare the preview again."
              onRetry={() => void loadPreview()}
            />
          ) : null}
          {state === 'loading' ? (
            <section
              className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-xl bg-card p-5 shadow-rest"
              role="status"
            >
              <LoaderCircle
                className="animate-spin text-primary motion-reduce:animate-none"
                aria-hidden="true"
                size={32}
              />
              <p className="font-semibold text-foreground">
                Preparing shared preview{progress !== null ? ` · ${progress}%` : ''}
              </p>
              <div
                className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-card-muted"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress ?? undefined}
              >
                <div
                  className={
                    progress === null
                      ? 'h-full w-1/3 animate-pulse rounded-full bg-primary-action motion-reduce:animate-none'
                      : 'h-full rounded-full bg-primary-action'
                  }
                  style={progress === null ? undefined : { width: `${progress}%` }}
                />
              </div>
              <Button variant="ghost" onClick={() => previewController.current?.abort()}>
                <X aria-hidden="true" size={18} /> Cancel
              </Button>
            </section>
          ) : null}
          {state === 'ready' && blob ? (
            <section className="flex min-h-72 items-center justify-center overflow-hidden rounded-xl bg-card-muted p-3 shadow-rest">
              <SharedContentViewer blob={blob} url={url} text={text} />
            </section>
          ) : null}
          {state === 'ready' ? (
            <div className="flex flex-col items-center gap-2">
              <Button disabled={downloading} onClick={() => void download()}>
                <Download aria-hidden="true" size={18} />{' '}
                {downloading
                  ? `Downloading${downloadProgress !== null ? ` · ${downloadProgress}%` : ''}`
                  : 'Download shared file'}
              </Button>
              {downloading ? (
                <Button variant="ghost" onClick={() => downloadController.current?.abort()}>
                  <X aria-hidden="true" size={18} /> Cancel download
                </Button>
              ) : null}
              {downloadNotice ? (
                <p
                  className={
                    downloadNotice.kind === 'error'
                      ? 'text-sm text-danger'
                      : 'text-sm text-muted-foreground'
                  }
                  aria-live="polite"
                >
                  {downloadNotice.text}
                </p>
              ) : null}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
