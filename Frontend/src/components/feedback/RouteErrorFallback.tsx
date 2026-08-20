import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { ApiError } from '@/api/errors'
import { ErrorPage } from '@/pages/errors/ErrorPage'

function statusFromRouteError(error: unknown) {
  if (isRouteErrorResponse(error)) return error.status
  if (error instanceof ApiError) return error.status
  return 500
}

function traceFromRouteError(error: unknown) {
  if (error instanceof ApiError) return error.traceId
  return undefined
}

export function RouteErrorFallback() {
  const error = useRouteError()

  return <ErrorPage status={statusFromRouteError(error)} traceId={traceFromRouteError(error)} />
}
