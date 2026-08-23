import { lazy, Suspense, type ComponentProps } from 'react'
import { SceneFallback } from '@/components/three/SceneFallback'
import { SceneErrorBoundary } from '@/components/three/SceneErrorBoundary'

const ThreeScene = lazy(() =>
  import('@/components/three/ThreeScene').then((module) => ({ default: module.ThreeScene })),
)

export function LazyThreeScene(props: ComponentProps<typeof ThreeScene>) {
  return (
    <SceneErrorBoundary
      label={props.label}
      imageSrc={props.fallbackSrc}
      darkImageSrc={props.fallbackDarkSrc}
      fallback={props.fallback}
    >
      <Suspense
        fallback={
          props.fallback ?? (
            <SceneFallback
              label={props.label}
              imageSrc={props.fallbackSrc}
              darkImageSrc={props.fallbackDarkSrc}
            />
          )
        }
      >
        <ThreeScene {...props} />
      </Suspense>
    </SceneErrorBoundary>
  )
}
