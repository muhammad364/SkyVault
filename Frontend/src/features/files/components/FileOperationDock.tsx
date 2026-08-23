import { Check, CircleStop, LoaderCircle, RotateCcw, Trash2, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useFileOperationsStore } from '@/features/files/store/fileOperations.store'

const activeStatuses = ['queued', 'transferring', 'processing']

function statusLabel(status: string, progress: number | null, kind: string) {
  if (status === 'queued') return 'Queued'
  if (status === 'transferring') return progress === null ? 'Transferring' : `${progress}%`
  if (status === 'processing') {
    if (kind === 'upload' || kind === 'replace') return 'Securing in your vault'
    if (kind === 'preview' || kind === 'download') return 'Preparing transfer'
    return 'Working in your vault'
  }
  if (status === 'completed') return 'Complete'
  if (status === 'cancelled') return 'Stopped'
  return 'Needs attention'
}

export function FileOperationDock() {
  const operations = useFileOperationsStore((state) => state.operations)
  const cancel = useFileOperationsStore((state) => state.cancel)
  const retry = useFileOperationsStore((state) => state.retry)
  const stopQueued = useFileOperationsStore((state) => state.stopQueued)
  const remove = useFileOperationsStore((state) => state.remove)
  const clearFinished = useFileOperationsStore((state) => state.clearFinished)
  const dismissalTimers = useRef(new Map<string, number>())

  useEffect(() => {
    const dismissibleIds = new Set(
      operations
        .filter(
          (operation) =>
            ['completed', 'cancelled'].includes(operation.status) ||
            (operation.kind === 'preview' && operation.status === 'failed'),
        )
        .map((operation) => operation.id),
    )

    dismissibleIds.forEach((id) => {
      if (dismissalTimers.current.has(id)) return
      const timer = window.setTimeout(() => {
        dismissalTimers.current.delete(id)
        remove(id)
      }, 3000)
      dismissalTimers.current.set(id, timer)
    })

    dismissalTimers.current.forEach((timer, id) => {
      if (operations.some((operation) => operation.id === id)) return
      window.clearTimeout(timer)
      dismissalTimers.current.delete(id)
    })
  }, [operations, remove])

  useEffect(
    () => () => {
      dismissalTimers.current.forEach((timer) => window.clearTimeout(timer))
      dismissalTimers.current.clear()
    },
    [],
  )

  const visibleOperations = operations.filter((operation) => operation.kind !== 'preview')

  if (visibleOperations.length === 0) return null

  const hasFinished = visibleOperations.some(
    (operation) => !activeStatuses.includes(operation.status),
  )

  return (
    <aside
      className="fixed inset-x-3 bottom-20 z-40 ml-auto max-h-[min(26rem,60dvh)] w-[calc(100vw-1.5rem)] max-w-md overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-card/95 p-3 shadow-float backdrop-blur md:inset-x-auto md:bottom-5 md:right-5 md:w-[min(28rem,calc(100vw-2.5rem))]"
      aria-label="File operations"
      aria-live="polite"
    >
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-semibold text-brand">Vault activity</p>
          <h2 className="font-display text-base font-bold text-foreground">Operations</h2>
        </div>
        {hasFinished ? (
          <Button variant="ghost" className="min-h-11 px-3" onClick={clearFinished}>
            <Trash2 aria-hidden="true" size={16} /> Clear finished
          </Button>
        ) : null}
      </div>
      <ul className="grid gap-2">
        {visibleOperations.map((operation) => {
          const active = activeStatuses.includes(operation.status)
          return (
            <li key={operation.id} className="min-w-0 overflow-hidden rounded-lg bg-card-muted p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card text-primary">
                  {operation.status === 'completed' ? (
                    <Check aria-hidden="true" size={16} />
                  ) : active ? (
                    <LoaderCircle
                      className="animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                      size={16}
                    />
                  ) : (
                    <CircleStop aria-hidden="true" size={16} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-semibold text-foreground"
                    title={operation.label}
                  >
                    {operation.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {operation.completedCount !== undefined && operation.totalCount
                      ? `${operation.completedCount} of ${operation.totalCount} · `
                      : ''}
                    {statusLabel(operation.status, operation.progress, operation.kind)}
                  </p>
                </div>
                {operation.cancellable ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => cancel(operation.id)}
                    aria-label={`Cancel ${operation.label}`}
                  >
                    <X aria-hidden="true" size={18} />
                  </Button>
                ) : active && operation.totalCount && operation.totalCount > 1 ? (
                  <Button variant="ghost" className="px-3" onClick={() => stopQueued(operation.id)}>
                    Stop queued
                  </Button>
                ) : !active &&
                  ['failed', 'cancelled'].includes(operation.status) &&
                  ['upload', 'replace'].includes(operation.kind) ? (
                  <div className="flex shrink-0 items-center">
                    <Button variant="ghost" className="px-3" onClick={() => retry(operation.id)}>
                      <RotateCcw aria-hidden="true" size={16} /> Retry
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(operation.id)}
                      aria-label={`Dismiss ${operation.label}`}
                    >
                      <X aria-hidden="true" size={18} />
                    </Button>
                  </div>
                ) : !active ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(operation.id)}
                    aria-label={`Dismiss ${operation.label}`}
                  >
                    <X aria-hidden="true" size={18} />
                  </Button>
                ) : null}
              </div>
              {operation.status === 'transferring' && operation.progress !== null ? (
                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-card"
                  role="progressbar"
                  aria-label={operation.label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={operation.progress}
                >
                  <div
                    className="h-full rounded-full bg-primary-action transition-[width] duration-micro"
                    style={{ width: `${operation.progress}%` }}
                  />
                </div>
              ) : active ? (
                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-card"
                  role="progressbar"
                  aria-label={`${operation.label}: ${statusLabel(operation.status, null, operation.kind)}`}
                >
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-primary-action motion-reduce:animate-none" />
                </div>
              ) : null}
              {operation.error ? (
                <p className="mt-2 text-xs text-danger" role="alert">
                  {operation.error}
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
