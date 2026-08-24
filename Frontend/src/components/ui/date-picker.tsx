import * as PopoverPrimitive from '@radix-ui/react-popover'
import { CalendarDays, ChevronDown, X } from 'lucide-react'
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type DatePickerKind = 'date' | 'datetime-local'

interface DatePickerProps {
  id: string
  value: string
  onChange: (value: string) => void
  kind?: DatePickerKind
  min?: string
  max?: string
  defaultTime?: string
  disabled?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
}

function parseLocalDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return undefined
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? undefined : date
}

function dateValue(date: Date) {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function displayValue(value: string, kind: DatePickerKind) {
  const date = parseLocalDate(value)
  if (!date) return 'Choose a date'
  const formatted = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
  if (kind === 'date') return formatted
  const time = value.slice(11, 16)
  return time ? `${formatted} at ${time}` : formatted
}

export function DatePicker({
  id,
  value,
  onChange,
  kind = 'date',
  min,
  max,
  defaultTime = '00:00',
  disabled,
  className,
  ...ariaProps
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = parseLocalDate(value)
  const minDate = parseLocalDate(min ?? '')
  const maxDate = parseLocalDate(max ?? '')
  const disabledDays = minDate
    ? maxDate
      ? [{ before: minDate }, { after: maxDate }]
      : { before: minDate }
    : maxDate
      ? { after: maxDate }
      : undefined

  const selectDate = (date: Date | undefined) => {
    if (!date) return
    const nextDate = dateValue(date)
    if (kind === 'date') {
      onChange(nextDate)
      setOpen(false)
      return
    }
    onChange(`${nextDate}T${value.slice(11, 16) || defaultTime}`)
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div className="relative min-w-0">
        <PopoverPrimitive.Trigger asChild>
          <button
            id={id}
            type="button"
            data-value={value}
            disabled={disabled}
            className={cn(
              'flex min-h-11 w-full min-w-0 items-center gap-3 rounded-sm border border-border bg-card px-3 pr-20 text-left text-base text-foreground shadow-rest outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
              !value && 'text-muted-foreground',
              className,
            )}
            {...ariaProps}
          >
            <CalendarDays className="shrink-0 text-muted-foreground" aria-hidden="true" size={18} />
            <span className="min-w-0 flex-1 truncate">{displayValue(value, kind)}</span>
            <ChevronDown className="shrink-0 text-muted-foreground" aria-hidden="true" size={16} />
          </button>
        </PopoverPrimitive.Trigger>
        {value ? (
          <button
            type="button"
            className="absolute right-10 top-1/2 flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-card-muted hover:text-foreground"
            aria-label="Clear date"
            onClick={() => onChange('')}
          >
            <X aria-hidden="true" size={16} />
          </button>
        ) : null}
      </div>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          className="z-[70] w-[min(22rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-lg border border-border bg-card p-3 text-foreground shadow-float outline-none"
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={selectDate}
            disabled={disabledDays}
            defaultMonth={selected ?? minDate ?? new Date()}
            startMonth={minDate}
            endMonth={maxDate}
            classNames={{
              root: 'relative w-full',
              months: 'w-full',
              month: 'w-full space-y-3',
              month_caption: 'relative flex min-h-10 items-center justify-center px-10',
              caption_label: 'font-display text-sm font-bold text-foreground',
              nav: 'absolute inset-x-3 top-3 flex items-center justify-between',
              button_previous:
                'flex min-h-10 min-w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-card-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
              button_next:
                'flex min-h-10 min-w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-card-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
              month_grid: 'w-full border-collapse',
              weekdays: 'grid grid-cols-7',
              weekday: 'py-2 text-center text-xs font-semibold text-muted-foreground',
              weeks: 'space-y-1',
              week: 'grid grid-cols-7',
              day: 'flex min-h-10 min-w-0 items-center justify-center text-center',
              day_button:
                'flex min-h-10 min-w-10 items-center justify-center rounded-full text-sm outline-none hover:bg-card-muted focus-visible:ring-2 focus-visible:ring-ring',
              selected:
                '[&>button]:bg-primary [&>button]:font-semibold [&>button]:text-primary-foreground',
              today: '[&>button]:border [&>button]:border-brand [&>button]:text-brand',
              outside: 'opacity-40',
              disabled: 'pointer-events-none opacity-30',
            }}
          />
          {kind === 'datetime-local' ? (
            <label
              className="mt-3 grid gap-2 border-t border-border pt-3 text-sm font-semibold text-foreground"
              htmlFor={`${id}-time`}
            >
              Time
              <Input
                id={`${id}-time`}
                type="time"
                value={value.slice(11, 16) || defaultTime}
                onChange={(event) => {
                  const base = value.slice(0, 10) || dateValue(new Date())
                  onChange(`${base}T${event.target.value}`)
                }}
              />
            </label>
          ) : null}
          <div className="mt-3 flex justify-end border-t border-border pt-3">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
