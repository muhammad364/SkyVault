import { Outlet } from 'react-router-dom'
import { BrandSignature } from '@/components/brand/BrandSignature'
import { AdminRail } from '@/features/admin/components/AdminRail'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function AdminLayout() {
  return (
    <div className="min-h-dvh bg-canvas p-3 pb-24 md:p-5">
      <div className="mx-auto flex max-w-screen-xl gap-4">
        <AdminRail />
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl bg-surface p-4 shadow-rest sm:p-5 md:p-6">
          <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <div className="min-w-0">
              <div className="md:hidden">
                <BrandSignature />
              </div>
              <div className="hidden min-w-0 md:block">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
                  Administration
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  Role-restricted operations console
                </p>
              </div>
            </div>
            <ThemeToggle />
          </header>
          <main className="min-h-96 min-w-0 pt-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
