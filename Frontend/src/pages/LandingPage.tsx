import { lazy } from 'react'
import { Link } from 'react-router-dom'
import { DeferredLandingSection } from '@/features/marketing/components/DeferredLandingSection'
import { LandingHero } from '@/features/marketing/components/LandingHero'

const MarketingHighlights = lazy(() =>
  import('@/features/marketing/components/MarketingHighlights').then((module) => ({
    default: module.MarketingHighlights,
  })),
)
const HowItWorks = lazy(() =>
  import('@/features/marketing/components/HowItWorks').then((module) => ({ default: module.HowItWorks })),
)
const PublicPlansPreview = lazy(() =>
  import('@/features/marketing/components/PublicPlansPreview').then((module) => ({
    default: module.PublicPlansPreview,
  })),
)

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <LandingHero />
      <DeferredLandingSection label="Loading SkyVault benefits">
        <MarketingHighlights />
      </DeferredLandingSection>
      <DeferredLandingSection label="Loading how SkyVault works">
        <HowItWorks />
      </DeferredLandingSection>
      <DeferredLandingSection label="Loading SkyVault storage plans" tall>
        <PublicPlansPreview />
      </DeferredLandingSection>
      <footer className="flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>SkyVault — Your files. Your space. Always secure.</p>
        <nav className="flex flex-wrap gap-4" aria-label="Footer">
          <a className="text-primary underline-offset-4 hover:underline" href="#why-skyvault">
            Why SkyVault
          </a>
          <a className="text-primary underline-offset-4 hover:underline" href="#plans">
            Storage plans
          </a>
          <Link className="text-primary underline-offset-4 hover:underline" to="/auth?mode=login">
            Sign in
          </Link>
        </nav>
      </footer>
    </div>
  )
}
