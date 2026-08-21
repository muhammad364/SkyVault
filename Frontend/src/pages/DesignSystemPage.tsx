import { Moon, Sun } from 'lucide-react'
import { type ReactNode } from 'react'
import { BrandSignature } from '@/components/brand/BrandSignature'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useUiStore } from '@/store/ui.store'

interface ShowcaseSectionProps {
  title: string
  children: ReactNode
}

function ShowcaseSection({ title, children }: ShowcaseSectionProps) {
  return (
    <section className="flex flex-col gap-6" aria-labelledby={`${title.toLowerCase()}-heading`}>
      <h2
        id={`${title.toLowerCase()}-heading`}
        className="font-display text-2xl font-bold text-foreground"
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function ThemePreview({ theme, children }: { theme: 'light' | 'dark'; children: ReactNode }) {
  return (
    <div
      className={theme === 'dark' ? 'dark rounded-xl bg-canvas p-4' : 'rounded-xl bg-canvas p-4'}
    >
      <Card className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {theme} theme
        </p>
        {children}
      </Card>
    </div>
  )
}

function DesignSystemPage() {
  const themePreference = useUiStore((state) => state.themePreference)
  const setThemePreference = useUiStore((state) => state.setThemePreference)

  return (
    <main className="min-h-dvh bg-canvas p-3 md:p-5">
      <div className="mx-auto flex min-h-dvh max-w-screen-xl flex-col gap-8 rounded-2xl bg-surface p-6 shadow-float md:p-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-3">
            <BrandSignature variant="compact" />
            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Phase 0
              </p>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Design system
              </h1>
              <p className="max-w-xl text-pretty text-secondary-foreground">
                The calm, accessible foundation for your personal workspace.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3" aria-label="Theme controls">
            <Button
              variant={themePreference === 'light' ? 'primary' : 'ghost'}
              size="icon"
              aria-label="Use light theme"
              onClick={() => setThemePreference('light')}
            >
              <Sun aria-hidden="true" size={20} />
            </Button>
            <Button
              variant={themePreference === 'dark' ? 'primary' : 'ghost'}
              size="icon"
              aria-label="Use dark theme"
              onClick={() => setThemePreference('dark')}
            >
              <Moon aria-hidden="true" size={20} />
            </Button>
            <Button
              variant={themePreference === 'system' ? 'primary' : 'ghost'}
              onClick={() => setThemePreference('system')}
            >
              System theme
            </Button>
          </div>
        </header>

        <ShowcaseSection title="Tokens">
          <div className="grid gap-6 md:grid-cols-2">
            <ThemePreview theme="light">
              <p className="text-foreground">Warm foreground</p>
              <p className="text-muted-foreground">Quiet supporting copy</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Neutral</Badge>
                <Badge variant="warning">Attention</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </ThemePreview>
            <ThemePreview theme="dark">
              <p className="text-foreground">Warm foreground</p>
              <p className="text-muted-foreground">Quiet supporting copy</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Neutral</Badge>
                <Badge variant="warning">Attention</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </ThemePreview>
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Controls">
          <Card className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary action</Button>
              <Button variant="ghost">Ghost action</Button>
              <Button variant="destructive">Remove item</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label
                htmlFor="design-system-email"
                className="flex flex-col gap-2 text-sm font-medium text-foreground"
              >
                Your email
                <Input id="design-system-email" type="email" placeholder="you@example.com" />
              </label>
              <label
                htmlFor="design-system-error"
                className="flex flex-col gap-2 text-sm font-medium text-foreground"
              >
                With supporting error
                <Input
                  id="design-system-error"
                  aria-invalid="true"
                  placeholder="A field with feedback"
                  className="border-danger"
                />
                <span className="text-sm text-danger">Check this detail and try again.</span>
              </label>
            </div>
          </Card>
        </ShowcaseSection>

        <ShowcaseSection title="Feedback states">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="flex flex-col gap-4" aria-label="Loading state example">
              <p className="font-display text-xl font-bold text-foreground">Loading</p>
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </Card>
            <EmptyState
              title="Nothing here yet"
              description="Your future vault content will always arrive with a clear next step."
              actionLabel="Learn more"
              onAction={() => undefined}
            />
            <ErrorState
              description="Your friendly retry state appears here without exposing service details."
              onRetry={() => undefined}
            />
          </div>
        </ShowcaseSection>
      </div>
    </main>
  )
}

export default DesignSystemPage
