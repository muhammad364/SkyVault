import { lazy, Suspense, type ComponentProps } from 'react'
import { SceneFallback } from '@/components/three/SceneFallback'

const ThreeScene = lazy(() =>
  import('@/components/three/ThreeScene').then((module) => ({ default: module.ThreeScene })),
)

export function LazyThreeScene(props: ComponentProps<typeof ThreeScene>) {
  return (
    <Suspense
      fallback={
        <SceneFallback
          label={props.label}
          imageSrc={props.fallbackSrc}
          darkImageSrc={props.fallbackDarkSrc}
        />
      }
    >
      <ThreeScene {...props} />
    </Suspense>
  )
}
