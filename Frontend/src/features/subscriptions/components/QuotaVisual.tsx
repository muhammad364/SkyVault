import { lazy, Suspense } from 'react'
import { LazyThreeScene } from '@/components/three/LazyThreeScene'

const QuotaVolumeScene = lazy(() => import('@/features/subscriptions/components/QuotaVolumeScene'))

interface QuotaVisualProps {
  usagePercentage: number
}

export function QuotaVisual({ usagePercentage }: QuotaVisualProps) {
  return (
    <LazyThreeScene
      label={`A vault volume filled to ${usagePercentage}% of your storage allocation`}
      fallbackSrc="/brand/quota-vault-fallback.svg"
      fallbackDarkSrc="/brand/quota-vault-fallback-dark-v3.svg"
    >
      <Suspense fallback={null}>
        <QuotaVolumeScene usagePercentage={usagePercentage} />
      </Suspense>
    </LazyThreeScene>
  )
}
