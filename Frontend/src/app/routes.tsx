import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RouteErrorFallback } from '@/components/feedback/RouteErrorFallback'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { LandingPageSkeleton } from '@/features/marketing/components/LandingPageSkeleton'
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
const AuthEntryRedirect = lazy(() => import('@/features/auth/pages/AuthEntryRedirect'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const CheckEmailPage = lazy(() => import('@/features/auth/pages/CheckEmailPage'))
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))
const AccountPage = lazy(() => import('@/features/account/pages/AccountPage'))
const StorageDashboardPage = lazy(
  () => import('@/features/subscriptions/pages/StorageDashboardPage'),
)
const SubscribeCheckoutPage = lazy(
  () => import('@/features/subscriptions/pages/SubscribeCheckoutPage'),
)
const AdditionalStorageCheckoutPage = lazy(
  () => import('@/features/subscriptions/pages/AdditionalStorageCheckoutPage'),
)
const RenewSubscriptionPage = lazy(
  () => import('@/features/subscriptions/pages/RenewSubscriptionPage'),
)
const WorkspaceHomePage = lazy(() => import('@/features/workspace/pages/WorkspaceHomePage'))

function withSuspense(element: JSX.Element, fallback: JSX.Element = <PageSkeleton />) {
  return <Suspense fallback={fallback}>{element}</Suspense>
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <PublicLayout />,
      errorElement: <RouteErrorFallback />,
      children: [{ index: true, element: withSuspense(<LandingPage />, <LandingPageSkeleton />) }],
    },
    {
      path: '/design-system',
      element: withSuspense(<DesignSystemPage />),
      errorElement: <RouteErrorFallback />,
    },
    {
      path: '/errors/:status',
      element: withSuspense(<StatusErrorPage />),
      errorElement: <RouteErrorFallback />,
    },
    {
      path: '/auth',
      element: (
        <PublicRoute>
          <AuthLayout />
        </PublicRoute>
      ),
      errorElement: <RouteErrorFallback />,
      children: [
        { index: true, element: withSuspense(<AuthEntryRedirect />) },
        { path: 'login', element: withSuspense(<LoginPage />) },
        { path: 'register', element: withSuspense(<RegisterPage />) },
        { path: 'check-email', element: withSuspense(<CheckEmailPage />) },
        { path: 'verify-email', element: withSuspense(<VerifyEmailPage />) },
        { path: 'forgot-password', element: withSuspense(<ForgotPasswordPage />) },
        { path: 'reset-password', element: withSuspense(<ResetPasswordPage />) },
      ],
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
        { index: true, element: withSuspense(<WorkspaceHomePage />) },
        { path: 'storage', element: withSuspense(<StorageDashboardPage />) },
        {
          path: 'storage/subscribe/:storagePlanId',
          element: withSuspense(<SubscribeCheckoutPage />),
        },
        { path: 'storage/additional', element: withSuspense(<AdditionalStorageCheckoutPage />) },
        { path: 'storage/renew', element: withSuspense(<RenewSubscriptionPage />) },
        { path: 'settings', element: withSuspense(<AccountPage />) },
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
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
)
