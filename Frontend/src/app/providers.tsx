import { QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import { queryClient } from '@/lib/queryClient'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <Toaster closeButton richColors position="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
