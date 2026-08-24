import { lazy } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DeferredLandingSection } from '@/features/marketing/components/DeferredLandingSection'
import { LandingHero } from '@/features/marketing/components/LandingHero'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const MarketingHighlights = lazy(() =>
  import('@/features/marketing/components/MarketingHighlights').then((module) => ({
    default: module.MarketingHighlights,
  })),
)
const HowItWorks = lazy(() =>
  import('@/features/marketing/components/HowItWorks').then((module) => ({
    default: module.HowItWorks,
  })),
)
const PublicPlansPreview = lazy(() =>
  import('@/features/marketing/components/PublicPlansPreview').then((module) => ({
    default: module.PublicPlansPreview,
  })),
)

export default function LandingPage() {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-12 md:gap-16"
    >
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
          <Link className="text-primary underline-offset-4 hover:underline" to="/auth/login">
            Sign in
          </Link>
        </nav>
      </footer>
    </motion.div>
  )
}
