import { Cloud, Database, Search, ShieldCheck } from 'lucide-react'

interface StoragePlanGraphicProps {
  storageSizeGb: number
}

export function StoragePlanGraphic({ storageSizeGb }: StoragePlanGraphicProps) {
  return (
    <div
      className="overflow-hidden rounded-lg bg-card-muted p-5"
      aria-label={`${storageSizeGb} GB secure storage`}
    >
      <div className="flex items-center justify-between gap-4">
        <div
          className="relative flex h-24 w-28 shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <span className="absolute bottom-2 h-5 w-24 rounded-full bg-canvas-strong" />
          <span className="absolute bottom-5 h-5 w-20 rounded-full bg-primary opacity-60" />
          <span className="absolute bottom-8 h-5 w-16 rounded-full bg-primary" />
          <Database className="relative text-primary-foreground" size={24} />
        </div>
        <div className="flex flex-col items-end gap-3 text-primary">
          <Cloud aria-hidden="true" size={24} />
          <div className="flex gap-2">
            <ShieldCheck aria-hidden="true" size={20} />
            <Search aria-hidden="true" size={20} />
          </div>
        </div>
      </div>
    </div>
  )
}
