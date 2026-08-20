import { QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import { GlobalErrorBoundary } from '@/components/feedback/GlobalErrorBoundary'
import { OfflineBanner } from '@/components/layout/OfflineBanner'
import { AuthSessionManager } from '@/features/auth/components/AuthSessionManager'
import { queryClient } from '@/lib/queryClient'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthSessionManager />
        <GlobalErrorBoundary>{children}</GlobalErrorBoundary>
        <OfflineBanner />
        <Toaster closeButton richColors position="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
