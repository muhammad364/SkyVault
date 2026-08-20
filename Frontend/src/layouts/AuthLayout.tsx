import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function AuthLayout() {
  return (
    <div className="min-h-dvh bg-canvas p-3 md:p-5">
      <main className="mx-auto grid min-h-dvh max-w-screen-xl gap-8 rounded-2xl bg-surface p-6 shadow-rest md:grid-cols-2 md:p-8">
        <aside className="hidden overflow-hidden rounded-2xl bg-canvas-strong p-8 md:flex md:flex-col md:justify-between">
          <img src="/brand/skyvault-logo-horizontal.png" className="h-10 w-fit dark:hidden" alt="SkyVault" />
          <img src="/brand/skyvault-logo-horizontal-dark.png" className="hidden h-10 w-fit dark:block" alt="SkyVault" />
          <div className="flex min-h-72 items-center justify-center rounded-2xl bg-card-muted">
            <img src="/brand/skyvault-mark.svg" className="h-32 w-32" alt="" />
          </div>
          <p className="max-w-sm text-pretty text-sm text-foreground">Your files. Your space. Always secure.</p>
        </aside>
        <section className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4 md:justify-end">
            <img src="/brand/skyvault-mark.svg" className="h-9 w-9 md:hidden" alt="SkyVault" />
            <ThemeToggle />
          </div>
          <Outlet />
        </section>
      </main>
    </div>
  )
}
