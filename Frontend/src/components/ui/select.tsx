import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  id?: string
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  name?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
}

export function Select({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  name,
  className,
  ...ariaProps
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={value || undefined}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
    >
      <SelectPrimitive.Trigger
        id={id}
        className={cn(
          'flex min-h-11 w-full min-w-0 items-center justify-between gap-3 rounded-sm border border-border bg-card px-3 text-left text-base text-foreground shadow-rest outline-none data-[placeholder]:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
          className,
        )}
        {...ariaProps}
      >
        <SelectPrimitive.Value placeholder={placeholder} className="min-w-0 flex-1 truncate" />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="shrink-0 text-muted-foreground" aria-hidden="true" size={18} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          collisionPadding={12}
          className="z-[70] max-h-[min(20rem,calc(100dvh-1.5rem))] min-w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-md border border-border bg-card text-foreground shadow-float"
        >
          <SelectPrimitive.ScrollUpButton className="flex h-8 items-center justify-center bg-card text-muted-foreground">
            <ChevronUp aria-hidden="true" size={16} />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="max-w-[calc(100vw-1.5rem)] p-1.5">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="relative flex min-h-11 min-w-0 cursor-default select-none items-center rounded-sm py-2 pl-9 pr-3 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-card-muted data-[disabled]:opacity-50"
              >
                <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check aria-hidden="true" size={16} />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>
                  <span className="block max-w-[calc(100vw-5rem)] truncate">{option.label}</span>
                </SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex h-8 items-center justify-center bg-card text-muted-foreground">
            <ChevronDown aria-hidden="true" size={16} />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
