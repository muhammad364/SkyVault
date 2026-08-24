import { useCallback, useEffect, useRef, useState } from 'react'
import { RequestCancelledError } from '@/api/errors'
import { fileErrorMessage } from '@/features/files/lib/fileErrorMessage'
import { previewKind } from '@/features/files/lib/previewKind'
import { filesService } from '@/features/files/services/files.service'

export type FilePreviewStatus = 'preparing' | 'transferring' | 'success' | 'cancelled' | 'error'

export function useFilePreview(fileId: string | undefined) {
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<FilePreviewStatus>('preparing')
  const [progress, setProgress] = useState<number | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState('')
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!fileId) {
      setStatus('error')
      setError("This preview link doesn't identify a file.")
      return
    }
    const controller = new AbortController()
    controllerRef.current = controller
    let active = true
    let objectUrl: string | null = null
    setStatus('preparing')
    setProgress(null)
    setBlob(null)
    setUrl(null)
    setText(null)
    setError('')

    void filesService
      .preview(fileId, {
        signal: controller.signal,
        onDownloadProgress: ({ loaded, total }) => {
          if (!active || !total) return
          setStatus('transferring')
          setProgress(Math.min(100, Math.round((loaded / total) * 100)))
        },
      })
      .then(async (result) => {
        if (!active) return
        const kind = previewKind(result.type)
        let nextText: string | null = null
        if (kind === 'text') nextText = await result.text()
        else if (kind !== 'unsupported') objectUrl = URL.createObjectURL(result)
        if (!active) {
          if (objectUrl) URL.revokeObjectURL(objectUrl)
          return
        }
        setBlob(result)
        setText(nextText)
        setUrl(objectUrl)
        setProgress(100)
        setStatus('success')
      })
      .catch((reason: unknown) => {
        if (!active) return
        if (reason instanceof RequestCancelledError || controller.signal.aborted) {
          setStatus('cancelled')
          setProgress(null)
          return
        }
        setStatus('error')
        setProgress(null)
        setError(
          fileErrorMessage(reason, "We couldn't prepare this preview.") ?? 'Preview stopped.',
        )
      })

    return () => {
      active = false
      controller.abort()
      controllerRef.current = null
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [attempt, fileId])

  const cancel = useCallback(() => controllerRef.current?.abort(), [])
  const retry = useCallback(() => setAttempt((current) => current + 1), [])

  return { status, progress, blob, url, text, error, cancel, retry }
}
