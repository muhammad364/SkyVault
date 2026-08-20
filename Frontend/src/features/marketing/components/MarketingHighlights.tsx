import { useEffect, useRef, useState } from 'react'
import { LockKeyhole, Pause, Play, Search, WalletCards } from 'lucide-react'
import { useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MarketingHighlightCard } from '@/features/marketing/components/MarketingHighlightCard'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const highlights = [
  {
    title: 'A space that feels private',
    description: 'Keep the files that matter together in your own personal vault.',
    icon: LockKeyhole,
  },
  {
    title: 'Storage without the clutter',
    description: 'Choose the storage that fits you, then keep your workspace simple.',
    icon: WalletCards,
  },
  {
    title: 'Find your way back',
    description: 'Use keyword and natural-language search to rediscover what you saved.',
    icon: Search,
  },
] as const

export function MarketingHighlights() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const isVisible = useInView(marqueeRef, { amount: 0.15 })
  const reducedMotion = useReducedMotion()
  const [hoverPaused, setHoverPaused] = useState(false)
  const [focusPaused, setFocusPaused] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState !== 'hidden')
  const isPaused = hoverPaused || focusPaused || userPaused || !isVisible || !pageVisible

  const toggleUserPause = () => {
    if (userPaused) {
      setUserPaused(false)
      setFocusPaused(false)
      return
    }

    setUserPaused(true)
  }

  useEffect(() => {
    const handleVisibility = () => setPageVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  return (
    <section id="why-skyvault" className="flex scroll-mt-32 flex-col gap-8" aria-labelledby="highlights-heading">
      <div className="flex items-end justify-between gap-4">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="text-sm font-semibold text-primary">Made for your everyday files</p>
          <h2 id="highlights-heading" className="text-balance font-display text-3xl font-bold text-foreground">
            A personal workspace, not an admin console.
          </h2>
        </div>
        {!reducedMotion ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-pressed={userPaused}
            aria-label={userPaused ? 'Resume moving benefit cards' : 'Pause moving benefit cards'}
            onClick={toggleUserPause}
            onFocus={() => setFocusPaused(true)}
            onBlur={() => setFocusPaused(false)}
          >
            {userPaused ? <Play aria-hidden="true" size={20} /> : <Pause aria-hidden="true" size={20} />}
          </Button>
        ) : null}
      </div>
      {reducedMotion ? (
        <div className="grid gap-6 md:grid-cols-3" data-testid="static-highlights">
          {highlights.map((highlight) => <MarketingHighlightCard key={highlight.title} {...highlight} />)}
        </div>
      ) : (
        <div
          ref={marqueeRef}
          className="overflow-hidden rounded-xl py-2"
          aria-label="SkyVault benefits"
          onPointerEnter={() => setHoverPaused(true)}
          onPointerLeave={() => setHoverPaused(false)}
        >
          <div className="marketing-marquee-track flex" data-paused={isPaused} data-testid="highlights-marquee">
            <div className="flex gap-6 pr-6">
              {highlights.map((highlight) => (
                <MarketingHighlightCard key={highlight.title} {...highlight} marquee />
              ))}
            </div>
            <div className="flex gap-6 pr-6" aria-hidden="true">
              {highlights.map((highlight) => (
                <MarketingHighlightCard key={`duplicate-${highlight.title}`} {...highlight} marquee />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
