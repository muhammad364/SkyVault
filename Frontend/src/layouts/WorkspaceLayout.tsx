import { Outlet } from 'react-router-dom'
import { CommandBar } from '@/components/layout/CommandBar'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { WorkspaceRail } from '@/components/layout/WorkspaceRail'

export function WorkspaceLayout() {
  return (
    <div className="min-h-dvh bg-canvas p-3 pb-24 md:p-5">
      <div className="mx-auto flex max-w-screen-xl gap-5">
        <WorkspaceRail />
        <div className="min-w-0 flex-1 rounded-2xl bg-surface p-5 shadow-rest md:p-8">
          <header className="flex flex-col gap-6 pb-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand">
                Your vault
              </p>
              <h1 className="font-display text-3xl font-bold leading-tight text-foreground text-balance">
                A calm place for everything you keep.
              </h1>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:justify-end">
              <CommandBar />
              <ThemeToggle />
            </div>
          </header>
          <main className="min-h-96">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
