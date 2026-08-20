import { ErrorPage } from '@/pages/errors/ErrorPage'

export function NotFoundPage() {
  return <ErrorPage status={404} />
}

export default NotFoundPage
