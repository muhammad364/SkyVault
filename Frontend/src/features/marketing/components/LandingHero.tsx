import { lazy, Suspense } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LazyThreeScene } from '@/components/three/LazyThreeScene'
import { SceneErrorBoundary } from '@/components/three/SceneErrorBoundary'
import { SceneFallback } from '@/components/three/SceneFallback'
import { Button } from '@/components/ui/button'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const LandingVaultScene = lazy(() => import('@/features/marketing/components/LandingVaultScene'))

export function LandingHero() {
  const { isMd } = useBreakpoint()
  const reducedMotion = useReducedMotion()
  const hasLimitedHardware = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4
  const initial = reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
  const animate = reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
  const canRenderThree = isMd && !reducedMotion && !hasLimitedHardware

  return (
    <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12" aria-labelledby="landing-heading">
      <motion.div initial={initial} animate={animate} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }} className="flex min-w-0 flex-col gap-6">
        <p className="text-sm font-semibold text-primary">Your files. Your space. Always secure.</p>
        <div className="flex flex-col gap-4">
          <h1 id="landing-heading" className="max-w-2xl text-balance font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
            A quieter home for every file.
          </h1>
          <p className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            SkyVault brings secure storage, simple plans, and intelligent search into one calm personal workspace.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild>
            <Link to="/auth?mode=register">
              Create your vault <ArrowRight aria-hidden="true" size={20} />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/auth?mode=login">Sign in to SkyVault</Link>
          </Button>
        </div>
      </motion.div>
      <div className="min-w-0 rounded-2xl bg-canvas-strong p-6 shadow-float md:p-8">
        {canRenderThree ? (
          <SceneErrorBoundary label="A SkyVault vault door">
            <Suspense fallback={<SceneFallback label="A SkyVault vault door" />}>
              <LazyThreeScene label="A SkyVault vault door">
                <LandingVaultScene />
              </LazyThreeScene>
            </Suspense>
          </SceneErrorBoundary>
        ) : <SceneFallback label="A SkyVault vault door" />}
      </div>
    </section>
  )
}
