interface SceneFallbackProps {
  label: string
}

export function SceneFallback({ label }: SceneFallbackProps) {
  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-card-muted p-8">
      <img src="/brand/skyvault-mark.svg" alt={label} className="h-24 w-24" />
    </div>
  )
}
