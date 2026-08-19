import { lazy, Suspense } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'

const DesignSystemPage = lazy(() => import('@/pages/DesignSystemPage'))

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/design-system" replace /> },
  {
    path: '/design-system',
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <DesignSystemPage />
      </Suspense>
    ),
  },
])
