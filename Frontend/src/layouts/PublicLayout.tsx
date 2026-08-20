import { Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BrandSignature } from '@/components/brand/BrandSignature'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function PublicLayout() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="min-h-dvh bg-canvas p-3 md:p-5">
      <div className="mx-auto min-h-dvh max-w-screen-xl rounded-2xl bg-surface p-4 shadow-rest md:p-8">
        <div className="flex min-h-dvh flex-col gap-8">
          <motion.header
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-3 z-20 rounded-xl border border-border bg-surface p-3 shadow-rest"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <Link to="/" className="min-w-0" aria-label="SkyVault home">
                  <BrandSignature />
                </Link>
                <ThemeToggle className="sm:hidden" />
              </div>
              <nav className="flex min-w-0 items-center gap-2" aria-label="Public navigation">
                <a
                  className="min-h-11 shrink-0 content-center rounded-full px-3 text-sm font-semibold text-primary transition duration-micro hover:bg-card-muted"
                  href="#how-it-works"
                >
                  How it works
                </a>
                <Button asChild variant="ghost" className="hidden lg:inline-flex">
                  <Link to="/auth?mode=login">Sign in</Link>
                </Button>
                <Button asChild className="min-w-0 flex-1 px-4 sm:flex-none">
                  <Link to="/auth?mode=register">Create your vault</Link>
                </Button>
                <ThemeToggle className="hidden sm:inline-flex" />
              </nav>
            </div>
          </motion.header>
          <main className="flex flex-1 flex-col">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
