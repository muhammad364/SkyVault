import { useParams } from 'react-router-dom'
import { ErrorPage } from '@/pages/errors/ErrorPage'
import type { ErrorStatus } from '@/pages/errors/errorContent'

const supportedStatuses = new Set(['400', '401', '403', '404', '408', '413', '429', '500', '503'])

export function StatusErrorPage() {
  const { status = 'generic' } = useParams()

  if (status === 'offline') return <ErrorPage status="offline" />
  if (!supportedStatuses.has(status)) return <ErrorPage status="generic" />

  return <ErrorPage status={Number(status) as ErrorStatus} />
}

export default StatusErrorPage
