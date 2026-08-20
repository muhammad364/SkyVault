import { lazy, Suspense } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { RouteErrorFallback } from '@/components/feedback/RouteErrorFallback'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { WorkspaceLayout } from '@/layouts/WorkspaceLayout'
import { AdminRoute } from '@/routes/AdminRoute'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicRoute } from '@/routes/PublicRoute'
import { PublicLayout } from '@/layouts/PublicLayout'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const DesignSystemPage = lazy(() => import('@/pages/DesignSystemPage'))
const StatusErrorPage = lazy(() => import('@/pages/errors/StatusErrorPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const PhasePendingPage = lazy(() => import('@/pages/PhasePendingPage'))
const AdminPendingPage = lazy(() => import('@/pages/AdminPendingPage'))

function withSuspense(element: JSX.Element) {
  return <Suspense fallback={<PageSkeleton />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <RouteErrorFallback />,
    children: [{ index: true, element: withSuspense(<LandingPage />) }],
  },
  { path: '/design-system', element: withSuspense(<DesignSystemPage />), errorElement: <RouteErrorFallback /> },
  { path: '/errors/:status', element: withSuspense(<StatusErrorPage />), errorElement: <RouteErrorFallback /> },
  {
    path: '/auth',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    errorElement: <RouteErrorFallback />,
    children: [{ index: true, element: <Navigate to="/errors/401" replace /> }],
  },
  {
    path: '/vault',
    element: (
      <ProtectedRoute>
        <WorkspaceLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, element: withSuspense(<PhasePendingPage />) },
      { path: '*', element: withSuspense(<PhasePendingPage />) },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    errorElement: <RouteErrorFallback />,
    children: [{ index: true, element: withSuspense(<AdminPendingPage />) }],
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
})
