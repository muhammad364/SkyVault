import { lazy, Suspense, useRef } from 'react'
import { useInView } from 'framer-motion'
import { LazyThreeScene } from '@/components/three/LazyThreeScene'
import { SceneErrorBoundary } from '@/components/three/SceneErrorBoundary'
import { SceneFallback } from '@/components/three/SceneFallback'

const AuthKeyScene = lazy(() => import('@/features/auth/components/AuthKeyScene'))
const fallbackSrc = '/brand/auth-key-fallback.svg'
const fallbackDarkSrc = '/brand/auth-key-fallback-dark-v3.svg'
const label = 'A SkyVault key connected to a circular vault dial'

export function AuthVisual() {
  const visualRef = useRef<HTMLDivElement>(null)
  const active = useInView(visualRef, { amount: 0.2 })

  return (
    <div ref={visualRef}>
      <SceneErrorBoundary label={label} imageSrc={fallbackSrc} darkImageSrc={fallbackDarkSrc}>
        <Suspense
          fallback={
            <SceneFallback label={label} imageSrc={fallbackSrc} darkImageSrc={fallbackDarkSrc} />
          }
        >
          <LazyThreeScene label={label} fallbackSrc={fallbackSrc} fallbackDarkSrc={fallbackDarkSrc}>
            <AuthKeyScene active={active} />
          </LazyThreeScene>
        </Suspense>
      </SceneErrorBoundary>
    </div>
  )
}
