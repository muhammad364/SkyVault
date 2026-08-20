import { LockKeyhole, Search, WalletCards } from 'lucide-react'
import { motion } from 'framer-motion'
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
  const reducedMotion = useReducedMotion()

  return (
    <section id="why-skyvault" className="flex flex-col gap-8" aria-labelledby="highlights-heading">
      <div className="flex max-w-2xl flex-col gap-3">
        <p className="text-sm font-semibold text-primary">Made for your everyday files</p>
        <h2 id="highlights-heading" className="text-balance font-display text-3xl font-bold text-foreground">
          A personal workspace, not an admin console.
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {highlights.map(({ title, description, icon: Icon }, index) => (
          <motion.article
            key={title}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.24, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-w-0 flex-col gap-5 rounded-lg bg-card p-6 shadow-rest transition duration-default ease-vault hover:-translate-y-0.5 hover:shadow-hover motion-reduce:transform-none"
          >
            <span className="flex min-h-11 min-w-11 items-center justify-center rounded-md bg-card-muted text-primary">
              <Icon aria-hidden="true" size={20} />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
              <p className="text-pretty text-sm text-muted-foreground">{description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
