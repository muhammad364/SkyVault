import { Link, Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/button'

export function PublicLayout() {
  return (
    <div className="min-h-dvh bg-canvas p-3 md:p-5">
      <div className="mx-auto flex min-h-dvh max-w-screen-xl flex-col gap-8 rounded-2xl bg-surface p-6 shadow-rest md:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="min-w-0" aria-label="SkyVault home">
            <img src="/brand/skyvault-logo-horizontal.png" className="h-10 w-auto dark:hidden" alt="SkyVault" />
            <img src="/brand/skyvault-logo-horizontal-dark.png" className="hidden h-10 w-auto dark:block" alt="SkyVault" />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/auth?mode=login">Sign in</Link>
            </Button>
          </div>
          <nav className="order-3 flex w-full items-center justify-between gap-3 sm:order-none sm:w-auto sm:justify-end" aria-label="Public navigation">
            <a className="text-sm font-semibold text-primary underline-offset-4 hover:underline" href="#how-it-works">How it works</a>
            <Button asChild className="flex-1 sm:flex-none">
              <Link to="/auth?mode=register">Create your vault</Link>
            </Button>
          </nav>
        </header>
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
