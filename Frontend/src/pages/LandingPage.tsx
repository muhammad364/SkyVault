import { Link } from 'react-router-dom'
import { LandingHero } from '@/features/marketing/components/LandingHero'
import { MarketingHighlights } from '@/features/marketing/components/MarketingHighlights'
import { HowItWorks } from '@/features/marketing/components/HowItWorks'
import { PublicPlansPreview } from '@/features/marketing/components/PublicPlansPreview'

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <LandingHero />
      <MarketingHighlights />
      <HowItWorks />
      <PublicPlansPreview />
      <footer className="flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>SkyVault — Your files. Your space. Always secure.</p>
        <nav className="flex flex-wrap gap-4" aria-label="Footer">
          <a className="text-primary underline-offset-4 hover:underline" href="#why-skyvault">Why SkyVault</a>
          <a className="text-primary underline-offset-4 hover:underline" href="#plans">Storage plans</a>
          <Link className="text-primary underline-offset-4 hover:underline" to="/auth?mode=login">Sign in</Link>
        </nav>
      </footer>
    </div>
  )
}
