import { cn } from '@/lib/utils'

interface BrandMarkProps {
  className?: string
  alt?: string
}

export function BrandMark({ className, alt = '' }: BrandMarkProps) {
  return (
    <>
      <img src="/brand/skyvault-mark.svg" className={cn('dark:hidden', className)} alt={alt} />
      <img
        src="/brand/skyvault-mark-dark-v3.svg"
        className={cn('hidden dark:block', className)}
        alt={alt}
      />
    </>
  )
}
