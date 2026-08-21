import { Canvas } from '@react-three/fiber'
import { Suspense, type ReactNode } from 'react'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SceneFallback } from '@/components/three/SceneFallback'

interface ThreeSceneProps {
  label: string
  children: ReactNode
  fallbackSrc?: string
  fallbackDarkSrc?: string
}

export function ThreeScene({ label, children, fallbackSrc, fallbackDarkSrc }: ThreeSceneProps) {
  const { isMd } = useBreakpoint()
  const reducedMotion = useReducedMotion()
  const hasLimitedHardware = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4

  if (!isMd || reducedMotion || hasLimitedHardware) {
    return <SceneFallback label={label} imageSrc={fallbackSrc} darkImageSrc={fallbackDarkSrc} />
  }

  return (
    <div className="aspect-square w-full" role="img" aria-label={label}>
      <Canvas dpr={[1, 1.75]} frameloop="demand" camera={{ position: [0, 0, 4], fov: 42 }}>
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
