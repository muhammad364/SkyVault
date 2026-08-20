import { Outlet } from 'react-router-dom'
import { BrandSignature } from '@/components/brand/BrandSignature'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { AuthVisual } from '@/features/auth/components/AuthVisual'

export function AuthLayout() {
  return (
    <div className="min-h-dvh bg-canvas p-3 md:p-5">
      <main className="mx-auto min-h-dvh max-w-screen-xl rounded-2xl bg-surface p-4 shadow-rest md:p-8">
        <div className="grid min-h-dvh gap-8 md:grid-cols-2">
          <aside className="hidden overflow-hidden rounded-2xl bg-canvas-strong p-8 md:flex md:flex-col md:justify-between">
            <BrandSignature />
            <AuthVisual />
            <p className="max-w-sm text-pretty text-sm text-foreground">Your files. Your space. Always secure.</p>
          </aside>
          <section className="flex min-w-0 flex-col gap-8">
            <div className="flex items-center justify-between gap-4 md:justify-end">
              <BrandSignature className="md:hidden" />
              <ThemeToggle />
            </div>
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
              <Outlet />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
