interface SceneFallbackProps {
  label: string
  imageSrc?: string
}

export function SceneFallback({ label, imageSrc = '/brand/skyvault-mark.svg' }: SceneFallbackProps) {
  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-card-muted p-8">
      <img src={imageSrc} alt={label} className="h-full w-full object-contain" />
    </div>
  )
}
