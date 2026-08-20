import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function PublicLayout() {
  return (
    <div className="min-h-dvh bg-canvas p-3 md:p-5">
      <div className="mx-auto flex min-h-dvh max-w-screen-xl flex-col gap-8 rounded-2xl bg-surface p-6 shadow-rest md:p-8">
        <header className="flex items-center justify-between gap-4">
          <img src="/brand/skyvault-logo-horizontal.png" className="h-10 w-auto dark:hidden" alt="SkyVault" />
          <img src="/brand/skyvault-logo-horizontal-dark.png" className="hidden h-10 w-auto dark:block" alt="SkyVault" />
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
