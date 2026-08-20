import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function AdminLayout() {
  return (
    <div className="min-h-dvh bg-canvas p-3 md:p-5">
      <div className="mx-auto flex min-h-dvh max-w-screen-xl flex-col gap-6 rounded-2xl bg-surface p-5 shadow-rest md:p-8">
        <header className="flex items-start justify-between gap-4 border-b border-border pb-6">
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Admin</p>
            <h1 className="font-display text-2xl font-bold text-foreground">SkyVault operations</h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
