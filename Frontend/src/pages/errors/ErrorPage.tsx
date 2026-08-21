import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandSignature } from '@/components/brand/BrandSignature'
import { BrandMark } from '@/components/brand/BrandMark'
import { Button } from '@/components/ui/button'
import { errorContent, type ErrorStatus } from '@/pages/errors/errorContent'

interface ErrorPageProps {
  status: ErrorStatus | number
  traceId?: string
  onRetry?: () => void
}

function normalizeStatus(status: ErrorPageProps['status']): ErrorStatus {
  if (
    status === 400 ||
    status === 401 ||
    status === 403 ||
    status === 404 ||
    status === 408 ||
    status === 413 ||
    status === 429 ||
    status === 500 ||
    status === 503 ||
    status === 'offline' ||
    status === 'generic'
  ) {
    return status
  }

  if (typeof status === 'number' && status >= 500) return 500
  return 'generic'
}

export function ErrorPage({ status, traceId, onRetry }: ErrorPageProps) {
  const navigate = useNavigate()
  const resolvedStatus = normalizeStatus(status)
  const content = errorContent[resolvedStatus]
  const showRetry = content.canRetry || Boolean(onRetry)

  return (
    <main className="min-h-dvh bg-canvas p-3 md:p-5">
      <section className="mx-auto flex min-h-dvh max-w-screen-xl flex-col gap-8 rounded-2xl bg-surface p-6 shadow-rest md:p-8">
        <header className="flex items-center justify-between gap-4">
          <BrandSignature variant="compact" />
          <p className="font-mono text-[13px] text-muted-foreground">
            {typeof resolvedStatus === 'number' ? resolvedStatus : resolvedStatus.toUpperCase()}
          </p>
        </header>
        <div className="flex flex-1 items-center">
          <div className="grid w-full gap-8 md:grid-cols-2 md:items-center">
            <div className="flex max-w-2xl flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand">
                  {content.eyebrow}
                </p>
                <h1 className="font-display text-3xl font-bold leading-tight text-foreground text-balance md:text-4xl">
                  {content.title}
                </h1>
                <p className="max-w-lg text-pretty text-secondary-foreground">
                  {content.description}
                </p>
              </div>
              {traceId ? (
                <p className="w-fit rounded-full bg-card-muted px-4 py-2 font-mono text-[13px] text-muted-foreground">
                  Trace {traceId}
                </p>
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link to="/vault">
                    <ArrowLeft aria-hidden="true" size={18} />
                    Back to my vault
                  </Link>
                </Button>
                {showRetry ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      if (onRetry) {
                        onRetry()
                        return
                      }
                      navigate(0)
                    }}
                  >
                    <RotateCcw aria-hidden="true" size={18} />
                    Try again
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="hidden rounded-2xl bg-card-muted p-8 md:block">
              <BrandMark className="mx-auto h-32 w-32" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ErrorPage
