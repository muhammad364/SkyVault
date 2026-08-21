import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'pressable inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-default ease-vault focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-action text-primary-foreground shadow-rest hover:bg-primary-action-hover hover:shadow-hover',
        secondary: 'bg-card-muted text-foreground shadow-rest hover:bg-border hover:shadow-hover',
        ghost: 'bg-transparent text-foreground hover:bg-card-muted',
        destructive:
          'bg-destructive text-destructive-foreground shadow-rest hover:bg-destructive-hover hover:shadow-hover',
      },
      size: {
        default: 'min-h-11 px-5',
        icon: 'min-h-11 min-w-11 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button'
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
})
