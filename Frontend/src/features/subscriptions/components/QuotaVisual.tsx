import { lazy, Suspense, useId } from 'react'
import { LazyThreeScene } from '@/components/three/LazyThreeScene'
import { boundedQuotaPercentage } from '@/features/subscriptions/lib/quotaPresentation'

const QuotaVolumeScene = lazy(() => import('@/features/subscriptions/components/QuotaVolumeScene'))

interface QuotaVisualProps {
  usagePercentage: number
}

function QuotaVaultFallback({ usagePercentage }: QuotaVisualProps) {
  const clipId = useId().replaceAll(':', '')
  const percentage = boundedQuotaPercentage(usagePercentage)
  const fillHeight = (percentage / 100) * 188
  const fillTop = 252 - fillHeight
  const signal =
    usagePercentage >= 95
      ? 'var(--danger)'
      : usagePercentage >= 80
        ? 'var(--warning-strong)'
        : 'var(--primary)'

  return (
    <div
      className="flex aspect-square w-full items-center justify-center rounded-lg bg-card-muted p-5"
      role="img"
      aria-label={`A vault volume filled to ${usagePercentage}% of your storage allocation`}
    >
      <svg viewBox="0 0 320 320" className="h-full w-full" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <rect x="78" y="64" width="164" height="188" rx="28" />
          </clipPath>
        </defs>
        <rect
          x="62"
          y="42"
          width="196"
          height="236"
          rx="44"
          fill="var(--zinc-door)"
          stroke="var(--zinc-300)"
          strokeWidth="10"
        />
        <rect x="78" y="64" width="164" height="188" rx="28" fill="var(--card-muted)" />
        <g clipPath={`url(#${clipId})`}>
          <rect
            x="78"
            y={fillTop}
            width="164"
            height={fillHeight}
            fill={signal}
            opacity="0.88"
            className="transition-all duration-page ease-vault"
          />
        </g>
        <circle cx="160" cy="137" r="49" fill="var(--zinc-door)" opacity="0.94" />
        <circle cx="160" cy="137" r="45" fill="none" stroke="var(--zinc-300)" strokeWidth="11" />
        <circle cx="160" cy="137" r="12" fill={signal} />
        <path
          d="M160 96v29M119 137h29M172 137h29M160 149v29"
          stroke="var(--zinc-300)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function QuotaVisual({ usagePercentage }: QuotaVisualProps) {
  const fallback = <QuotaVaultFallback usagePercentage={usagePercentage} />

  return (
    <LazyThreeScene
      label={`A vault volume filled to ${usagePercentage}% of your storage allocation`}
      fallbackSrc="/brand/quota-vault-fallback.svg"
      fallbackDarkSrc="/brand/quota-vault-fallback-dark-v3.svg"
      fallback={fallback}
    >
      <Suspense fallback={null}>
        <QuotaVolumeScene usagePercentage={usagePercentage} />
      </Suspense>
    </LazyThreeScene>
  )
}
