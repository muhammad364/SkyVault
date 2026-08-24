import { Suspense, useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { LandingSectionSkeleton } from '@/features/marketing/components/LandingSectionSkeleton'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface DeferredLandingSectionProps {
  label: string
  children: ReactNode
  tall?: boolean
}

export function DeferredLandingSection({
  label,
  children,
  tall = false,
}: DeferredLandingSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useInView(sectionRef, { once: true, margin: '240px 0px' })
  const reducedMotion = useReducedMotion()
  const fallback = <LandingSectionSkeleton tall={tall} />

  return (
    <div ref={sectionRef} aria-busy={!isNearViewport} aria-label={label}>
      {isNearViewport ? (
        <Suspense fallback={fallback}>
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  )
}
