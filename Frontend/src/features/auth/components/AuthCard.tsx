import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface AuthCardProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthCard({ eyebrow, title, description, children, footer }: AuthCardProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.article
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl bg-card p-6 shadow-float md:p-8"
    >
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-brand">{eyebrow}</p>
          <div className="flex flex-col gap-2">
            <h1 className="text-balance font-display text-3xl font-bold leading-tight text-foreground">
              {title}
            </h1>
            <p className="text-pretty text-sm text-secondary-foreground">{description}</p>
          </div>
        </header>
        {children}
        {footer ? <footer className="border-t border-border pt-6">{footer}</footer> : null}
      </div>
    </motion.article>
  )
}
