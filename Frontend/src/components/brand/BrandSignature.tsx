import { cn } from '@/lib/utils'

interface BrandSignatureProps {
  variant?: 'header' | 'hero'
  className?: string
}

export function BrandSignature({ variant = 'header', className }: BrandSignatureProps) {
  const isHero = variant === 'hero'

  return (
    <span className={cn('inline-flex min-w-0 items-center gap-3', className)}>
      <span className={cn('shrink-0', isHero ? 'h-16 md:h-20' : 'h-14 md:h-16')} aria-hidden="true">
        <img
          src="/brand/skyvault-emblem-light-v2.png"
          alt=""
          className="h-full w-auto object-contain dark:hidden"
        />
        <img
          src="/brand/skyvault-emblem-dark-v2.png"
          alt=""
          className="hidden h-full w-auto object-contain dark:block"
        />
      </span>
      <span
        className={cn(
          'truncate font-display font-bold leading-none tracking-tight',
          isHero ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl',
        )}
      >
        <span className="text-foreground">Sky</span>
        <span className="text-primary">Vault</span>
      </span>
    </span>
  )
}
