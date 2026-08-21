import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { LazyThreeScene } from '@/components/three/LazyThreeScene'
import { SceneErrorBoundary } from '@/components/three/SceneErrorBoundary'
import { SceneFallback } from '@/components/three/SceneFallback'
import { Button } from '@/components/ui/button'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const LandingVaultScene = lazy(() => import('@/features/marketing/components/LandingVaultScene'))
const fallbackSrc = '/brand/landing-vault-fallback-light-v3.png'
const fallbackDarkSrc = '/brand/landing-vault-fallback-dark-v3.png'

const easing = [0.22, 1, 0.36, 1] as const

export function LandingHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const sequenceTimer = useRef<number>()
  const [engaged, setEngaged] = useState(false)
  const isVisible = useInView(sectionRef, { amount: 0.25 })
  const { isMd } = useBreakpoint()
  const reducedMotion = useReducedMotion()
  const hasLimitedHardware = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4
  const canRenderThree = isMd && !reducedMotion && !hasLimitedHardware

  useEffect(() => () => window.clearTimeout(sequenceTimer.current), [])

  const triggerLockSequence = () => {
    if (!canRenderThree) return
    window.clearTimeout(sequenceTimer.current)
    setEngaged(true)
    sequenceTimer.current = window.setTimeout(() => setEngaged(false), 320)
  }

  const itemMotion = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }

  return (
    <section
      ref={sectionRef}
      className="grid scroll-mt-32 items-center gap-8 lg:grid-cols-2 lg:gap-12"
      aria-labelledby="landing-heading"
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.04 } } }}
        className="flex min-w-0 flex-col gap-6 md:gap-8"
      >
        <motion.p
          variants={itemMotion}
          transition={{ duration: 0.32, ease: easing }}
          className="text-base font-semibold text-brand md:text-lg"
        >
          Your files. Your space. Always secure.
        </motion.p>
        <motion.div
          variants={itemMotion}
          transition={{ duration: 0.32, ease: easing }}
          className="flex flex-col gap-4"
        >
          <h1
            id="landing-heading"
            className="max-w-2xl text-balance font-display text-5xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl"
          >
            A quieter home for every file.
          </h1>
          <p className="max-w-xl text-pretty text-lg text-secondary-foreground md:text-xl">
            Secure storage, simple plans, and intelligent search come together in one calm personal
            workspace.
          </p>
        </motion.div>
        <motion.div
          variants={itemMotion}
          transition={{ duration: 0.32, ease: easing }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Button asChild className="text-base">
            <Link to="/auth/register">
              Create your vault <ArrowRight aria-hidden="true" size={20} />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-base">
            <Link to="/auth/login">Sign in to SkyVault</Link>
          </Button>
        </motion.div>
      </motion.div>
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: reducedMotion ? 0 : 0.16, ease: easing }}
        className="min-w-0 rounded-2xl bg-canvas-strong p-6 shadow-float md:p-8"
        tabIndex={canRenderThree ? 0 : undefined}
        onPointerEnter={triggerLockSequence}
        onFocus={triggerLockSequence}
        aria-label="Interactive SkyVault safe"
      >
        {canRenderThree ? (
          <SceneErrorBoundary
            label="A heavy SkyVault safe with a circular locking door"
            imageSrc={fallbackSrc}
            darkImageSrc={fallbackDarkSrc}
          >
            <Suspense
              fallback={
                <SceneFallback
                  label="A heavy SkyVault safe"
                  imageSrc={fallbackSrc}
                  darkImageSrc={fallbackDarkSrc}
                />
              }
            >
              <LazyThreeScene
                label="A heavy SkyVault safe with a circular locking door"
                fallbackSrc={fallbackSrc}
                fallbackDarkSrc={fallbackDarkSrc}
              >
                <LandingVaultScene active={isVisible} engaged={engaged} />
              </LazyThreeScene>
            </Suspense>
          </SceneErrorBoundary>
        ) : (
          <SceneFallback
            label="A heavy SkyVault safe with a circular locking door"
            imageSrc={fallbackSrc}
            darkImageSrc={fallbackDarkSrc}
          />
        )}
      </motion.div>
    </section>
  )
}
