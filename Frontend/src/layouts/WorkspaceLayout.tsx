import { Outlet } from 'react-router-dom'
import { CommandBar } from '@/components/layout/CommandBar'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { WorkspaceRail } from '@/components/layout/WorkspaceRail'
import { FileOperationDock } from '@/features/files/components/FileOperationDock'
import { FileOperationProvider } from '@/features/files/components/FileOperationProvider'

export function WorkspaceLayout() {
  return (
    <FileOperationProvider>
      <div className="min-h-dvh bg-canvas p-3 pb-24 md:p-5">
        <div className="mx-auto flex max-w-screen-xl gap-4">
          <WorkspaceRail />
          <div className="min-w-0 flex-1 rounded-2xl bg-surface p-5 shadow-rest md:p-6">
            <header className="flex flex-col gap-4 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
                  Your vault
                </p>
                <h1 className="font-display text-2xl font-bold leading-tight text-foreground text-balance">
                  A calm place for everything you keep.
                </h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                <CommandBar />
                <ThemeToggle />
              </div>
            </header>
            <main className="min-h-96">
              <Outlet />
            </main>
          </div>
        </div>
        <FileOperationDock />
      </div>
    </FileOperationProvider>
  )
}
