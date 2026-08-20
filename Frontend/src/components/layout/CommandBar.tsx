import { Search } from 'lucide-react'

export function CommandBar() {
  return (
    <button
      type="button"
      className="pressable flex min-h-11 w-full items-center justify-between gap-4 rounded-full border border-border bg-card/70 px-5 text-left text-sm text-muted-foreground shadow-float backdrop-blur-md transition duration-default ease-vault hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transform-none md:max-w-md"
    >
      <span className="inline-flex items-center gap-3">
        <Search aria-hidden="true" size={18} />
        <span>Search your vault</span>
      </span>
      <span className="hidden rounded-full bg-card-muted px-3 py-1 font-mono text-[13px] text-foreground sm:inline-flex">
        /
      </span>
    </button>
  )
}
