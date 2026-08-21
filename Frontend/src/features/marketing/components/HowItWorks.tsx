import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const steps = [
  ['01', 'Create your vault', 'Start with a space that is yours.'],
  ['02', 'Bring in what matters', 'Keep your files together without losing the calm.'],
  ['03', 'Find it when you need it', 'Search naturally when a file slips your mind.'],
] as const

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useInView(sectionRef, { once: true, amount: 0.3 })
  const reducedMotion = useReducedMotion()

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="scroll-mt-32 rounded-2xl bg-card-muted p-6 md:p-8"
      aria-labelledby="how-it-works-heading"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-brand">How it works</p>
          <h2
            id="how-it-works-heading"
            className="text-balance font-display text-3xl font-bold text-foreground"
          >
            Make room for the files that follow you everywhere.
          </h2>
        </div>
        <div className="relative">
          <motion.div
            className="absolute bottom-0 left-6 top-0 w-px origin-top bg-brand md:hidden"
            initial={{ opacity: 0, scaleY: reducedMotion ? 1 : 0 }}
            animate={
              isVisible ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: reducedMotion ? 1 : 0 }
            }
            transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-brand md:block"
            initial={{ opacity: 0, scaleX: reducedMotion ? 1 : 0 }}
            animate={
              isVisible ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: reducedMotion ? 1 : 0 }
            }
            transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />
          <ol className="relative grid gap-6 md:grid-cols-3">
            {steps.map(([number, title, description], index) => (
              <motion.li
                key={number}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={
                  isVisible
                    ? { opacity: 1, y: 0 }
                    : reducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 8 }
                }
                transition={{
                  duration: reducedMotion ? 0 : 0.24,
                  delay: reducedMotion ? 0 : index * 0.04,
                }}
                className="relative pl-16 md:pl-0"
              >
                <div className="flex min-w-0 flex-col gap-3">
                  <motion.span
                    initial={reducedMotion ? { opacity: 1 } : { opacity: 0, rotate: -12 }}
                    animate={
                      isVisible
                        ? { opacity: 1, rotate: 0 }
                        : reducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, rotate: -12 }
                    }
                    transition={{
                      duration: reducedMotion ? 0 : 0.32,
                      delay: reducedMotion ? 0 : index * 0.04,
                    }}
                    className="absolute left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-card font-mono text-sm font-semibold tabular-nums text-primary shadow-rest md:relative"
                  >
                    {number}
                  </motion.span>
                  <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
                  <p className="text-pretty text-sm text-secondary-foreground">{description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
