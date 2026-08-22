import { lazy, Suspense } from 'react'
import { LazyThreeScene } from '@/components/three/LazyThreeScene'

const FolderEmptyScene = lazy(() => import('@/features/files/components/FolderEmptyScene'))

export function EmptyFolderVisual() {
  return (
    <div className="w-44 max-w-full">
      <LazyThreeScene
        label="An open zinc and burgundy folder waiting for files"
        fallbackSrc="/brand/folder-empty-fallback.svg"
        fallbackDarkSrc="/brand/folder-empty-fallback-dark.svg"
      >
        <Suspense fallback={null}>
          <FolderEmptyScene />
        </Suspense>
      </LazyThreeScene>
    </div>
  )
}
